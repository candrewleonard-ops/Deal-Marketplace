import { useState } from 'react';
import { X, DollarSign, Home, MapPin, Camera, Video, Tag } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import AddressAutocomplete from './AddressAutocomplete';

const DEAL_TYPES = [
  { value: 'fix-flip',  label: 'Fix & Flip',       color: '#ef4444' },
  { value: 'rental',    label: 'Rental',           color: '#10b981' },
  { value: 'creative',  label: 'Creative Finance', color: '#f59e0b' },
  { value: 'commercial',label: 'Commercial',       color: '#06b6d4' },
  { value: 'land',      label: 'Land',             color: '#8b5cf6' },
];

export default function PostDealModal({ onClose, onSubmit }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    dealType: 'fix-flip',
    title: '',
    address: '',
    city: '', state: '', zip: '',
    beds: '', baths: '', sqft: '', yearBuilt: '',
    contractedPrice: '', listingPrice: '',
    arv: '', repairCost: '',
    description: '',
    youtubeUrl: '',
    tags: [],
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function nextStep(e) {
    e.preventDefault();
    if (step < 3) { setStep(step + 1); return; }
    toast('🎉 Deal posted successfully! It\'s now live in the marketplace.', 'success', 4500);
    onSubmit?.(form);
    onClose();
  }

  const canContinue = step === 1
    ? form.title && form.city && form.state && form.dealType
    : step === 2
      ? form.listingPrice && form.arv
      : true;

  const profit = (parseInt(form.arv) || 0) - (parseInt(form.listingPrice) || 0) - (parseInt(form.repairCost) || 0);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#12121e', border: '1px solid #1e1e2e',
          borderRadius: '20px', width: '100%', maxWidth: '580px',
          maxHeight: '92vh', overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', margin: 0 }}>Post a Deal</h2>
            <div style={{ color: '#475569', fontSize: '12px', marginTop: '2px' }}>Step {step} of 3 · Free to list</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: '3px', background: '#1e1e2e' }}>
          <div style={{ width: `${(step / 3) * 100}%`, height: '100%', background: 'linear-gradient(to right, #8b5cf6, #06b6d4)', transition: 'width 0.3s ease' }} />
        </div>

        <form onSubmit={nextStep} style={{ padding: '24px' }}>
          {/* Step 1: Property basics */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>DEAL TYPE *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {DEAL_TYPES.map(t => (
                    <button
                      key={t.value} type="button"
                      onClick={() => update('dealType', t.value)}
                      style={{
                        padding: '8px 14px', borderRadius: '8px',
                        background: form.dealType === t.value ? `${t.color}20` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.dealType === t.value ? t.color : '#1e1e2e'}`,
                        color: form.dealType === t.value ? t.color : '#94a3b8',
                        cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="DEAL TITLE *" icon={Tag}>
                <input value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Brick Ranch with Massive ARV Upside" className="input-dark" style={inputStyle} />
              </Field>

              <Field label="STREET ADDRESS (hidden until you approve requests)" icon={MapPin}>
                <AddressAutocomplete
                  value={form.address}
                  onChange={(v) => update('address', v)}
                  onSelect={(picked) => {
                    setForm(f => ({
                      ...f,
                      address: picked.street || f.address,
                      city:    picked.city  || f.city,
                      state:   picked.state || f.state,
                      zip:     picked.zip   || f.zip,
                    }));
                  }}
                  placeholder="Start typing — e.g. 2847 Peachtree Rd NE"
                  inputStyle={inputStyle}
                />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                <Field label="CITY *">
                  <input value={form.city} onChange={e => update('city', e.target.value)} placeholder="Atlanta" className="input-dark" style={inputStyle} />
                </Field>
                <Field label="STATE *">
                  <input value={form.state} onChange={e => update('state', e.target.value.toUpperCase())} maxLength={2} placeholder="GA" className="input-dark" style={inputStyle} />
                </Field>
                <Field label="ZIP">
                  <input value={form.zip} onChange={e => update('zip', e.target.value)} placeholder="30305" className="input-dark" style={inputStyle} />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                <Field label="BEDS"><input value={form.beds} onChange={e => update('beds', e.target.value)} type="number" placeholder="3" className="input-dark" style={inputStyle} /></Field>
                <Field label="BATHS"><input value={form.baths} onChange={e => update('baths', e.target.value)} type="number" step="0.5" placeholder="2" className="input-dark" style={inputStyle} /></Field>
                <Field label="SQFT"><input value={form.sqft} onChange={e => update('sqft', e.target.value)} type="number" placeholder="1850" className="input-dark" style={inputStyle} /></Field>
                <Field label="YEAR"><input value={form.yearBuilt} onChange={e => update('yearBuilt', e.target.value)} type="number" placeholder="1978" className="input-dark" style={inputStyle} /></Field>
              </div>
            </div>
          )}

          {/* Step 2: Financials */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ color: '#a78bfa', fontSize: '12px', fontWeight: 700, marginBottom: '3px' }}>🔒 Contracted price stays private</div>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>Only the Listing Price shows publicly. Your assignment fee is hidden.</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label="CONTRACTED PRICE (private)" icon={DollarSign}>
                  <input value={form.contractedPrice} onChange={e => update('contractedPrice', e.target.value)} type="number" placeholder="65000" className="input-dark" style={inputStyle} />
                </Field>
                <Field label="LISTING PRICE (public) *" icon={DollarSign}>
                  <input value={form.listingPrice} onChange={e => update('listingPrice', e.target.value)} type="number" placeholder="90000" className="input-dark" style={inputStyle} />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label="AFTER REPAIR VALUE *" icon={Home}>
                  <input value={form.arv} onChange={e => update('arv', e.target.value)} type="number" placeholder="320000" className="input-dark" style={inputStyle} />
                </Field>
                <Field label="REPAIR COST ESTIMATE">
                  <input value={form.repairCost} onChange={e => update('repairCost', e.target.value)} type="number" placeholder="55000" className="input-dark" style={inputStyle} />
                </Field>
              </div>

              {/* Live profit preview */}
              {form.arv && form.listingPrice && (
                <div style={{ background: '#1a1a2e', border: '1px solid #1e1e2e', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ color: '#475569', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>ESTIMATED BUYER PROFIT</div>
                  <div style={{ color: profit > 0 ? '#10b981' : '#ef4444', fontSize: '22px', fontWeight: 800 }}>
                    ${Math.round(profit).toLocaleString()}
                  </div>
                  <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px' }}>
                    = ARV – List Price – Repair Cost (shown on deal card)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Media + description */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field label="DEAL DESCRIPTION">
                <textarea
                  value={form.description} onChange={e => update('description', e.target.value)}
                  placeholder="Describe the property, scope of work, neighborhood, comps, timing, etc..."
                  rows={5}
                  className="input-dark"
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </Field>

              <Field label="YOUTUBE VIDEO TOUR URL (optional)" icon={Video}>
                <input value={form.youtubeUrl} onChange={e => update('youtubeUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." className="input-dark" style={inputStyle} />
              </Field>

              {/* Photo upload placeholder */}
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>PROPERTY PHOTOS</label>
                <div style={{
                  background: '#1a1a2e', border: '2px dashed #1e1e2e', borderRadius: '10px',
                  padding: '24px', textAlign: 'center', cursor: 'pointer',
                }}>
                  <Camera size={24} style={{ color: '#475569', marginBottom: '8px' }} />
                  <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>Drop photos here or click to upload</div>
                  <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px' }}>Up to 12 photos · JPG, PNG, HEIC</div>
                </div>
              </div>

              {/* Final CTA banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(139,92,246,0.08))',
                border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', padding: '12px 14px',
              }}>
                <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, marginBottom: '3px' }}>💡 Pro tip</div>
                <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.5 }}>
                  Listings with photos + video get <strong style={{ color: '#f8fafc' }}>5x more address requests</strong>.
                  Add a quick walkthrough to stand out.
                </div>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1e1e2e' }}>
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} style={{ padding: '11px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
                ← Back
              </button>
            ) : <div />}
            <button
              type="submit"
              disabled={!canContinue}
              className={canContinue ? 'gradient-btn' : ''}
              style={{
                padding: '11px 20px', borderRadius: '10px',
                background: canContinue ? undefined : 'rgba(255,255,255,0.05)',
                border: canContinue ? 'none' : '1px solid #1e1e2e',
                color: canContinue ? '#fff' : '#475569',
                fontWeight: 700, fontSize: '13px',
                cursor: canContinue ? 'pointer' : 'not-allowed',
              }}
            >
              {step < 3 ? 'Continue →' : 'Post Deal 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '9px', fontSize: '13px' };

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px', letterSpacing: '0.3px' }}>
        {Icon && <Icon size={11} style={{ color: '#475569' }} />}
        {label}
      </label>
      {children}
    </div>
  );
}
