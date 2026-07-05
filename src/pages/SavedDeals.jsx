import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2, CheckSquare, Square, X } from 'lucide-react';
import { deals } from '../data/deals';
import { useSavedDeals } from '../hooks/useSavedDeals';
import { useToast } from '../context/ToastContext';
import DealCard from '../components/DealCard';
import { useSEO } from '../hooks/useSEO';

export default function SavedDeals() {
  useSEO({ title: 'Saved Deals', description: 'Your shortlist of off-market deals.' });
  const { savedIds, clear, removeMany } = useSavedDeals();
  const { toast } = useToast();
  const savedDeals = deals.filter(d => savedIds.includes(String(d.id)));

  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const totalValue = savedDeals.reduce((sum, d) => sum + (d.listingPrice || d.price || 0), 0);
  const totalRepairs = savedDeals.reduce((sum, d) => sum + (d.repairCost || 0), 0);
  const totalARV = savedDeals.reduce((sum, d) => sum + (d.arv || 0), 0);

  function toggleSelected(id) {
    const sid = String(id);
    const next = new Set(selected);
    if (next.has(sid)) next.delete(sid); else next.add(sid);
    setSelected(next);
  }

  function selectAll() {
    setSelected(new Set(savedDeals.map(d => String(d.id))));
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelected(new Set());
  }

  function removeSelected() {
    const ids = [...selected];
    removeMany(ids);
    toast(`Removed ${ids.length} deal${ids.length !== 1 ? 's' : ''}`, 'info');
    exitSelectMode();
  }

  return (
    <div style={{ background: '#0a0b0a', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#0e100e', borderBottom: '1px solid #232925', padding: '24px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <Heart size={22} fill="#ef4444" style={{ color: '#ef4444' }} />
              <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '24px', margin: 0 }}>Saved Deals</h1>
            </div>
            <p style={{ color: '#5a675f', margin: 0, fontSize: '13px' }}>
              {savedDeals.length} deal{savedDeals.length !== 1 ? 's' : ''} saved to your list
            </p>
          </div>

          {savedDeals.length > 0 && !selectMode && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setSelectMode(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '9px 14px', borderRadius: '9px',
                  background: 'rgba(0, 200, 5,0.1)', border: '1px solid rgba(0, 200, 5,0.3)',
                  color: '#4ade80', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                }}
              >
                <CheckSquare size={14} /> Select
              </button>
              <button
                onClick={() => { clear(); toast('All saved deals cleared', 'info'); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '9px 14px', borderRadius: '9px',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                  color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                }}
              >
                <Trash2 size={14} /> Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bulk action toolbar */}
      {selectMode && (
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(15,15,28,0.96)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #232925',
          padding: '12px 20px',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={exitSelectMode}
              aria-label="Cancel selection"
              style={{
                width: 32, height: 32, borderRadius: 8, border: '1px solid #232925',
                background: 'rgba(255,255,255,0.04)', color: '#95a29b', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
            <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: 14 }}>
              {selected.size} selected
            </span>
            <button
              onClick={selectAll}
              disabled={selected.size === savedDeals.length}
              style={{
                padding: '7px 12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.04)', border: '1px solid #232925',
                color: selected.size === savedDeals.length ? '#5a675f' : '#95a29b',
                fontSize: 12, fontWeight: 700, cursor: selected.size === savedDeals.length ? 'default' : 'pointer',
              }}
            >
              Select all
            </button>
            <div style={{ flex: 1 }} />
            <button
              onClick={removeSelected}
              disabled={selected.size === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8,
                background: selected.size === 0 ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: selected.size === 0 ? '#5a675f' : '#ef4444',
                fontSize: 13, fontWeight: 700,
                cursor: selected.size === 0 ? 'default' : 'pointer',
              }}
            >
              <Trash2 size={14} /> Remove selected
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
        {savedDeals.length === 0 ? (
          <div style={{
            background: '#131614', border: '1px solid #232925', borderRadius: '16px',
            padding: '80px 40px', textAlign: 'center',
          }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '18px',
            }}>
              <Heart size={32} style={{ color: '#ef4444' }} />
            </div>
            <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '20px', margin: '0 0 8px' }}>No saved deals yet</h2>
            <p style={{ color: '#95a29b', fontSize: '14px', margin: '0 0 24px', maxWidth: '400px', marginInline: 'auto', lineHeight: 1.6 }}>
              Tap the heart icon on any deal to save it for later. Build your deal shortlist and come back when you're ready to move.
            </p>
            <Link
              to="/marketplace"
              className="gradient-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: '10px',
                color: '#fff', fontWeight: 700, fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Browse the Marketplace <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <>
            {/* Summary stats — hide during select mode to reduce visual clutter */}
            {!selectMode && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { label: 'Total List Price', value: totalValue, color: '#f8fafc' },
                    { label: 'Total ARV (seller-reported)', value: totalARV, color: '#10b981' },
                    { label: 'Total Est. Repairs', value: totalRepairs, color: '#ef4444' },
                    { label: 'Avg List / Deal', value: totalValue / savedDeals.length, color: '#00e5a0' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{
                      background: '#131614', border: '1px solid #232925', borderRadius: '12px', padding: '16px',
                    }}>
                      <div style={{ color: '#5a675f', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px' }}>{label}</div>
                      <div style={{ color, fontWeight: 800, fontSize: '22px', marginTop: '4px' }}>
                        ${Math.round(value).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(0, 200, 5,0.08), rgba(0, 229, 160,0.08))',
                  border: '1px solid rgba(0, 200, 5,0.2)', borderRadius: '12px',
                  padding: '16px 20px', marginBottom: '24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
                }}>
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>
                      🔔 Get notified when similar deals hit the market
                    </div>
                    <div style={{ color: '#95a29b', fontSize: '12px' }}>
                      Set up deal alerts for your saved cities and price range
                    </div>
                  </div>
                  <Link
                    to="/premium"
                    style={{
                      padding: '9px 16px', borderRadius: '9px',
                      background: 'rgba(0, 200, 5,0.15)', border: '1px solid rgba(0, 200, 5,0.35)',
                      color: '#4ade80', textDecoration: 'none', fontWeight: 700, fontSize: '12px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Enable Alerts (VIP) →
                  </Link>
                </div>
              </>
            )}

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
              {savedDeals.map(deal => {
                const sid = String(deal.id);
                const isChecked = selected.has(sid);
                return (
                  <div
                    key={deal.id}
                    onClick={selectMode ? () => toggleSelected(sid) : undefined}
                    style={{ position: 'relative', cursor: selectMode ? 'pointer' : 'default' }}
                  >
                    {selectMode && (
                      <div style={{
                        position: 'absolute', top: 10, left: 10, zIndex: 5,
                        width: 32, height: 32, borderRadius: 8,
                        background: isChecked ? '#00c805' : 'rgba(10,10,15,0.85)',
                        border: `1.5px solid ${isChecked ? '#4ade80' : 'rgba(255,255,255,0.3)'}`,
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                      }}>
                        {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                      </div>
                    )}
                    <div style={{
                      pointerEvents: selectMode ? 'none' : 'auto',
                      opacity: selectMode && !isChecked ? 0.55 : 1,
                      transition: 'opacity 0.15s',
                      outline: isChecked ? '2px solid #00c805' : 'none',
                      outlineOffset: -2,
                      borderRadius: 12,
                    }}>
                      <DealCard deal={deal} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
