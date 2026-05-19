import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, Home, MapPin, Camera, Video, Tag, ArrowLeft, Upload,
  X, GripVertical, Star, Image as ImageIcon, Sparkles, CheckCircle2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';
import AddressAutocomplete from '../components/AddressAutocomplete';

const DEAL_TYPES = [
  { value: 'fix-flip',   label: 'Fix & Flip',       color: '#ef4444' },
  { value: 'rental',     label: 'Rental',           color: '#10b981' },
  { value: 'creative',   label: 'Creative Finance', color: '#f59e0b' },
  { value: 'commercial', label: 'Commercial',       color: '#06b6d4' },
  { value: 'land',       label: 'Land',             color: '#8b5cf6' },
];

const MAX_PHOTOS = 12;

export default function PostDeal() {
  useSEO({ title: 'Post a Deal', description: 'List your off-market deal in under a minute.' });
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    dealType: 'fix-flip',
    title: '',
    address: '', city: '', state: '', zip: '',
    beds: '', baths: '', sqft: '', yearBuilt: '',
    contractedPrice: '', listingPrice: '',
    arv: '', repairCost: '',
    description: '', youtubeUrl: '',
  });
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

  const profit = (parseInt(form.arv) || 0) - (parseInt(form.listingPrice) || 0) - (parseInt(form.repairCost) || 0);
  const canPost = form.title && form.city && form.state && form.listingPrice && form.arv;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canPost) {
      toast('Add a title, city/state, listing price, and ARV to post.', 'info');
      return;
    }
    toast('🎉 Deal posted! It\'s now live in the marketplace.', 'success', 4500);
    navigate('/my-deals');
  }

  const fullAddress = [form.address, form.city, form.state, form.zip].filter(Boolean).join(', ');

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: 96 }}>
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
        {/* Hero: deal name + address */}
        <div style={{ marginBottom: 20 }}>
          <input
            value={form.title}
            onChange={e => update('title', e.target.value)}
            placeholder="Deal title — e.g. Brick Ranch with Massive ARV Upside"
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              color: '#f8fafc', fontWeight: 900,
              fontSize: 'clamp(22px, 4vw, 34px)', letterSpacing: '-0.5px',
              padding: '4px 0',
            }}
          />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            borderBottom: '1px solid #1e1e2e', paddingBottom: 12, marginTop: 4,
          }}>
            <MapPin size={16} style={{ color: '#a78bfa', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
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
                  color: '#cbd5e1', fontSize: 15, padding: '4px 0',
                }}
              />
            </div>
          </div>
          {fullAddress && (
            <div style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>
              🔒 Exact address stays hidden until you approve a buyer's request.
            </div>
          )}
        </div>

        {/* Photo gallery — directly under name + address */}
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

          {/* Financials */}
          <Card title="The numbers" icon={DollarSign}>
            <div style={{
              background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 10, padding: '10px 12px', marginBottom: 14,
            }}>
              <div style={{ color: '#a78bfa', fontSize: 12, fontWeight: 700 }}>🔒 Contracted price stays private</div>
              <div style={{ color: '#94a3b8', fontSize: 12 }}>Only the listing price shows publicly.</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <Box label="Contracted (private)"><input value={form.contractedPrice} onChange={e => update('contractedPrice', e.target.value)} type="number" placeholder="65000" className="input-dark" style={inp} /></Box>
              <Box label="Listing price *"><input value={form.listingPrice} onChange={e => update('listingPrice', e.target.value)} type="number" placeholder="90000" className="input-dark" style={inp} /></Box>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Box label="ARV *"><input value={form.arv} onChange={e => update('arv', e.target.value)} type="number" placeholder="320000" className="input-dark" style={inp} /></Box>
              <Box label="Repair estimate"><input value={form.repairCost} onChange={e => update('repairCost', e.target.value)} type="number" placeholder="55000" className="input-dark" style={inp} /></Box>
            </div>
            {form.arv && form.listingPrice && (
              <div style={{ background: '#1a1a2e', border: '1px solid #1e1e2e', borderRadius: 10, padding: 14, marginTop: 14 }}>
                <div style={{ color: '#475569', fontSize: 11, fontWeight: 700 }}>ESTIMATED BUYER PROFIT</div>
                <div style={{ color: profit > 0 ? '#10b981' : '#ef4444', fontSize: 24, fontWeight: 800 }}>
                  ${Math.round(profit).toLocaleString()}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Description + video */}
        <Card title="Description & video" icon={Video} style={{ marginTop: 18 }}>
          <Box label="Deal description">
            <textarea
              value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="Scope of work, neighborhood, comps, timing, exit strategy…"
              rows={5} className="input-dark" style={{ ...inp, resize: 'vertical' }}
            />
          </Box>
          <div style={{ marginTop: 12 }}>
            <Box label="YouTube walkthrough URL (optional)">
              <input value={form.youtubeUrl} onChange={e => update('youtubeUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." className="input-dark" style={inp} />
            </Box>
          </div>
        </Card>
      </form>

      {/* Sticky submit bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(13,13,26,0.96)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid #1e1e2e',
        padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {form.title || 'Untitled deal'}
            </div>
            <div style={{ color: '#64748b', fontSize: 12 }}>
              {photos.length} photo{photos.length !== 1 ? 's' : ''} · {canPost ? 'Ready to post' : 'Fill required fields'}
            </div>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!canPost}
            style={{
              padding: '13px 26px', borderRadius: 12,
              background: canPost ? 'linear-gradient(135deg,#8b5cf6,#06b6d4)' : 'rgba(255,255,255,0.05)',
              border: canPost ? 'none' : '1px solid #1e1e2e',
              color: canPost ? '#fff' : '#475569',
              fontWeight: 800, fontSize: 15,
              cursor: canPost ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: canPost ? '0 10px 28px rgba(139,92,246,0.4)' : 'none',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={17} /> Post Deal
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
                padding: '4px 8px', borderRadius: 999,
                background: 'rgba(139,92,246,0.9)', color: '#fff',
                fontSize: 10, fontWeight: 800, letterSpacing: 0.4,
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

        {/* Upload tile (the "blank" that fills as you drop) */}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={onPick}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            style={{
              aspectRatio: '4 / 3', borderRadius: 12,
              border: `2px dashed ${dragOver ? '#8b5cf6' : '#1e1e2e'}`,
              background: dragOver ? 'rgba(139,92,246,0.08)' : '#12121e',
              color: '#94a3b8', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {photos.length === 0 ? <Camera size={18} style={{ color: '#a78bfa' }} /> : <Upload size={18} style={{ color: '#a78bfa' }} />}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1' }}>
              {photos.length === 0 ? 'Drop photos or click' : 'Add more'}
            </div>
            <div style={{ fontSize: 10, color: '#64748b' }}>JPG · PNG · HEIC</div>
          </button>
        )}
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
    width: 26, height: 26, borderRadius: 7, border: 'none',
    background: disabled ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.18)',
    color: disabled ? '#475569' : '#fff',
    cursor: disabled ? 'default' : 'pointer',
    fontWeight: 800, fontSize: 13, lineHeight: 1,
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
