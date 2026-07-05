import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toast: () => {} };
  return ctx;
}

const TYPE_CONFIG = {
  success: { icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.35)' },
  error:   { icon: XCircle,     color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.35)' },
  info:    { icon: Info,        color: '#00e5a0', bg: 'rgba(0, 229, 160,0.12)',   border: 'rgba(0, 229, 160,0.35)' },
  warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const toast = useCallback((msg, type = 'success', ttl = 3200) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => dismiss(id), ttl);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast stack */}
      <div style={{
        position: 'fixed', top: '80px', right: '20px', zIndex: 10000,
        display: 'flex', flexDirection: 'column', gap: '10px',
        pointerEvents: 'none', maxWidth: '380px',
      }}>
        {toasts.map(t => {
          const cfg = TYPE_CONFIG[t.type] || TYPE_CONFIG.success;
          const Icon = cfg.icon;
          return (
            <div
              key={t.id}
              style={{
                background: '#131614', border: `1px solid ${cfg.border}`,
                borderLeft: `3px solid ${cfg.color}`,
                borderRadius: '10px', padding: '12px 14px',
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                pointerEvents: 'auto', minWidth: '260px',
                animation: 'toast-in 0.25s ease-out',
              }}
            >
              <Icon size={18} style={{ color: cfg.color, flexShrink: 0, marginTop: '1px' }} />
              <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 500, flex: 1, lineHeight: 1.5 }}>
                {t.msg}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                style={{ background: 'none', border: 'none', color: '#5a675f', cursor: 'pointer', padding: 0, marginTop: '1px' }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toast-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
