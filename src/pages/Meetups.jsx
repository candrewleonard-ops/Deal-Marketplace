import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, ExternalLink, Filter, Map, Grid } from 'lucide-react';
import { meetups, meetupCategories } from '../data/meetups';

const categoryColors = {
  'REI Meetup': '#8b5cf6',
  'Wholesaler Meetup': '#06b6d4',
  'REIA Meeting': '#f59e0b',
  'Networking Event': '#10b981',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Meetups() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState('grid');
  const [showHost, setShowHost] = useState(false);

  const filtered = meetups.filter(m =>
    activeCategory === 'All' || m.category === activeCategory
  );

  const featured = filtered.filter(m => m.isFeatured);
  const upcoming = filtered.filter(m => !m.isFeatured);

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.08)), #0d0d1a',
        borderBottom: '1px solid #1e1e2e',
        padding: '48px 20px 36px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div>
              <h1 style={{ color: '#f8fafc', fontWeight: 900, fontSize: 'clamp(24px, 4vw, 40px)', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
                REI Meetups & Events
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
                Connect with {meetups.reduce((sum, m) => sum + m.attendees, 0).toLocaleString()}+ investors at events near you
              </p>
            </div>
            <button
              onClick={() => setShowHost(true)}
              className="gradient-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 22px', borderRadius: '12px',
                color: '#fff', fontWeight: 700, fontSize: '15px',
              }}
            >
              <Plus size={18} />
              Host a Meetup
            </button>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Category filters */}
            <div style={{ display: 'flex', gap: '6px', flex: 1, flexWrap: 'wrap' }}>
              {meetupCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                    background: activeCategory === cat
                      ? (cat === 'All' ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : `${categoryColors[cat] || '#8b5cf6'}20`)
                      : 'rgba(255,255,255,0.04)',
                    border: activeCategory === cat && cat !== 'All'
                      ? `1px solid ${categoryColors[cat] || '#8b5cf6'}50`
                      : activeCategory === cat ? '1px solid transparent' : '1px solid #1e1e2e',
                    color: activeCategory === cat
                      ? (cat === 'All' ? '#fff' : categoryColors[cat] || '#8b5cf6')
                      : '#94a3b8',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', borderRadius: '10px', overflow: 'hidden' }}>
              {[{ icon: Grid, val: 'grid' }, { icon: Map, val: 'map' }].map(({ icon: Icon, val }) => (
                <button
                  key={val}
                  onClick={() => setView(val)}
                  style={{
                    padding: '8px 12px',
                    background: view === val ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    border: 'none', cursor: 'pointer',
                    color: view === val ? '#8b5cf6' : '#94a3b8',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {view === 'map' ? (
          <div style={{
            background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px',
            height: '500px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            backgroundImage: 'linear-gradient(rgba(30,30,46,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30,30,46,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}>
            <Map size={56} style={{ color: '#8b5cf6', marginBottom: '16px' }} />
            <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '20px', margin: '0 0 8px' }}>Map View</h3>
            <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>
              Interactive map showing {filtered.length} events across the US
            </p>
            {/* Map pins placeholder */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {filtered.slice(0, 6).map(m => (
                <div key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: '#1a1a2e', border: '1px solid #1e1e2e',
                  borderRadius: '20px', padding: '6px 14px',
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: categoryColors[m.category] || '#8b5cf6' }} />
                  <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500 }}>{m.city}, {m.state}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Featured Events */}
            {featured.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>⭐</span> Featured Events
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                  {featured.map(meetup => <MeetupCard key={meetup.id} meetup={meetup} featured />)}
                </div>
              </div>
            )}

            {/* All Events */}
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '20px', marginBottom: '20px' }}>
                Upcoming Events ({upcoming.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                {upcoming.map(meetup => <MeetupCard key={meetup.id} meetup={meetup} />)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Host Modal */}
      {showHost && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#12121e', border: '1px solid #1e1e2e',
            borderRadius: '20px', width: '100%', maxWidth: '540px',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '20px', margin: 0 }}>Host a Meetup</h2>
              <button onClick={() => setShowHost(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '20px' }}>×</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Event Title', placeholder: 'Atlanta REI Monthly Meetup', type: 'text' },
                { label: 'Location', placeholder: 'Venue Name, Address', type: 'text' },
                { label: 'City, State', placeholder: 'Atlanta, GA', type: 'text' },
                { label: 'Date', placeholder: '', type: 'date' },
                { label: 'Time', placeholder: '', type: 'time' },
                { label: 'Max Attendees', placeholder: '100', type: 'number' },
                { label: 'Ticket Price (0 for free)', placeholder: '0', type: 'number' },
              ].map(({ label, placeholder, type }) => (
                <div key={label}>
                  <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="input-dark"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Category</label>
                <select className="input-dark" style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
                  {meetupCategories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Description</label>
                <textarea
                  placeholder="Tell investors what this event is about, what to bring, what to expect..."
                  className="input-dark"
                  rows={4}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
              <button
                onClick={() => setShowHost(false)}
                className="gradient-btn"
                style={{ padding: '14px', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '15px' }}
              >
                Create Meetup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MeetupCard({ meetup, featured }) {
  const [registered, setRegistered] = useState(false);
  const color = categoryColors[meetup.category] || '#8b5cf6';
  const pct = Math.round((meetup.attendees / meetup.maxAttendees) * 100);

  return (
    <div
      className="card-hover"
      style={{
        background: '#12121e',
        border: featured ? `1px solid ${color}40` : '1px solid #1e1e2e',
        borderRadius: '16px', overflow: 'hidden',
        boxShadow: featured ? `0 0 20px ${color}15` : 'none',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '180px' }}>
        <img
          src={meetup.image}
          alt={meetup.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.9) 0%, transparent 60%)' }} />

        {/* Category badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span style={{
            background: `${color}E0`, color: '#fff',
            borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700,
          }}>
            {meetup.category}
          </span>
        </div>

        {/* Virtual badge */}
        {meetup.isVirtual && (
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <span style={{ background: 'rgba(139, 92, 246, 0.9)', color: '#fff', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>
              🖥 Virtual
            </span>
          </div>
        )}

        {/* Price */}
        <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
          <span style={{
            background: meetup.price === 0 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(0,0,0,0.8)',
            color: '#fff', borderRadius: '20px', padding: '4px 12px', fontSize: '13px', fontWeight: 800,
          }}>
            {meetup.price === 0 ? 'FREE' : `$${meetup.price}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px' }}>
        <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', marginBottom: '10px', lineHeight: 1.3 }} className="line-clamp-2">
          {meetup.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>{formatDate(meetup.date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>{meetup.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <span style={{ color: '#94a3b8', fontSize: '13px' }} className="line-clamp-1">
              {meetup.isVirtual ? 'Online Event (Zoom)' : meetup.location}
            </span>
          </div>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, marginBottom: '14px' }} className="line-clamp-2">
          {meetup.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {meetup.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e',
              borderRadius: '20px', padding: '2px 10px',
              color: '#94a3b8', fontSize: '11px', fontWeight: 500,
            }}>
              #{tag.replace(/\s/g, '')}
            </span>
          ))}
        </div>

        {/* Attendees */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={13} style={{ color: '#94a3b8' }} />
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                <strong style={{ color: '#f8fafc' }}>{meetup.attendees.toLocaleString()}</strong> / {meetup.maxAttendees.toLocaleString()} attending
              </span>
            </div>
            <span style={{ color: pct >= 80 ? '#ef4444' : '#94a3b8', fontSize: '12px', fontWeight: 600 }}>
              {pct}% full
            </span>
          </div>
          <div style={{ height: '4px', background: '#1e1e2e', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '2px',
              width: `${Math.min(pct, 100)}%`,
              background: pct >= 80 ? '#ef4444' : `linear-gradient(to right, #8b5cf6, #06b6d4)`,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Host */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', paddingTop: '12px', borderTop: '1px solid #1e1e2e' }}>
          <img src={meetup.hostAvatar} alt={meetup.hostName} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: '#475569', fontSize: '12px' }}>Hosted by <strong style={{ color: '#94a3b8' }}>{meetup.hostName}</strong></span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setRegistered(!registered)}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px',
              background: registered ? 'rgba(16, 185, 129, 0.15)' : 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              border: registered ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
              color: registered ? '#10b981' : '#fff',
              cursor: 'pointer', fontWeight: 700, fontSize: '13px',
              transition: 'all 0.2s',
            }}
          >
            {registered ? '✓ Registered' : meetup.price === 0 ? 'Register Free' : `Register — $${meetup.price}`}
          </button>
          <button style={{
            padding: '10px 12px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
            color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center',
            transition: 'all 0.2s',
          }}>
            <ExternalLink size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
