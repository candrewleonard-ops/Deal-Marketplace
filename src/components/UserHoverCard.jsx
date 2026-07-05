import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function UserHoverCard({ user, children }) {
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);

  if (!user) return children;

  const open = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShow(true), 300);
  };
  const close = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShow(false), 200);
  };

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={open}
      onMouseLeave={close}
    >
      {children}
      {show && (
        <div
          onMouseEnter={open}
          onMouseLeave={close}
          style={{
            position: 'absolute', top: '100%', left: 0, marginTop: '8px',
            width: '300px', background: '#131614',
            border: '1px solid #232925', borderRadius: '14px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            zIndex: 500, overflow: 'hidden',
            animation: 'hoverCardFade 0.15s ease-out',
          }}
        >
          {/* Cover photo */}
          <div style={{
            height: '60px',
            background: `linear-gradient(135deg, rgba(0, 200, 5, 0.3), rgba(0, 229, 160, 0.3)), url(${user.coverPhoto || ''})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
          <div style={{ padding: '0 14px 14px', marginTop: '-24px' }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '3px solid #131614', objectFit: 'cover',
              }}
            />
            <div style={{ marginTop: '6px' }}>
              <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{user.name}</div>
              </Link>
              <div style={{ color: '#5a675f', fontSize: '12px' }}>@{user.username}</div>
            </div>
            {user.tags && user.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                {user.tags.slice(0, 3).map(tag => (
                  <span key={tag} style={{
                    background: 'rgba(0, 200, 5, 0.1)', color: '#00c805',
                    borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: 600,
                  }}>{tag}</span>
                ))}
              </div>
            )}
            {user.bio && (
              <p style={{
                color: '#95a29b', fontSize: '12px', margin: '8px 0 0',
                lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {user.bio}
              </p>
            )}
            <button
              className="gradient-btn"
              style={{
                marginTop: '10px', width: '100%', padding: '7px',
                borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '12px',
              }}
            >
              Follow
            </button>
          </div>
        </div>
      )}
      <style>{`@keyframes hoverCardFade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </span>
  );
}
