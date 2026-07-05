import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Calendar, TrendingUp, Shield, Star, Bell, Check, UserPlus, MessageSquare } from 'lucide-react';
import { getCityById } from '../data/cities';
import { users } from '../data/users';
import { useAuth } from '../context/AuthContext';

export default function CityDiscussion() {
  const { cityId } = useParams();
  const { currentUser } = useAuth();
  const city = getCityById(cityId);
  const [tab, setTab] = useState('feed');
  const [joined, setJoined] = useState(false);
  const [rsvped, setRsvped] = useState(false);
  const [postText, setPostText] = useState('');
  const [cityPosts, setCityPosts] = useState([
    {
      id: 1,
      userName: 'Marcus Johnson',
      userAvatar: 'https://picsum.photos/seed/user1/100/100',
      content: 'Just closed a deal off-market here last week. ARV was $340k, picked it up for $185k. The market is moving fast — DOM under 20 days for anything under $300k.',
      timestamp: '2h ago',
      likes: 18,
    },
    {
      id: 2,
      userName: 'Diana Cruz',
      userAvatar: 'https://picsum.photos/seed/user2/100/100',
      content: 'Anyone else noticing seller motivation increasing in the suburbs? Getting more inbound calls than last quarter. Great time to be buying.',
      timestamp: '5h ago',
      likes: 12,
    },
  ]);
  const [followedMembers, setFollowedMembers] = useState({});
  const [alertEmail, setAlertEmail] = useState('');
  const [alertSet, setAlertSet] = useState(false);

  if (!city) {
    return (
      <div style={{ background: '#0a0b0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#f8fafc' }}>City not found</h2>
          <Link to="/social" style={{ color: '#00c805' }}>← Back to Social</Link>
        </div>
      </div>
    );
  }

  const leaders = city.communityLeaders.map(id => users.find(u => u.id === id)).filter(Boolean);
  const isLeader = city.communityLeaders.includes(currentUser.id);
  const communityMembers = users.slice(0, 8);

  function handlePost() {
    if (!postText.trim()) return;
    const newPost = {
      id: Date.now(),
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: postText,
      timestamp: 'Just now',
      likes: 0,
    };
    setCityPosts([newPost, ...cityPosts]);
    setPostText('');
  }

  function handleSetAlert(e) {
    e.preventDefault();
    if (alertEmail.trim()) {
      setAlertSet(true);
    }
  }

  return (
    <div style={{ background: '#0a0b0a', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 200, 5,0.15), rgba(0, 229, 160,0.08)), #0e100e',
        borderBottom: '1px solid #232925',
        padding: '36px 20px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <MapPin size={28} style={{ color: '#00c805' }} />
                <h1 style={{
                  background: 'linear-gradient(135deg, #00c805, #00e5a0)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', fontWeight: 900, fontSize: 'clamp(24px, 4vw, 36px)',
                  margin: 0,
                }}>
                  {city.name}, {city.state}
                </h1>
              </div>
              <div style={{ display: 'flex', gap: '20px', color: '#95a29b', fontSize: '14px', flexWrap: 'wrap' }}>
                <span><Users size={14} style={{ display: 'inline', marginRight: '4px' }} />{city.memberCount.toLocaleString()} members</span>
                <span>Metro pop: {(city.population / 1000000).toFixed(1)}M</span>
                <span style={{ color: '#10b981' }}>● Active market</span>
              </div>
            </div>
            <button
              onClick={() => setJoined(!joined)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '11px 22px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                background: joined ? 'rgba(16,185,129,0.1)' : 'linear-gradient(135deg, #00c805, #00e5a0)',
                border: joined ? '1px solid rgba(16,185,129,0.3)' : 'none',
                color: joined ? '#10b981' : '#fff',
                transition: 'all 0.2s',
              }}
            >
              {joined ? <Check size={16} /> : <UserPlus size={16} />}
              {joined ? 'Joined Community' : 'Join Community'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' }}>
        {/* Community Leaders */}
        {leaders.length > 0 && (
          <div style={{ background: '#131614', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginBottom: '10px', textTransform: 'uppercase' }}>COMMUNITY LEADERS</div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {leaders.map(l => (
                <Link key={l.id} to={`/profile/${l.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', background: '#1a1f1b', padding: '8px 14px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <img src={l.avatar} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                  <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{l.name}</span>
                  <Star size={13} style={{ color: '#f59e0b' }} fill="#f59e0b" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Stats Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Avg Days on Market', value: `${city.stats.avgDaysOnMarket}d`, color: '#00c805' },
            { label: 'Median List Price', value: `$${(city.stats.medianListPrice / 1000).toFixed(0)}k`, color: '#10b981' },
            { label: 'Avg Year Built', value: city.stats.avgYearBuilt, color: '#00e5a0' },
            { label: 'Over Asking', value: `${city.stats.percentOverAsking}%`, color: '#ef4444' },
            { label: 'At Asking', value: `${city.stats.percentAtAsking}%`, color: '#95a29b' },
            { label: 'Under Asking', value: `${city.stats.percentUnderAsking}%`, color: '#10b981' },
          ].map(s => (
            <div key={s.label} style={{ background: '#131614', border: '1px solid #232925', borderRadius: '10px', padding: '14px', transition: 'border-color 0.2s' }}>
              <div style={{ color: '#5a675f', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
              <div style={{ color: s.color, fontWeight: 800, fontSize: '24px', marginTop: '6px' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid #232925' }}>
          {['feed', 'meetups', 'members', 'rules'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                color: tab === t ? '#00c805' : '#95a29b',
                fontWeight: 600, fontSize: '14px', textTransform: 'capitalize',
                borderBottom: `2px solid ${tab === t ? '#00c805' : 'transparent'}`,
                marginBottom: '-1px',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'feed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isLeader && (
              <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={18} style={{ color: '#f59e0b' }} />
                <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '13px' }}>Leader Mode: Moderation tools enabled</span>
              </div>
            )}

            {/* Post composer */}
            <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <img src={currentUser.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <textarea
                  value={postText}
                  onChange={e => setPostText(e.target.value)}
                  placeholder={`Share an update about the ${city.name} market...`}
                  className="input-dark"
                  rows={3}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', fontSize: '14px', marginBottom: '0', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handlePost}
                  className="gradient-btn"
                  style={{ padding: '8px 20px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', opacity: postText.trim() ? 1 : 0.5 }}
                >
                  Post to {city.name}
                </button>
              </div>
            </div>

            {/* Posts */}
            {cityPosts.map(post => (
              <div key={post.id} style={{ background: '#131614', border: '1px solid #232925', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <img src={post.userAvatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>{post.userName}</div>
                    <div style={{ color: '#5a675f', fontSize: '12px' }}>{post.timestamp}</div>
                  </div>
                </div>
                <p style={{ color: '#e4eae6', fontSize: '14px', lineHeight: 1.7, margin: '0 0 14px' }}>{post.content}</p>
                <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #232925', paddingTop: '12px' }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#5a675f', cursor: 'pointer', fontSize: '13px' }}>
                    ❤️ {post.likes}
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#5a675f', cursor: 'pointer', fontSize: '13px' }}>
                    <MessageSquare size={14} /> Comment
                  </button>
                </div>
              </div>
            ))}

            {/* Deal Alert CTA */}
            <div style={{ background: 'linear-gradient(135deg, rgba(0, 200, 5,0.1), rgba(0, 229, 160,0.07))', border: '1px solid rgba(0, 200, 5,0.25)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
              <Bell size={28} style={{ color: '#00c805', marginBottom: '12px' }} />
              <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>
                Want deal alerts for {city.name}?
              </h3>
              <p style={{ color: '#95a29b', fontSize: '14px', marginBottom: '16px' }}>
                Get notified the moment new off-market deals hit the {city.name} market. Be first in line.
              </p>
              {alertSet ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '15px' }}>
                  <Check size={18} />
                  Deal alerts set for {city.name}!
                </div>
              ) : (
                <form onSubmit={handleSetAlert} style={{ display: 'flex', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
                  <input
                    type="email"
                    value={alertEmail}
                    onChange={e => setAlertEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-dark"
                    style={{ flex: 1, padding: '11px 14px', borderRadius: '10px', fontSize: '14px' }}
                  />
                  <button type="submit" className="gradient-btn" style={{ padding: '11px 20px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                    Get Alerts
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {tab === 'meetups' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', padding: '18px' }}>
                <div style={{ color: '#5a675f', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>LAST MEETUP</div>
                <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{city.lastMeetup.location}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#95a29b', fontSize: '13px', marginBottom: '8px' }}>
                  <Calendar size={13} />
                  {city.lastMeetup.date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#95a29b', fontSize: '13px' }}>
                  <Users size={13} />
                  {city.lastMeetup.attendees} attended
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, rgba(0, 200, 5, 0.1), rgba(0, 229, 160, 0.08))', border: '1px solid rgba(0, 200, 5, 0.3)', borderRadius: '12px', padding: '18px' }}>
                <div style={{ color: '#00c805', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>NEXT MEETUP</div>
                <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{city.nextMeetup.location}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#95a29b', fontSize: '13px', marginBottom: '6px' }}>
                  <Calendar size={13} />
                  {city.nextMeetup.date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#95a29b', fontSize: '13px', marginBottom: '16px' }}>
                  <Users size={13} />
                  {city.nextMeetup.rsvps} RSVPs so far
                </div>
                <button
                  onClick={() => setRsvped(!rsvped)}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    background: rsvped ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, #00c805, #00e5a0)',
                    border: rsvped ? '1px solid rgba(16,185,129,0.3)' : 'none',
                    color: rsvped ? '#10b981' : '#fff',
                    transition: 'all 0.2s',
                  }}
                >
                  {rsvped ? '✓ Going' : 'RSVP Free'}
                </button>
              </div>
            </div>

            <Link
              to="/meetups"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid #232925', borderRadius: '12px', color: '#00c805', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}
            >
              View All Meetups in {city.name} →
            </Link>
          </div>
        )}

        {tab === 'members' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: '#95a29b', fontSize: '14px', marginBottom: '4px' }}>
              <strong style={{ color: '#f8fafc' }}>{city.memberCount.toLocaleString()}</strong> members in this community
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {communityMembers.map(member => {
                const isFollowed = followedMembers[member.id];
                return (
                  <div key={member.id} style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <img src={member.avatar} alt="" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {member.name}
                          {city.communityLeaders.includes(member.id) && <Star size={11} fill="#f59e0b" style={{ color: '#f59e0b', marginLeft: '4px', display: 'inline' }} />}
                        </div>
                        <div style={{ color: '#5a675f', fontSize: '11px' }}>@{member.username}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {member.tags.slice(0, 2).map(tag => (
                        <span key={tag} style={{ background: 'rgba(0, 200, 5,0.1)', color: '#00c805', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: 600 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setFollowedMembers(prev => ({ ...prev, [member.id]: !isFollowed }))}
                      style={{
                        width: '100%', padding: '7px', borderRadius: '8px', fontWeight: 600, fontSize: '12px', cursor: 'pointer',
                        background: isFollowed ? 'rgba(16,185,129,0.1)' : 'rgba(0, 200, 5,0.1)',
                        border: isFollowed ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(0, 200, 5,0.2)',
                        color: isFollowed ? '#10b981' : '#00c805',
                      }}
                    >
                      {isFollowed ? '✓ Following' : '+ Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'rules' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} style={{ color: '#00c805' }} />
                {city.name} Community Rules
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { title: 'Be Respectful', desc: `Treat all members with respect. Personal attacks, harassment, or discrimination will not be tolerated in the ${city.name} community.` },
                  { title: 'No Spam or Unsolicited Promotion', desc: 'Share value before promoting your services. Context matters — a relevant deal beats a cold pitch every time.' },
                  { title: 'Accurate Information Only', desc: 'Share accurate deal information and market data. Misleading numbers waste everyone\'s time and damage trust.' },
                  { title: 'Stay On-Topic', desc: `Keep discussions focused on the ${city.name} real estate market, local deals, and relevant investment strategies.` },
                  { title: 'No Direct Solicitations', desc: 'No mass outreach or solicitations in public threads. Use DMs for private business conversations.' },
                ].map((rule, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px', background: '#1a1f1b', borderRadius: '10px', border: '1px solid #232925' }}>
                    <div style={{ background: 'linear-gradient(135deg, #00c805, #00e5a0)', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{rule.title}</div>
                      <div style={{ color: '#95a29b', fontSize: '13px', lineHeight: 1.6 }}>{rule.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
