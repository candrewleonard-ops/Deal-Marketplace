import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SECTIONS = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Browse Deals',     to: '/marketplace' },
      { label: 'Post a Deal',      to: '/my-deals' },
      { label: 'Saved Deals',      to: '/saved' },
      { label: 'Contractors',      to: '/contractors' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Social Feed',      to: '/social' },
      { label: 'Groups',           to: '/groups' },
      { label: 'Meetups',          to: '/meetups' },
      { label: 'City Discussions', to: '/social' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My Profile',       to: '/profile/me' },
      { label: 'My Deals',         to: '/my-deals' },
      { label: 'Messages',         to: '/messages' },
      { label: 'Upgrade to VIP',   to: '/premium' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About TREIM',      to: '/landing' },
      { label: 'How It Works',     to: '/landing' },
      { label: 'Contact',          to: '/messages' },
      { label: 'Help Center',      to: '/landing' },
    ],
  },
];

const SOCIAL = [
  { glyph: '𝕏',  href: '#', label: 'X' },
  { glyph: 'f',  href: '#', label: 'Facebook' },
  { glyph: 'ig', href: '#', label: 'Instagram' },
  { glyph: 'yt', href: '#', label: 'YouTube' },
  { glyph: 'in', href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  function subscribe(e) {
    e.preventDefault();
    if (!email || !email.includes('@')) { toast('Please enter a valid email', 'error'); return; }
    setEmail('');
    toast("You're subscribed! First digest drops this week.", 'success');
  }

  return (
    <footer style={{
      background: '#0d0d1a', borderTop: '1px solid #1e1e2e',
      padding: '48px 20px 24px', marginTop: '60px',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Upper section: brand + nav columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(4, 1fr)',
          gap: '40px', marginBottom: '40px',
        }}>
          {/* Brand column */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '14px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Building2 size={18} style={{ color: '#fff' }} />
              </div>
              <span className="gradient-text" style={{ fontSize: '22px', fontWeight: 900 }}>TREIM</span>
            </Link>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '280px' }}>
              The #1 marketplace for real estate investors. Post deals free, find buyers fast, build your network.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {SOCIAL.map(({ glyph, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: '34px', height: '34px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#94a3b8', transition: 'all 0.2s',
                    fontWeight: 800, fontSize: '13px',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.color = '#8b5cf6'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e2e'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  {glyph}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {SECTIONS.map(({ title, links }) => (
            <div key={title}>
              <h4 style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '14px' }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#8b5cf6'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.08))',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: '14px', padding: '20px 24px', marginBottom: '28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '16px', marginBottom: '2px' }}>
              🔥 Get hot deals in your inbox
            </div>
            <div style={{ color: '#94a3b8', fontSize: '13px' }}>
              Weekly roundup of the best deals across your favorite markets. Free, unsubscribe anytime.
            </div>
          </div>
          <form
            onSubmit={subscribe}
            style={{ display: 'flex', gap: '8px', flexShrink: 0 }}
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-dark"
              style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '13px', minWidth: '220px' }}
            />
            <button
              type="submit"
              className="gradient-btn"
              style={{ padding: '10px 18px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #1e1e2e', paddingTop: '20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ color: '#475569', fontSize: '12px' }}>
            © {new Date().getFullYear()} TREIM — The Real Estate Investment Marketplace. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '18px', fontSize: '12px' }}>
            {['Terms', 'Privacy', 'Cookies', 'DMCA'].map(t => (
              <a key={t} href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s' }}
                 onMouseEnter={e => { e.currentTarget.style.color = '#f8fafc'; }}
                 onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; }}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
