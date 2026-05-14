import { MessageSquare } from 'lucide-react';
import { T } from '../theme';

export default function FloatingChat({ offsetForBottomNav = false }) {
  return (
    <button
      aria-label="Open chat"
      style={{
        position: 'fixed',
        right: 18,
        bottom: offsetForBottomNav ? 'calc(80px + env(safe-area-inset-bottom))' : 22,
        width: 54,
        height: 54,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        background: T.lime,
        color: '#07080b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 0 1px rgba(217,255,79,0.5), 0 12px 30px rgba(217,255,79,0.35)`,
        zIndex: 65,
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <MessageSquare size={22} strokeWidth={2.4} />
      <span
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#ef4444',
          border: `2px solid ${T.bg}`,
        }}
      />
    </button>
  );
}
