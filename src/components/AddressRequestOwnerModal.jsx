import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Ban, Send, MessageSquare, MapPin } from 'lucide-react';
import { getThread, recordDM } from '../lib/dmHistory';

const DEFAULT_DM = "I saw your request to review my property, are you an end buyer?";

/**
 * Shown to the deal owner when a buyer requests their address. They can
 * Approve, Deny, or DM. The DM panel loads any prior thread, or shows
 * "No DM's yet. Start the party!" with a prefilled opener.
 */
export default function AddressRequestOwnerModal({
  open, deal, owner, requester, onApprove, onDeny, onClose,
}) {
  const [draft, setDraft] = useState(DEFAULT_DM);
  const [, force] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (open) { setDraft(DEFAULT_DM); }
  }, [open, requester?.id]);

  if (!open || typeof document === 'undefined') return null;

  const thread = owner && requester ? getThread(owner.id, requester.id) : [];

  function send() {
    const text = draft.trim();
    if (!text) return;
    recordDM({
      fromId: owner.id, fromName: owner.name,
      toId: requester.id, toName: requester.name,
      text,
    });
    setDraft('');
    force(n => n + 1);
    setTimeout(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, 30);
  }

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 730,
        background: 'rgba(5,5,12,0.86)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        animation: 'aro-fade 0.18s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 460, maxHeight: '94vh', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(180deg,#1a1f1b,#131614)',
          border: '1px solid rgba(0, 200, 5,0.3)', borderRadius: 20,
          boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
          animation: 'aro-pop 0.24s cubic-bezier(.2,.9,.3,1)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #232925', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={requester?.avatar} alt="" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#95a29b', fontSize: 11, fontWeight: 800, letterSpacing: 0.4 }}>NEW ADDRESS REQUEST</div>
            <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: 16 }}>{requester?.name || 'A buyer'}</div>
            <div style={{ color: '#707d75', fontSize: 12 }}>
              {(requester?.tags?.[0]) || 'Investor'} · wants the address for “{deal?.title}”
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#95a29b', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, color: '#707d75', fontSize: 12, borderBottom: '1px solid #232925' }}>
          <MapPin size={13} style={{ color: '#4ade80' }} />
          {deal?.city}, {deal?.state} · ${(deal?.listingPrice || deal?.price || 0).toLocaleString()}
        </div>

        {/* DM thread */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 16, minHeight: 140, maxHeight: 280 }}>
          {thread.length === 0 ? (
            <div style={{
              textAlign: 'center', color: '#707d75', fontSize: 13,
              padding: '28px 12px',
            }}>
              <MessageSquare size={26} style={{ color: '#5a675f', marginBottom: 8 }} />
              <div style={{ color: '#cdd6d0', fontWeight: 700 }}>No DM's yet. Start the party! 🎉</div>
              <div style={{ marginTop: 4 }}>Vet the buyer before you hand over the address.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {thread.map(m => {
                const mine = String(m.fromId) === String(owner.id);
                return (
                  <div key={m.id} style={{
                    alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '80%',
                    padding: '8px 12px', borderRadius: 14,
                    background: mine ? 'linear-gradient(135deg,#00c805,#6d3df5)' : 'rgba(255,255,255,0.06)',
                    color: mine ? '#fff' : '#e4eae6', fontSize: 13, lineHeight: 1.45,
                    borderBottomRightRadius: mine ? 4 : 14,
                    borderBottomLeftRadius: mine ? 14 : 4,
                  }}>
                    {m.text}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DM composer */}
        <div style={{ padding: 14, borderTop: '1px solid #232925' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              placeholder="Message the buyer…"
              style={{
                flex: 1, resize: 'none', padding: '10px 12px', borderRadius: 10,
                background: '#0e100e', border: '1px solid #232925', color: '#f8fafc',
                fontSize: 13, outline: 'none', fontFamily: 'inherit', lineHeight: 1.45,
              }}
            />
            <button
              onClick={send}
              style={{
                width: 42, height: 42, borderRadius: 10, border: 'none', flexShrink: 0,
                background: 'linear-gradient(135deg,#00c805,#00e5a0)', color: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Send size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              onClick={onDeny}
              style={{
                flex: 1, padding: '12px', borderRadius: 10, cursor: 'pointer',
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
                color: '#f87171', fontWeight: 800, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}
            >
              <Ban size={15} /> Deny
            </button>
            <button
              onClick={onApprove}
              style={{
                flex: 1.4, padding: '12px', borderRadius: 10, cursor: 'pointer', border: 'none',
                background: 'linear-gradient(135deg,#10b981,#00e5a0)', color: '#fff',
                fontWeight: 800, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                boxShadow: '0 8px 22px rgba(16,185,129,0.4)',
              }}
            >
              <Check size={15} /> Approve & share address
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes aro-fade { from {opacity:0} to {opacity:1} }
        @keyframes aro-pop { from {opacity:0; transform:translateY(18px) scale(.97)} to {opacity:1; transform:none} }
      `}</style>
    </div>,
    document.body
  );
}
