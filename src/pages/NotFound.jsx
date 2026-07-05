import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Building2 } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: '#0a0b0a', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 30% 30%, rgba(0, 200, 5,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(0, 229, 160,0.08) 0%, transparent 50%)',
      }} />

      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center', position: 'relative' }}>
        {/* Huge 404 */}
        <div className="gradient-text" style={{
          fontSize: '160px', fontWeight: 900, lineHeight: 1, letterSpacing: '-4px',
          marginBottom: '8px',
        }}>
          404
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Building2 size={16} style={{ color: '#00c805' }} />
          <span style={{ color: '#95a29b', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Deal Not Found
          </span>
        </div>

        <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '28px', margin: '0 0 12px' }}>
          Looks like this property is off-market
        </h1>

        <p style={{ color: '#95a29b', fontSize: '15px', margin: '0 0 32px', lineHeight: 1.6 }}>
          The page you're looking for doesn't exist, moved, or the deal's already been snatched up.
          Let's get you back to something that closes.
        </p>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '12px 20px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid #232925',
              color: '#f8fafc', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
            }}
          >
            <ArrowLeft size={15} /> Go Back
          </button>
          <Link
            to="/"
            className="gradient-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '12px 20px', borderRadius: '10px',
              color: '#fff', fontWeight: 700, fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            <Home size={15} /> Back to Marketplace
          </Link>
        </div>

        {/* Popular destinations */}
        <div style={{
          background: '#131614', border: '1px solid #232925', borderRadius: '14px',
          padding: '20px 24px',
        }}>
          <div style={{ color: '#5a675f', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Popular destinations
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { to: '/marketplace',  label: 'Browse all active deals',   icon: Search },
              { to: '/social',       label: 'Investor social feed',      icon: Building2 },
              { to: '/meetups',      label: 'REI meetups near you',      icon: Building2 },
              { to: '/my-deals',     label: 'Post your own deal',        icon: Building2 },
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '8px',
                  color: '#cdd6d0', textDecoration: 'none', fontSize: '13px', fontWeight: 500,
                  transition: 'all 0.15s', textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0, 200, 5,0.08)'; e.currentTarget.style.color = '#4ade80'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cdd6d0'; }}
              >
                <Icon size={14} style={{ color: '#5a675f' }} />
                {label}
                <span style={{ marginLeft: 'auto', color: '#5a675f' }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
