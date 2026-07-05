import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, Home, MapPin, Camera, Video, Tag, ArrowLeft, Upload,
  X, GripVertical, Star, Image as ImageIcon, Sparkles, CheckCircle2,
  Hammer,
} from 'lucide-react';
import { SOW_ITEMS } from '../data/scopeOfWork';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';
import { useIsMobile } from '../hooks/useIsMobile';
import AddressAutocomplete from '../components/AddressAutocomplete';
import { uploadImage } from '../lib/images';
import { createDeal } from '../lib/deals';
import { isSupabaseConfigured } from '../lib/supabase';
import { logActivity } from '../lib/activityLog';

const DEAL_TYPES = [
  { value: 'fix-flip',   label: 'Fix & Flip',       color: '#ef4444' },
  { value: 'rental',     label: 'Rental',           color: '#10b981' },
  { value: 'creative',   label: 'Creative Finance', color: '#f59e0b' },
  { value: 'commercial', label: 'Commercial',       color: '#00e5a0' },
  { value: 'land',       label: 'Land',             color: '#00c805' },
];

const MAX_PHOTOS = 12;

export default function PostDeal() {
  useSEO({ title: 'Post a Deal', description: 'List your off-market deal in under a minute.' });
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const fileInputRef = useRef(null);
  const addressBoxRef = useRef(null); // wraps the address input so we can read its live DOM value (autofill-safe)

  const [form, setForm] = useState({
    dealType: 'fix-flip',
    title: '',
    address: '', city: '', state: '', zip: '',
    beds: '', baths: '', sqft: '', yearBuilt: '',
    contractedPrice: '', listingPrice: '',
    arv: '', rehabLow: '', rehabHigh: '',
    description: '', youtubeUrl: '',
    addressVisibility: 'public', // 'public' (default — buyers get it instantly) | 'request'
    scopeOfWork: {},             // { roof: 'yes'|'no'|'na', ... } — see data/scopeOfWork.js
  });
  const [photos, setPhotos] = useState([]); // { id, url, name }
  const [dragOver, setDragOver] = useState(false);
  const dragIndex = useRef(null);
  const [overIndex, setOverIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList || []).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;
    setPhotos(prev => {
      const room = MAX_PHOTOS - prev.length;
      const next = files.slice(0, room).map((file, i) => ({
        id: `${Date.now()}-${i}-${file.name}`,
        url: URL.createObjectURL(file),
        name: file.name,
        file, // kept so we can upload to storage on submit
      }));
      if (files.length > room) {
        toast(`Only ${MAX_PHOTOS} photos max — added the first ${room}.`, 'info');
      }
      return [...prev, ...next];
    });
  }, [toast]);

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }

  function removePhoto(id) {
    setPhotos(prev => {
      const target = prev.find(p => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter(p => p.id !== id);
    });
  }

  // ── Reorder (HTML5 drag) ──
  function handleTileDragStart(i) { dragIndex.current = i; }
  function handleTileDragOver(e, i) { e.preventDefault(); setOverIndex(i); }
  function handleTileDrop(i) {
    const from = dragIndex.current;
    if (from == null || from === i) { setOverIndex(null); return; }
    setPhotos(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(i, 0, moved);
      return next;
    });
    dragIndex.current = null;
    setOverIndex(null);
  }
  function movePhoto(i, dir) {
    setPhotos(prev => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  // Reads the address from React state OR, as a fallback, the live DOM value
  // of the input. Browser autofill can populate the field visually without
  // firing React's onChange, which would otherwise leave state empty.
  function resolveAddress() {
    const fromState = (form.address || '').trim();
    if (fromState) return fromState;
    const el = addressBoxRef.current?.querySelector('input');
    return (el?.value || '').trim();
  }

  // Minimum to post: a name, a street address, and at least one photo.
  const canPost = !!form.title.trim() && !!form.address.trim() && photos.length >= 1;

  async function handleSubmit(e) {
    e?.preventDefault?.();
    if (submitting) return;

    const title = form.title.trim();
    const address = resolveAddress();
    if (address && address !== form.address) update('address', address);

    const missing = [];
    if (!title) missing.push('a deal name');
    if (!address) missing.push('the street address');
    if (photos.length < 1) missing.push('at least one photo');
    if (missing.length) {
      const list = missing.length === 1
        ? missing[0]
        : missing.slice(0, -1).join(', ') + ' and ' + missing[missing.length - 1];
      toast(`Add ${list} to post your deal.`, 'info', 4000);
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload photos to Storage (in display order)
      const urls = [];
      for (const p of photos) {
        if (p.file) {
          const { url } = await uploadImage(p.file);
          if (url) urls.push(url);
        } else if (p.url) {
          urls.push(p.url);
        }
      }
      // 2. Insert the deal row
      const res = await createDeal(
        { ...form, address },
        urls,
        { id: currentUser?.id, name: currentUser?.name },
      );
      if (!res.ok) {
        const msg = res.reason === 'not-configured'
          ? "Database not connected on this build. The Supabase keys aren't baked in — add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY in Cloudflare and Retry the deployment."
          : `Couldn't save the deal: ${res.reason}`;
        toast(msg, 'error', 8000);
        setSubmitting(false);
        return;
      }
      logActivity({
        actorId: currentUser?.id,
        actorName: currentUser?.name,
        type: 'deal_create',
        detail: `${form.title} — ${form.city}, ${form.state} ($${Number(form.listingPrice || 0).toLocaleString()})`,
        targetId: res.deal?._supabaseId || null,
      });
      toast('🎉 Deal posted! It\'s now live in the marketplace.', 'success', 4500);
      navigate('/marketplace');
    } catch (err) {
      toast(`Upload failed: ${err?.message || err}`, 'error', 7000);
      setSubmitting(false);
    }
  }

  return (
    <div style={{ background: '#0a0b0a', minHeight: '100vh', paddingBottom: 150 }}>
      {/* Top bar */}
      <div style={{
        background: '#0e100e', borderBottom: '1px solid #232925',
        padding: '14px 16px', position: 'sticky', top: 0, zIndex: 30,
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.04)', border: '1px solid #232925',
              borderRadius: 9, padding: '8px 12px', color: '#95a29b',
              cursor: 'pointer', fontSize: 13, fontWeight: 700,
            }}
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(0, 200, 5,0.14)', border: '1px solid rgba(0, 200, 5,0.3)',
              color: '#4ade80', fontSize: 11, fontWeight: 800, letterSpacing: 0.5,
            }}>
              <Sparkles size={11} /> FREE TO LIST
            </div>
            {/* DB connection indicator — instantly shows if the Supabase keys
                are in this build. Green = deals save. Amber = they don't. */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 999,
              background: isSupabaseConfigured ? 'rgba(16,185,129,0.14)' : 'rgba(245,158,11,0.14)',
              border: `1px solid ${isSupabaseConfigured ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}`,
              color: isSupabaseConfigured ? '#34d399' : '#fbbf24',
              fontSize: 11, fontWeight: 800, letterSpacing: 0.3,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: isSupabaseConfigured ? '#10b981' : '#f59e0b',
              }} />
              {isSupabaseConfigured ? 'DATABASE CONNECTED' : 'DB NOT CONNECTED — DEALS WON’T SAVE'}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
        {/* Hero: deal name */}
        <div style={{ marginBottom: 20 }}>
          <input
            value={form.title}
            onChange={e => update('title', e.target.value)}
            placeholder="Deal title — e.g. Brick Ranch with Massive ARV Upside"
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              color: '#f8fafc', fontWeight: 900,
              fontSize: 'clamp(20px, 4vw, 34px)', letterSpacing: '-0.5px',
              padding: '4px 0',
            }}
          />
          <div style={{
            borderBottom: '1px solid #232925', paddingBottom: 12, marginTop: 2,
            color: '#707d75', fontSize: 13,
          }}>
            Give your deal a clear, catchy title — this is the first thing buyers see.
          </div>
        </div>

        {/* Photo gallery — directly under the deal name */}
        <PhotoGallery
          photos={photos}
          dragOver={dragOver}
          overIndex={overIndex}
          fileInputRef={fileInputRef}
          onPick={() => fileInputRef.current?.click()}
          onFiles={addFiles}
          onDrop={onDrop}
          setDragOver={setDragOver}
          onRemove={removePhoto}
          onTileDragStart={handleTileDragStart}
          onTileDragOver={handleTileDragOver}
          onTileDrop={handleTileDrop}
          onMove={movePhoto}
        />

        {/* ── Video walkthrough — front and center, red like a record light ── */}
        <div style={{
          marginTop: 12,
          borderRadius: 16,
          background: form.youtubeUrl
            ? 'rgba(16,185,129,0.06)'
            : 'linear-gradient(135deg, rgba(225,29,72,0.10), rgba(239,68,68,0.03))',
          border: `1.5px solid ${form.youtubeUrl ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg, #e11d48, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(239,68,68,0.45)',
          }}>
            <Video size={20} color="#fff" />
          </div>
          <div style={{ flex: '1 1 230px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", color: '#f8fafc', fontWeight: 700, fontSize: 15.5, letterSpacing: '-0.2px' }}>
                Video walkthrough
              </span>
              {form.youtubeUrl ? (
                <span style={{ color: '#10b981', fontSize: 11, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={12} /> ATTACHED
                </span>
              ) : (
                <span style={{
                  color: '#f87171', fontSize: 10, fontWeight: 900, letterSpacing: 0.8,
                  border: '1px solid rgba(239,68,68,0.4)', borderRadius: 999, padding: '2px 8px',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'sponsored-shimmer 1.6s ease-in-out infinite' }} />
                  REC
                </span>
              )}
            </div>
            <div style={{ color: '#95a29b', fontSize: 12, marginTop: 2, lineHeight: 1.45 }}>
              Deals with video get far more serious buyers — paste any YouTube link and it embeds on your listing.
            </div>
          </div>
          <input
            value={form.youtubeUrl}
            onChange={e => update('youtubeUrl', e.target.value)}
            placeholder="https://youtube.com/watch?v=…"
            style={{
              flex: '1 1 260px', minWidth: 200,
              padding: '12px 14px', borderRadius: 10,
              background: '#0a0b0a',
              border: `1px solid ${form.youtubeUrl ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.35)'}`,
              color: '#f8fafc', fontSize: 14, fontWeight: 600, outline: 'none',
            }}
          />
        </div>

        {/* Two-column body on desktop */}
        <div style={{
          display: 'grid', gap: 18, marginTop: 24,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}>
          {/* Property details */}
          <Card title="Property details" icon={Home}>
            {/* Property address — first field, full width, mobile-friendly */}
            <Label>Property address *</Label>
            <div
              ref={addressBoxRef}
              className="addr-box"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#0e100e', border: '1px solid #2e352f',
                borderRadius: 12, padding: '4px 14px', marginBottom: 8,
              }}
            >
              <MapPin size={16} style={{ color: '#4ade80', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <AddressAutocomplete
                  value={form.address}
                  onChange={(v) => update('address', v)}
                  onSelect={(picked) => setForm(f => ({
                    ...f,
                    address: picked.street || f.address,
                    city: picked.city || f.city,
                    state: picked.state || f.state,
                    zip: picked.zip || f.zip,
                  }))}
                  placeholder="Start typing the property address…"
                  inputStyle={{
                    width: '100%', background: 'transparent', border: 'none', outline: 'none',
                    color: '#f8fafc', fontSize: 15, fontWeight: 600,
                    padding: '11px 0',
                  }}
                />
              </div>
            </div>
            {/* Address policy — a simple yes/no. Default: buyers get it instantly. */}
            <div style={{ marginBottom: 14 }}>
              <Label>Can buyers get the address instantly?</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {[
                  { v: 'public', t: 'Yes — instant (recommended)', d: 'Any signed-in buyer taps "Get Address" and sees it right away. You still see who grabbed it.' },
                  { v: 'request', t: 'No — I approve each request', d: 'Buyers must send a request; you approve or deny each one.' },
                ].map(opt => {
                  const on = form.addressVisibility === opt.v;
                  return (
                    <button
                      key={opt.v} type="button"
                      onClick={() => update('addressVisibility', opt.v)}
                      style={{
                        textAlign: 'left', cursor: 'pointer',
                        background: on ? 'rgba(0, 200, 5,0.12)' : '#0e100e',
                        border: `1.5px solid ${on ? '#00c805' : '#232925'}`,
                        borderRadius: 10, padding: '10px 12px',
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                      }}
                    >
                      <span style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        border: `2px solid ${on ? '#00c805' : '#5a675f'}`,
                        background: on ? '#00c805' : 'transparent',
                      }} />
                      <span>
                        <span style={{ color: on ? '#4ade80' : '#f8fafc', fontWeight: 700, fontSize: 13 }}>{opt.t}</span>
                        <span style={{ display: 'block', color: '#95a29b', fontSize: 12, marginTop: 2, lineHeight: 1.45 }}>{opt.d}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Label>Deal type</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {DEAL_TYPES.map(t => (
                <button
                  key={t.value} type="button"
                  onClick={() => update('dealType', t.value)}
                  style={{
                    padding: '8px 14px', borderRadius: 8,
                    background: form.dealType === t.value ? `${t.color}20` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${form.dealType === t.value ? t.color : '#232925'}`,
                    color: form.dealType === t.value ? t.color : '#95a29b',
                    cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
              <Box label="City *"><input value={form.city} onChange={e => update('city', e.target.value)} placeholder="Atlanta" className="input-dark" style={inp} /></Box>
              <Box label="State *"><input value={form.state} onChange={e => update('state', e.target.value.toUpperCase())} maxLength={2} placeholder="GA" className="input-dark" style={inp} /></Box>
              <Box label="ZIP"><input value={form.zip} onChange={e => update('zip', e.target.value)} placeholder="30305" className="input-dark" style={inp} /></Box>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
              <Box label="Beds"><input value={form.beds} onChange={e => update('beds', e.target.value)} type="number" placeholder="3" className="input-dark" style={inp} /></Box>
              <Box label="Baths"><input value={form.baths} onChange={e => update('baths', e.target.value)} type="number" step="0.5" placeholder="2" className="input-dark" style={inp} /></Box>
              <Box label="Sqft"><input value={form.sqft} onChange={e => update('sqft', e.target.value)} type="number" placeholder="1850" className="input-dark" style={inp} /></Box>
              <Box label="Year"><input value={form.yearBuilt} onChange={e => update('yearBuilt', e.target.value)} type="number" placeholder="1978" className="input-dark" style={inp} /></Box>
            </div>
          </Card>

          {/* Financials — List Price is the headline */}
          <Card title="The numbers" icon={DollarSign}>
            {/* LIST PRICE — the most important public number */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 200, 5,0.14), rgba(0, 229, 160,0.10))',
              border: '1px solid rgba(0, 200, 5,0.4)',
              borderRadius: 14, padding: '16px 18px', marginBottom: 16,
            }}>
              <label style={{
                color: '#4ade80', fontSize: 12, fontWeight: 800,
                letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <DollarSign size={13} /> LIST PRICE — shown publicly
              </label>
              <div style={{ position: 'relative', marginTop: 8 }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: '#f8fafc', fontSize: 26, fontWeight: 900, pointerEvents: 'none',
                }}>$</span>
                <input
                  value={form.listingPrice}
                  onChange={e => update('listingPrice', e.target.value)}
                  type="number"
                  placeholder="90,000"
                  style={{
                    width: '100%', padding: '12px 14px 12px 34px',
                    borderRadius: 10, background: '#0e100e',
                    border: '1px solid rgba(0, 200, 5,0.35)',
                    color: '#f8fafc', fontSize: 26, fontWeight: 900, outline: 'none',
                  }}
                />
              </div>
              <div style={{ color: '#95a29b', fontSize: 12, marginTop: 8 }}>
                This is the headline number buyers see. Your contracted price stays private.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <Box label="Contracted price (private)"><input value={form.contractedPrice} onChange={e => update('contractedPrice', e.target.value)} type="number" placeholder="65000" className="input-dark" style={inp} /></Box>
              <Box label="ARV (seller-reported)"><input value={form.arv} onChange={e => update('arv', e.target.value)} type="number" placeholder="320000" className="input-dark" style={inp} /></Box>
            </div>

            <Label>Rehab estimate range</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#707d75', fontSize: 13, fontWeight: 700 }}>$</span>
                <input value={form.rehabLow} onChange={e => update('rehabLow', e.target.value)} type="number" placeholder="Low (e.g. 40,000)" className="input-dark" style={{ ...inp, paddingLeft: 22 }} />
              </div>
              <span style={{ color: '#707d75', fontSize: 13, fontWeight: 700 }}>to</span>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#707d75', fontSize: 13, fontWeight: 700 }}>$</span>
                <input value={form.rehabHigh} onChange={e => update('rehabHigh', e.target.value)} type="number" placeholder="High (e.g. 60,000)" className="input-dark" style={{ ...inp, paddingLeft: 22 }} />
              </div>
            </div>
            <div style={{
              marginTop: 10, padding: '8px 11px', borderRadius: 8,
              background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
              color: '#fbbf24', fontSize: 11.5, lineHeight: 1.5,
            }}>
              Buyers see this as a range and run their own numbers in the deal calculator.
              ARV is your estimate — buyers are told to verify it themselves.
            </div>
          </Card>
        </div>

        {/* ── Scope of Work — 15 quick condition questions ── */}
        <Card title="Scope of work" icon={Hammer} style={{ marginTop: 18 }}>
          <p style={{ color: '#95a29b', fontSize: 13, margin: '0 0 14px', lineHeight: 1.55 }}>
            15 quick questions about what the property needs. Buyers see your answers in a
            <strong style={{ color: '#fbbf24' }}> Scope of Work</strong> tab on the listing — deals
            with a filled-out scope get far more serious offers. Pick <strong style={{ color: '#e4eae6' }}>N/A</strong> to
            leave one off the listing.
          </p>
          <div style={{
            display: 'grid', gap: 8,
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          }}>
            {SOW_ITEMS.map(({ key, question }) => {
              const val = form.scopeOfWork?.[key] || null;
              const setVal = (v) => update('scopeOfWork', { ...form.scopeOfWork, [key]: v });
              const pill = (v, label, onColor, onBg, onBorder) => {
                const on = val === v;
                return (
                  <button
                    key={v} type="button"
                    onClick={() => setVal(on ? null : v)}
                    style={{
                      padding: '7px 0', width: 46, borderRadius: 8, cursor: 'pointer',
                      background: on ? onBg : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${on ? onBorder : '#232925'}`,
                      color: on ? onColor : '#707d75',
                      fontSize: 11.5, fontWeight: 800,
                    }}
                  >
                    {label}
                  </button>
                );
              };
              return (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  padding: '9px 12px', borderRadius: 10,
                  background: '#0e100e', border: '1px solid #232925',
                }}>
                  <span style={{ color: '#e4eae6', fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>
                    {question}
                  </span>
                  <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    {pill('yes', 'Yes', '#fbbf24', 'rgba(245,158,11,0.16)', '#f59e0b')}
                    {pill('no', 'No', '#4ade80', 'rgba(0,200,5,0.14)', '#00c805')}
                    {pill('na', 'N/A', '#95a29b', 'rgba(255,255,255,0.10)', '#38403a')}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Description — larger on desktop */}
        <Card title="Description" icon={Tag} style={{ marginTop: 18 }}>
          <Box label="Deal description">
            <textarea
              value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="Scope of work, neighborhood, comps, timing, exit strategy, why it's a deal…"
              rows={isMobile ? 6 : 10}
              className="input-dark"
              style={{
                ...inp,
                resize: 'vertical',
                fontSize: isMobile ? 14 : 16,
                lineHeight: 1.6,
                minHeight: isMobile ? 140 : 240,
                padding: '14px 16px',
              }}
            />
          </Box>
        </Card>
      </form>

      {/* Sticky submit bar — large + prominent */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(13, 16, 13,0.98)', backdropFilter: 'blur(14px)',
        borderTop: '1px solid #232925',
        padding: `${isMobile ? 16 : 20}px ${isMobile ? 16 : 24}px calc(${isMobile ? 16 : 20}px + env(safe-area-inset-bottom))`,
        boxShadow: '0 -12px 40px rgba(0,0,0,0.5)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: isMobile ? 15 : 18, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {form.title || 'Untitled deal'}
            </div>
            <div style={{ color: canPost ? '#34d399' : '#707d75', fontSize: isMobile ? 12 : 14, fontWeight: 600, marginTop: 2 }}>
              {submitting
                ? 'Uploading photos & saving…'
                : `${photos.length} photo${photos.length !== 1 ? 's' : ''} · ${canPost ? '✓ Ready to post' : 'Need: name, street address & 1 photo'}`}
            </div>
          </div>
          {/* Always pressable — clicking it tells you exactly what's missing
              (and is autofill-safe via resolveAddress). */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: isMobile ? '16px 28px' : '18px 44px',
              borderRadius: 14,
              background: 'linear-gradient(135deg,#00c805,#00e05c)',
              border: 'none',
              color: '#052012',
              fontWeight: 900, fontSize: isMobile ? 17 : 20, letterSpacing: 0.2,
              cursor: submitting ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 14px 38px rgba(0, 200, 5,0.5)',
              opacity: submitting ? 0.7 : (canPost ? 1 : 0.92),
              flexShrink: 0,
              transition: 'transform 0.12s',
            }}
            onMouseDown={(e) => { if (!submitting) e.currentTarget.style.transform = 'scale(0.97)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <CheckCircle2 size={isMobile ? 20 : 24} /> {submitting ? 'Posting…' : 'Post Deal'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
function PhotoGallery({
  photos, dragOver, overIndex, fileInputRef, onPick, onFiles, onDrop,
  setDragOver, onRemove, onTileDragStart, onTileDragOver, onTileDrop, onMove,
}) {
  const display = "'Space Grotesk', 'Inter', sans-serif";
  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={e => { onFiles(e.target.files); e.target.value = ''; }}
        style={{ display: 'none' }}
      />

      {/* ── The drop strip — one big, unmissable target ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={onPick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onPick(); }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        aria-label="Add photos"
        style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '18px 20px', borderRadius: 18, cursor: 'pointer',
          background: dragOver
            ? 'linear-gradient(135deg, rgba(0,200,5,0.14), rgba(0,200,5,0.05))'
            : 'linear-gradient(135deg, #11140f, #0e100e)',
          border: `2px dashed ${dragOver ? '#00c805' : '#38403a'}`,
          boxShadow: dragOver ? '0 0 0 4px rgba(0,200,5,0.15)' : '0 4px 20px rgba(0,0,0,0.25)',
          transition: 'all 0.15s',
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{
          width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #e11d48, #ef4444)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(239,68,68,0.45)',
        }}>
          <Camera size={24} color="#fff" />
        </div>
        <div style={{ flex: '1 1 240px', minWidth: 0 }}>
          <div style={{ fontFamily: display, color: '#f8fafc', fontWeight: 700, fontSize: 'clamp(16px, 2.4vw, 21px)', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
            {photos.length === 0
              ? 'Drop your property photos here'
              : `${photos.length}/${MAX_PHOTOS} photos in — keep going`}
          </div>
          <div style={{ color: '#95a29b', fontSize: 12.5, marginTop: 4 }}>
            {photos.length === 0
              ? 'or click anywhere in this box · JPG · PNG · HEIC · listings with photos get far more buyers'
              : 'Drag the tiles below to reorder — the first photo is your cover.'}
          </div>
        </div>
        <div style={{
          fontFamily: display,
          padding: '11px 20px', borderRadius: 999, flexShrink: 0,
          background: '#f8fafc', color: '#0a0b0a',
          fontWeight: 700, fontSize: 13.5, letterSpacing: 0.2,
          boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          <Upload size={15} /> Browse files
        </div>
      </div>

      {/* ── Photo grid (+ quiet placeholder slots) ── */}
      <div style={{
        display: 'grid', gap: 10,
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      }}>
        {photos.map((p, i) => (
          <div
            key={p.id}
            draggable
            onDragStart={() => onTileDragStart(i)}
            onDragOver={(e) => onTileDragOver(e, i)}
            onDrop={() => onTileDrop(i)}
            onDragEnd={() => onTileDrop(i)}
            style={{
              position: 'relative', aspectRatio: '4 / 3',
              borderRadius: 12, overflow: 'hidden',
              border: overIndex === i ? '2px solid #00c805' : '1px solid #232925',
              background: '#131614', cursor: 'grab',
              transition: 'border-color 0.15s, transform 0.15s',
            }}
          >
            <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

            {/* Cover badge */}
            {i === 0 && (
              <div style={{
                position: 'absolute', top: 8, left: 8,
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '5px 10px', borderRadius: 999,
                background: 'linear-gradient(135deg, #00c805, #00e05c)',
                color: '#052012', fontSize: 10, fontWeight: 900, letterSpacing: 0.5,
                boxShadow: '0 4px 14px rgba(0, 200, 5,0.6)',
              }}>
                <Star size={10} fill="#052012" /> COVER
              </div>
            )}

            {/* Drag hint */}
            <div style={{
              position: 'absolute', top: 8, right: 8,
              width: 26, height: 26, borderRadius: 7,
              background: 'rgba(10, 11, 10,0.7)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#cdd6d0',
            }}>
              <GripVertical size={14} />
            </div>

            {/* Bottom controls */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '8px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.78), transparent)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <button type="button" onClick={() => onMove(i, -1)} disabled={i === 0}
                style={ctrlBtn(i === 0)}>←</button>
              <button type="button" onClick={() => onMove(i, 1)} disabled={i === photos.length - 1}
                style={ctrlBtn(i === photos.length - 1)}>→</button>
              <div style={{ flex: 1 }} />
              <button type="button" onClick={() => onRemove(p.id)}
                style={{
                  width: 26, height: 26, borderRadius: 7, border: 'none',
                  background: 'rgba(239,68,68,0.85)', color: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <X size={13} />
              </button>
            </div>
          </div>
        ))}

        {/* Quiet placeholder slots */}
        {Array.from({ length: Math.max(0, Math.min(6, MAX_PHOTOS) - photos.length) }).map((_, k) => {
          const slot = photos.length + 1 + k;
          return (
            <button
              key={`ghost-${k}`}
              type="button"
              onClick={onPick}
              style={{
                aspectRatio: '4 / 3', borderRadius: 12,
                border: '1.5px dashed #2e352f',
                background: '#0e100e',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00c805'; e.currentTarget.style.background = '#10140f'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2e352f'; e.currentTarget.style.background = '#0e100e'; }}
            >
              <Camera size={18} color="#5a675f" />
              <span style={{ color: '#5a675f', fontSize: 11, fontWeight: 700 }}>
                Photo {slot}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const inp = { width: '100%', padding: '10px 12px', borderRadius: 9, fontSize: 13 };

function ctrlBtn(disabled) {
  return {
    width: 28, height: 28, borderRadius: 8, border: 'none',
    background: disabled ? 'rgba(255,255,255,0.08)' : 'rgba(0, 200, 5,0.85)',
    color: disabled ? 'rgba(255,255,255,0.35)' : '#fff',
    cursor: disabled ? 'default' : 'pointer',
    fontWeight: 900, fontSize: 14, lineHeight: 1,
    boxShadow: disabled ? 'none' : '0 3px 10px rgba(0, 200, 5,0.5)',
  };
}

function Card({ title, icon: Icon, children, style }) {
  return (
    <div style={{
      background: '#131614', border: '1px solid #232925', borderRadius: 14,
      padding: 18, ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        {Icon && <Icon size={16} style={{ color: '#4ade80' }} />}
        <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 15, margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <label style={{ color: '#95a29b', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: 0.3 }}>
      {children}
    </label>
  );
}

function Box({ label, children }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
