import { useEffect } from 'react';
import { X } from 'lucide-react';
import { T } from '../theme';
import { FilterSidebarContent } from './FilterSidebar';

export default function MobileFilterDrawer({ open, onClose, state, setState, matchedCount }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: '92vh',
          background: T.bg,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          border: `1px solid ${T.border}`,
          borderBottom: 'none',
          display: 'flex',
          flexDirection: 'column',
          animation: 'sheet-up 0.25s cubic-bezier(.2,.9,.3,1)',
        }}
      >
        {/* grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <div style={{ width: 44, height: 4, borderRadius: 2, background: '#2a2f3a' }} />
        </div>
        {/* header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <span style={{ color: T.text, fontWeight: 800, fontSize: 16 }}>Filters</span>
          <button
            onClick={onClose}
            aria-label="Close filters"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              background: T.card,
              color: T.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <FilterSidebarContent
            state={state}
            setState={setState}
            matchedCount={matchedCount}
            showApply={false}
            mobile
          />
        </div>

        {/* sticky apply */}
        <div
          style={{
            padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
            borderTop: `1px solid ${T.border}`,
            background: T.bg,
            display: 'flex',
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: '0 0 96px',
              padding: '14px',
              borderRadius: 12,
              border: `1px solid ${T.border}`,
              background: T.card,
              color: T.text,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px 16px',
              borderRadius: 12,
              border: 'none',
              background: T.lime,
              color: '#07080b',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: `0 0 0 1px rgba(217,255,79,0.4), 0 8px 22px rgba(217,255,79,0.32)`,
            }}
          >
            Apply Filters
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 999,
                background: 'rgba(7,8,11,0.18)',
                color: '#07080b',
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {matchedCount.toLocaleString()}
            </span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes sheet-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
