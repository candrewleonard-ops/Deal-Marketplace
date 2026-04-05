import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Calendar, TrendingUp, Shield, Star } from 'lucide-react';
import { getCityById } from '../data/cities';
import { users } from '../data/users';
import { useAuth } from '../context/AuthContext';

export default function CityDiscussion() {
  const { cityId } = useParams();
  const { currentUser } = useAuth();
  const city = getCityById(cityId);
  const [tab, setTab] = useState('feed');

  if (!city) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#f8fafc' }}>City not found</h2>
          <Link to="/social" style={{ color: '#8b5cf6' }}>← Back to Social</Link>
        </div>
      </div>
    );
  }

  const leaders = city.communityLeaders.map(id => users.find(u => u.id === id)).filter(Boolean);
  const isLeader = city.communityLeaders.includes(currentUser.id);

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d0d1a, #1a1a2e)', borderBottom: '1px solid #1e1e2e', padding: '32px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <MapPin size={28} style={{ color: '#8b5cf6' }} />
            <h1 style={{ color: '#f8fafc', fontWeight: 900, fontSize: '32px', margin: 0 }}>{city.name}, {city.state}</h1>
          </div>
          <div style={{ display: 'flex', gap: '20px', color: '#94a3b8', fontSize: '14px' }}>
            <span><Users size={14} style={{ display: 'inline', marginRight: '4px' }} />{city.memberCount.toLocaleString()} members</span>
            <span>Metro population: {(city.population / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' }}>
        {/* Community Leaders */}
        {leaders.length > 0 && (
          <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>COMMUNITY LEADERS</div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {leaders.map(l => (
                <Link key={l.id} to={`/profile/${l.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', background: '#1a1a2e', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <img src={l.avatar} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                  <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{l.name}</span>
                  <Star size={14} style={{ color: '#f59e0b' }} fill="#f59e0b" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Stats Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Avg Days on Market', value: `${city.stats.avgDaysOnMarket}d`, color: '#8b5cf6' },
            { label: 'Median List Price', value: `$${(city.stats.medianListPrice / 1000).toFixed(0)}k`, color: '#10b981' },
            { label: 'Avg Year Built', value: city.stats.avgYearBuilt, color: '#06b6d4' },
            { label: 'Over Asking', value: `${city.stats.percentOverAsking}%`, color: '#ef4444' },
            { label: 'At Asking', value: `${city.stats.percentAtAsking}%`, color: '#94a3b8' },
            { label: 'Under Asking', value: `${city.stats.percentUnderAsking}%`, color: '#10b981' },
          ].map(s => (
            <div key={s.label} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '10px', padding: '14px' }}>
              <div style={{ color: '#475569', fontSize: '11px', fontWeight: 600 }}>{s.label}</div>
              <div style={{ color: s.color, fontWeight: 800, fontSize: '22px', marginTop: '4px' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid #1e1e2e' }}>
          {['feed', 'meetups', 'members', 'rules'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', color: tab === t ? '#8b5cf6' : '#94a3b8', fontWeight: 600, fontSize: '14px', textTransform: 'capitalize', borderBottom: `2px solid ${tab === t ? '#8b5cf6' : 'transparent'}`, marginBottom: '-1px' }}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'feed' && (
          <div>
            {isLeader && (
              <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={18} style={{ color: '#f59e0b' }} />
                <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '13px' }}>Leader Mode: Moderation tools enabled</span>
              </div>
            )}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '20px' }}>
              <textarea placeholder={`Share an update about ${city.name}...`} className="input-dark" rows={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '14px', marginBottom: '10px', resize: 'vertical' }} />
              <button className="gradient-btn" style={{ padding: '8px 18px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>Post</button>
            </div>
            <div style={{ marginTop: '16px', color: '#475569', textAlign: 'center', padding: '40px' }}>
              Feed posts appear here. Be the first to post in {city.name}!
            </div>
          </div>
        )}

        {tab === 'meetups' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '18px' }}>
              <div style={{ color: '#475569', fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>LAST MEETUP</div>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{city.lastMeetup.location}</div>
              <div style={{ color: '#94a3b8', fontSize: '13px' }}><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />{city.lastMeetup.date} · {city.lastMeetup.attendees} attended</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', padding: '18px' }}>
              <div style={{ color: '#8b5cf6', fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>NEXT MEETUP</div>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{city.nextMeetup.location}</div>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px' }}><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />{city.nextMeetup.date} · {city.nextMeetup.rsvps} RSVPs</div>
              <button className="gradient-btn" style={{ padding: '8px 16px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', width: '100%' }}>RSVP</button>
            </div>
          </div>
        )}

        {tab === 'members' && (
          <div style={{ color: '#475569', textAlign: 'center', padding: '40px' }}>
            {city.memberCount.toLocaleString()} members in this community.
          </div>
        )}

        {tab === 'rules' && (
          <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', marginBottom: '14px' }}>Community Rules</h3>
            <ol style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.8, paddingLeft: '20px' }}>
              <li>Be respectful of other members</li>
              <li>No spam or self-promotion without context</li>
              <li>Share accurate deal information only</li>
              <li>Keep discussions focused on {city.name} market</li>
              <li>No direct solicitations in public threads</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
