import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, Home, MapPin, Camera, Video, Tag, ArrowLeft, Upload,
  X, GripVertical, Star, Image as ImageIcon, Sparkles, CheckCircle2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';
import { useIsMobile } from '../hooks/useIsMobile';
import AddressAutocomplete from '../components/AddressAutocomplete';

const DEAL_TYPES = [
  { value: 'fix-flip',   label: 'Fix & Flip',       color: '#ef4444' },
  { value: 'rental',     label: 'Rental',           color: '#10b981' },
  { value: 'creative',   label: 'Creative Finance', color: '#f59e0b' },
  { value: 'commercial', label: 'Commercial',       color: '#06b6d4' },
  { value: 'land',       label: 'Land',             color: '#8b5cf6' },
];

const MAX_PHOTOS = 12;

// Vibrant gradient palette — used for empty photo slots + accents so the
// gallery feels alive (matches the lively tiles in the onboarding tour).
const GRADIENTS = [
  'linear-gradient(135deg, #8b5cf6, #06b6d4)',
  'linear-gradient(135deg, #ef4444, #f59e0b)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #f59e0b, #ec4899)',
  'linear-gradient(135deg, #06b6d4, #8b5cf6)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
];

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
  });
  const [showVideoNudge, setShowVideoNudge] = useState(true);
  const [photos, setPhotos] = useState([]); // { id, url, name }
  const [dragOver, setDragOver] = useState(false);
  const dragIndex = useRef(null);
  const [overIndex, setOverIndex] = useState(null);

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

  function handleSubmit(e) {
    e?.preventDefault?.();
    const title = form.title.trim();
    const address = resolveAddress();
    // Keep state in sync if autofill bypassed onChange.
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
    toast('🎉 Deal posted! It\'s now live in the marketplace.', 'success', 4500);
    navigate('/my-deals');
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: 150 }}>
      {/* Top bar */}
      <div style={{
        background: '#0d0d1a', borderBottom: '1px solid #1e1e2e',
        padding: '14px 16px', position: 'sticky', top: 0, zIndex: 30,
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e',
              borderRadius: 9, padding: '8px 12px', color: '#94a3b8',
              cursor: 'pointer', fontSize: 13, fontWeight: 700,
            }}
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(139,92,246,0.3)',
              color: '#a78bfa', fontSize: 11, fontWeight: 800, letterSpacing: 0.5,
            }}>
              <Sparkles size={11} /> FREE TO LIST
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
            borderBottom: '1px solid #1e1e2e', paddingBottom: 12, marginTop: 2,
            color: '#64748b', fontSize: 13,
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
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#0d0d1a', border: '1px solid #1e1e2e',
                borderRadius: 10, padding: '4px 12px', marginBottom: 8,
              }}
            >
              <MapPin size={16} style={{ color: '#a78bfa', flexShrink: 0 }} />
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
            <div style={{ color: '#64748b', fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>
              🔒 The exact address stays hidden from buyers until you approve their request.
            </div>

            {/* Subtle, dismissible video nudge — right under the address */}
            {showVideoNudge && !form.youtubeUrl && (
              <div style={{
                marginBottom: 16,
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 14px', borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(139,92,246,0.06))',
                border: '1px solid rgba(239,68,68,0.18)',
              }}>
                <Video size={15} style={{ color: '#f87171', flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: '#cbd5e1', fontSize: 12.5, lineHeight: 1.5, flex: 1 }}>
                  Deals with a <strong style={{ color: '#f8fafc' }}>video walkthrough</strong> get far
                  more serious buyers. Add a YouTube link below — it embeds right on your listing.
                </span>
                <button
                  type="button"
                  onClick={() => setShowVideoNudge(false)}
                  aria-label="Dismiss"
                  style={{
                    background: 'none', border: 'none', color: '#64748b',
                    cursor: 'pointer', flexShrink: 0, padding: 2, lineHeight: 0,
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <Label>Deal type</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {DEAL_TYPES.map(t => (
                <button
                  key={t.value} type="button"
                  onClick={() => update('dealType', t.value)}
                  style={{
                    padding: '8px 14px', borderRadius: 8,
                    background: form.dealType === t.value ? `${t.color}20` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${form.dealType === t.value ? t.color : '#1e1e2e'}`,
                    color: form.dealType === t.value ? t.color : '#94a3b8',
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
              background: 'linear-gradient(135deg, rgba(139,92,246,0.14), rgba(6,182,212,0.10))',
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: 14, padding: '16px 18px', marginBottom: 16,
            }}>
              <label style={{
                color: '#a78bfa', fontSize: 12, fontWeight: 800,
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
                    borderRadius: 10, background: '#0d0d1a',
                    border: '1px solid rgba(139,92,246,0.35)',
                    color: '#f8fafc', fontSize: 26, fontWeight: 900, outline: 'none',
                  }}
                />
              </div>
              <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 8 }}>
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
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13, fontWeight: 700 }}>$</span>
                <input value={form.rehabLow} onChange={e => update('rehabLow', e.target.value)} type="number" placeholder="Low (e.g. 40,000)" className="input-dark" style={{ ...inp, paddingLeft: 22 }} />
              </div>
              <span style={{ color: '#64748b', fontSize: 13, fontWeight: 700 }}>to</span>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13, fontWeight: 700 }}>$</span>
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

        {/* Description + video — larger on desktop */}
        <Card title="Description & video" icon={Video} style={{ marginTop: 18 }}>
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
          <div style={{ marginTop: 16 }}>
            <label style={{
              color: '#94a3b8', fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8,
            }}>
              <Video size={15} style={{ color: '#f87171' }} /> YouTube walkthrough URL
              <span style={{ color: '#64748b', fontWeight: 600 }}>(optional, but recommended)</span>
            </label>
            <input
              value={form.youtubeUrl}
              onChange={e => update('youtubeUrl', e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="input-dark"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 10,
                fontSize: isMobile ? 14 : 16,
                fontWeight: 600,
              }}
            />
            <div style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>
              Paste any YouTube link — it embeds automatically on your live listing.
            </div>
          </div>
        </Card>
      </form>

      {/* Sticky submit bar — large + prominent */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(13,13,26,0.98)', backdropFilter: 'blur(14px)',
        borderTop: '1px solid #1e1e2e',
        padding: `${isMobile ? 16 : 20}px ${isMobile ? 16 : 24}px calc(${isMobile ? 16 : 20}px + env(safe-area-inset-bottom))`,
        boxShadow: '0 -12px 40px rgba(0,0,0,0.5)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: isMobile ? 15 : 18, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {form.title || 'Untitled deal'}
            </div>
            <div style={{ color: canPost ? '#34d399' : '#64748b', fontSize: isMobile ? 12 : 14, fontWeight: 600, marginTop: 2 }}>
              {photos.length} photo{photos.length !== 1 ? 's' : ''} ·{' '}
              {canPost ? '✓ Ready to post' : 'Need: name, street address & 1 photo'}
            </div>
          </div>
          {/* Always pressable — clicking it tells you exactly what's missing
              (and is autofill-safe via resolveAddress). */}
          <button
            type="submit"
            onClick={handleSubmit}
            style={{
              padding: isMobile ? '16px 28px' : '18px 44px',
              borderRadius: 14,
              background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
              border: 'none',
              color: '#fff',
              fontWeight: 900, fontSize: isMobile ? 17 : 20, letterSpacing: 0.2,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 14px 38px rgba(139,92,246,0.5)',
              opacity: canPost ? 1 : 0.92,
              flexShrink: 0,
              transition: 'transform 0.12s',
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <CheckCircle2 size={isMobile ? 20 : 24} /> Post Deal
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
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ImageIcon size={16} style={{ color: '#a78bfa' }} />
          <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: 15 }}>Photo gallery</span>
          <span style={{ color: '#64748b', fontSize: 12 }}>{photos.length}/{MAX_PHOTOS}</span>
        </div>
        {photos.length > 0 && (
          <span style={{ color: '#64748b', fontSize: 12 }}>Drag to reorder · first photo is the cover</span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={e => { onFiles(e.target.files); e.target.value = ''; }}
        style={{ display: 'none' }}
      />

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
              border: overIndex === i ? '2px solid #8b5cf6' : '1px solid #1e1e2e',
              background: '#12121e', cursor: 'grab',
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
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                color: '#fff', fontSize: 10, fontWeight: 900, letterSpacing: 0.5,
                boxShadow: '0 4px 14px rgba(139,92,246,0.6)',
              }}>
                <Star size={10} fill="#fff" /> COVER
              </div>
            )}

            {/* Drag hint */}
            <div style={{
              position: 'absolute', top: 8, right: 8,
              width: 26, height: 26, borderRadius: 7,
              background: 'rgba(10,10,15,0.7)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#cbd5e1',
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

        {/* Upload tile — vibrant, lively */}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={onPick}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            style={{
              aspectRatio: '4 / 3', borderRadius: 12, border: 'none',
              background: GRADIENTS[photos.length % GRADIENTS.length],
              color: '#fff', cursor: 'pointer', position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: dragOver
                ? '0 0 0 3px rgba(255,255,255,0.7), 0 12px 30px rgba(139,92,246,0.45)'
                : '0 8px 24px rgba(0,0,0,0.35)',
              transform: dragOver ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.15s',
            }}
          >
            {/* sheen */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.28), transparent 55%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              width: 46, height: 46, borderRadius: 12,
              background: 'rgba(255,255,255,0.22)',
              border: '1px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}>
              {photos.length === 0 ? <Camera size={20} color="#fff" /> : <Upload size={20} color="#fff" />}
            </div>
            <div style={{ fontSize: 13, fontWeight: 900, textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>
              {photos.length === 0 ? 'Add photos' : 'Add more'}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.9 }}>Drop or click · JPG · PNG · HEIC</div>
          </button>
        )}

        {/* Colorful empty slots so the gallery looks alive while you fill it */}
        {Array.from({ length: Math.max(0, Math.min(6, MAX_PHOTOS) - photos.length - 1) }).map((_, k) => {
          const slot = photos.length + 1 + k;
          return (
            <button
              key={`ghost-${k}`}
              type="button"
              onClick={onPick}
              style={{
                aspectRatio: '4 / 3', borderRadius: 12, border: 'none',
                background: GRADIENTS[(photos.length + 1 + k) % GRADIENTS.length],
                position: 'relative', overflow: 'hidden', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                opacity: 0.45, transition: 'opacity 0.15s, transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.45; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 70% 80%, rgba(255,255,255,0.22), transparent 55%)',
                pointerEvents: 'none',
              }} />
              <Camera size={18} color="rgba(255,255,255,0.85)" />
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 800 }}>
                Photo {slot}
              </span>
            </button>
          );
        })}
      </div>

      {photos.length === 0 && (
        <div style={{
          marginTop: 10, padding: '10px 14px', borderRadius: 8,
          background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
          color: '#fbbf24', fontSize: 12, lineHeight: 1.5,
        }}>
          💡 Listings with photos get far more address requests. The first photo becomes the cover.
        </div>
      )}
    </div>
  );
}

const inp = { width: '100%', padding: '10px 12px', borderRadius: 9, fontSize: 13 };

function ctrlBtn(disabled) {
  return {
    width: 28, height: 28, borderRadius: 8, border: 'none',
    background: disabled ? 'rgba(255,255,255,0.08)' : 'rgba(139,92,246,0.85)',
    color: disabled ? 'rgba(255,255,255,0.35)' : '#fff',
    cursor: disabled ? 'default' : 'pointer',
    fontWeight: 900, fontSize: 14, lineHeight: 1,
    boxShadow: disabled ? 'none' : '0 3px 10px rgba(139,92,246,0.5)',
  };
}

function Card({ title, icon: Icon, children, style }) {
  return (
    <div style={{
      background: '#12121e', border: '1px solid #1e1e2e', borderRadius: 14,
      padding: 18, ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        {Icon && <Icon size={16} style={{ color: '#a78bfa' }} />}
        <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 15, margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <label style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: 0.3 }}>
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
