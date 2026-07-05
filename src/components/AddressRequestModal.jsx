import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AddressRequestModal({ deal, sellerName, onClose, onSubmit }) {
  const { isLoggedIn } = useAuth();
  const [agreed, setAgreed] = useState(false);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div style={{
        background: '#131614', border: '1px solid #232925',
        borderRadius: '20px', width: '100%', maxWidth: '520px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #232925', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '20px', margin: 0 }}>Request Property Address</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5a675f', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {!isLoggedIn ? (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <Shield size={40} style={{ color: '#00c805', marginBottom: '16px' }} />
            <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Sign up or Log in to request address</h3>
            <p style={{ color: '#95a29b', fontSize: '14px', marginBottom: '24px' }}>You need to be logged in to request property details.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/auth" className="gradient-btn" style={{ padding: '12px 24px', borderRadius: '10px', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Sign Up</Link>
              <Link to="/auth" style={{ padding: '12px 24px', borderRadius: '10px', color: '#95a29b', textDecoration: 'none', border: '1px solid #232925', background: 'rgba(255,255,255,0.05)', fontWeight: 600 }}>Log In</Link>
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px' }}>
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '12px', padding: '16px', marginBottom: '20px',
              display: 'flex', gap: '12px',
            }}>
              <AlertTriangle size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ color: '#e4eae6', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                Requesting the address means you agree to the terms below. Any contract interference carries a $75,000 liquidated damages fee.
              </p>
            </div>

            <label style={{
              display: 'flex', gap: '12px', padding: '14px',
              background: '#1a1f1b', border: `1px solid ${agreed ? '#00c805' : '#232925'}`,
              borderRadius: '12px', cursor: 'pointer', marginBottom: '20px',
            }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: '3px', accentColor: '#00c805' }}
              />
              <span style={{ color: '#e4eae6', fontSize: '13px', lineHeight: 1.6 }}>
                I agree not to interfere with the contract in place. Doing so would result in a $75,000 fee due to <strong style={{ color: '#f8fafc' }}>{sellerName}</strong>.
              </span>
            </label>

            <button
              onClick={() => { if (agreed) onSubmit && onSubmit(); onClose(); }}
              disabled={!agreed}
              className={agreed ? 'gradient-btn' : ''}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: agreed ? undefined : 'rgba(255,255,255,0.05)',
                border: agreed ? 'none' : '1px solid #232925',
                color: agreed ? '#fff' : '#5a675f',
                fontWeight: 700, fontSize: '15px',
                cursor: agreed ? 'pointer' : 'not-allowed',
              }}
            >
              Submit Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
