import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, ExternalLink, Map, Grid, X, Check, Share2, Copy } from 'lucide-react';
import { meetups, meetupCategories } from '../data/meetups';
import { Link } from 'react-router-dom';

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
  const [userMeetups, setUserMeetups] = useState(meetups);
  const [toast, setToast] = useState(null);
  const [hostForm, setHostForm] = useState({
    title: '', location: '', cityState: '', date: '', time: '',
    maxAttendees: '', ticketPrice: '0', category: 'REI Meetup', description: '', isVirtual: false,
  });

  function showToastMsg(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = userMeetups.filter(m => activeCategory === 'All' || m.category === activeCategory);
  const featured = filtered.filter(m => m.isFeatured);
  const upcoming = filtered.filter(m => !m.isFeatured);

  function handleHostSubmit(e) {
    e.preventDefault();
    if (!hostForm.title.trim() || !hostForm.cityState.trim()) return;
    const [city, state] = hostForm.cityState.split(',').map(s => s.trim());
    const newMeetup = {
      id: Date.now(),
      title: hostForm.title,
      location: hostForm.location,
      city: city || 'TBD',
      state: state || '',
      date: hostForm.date || new Date().toISOString().split('T')[0],
      time: hostForm.time || '6:00 PM',
      maxAttendees: parseInt(hostForm.maxAttendees) || 100,
      attendees: 0,
      price: parseFloat(hostForm.ticketPrice) || 0,
      category: hostForm.category,
      description: hostForm.description,
      isFeatured: false,
      isVirtual: hostForm.isVirtual,
      image: `https://picsum.photos/seed/meetup${Date.now()}/800/400`,
      hostName: 'You',
      hostAvatar: 'https://picsum.photos/seed/user1/100/100',
      tags: [hostForm.category.split(' ')[0]],
    };
    setUserMeetups(prev => [newMeetup, ...prev]);
    setShowHost(false);
    setHostForm({ title: '', location: '', cityState: '', date: '', time: '', maxAttendees: '', ticketPrice: '0', category: 'REI Meetup', description: '', isVirtual: false });
    showToastMsg('Meetup created! Investors in your area will be notified.');
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.08)), #0d0d1a', borderBottom: '1px solid #1e1e2e', padding: '48px 20px 36px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div>
              <h1 style={{ color: '#f8fafc', fontWeight: 900, fontSize: 'clamp(24px, 4vw, 40px)', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
                REI Meetups & Events
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
                Connect with {userMeetups.reduce((sum, m) => sum + m.attendees, 0).toLocaleString()}+ investors at events near you
              </p>
            </div>
            <button
              onClick={() => setShowHost(true)}
              className="gradient-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}
            >
              <Plus size={18} />
              Host a Meetup
            </button>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '6px', flex: 1, flexWrap: 'wrap' }}>
              {meetupCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    background: activeCategory === cat
                      ? (cat === 'All' ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : `${categoryColors[cat] || '#8b5cf6'}20`)
                      : 'rgba(255,255,255,0.04)',
                    border: activeCategory === cat && cat !== 'All'
                      ? `1px solid ${categoryColors[cat] || '#8b5cf6'}50`
                      : activeCategory === cat ? '1px solid transparent' : '1px solid #1e1e2e',
                    color: activeCategory === cat
                      ? (cat === 'All' ? '#fff' : categoryColors[cat] || '#8b5cf6')
                      : '#94a3b8',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', borderRadius: '10px', overflow: 'hidden' }}>
              {[{ icon: Grid, val: 'grid' }, { icon: Map, val: 'map' }].map(({ icon: Icon, val }) => (
                <button key={val} onClick={() => setView(val)} style={{ padding: '8px 12px', background: view === val ? 'rgba(139, 92, 246, 0.2)' : 'transparent', border: 'none', cursor: 'pointer', color: view === val ? '#8b5cf6' : '#94a3b8', transition: 'all 0.2s' }}>
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Business CTA */}
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '14px', padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '16px', margin: '0 0 6px' }}>
              Host a meetup and become the go-to connector in your market
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
              Build your brand, grow your buyer list, and close more deals. The best networkers close the most deals.
            </p>
          </div>
          <button
            onClick={() => setShowHost(true)}
            className="gradient-btn"
            style={{ padding: '11px 22px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            Host Free Meetup →
          </button>
        </div>

        {view === 'map' ? (
          <div style={{
            background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px',
            minHeight: '500px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            backgroundImage: 'linear-gradient(rgba(30,30,46,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30,30,46,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}>
            <Map size={56} style={{ color: '#8b5cf6', marginBottom: '16px' }} />
            <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '20px', margin: '0 0 8px' }}>Map View</h3>
            <p style={{ color: '#475569', fontSize: '14px', margin: '0 0 24px' }}>
              Interactive map showing {filtered.length} events across the US
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {filtered.slice(0, 6).map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1a1a2e', border: '1px solid #1e1e2e', borderRadius: '20px', padding: '8px 14px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = categoryColors[m.category] || '#8b5cf6'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e2e'}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: categoryColors[m.category] || '#8b5cf6' }} />
                  <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500 }}>{m.city}, {m.state}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>⭐</span> Featured Events
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                  {featured.map(meetup => <MeetupCard key={meetup.id} meetup={meetup} featured onToast={showToastMsg} />)}
                </div>
              </div>
            )}

            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '20px', marginBottom: '20px' }}>
                Upcoming Events ({upcoming.length})
              </h2>
              {upcoming.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px' }}>
                  <Calendar size={48} style={{ color: '#8b5cf6', marginBottom: '16px', opacity: 0.4 }} />
                  <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px' }}>No events in this category</h3>
                  <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>Be the first to host one in your market!</p>
                  <button onClick={() => setShowHost(true)} className="gradient-btn" style={{ padding: '10px 20px', borderRadius: '8px', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Host a Meetup</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                  {upcoming.map(meetup => <MeetupCard key={meetup.id} meetup={meetup} onToast={showToastMsg} />)}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Host Modal */}
      {showHost && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowHost(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#12121e', zIndex: 1 }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '20px', margin: 0 }}>Host a Meetup</h2>
              <button onClick={() => setShowHost(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleHostSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Event Title *', key: 'title', placeholder: 'Atlanta REI Monthly Meetup', type: 'text' },
                { label: 'Venue / Location', key: 'location', placeholder: 'The Local Kitchen, 123 Main St', type: 'text' },
                { label: 'City, State *', key: 'cityState', placeholder: 'Atlanta, GA', type: 'text' },
                { label: 'Date', key: 'date', placeholder: '', type: 'date' },
                { label: 'Time', key: 'time', placeholder: '', type: 'time' },
                { label: 'Max Attendees', key: 'maxAttendees', placeholder: '100', type: 'number' },
                { label: 'Ticket Price ($0 for free)', key: 'ticketPrice', placeholder: '0', type: 'number' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={hostForm[key]}
                    onChange={e => setHostForm({ ...hostForm, [key]: e.target.value })}
                    className="input-dark"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px' }}
                    required={label.includes('*')}
                  />
                </div>
              ))}
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category</label>
                <select value={hostForm.category} onChange={e => setHostForm({ ...hostForm, category: e.target.value })} className="input-dark" style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
                  {meetupCategories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <label style={{ display: 'flex', gap: '10px', cursor: 'pointer', padding: '10px', background: '#1a1a2e', borderRadius: '8px' }}>
                <input type="checkbox" checked={hostForm.isVirtual} onChange={e => setHostForm({ ...hostForm, isVirtual: e.target.checked })} style={{ accentColor: '#8b5cf6', width: '16px', height: '16px', marginTop: '2px' }} />
                <div>
                  <div style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 600 }}>🖥 Virtual Event (Zoom / Online)</div>
                  <div style={{ color: '#475569', fontSize: '12px' }}>Allow remote attendees from anywhere</div>
                </div>
              </label>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  value={hostForm.description}
                  onChange={e => setHostForm({ ...hostForm, description: e.target.value })}
                  placeholder="Tell investors what this event is about, what to bring, what to expect..."
                  className="input-dark"
                  rows={4}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowHost(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" className="gradient-btn" style={{ flex: 2, padding: '14px', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}>
                  Create Meetup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, background: '#12121e', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <Check size={16} style={{ color: '#10b981', flexShrink: 0 }} />
          <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 500 }}>{toast}</span>
        </div>
      )}
    </div>
  );
}

function MeetupCard({ meetup, featured, onToast }) {
  const [registered, setRegistered] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(meetup.attendees);
  const [copied, setCopied] = useState(false);
  const color = categoryColors[meetup.category] || '#8b5cf6';
  const pct = Math.round((attendeeCount / meetup.maxAttendees) * 100);

  function handleRegister() {
    if (!registered) {
      setAttendeeCount(c => c + 1);
      onToast && onToast(`You're going to "${meetup.title}"! See you there.`);
    } else {
      setAttendeeCount(c => Math.max(0, c - 1));
    }
    setRegistered(!registered);
  }

  function handleShare() {
    navigator.clipboard.writeText(`https://allstreetlive.com/meetups/${meetup.id}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast && onToast('Link copied to clipboard!');
  }

  return (
    <div
      className="card-hover"
      style={{
        background: '#12121e',
        border: featured ? `1px solid ${color}40` : '1px solid #1e1e2e',
        borderRadius: '16px', overflow: 'hidden',
        boxShadow: featured ? `0 0 20px ${color}15` : 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4)`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = featured ? `0 0 20px ${color}15` : ''; }}
    >
      <div style={{ position: 'relative', height: '180px' }}>
        <img src={meetup.image} alt={meetup.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.9) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span style={{ background: `${color}E0`, color: '#fff', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>{meetup.category}</span>
        </div>
        {meetup.isVirtual && (
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <span style={{ background: 'rgba(139, 92, 246, 0.9)', color: '#fff', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>🖥 Virtual</span>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
          <span style={{ background: meetup.price === 0 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(0,0,0,0.8)', color: '#fff', borderRadius: '20px', padding: '4px 12px', fontSize: '13px', fontWeight: 800 }}>
            {meetup.price === 0 ? 'FREE' : `$${meetup.price}`}
          </span>
        </div>
      </div>

      <div style={{ padding: '18px' }}>
        <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', marginBottom: '10px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {meetup.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Calendar size={13} style={{ color: '#8b5cf6', flexShrink: 0 }} />
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>{formatDate(meetup.date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Clock size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>{meetup.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <MapPin size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <span style={{ color: '#94a3b8', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {meetup.isVirtual ? 'Online Event (Zoom)' : meetup.location}
            </span>
          </div>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {meetup.description}
        </p>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {meetup.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e', borderRadius: '20px', padding: '2px 10px', color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>
              #{tag.replace(/\s/g, '')}
            </span>
          ))}
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Users size={13} style={{ color: '#94a3b8' }} />
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                <strong style={{ color: '#f8fafc' }}>{attendeeCount.toLocaleString()}</strong> / {meetup.maxAttendees.toLocaleString()}
              </span>
            </div>
            <span style={{ color: pct >= 80 ? '#ef4444' : '#94a3b8', fontSize: '12px', fontWeight: 600 }}>{pct}% full</span>
          </div>
          <div style={{ height: '4px', background: '#1e1e2e', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '2px', width: `${Math.min(pct, 100)}%`, background: pct >= 80 ? '#ef4444' : `linear-gradient(to right, #8b5cf6, #06b6d4)`, transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingTop: '10px', borderTop: '1px solid #1e1e2e' }}>
          <img src={meetup.hostAvatar} alt={meetup.hostName} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: '#475569', fontSize: '12px' }}>Hosted by <strong style={{ color: '#94a3b8' }}>{meetup.hostName}</strong></span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleRegister}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px',
              background: registered ? 'rgba(16, 185, 129, 0.15)' : 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              border: registered ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
              color: registered ? '#10b981' : '#fff',
              cursor: 'pointer', fontWeight: 700, fontSize: '13px', transition: 'all 0.2s',
            }}
          >
            {registered ? '✓ Going' : meetup.price === 0 ? 'RSVP Free' : `Register — $${meetup.price}`}
          </button>
          <button
            onClick={handleShare}
            style={{ padding: '10px 12px', borderRadius: '10px', background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : '#1e1e2e'}`, color: copied ? '#10b981' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
          >
            {copied ? <Check size={15} /> : <Share2 size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}
