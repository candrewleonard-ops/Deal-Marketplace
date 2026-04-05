import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Users, Lock, Globe, Bell, BellOff, Plus,
  Calendar, MessageSquare, Settings, Pin, Image, Video,
  Heart, Share2, MoreHorizontal, Crown
} from 'lucide-react';
import { groups } from '../data/groups';
import { users } from '../data/users';

const mockPosts = [
  {
    id: 1, userId: 1, userName: 'Marcus Johnson', userAvatar: 'https://picsum.photos/seed/user1/100/100',
    userTags: ['Wholesaler'], timestamp: '2 hours ago', isPinned: true,
    content: '📌 WELCOME to the group! Make sure to read the rules in the About tab. Drop your market and specialty below so we can connect!',
    likes: 34, comments: 8, type: 'text',
  },
  {
    id: 2, userId: 3, userName: 'Trevor Banks', userAvatar: 'https://picsum.photos/seed/user3/100/100',
    userTags: ['Fix N Flipper'], timestamp: '5 hours ago', isPinned: false,
    content: 'Just closed a deal I found through this group last month — $41k profit on a 90-day flip in Plano. Big shoutout to the buyer that moved fast. This community is 🔥',
    image: 'https://picsum.photos/seed/grouppost1/800/500',
    likes: 88, comments: 21, type: 'image',
  },
  {
    id: 3, userId: 4, userName: 'Sarah Mitchell', userAvatar: 'https://picsum.photos/seed/user4/100/100',
    userTags: ['Marketer', 'Wholesaler'], timestamp: '1 day ago', isPinned: false,
    content: 'Market update for DFW: DOM is tightening up again — averaging 18 days for sub-$250k off-market deals. Buyers are hungry. If you have contracts, get them out NOW.',
    likes: 62, comments: 14, type: 'text',
  },
  {
    id: 4, userId: 7, userName: 'Robert Hill', userAvatar: 'https://picsum.photos/seed/user7/100/100',
    userTags: ['Fix N Flipper', 'Contractor'], timestamp: '2 days ago', isPinned: false,
    content: 'Anyone have boots on the ground in Fort Worth? Looking for a GC for a 3/2 that needs full rehab. Budget ~$65k. DM me.',
    likes: 19, comments: 30, type: 'text',
  },
];

const mockEvents = [
  {
    id: 1, title: 'Monthly Deal Review Meetup', date: 'April 15, 2026', time: '6:00 PM CST',
    location: 'Dallas, TX (+ Zoom)', attendees: 47, description: 'Share your current pipeline, get feedback on numbers, and network with local investors.',
  },
  {
    id: 2, title: 'Buyer/Seller Speed Networking', date: 'April 28, 2026', time: '7:00 PM CST',
    location: 'Online (Zoom)', attendees: 103, description: '5-minute roundtables with active buyers and sellers in the DFW market. Bring your deals and your buyer list.',
  },
];

const TABS = ['Feed', 'Events', 'Members', 'About'];

export default function GroupDetail() {
  const { groupId } = useParams();
  const group = groups.find(g => g.id === groupId);
  const [activeTab, setActiveTab] = useState('Feed');
  const [muted, setMuted] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [likedPosts, setLikedPosts] = useState({});

  if (!group) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#f8fafc', fontWeight: 700 }}>Group not found</h2>
          <Link to="/groups" style={{ color: '#8b5cf6', textDecoration: 'none' }}>← Back to Groups</Link>
        </div>
      </div>
    );
  }

  const members = users.filter(u => group.memberIds.includes(u.id));
  const isOwner = group.ownerId === 'me';

  function toggleLike(postId) {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {/* Banner */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src={group.bannerImage}
          alt={group.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.background = 'linear-gradient(135deg,#1a1a2e,#12121e)'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(10,10,15,0.95) 100%)' }} />

        {/* Back link */}
        <Link
          to="/groups"
          style={{
            position: 'absolute', top: '16px', left: '20px',
            display: 'flex', alignItems: 'center', gap: '6px',
            color: '#f8fafc', textDecoration: 'none', fontSize: '14px', fontWeight: 600,
            background: 'rgba(0,0,0,0.5)', borderRadius: '20px', padding: '6px 14px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <ArrowLeft size={15} />
          Groups
        </Link>

        {/* Group info overlay */}
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            {group.isPrivate
              ? <Lock size={14} style={{ color: '#f59e0b' }} />
              : <Globe size={14} style={{ color: '#10b981' }} />
            }
            <span style={{ color: group.isPrivate ? '#f59e0b' : '#10b981', fontSize: '12px', fontWeight: 700 }}>
              {group.isPrivate ? 'Private Group' : 'Public Group'}
            </span>
            <span style={{ color: '#475569', fontSize: '12px' }}>•</span>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>{group.category}</span>
          </div>
          <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '26px', margin: '0 0 6px' }}>{group.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', fontSize: '13px' }}>
              <Users size={13} />
              {group.memberCount.toLocaleString()} members
            </div>
            <div style={{ color: '#475569', fontSize: '13px' }}>
              Created {new Date(group.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div style={{ background: '#0d0d1a', borderBottom: '1px solid #1e1e2e', padding: '12px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none',
                  background: activeTab === tab ? 'rgba(139,92,246,0.15)' : 'transparent',
                  color: activeTab === tab ? '#8b5cf6' : '#94a3b8',
                  fontWeight: activeTab === tab ? 700 : 500,
                  fontSize: '14px', cursor: 'pointer',
                  borderBottom: activeTab === tab ? '2px solid #8b5cf6' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setMuted(!muted)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e',
                borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              }}
            >
              {muted ? <BellOff size={14} /> : <Bell size={14} />}
              {muted ? 'Unmute' : 'Mute'}
            </button>
            {isOwner && (
              <button style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e',
                borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              }}>
                <Settings size={14} />
                Manage
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>

          {/* Left: Feed / Events / Members / About */}
          <div>
            {activeTab === 'Feed' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Post composer */}
                <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '18px' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                    <img src="https://picsum.photos/seed/trialuser/100/100" alt="You" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <textarea
                      value={postContent}
                      onChange={e => setPostContent(e.target.value)}
                      placeholder={`Post something to ${group.name}…`}
                      className="input-dark"
                      rows={3}
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', fontSize: '14px', resize: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[{ icon: Image, color: '#10b981', label: 'Photo' }, { icon: Video, color: '#ef4444', label: 'Video' }].map(({ icon: Icon, color, label }) => (
                        <button key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}>
                          <Icon size={13} style={{ color }} />
                          {label}
                        </button>
                      ))}
                    </div>
                    <button
                      className="gradient-btn"
                      style={{ padding: '8px 18px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', opacity: postContent ? 1 : 0.5 }}
                    >
                      Post
                    </button>
                  </div>
                </div>

                {/* Posts */}
                {mockPosts.map(post => (
                  <div key={post.id} style={{ background: '#12121e', border: `1px solid ${post.isPinned ? 'rgba(245,158,11,0.3)' : '#1e1e2e'}`, borderRadius: '16px', overflow: 'hidden' }}>
                    {post.isPinned && (
                      <div style={{ background: 'rgba(245,158,11,0.08)', borderBottom: '1px solid rgba(245,158,11,0.2)', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Pin size={12} style={{ color: '#f59e0b' }} />
                        <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 700 }}>PINNED</span>
                      </div>
                    )}
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={post.userAvatar} alt={post.userName} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>{post.userName}</div>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                              {post.userTags.map(t => (
                                <span key={t} style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', borderRadius: '20px', padding: '1px 6px', fontSize: '10px', fontWeight: 600 }}>{t}</span>
                              ))}
                              <span style={{ color: '#475569', fontSize: '11px' }}>• {post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <button style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><MoreHorizontal size={16} /></button>
                      </div>
                      <p style={{ color: '#f8fafc', fontSize: '14px', lineHeight: 1.7, margin: '0 0 12px' }}>{post.content}</p>
                      {post.image && (
                        <img src={post.image} alt="" style={{ width: '100%', borderRadius: '10px', marginBottom: '12px', maxHeight: '320px', objectFit: 'cover' }} />
                      )}
                      <div style={{ display: 'flex', gap: '16px', paddingTop: '12px', borderTop: '1px solid #1e1e2e' }}>
                        {[
                          { icon: Heart, label: `${(likedPosts[post.id] ? post.likes + 1 : post.likes)}`, action: () => toggleLike(post.id), active: likedPosts[post.id], activeColor: '#ef4444' },
                          { icon: MessageSquare, label: `${post.comments}`, action: () => {}, active: false, activeColor: '#8b5cf6' },
                          { icon: Share2, label: 'Share', action: () => {}, active: false, activeColor: '#06b6d4' },
                        ].map(({ icon: Icon, label, action, active, activeColor }) => (
                          <button key={label} onClick={action} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: active ? activeColor : '#475569', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'color 0.15s' }}>
                            <Icon size={15} fill={active && Icon === Heart ? activeColor : 'none'} />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Events' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', margin: 0 }}>Upcoming Events</h3>
                  <button className="gradient-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                    <Plus size={14} />
                    Host Event
                  </button>
                </div>
                {mockEvents.map(ev => (
                  <div key={ev.id} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', margin: '0 0 8px' }}>{ev.title}</h4>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b5cf6', fontSize: '13px', fontWeight: 600 }}>
                            <Calendar size={13} />
                            {ev.date} at {ev.time}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
                            <Users size={13} />
                            {ev.attendees} attending
                          </div>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 6px', lineHeight: 1.6 }}>{ev.description}</p>
                        <div style={{ color: '#475569', fontSize: '12px' }}>📍 {ev.location}</div>
                      </div>
                      <button className="gradient-btn" style={{ padding: '10px 20px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                        RSVP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Members' && (
              <div>
                <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', margin: '0 0 16px' }}>
                  Members ({group.memberCount.toLocaleString()})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                  {members.map(member => (
                    <Link
                      key={member.id}
                      to={`/profile/${member.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'border-color 0.15s', cursor: 'pointer' }}>
                        <img src={member.avatar} alt={member.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                            {member.id === group.ownerId && <Crown size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />}
                          </div>
                          <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '2px' }}>
                            {member.tags.slice(0, 2).map(t => (
                              <span key={t} style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', borderRadius: '20px', padding: '1px 6px', fontSize: '10px', fontWeight: 600 }}>{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'About' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '20px' }}>
                  <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', margin: '0 0 10px' }}>About This Group</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{group.description}</p>
                </div>
                <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '20px' }}>
                  <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', margin: '0 0 14px' }}>Group Rules</h4>
                  {[
                    'No spam, unsolicited DMs, or self-promotion without value.',
                    'Verify deal numbers before posting — misleading listings will be removed.',
                    'Be respectful. No personal attacks or discrimination.',
                    'No off-topic content. Keep discussions real estate focused.',
                    'Share your wins AND your losses — the community learns from both.',
                  ].map((rule, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Group stats */}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '18px' }}>
              <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px', margin: '0 0 14px' }}>Group Info</h4>
              {[
                { label: 'Members', value: group.memberCount.toLocaleString() },
                { label: 'Type', value: group.isPrivate ? '🔒 Private' : '🌐 Public' },
                { label: 'Category', value: group.category },
                { label: 'Created', value: new Date(group.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
                { label: 'Events this month', value: '2' },
                { label: 'Posts this week', value: '18' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1e1e2e' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>{label}</span>
                  <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '13px' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Members preview */}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '18px' }}>
              <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px', margin: '0 0 14px' }}>Members</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {members.slice(0, 9).map(m => (
                  <img key={m.id} src={m.avatar} alt={m.name} title={m.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0a0a0f' }} />
                ))}
              </div>
              <button
                onClick={() => setActiveTab('Members')}
                style={{ color: '#8b5cf6', background: 'none', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                View all {group.memberCount.toLocaleString()} members →
              </button>
            </div>

            {/* Upcoming event preview */}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '18px' }}>
              <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px', margin: '0 0 14px' }}>Next Event</h4>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{mockEvents[0].title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b5cf6', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                <Calendar size={12} />
                {mockEvents[0].date}
              </div>
              <div style={{ color: '#475569', fontSize: '12px', marginBottom: '12px' }}>{mockEvents[0].attendees} attending</div>
              <button
                onClick={() => setActiveTab('Events')}
                style={{ color: '#8b5cf6', background: 'none', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                See all events →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
