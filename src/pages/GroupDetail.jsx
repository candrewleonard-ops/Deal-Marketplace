import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, Lock, Globe, Bell, BellOff, Plus,
  Calendar, MessageSquare, Settings, Pin, Image, Video,
  Heart, Share2, MoreHorizontal, Crown, X, Check, LogOut
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
  const navigate = useNavigate();
  const group = groups.find(g => g.id === groupId);
  const [activeTab, setActiveTab] = useState('Feed');
  const [muted, setMuted] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [feedPosts, setFeedPosts] = useState(mockPosts);
  const [likedPosts, setLikedPosts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [rsvpEvents, setRsvpEvents] = useState({});
  const [localEvents, setLocalEvents] = useState(mockEvents);
  const [showHostEvent, setShowHostEvent] = useState(false);
  const [showManageMenu, setShowManageMenu] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', date: '', time: '', location: '', description: '' });
  const [toast, setToast] = useState(null);
  const [commentText, setCommentText] = useState({});

  if (!group) {
    return (
      <div style={{ background: '#0a0b0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#f8fafc', fontWeight: 700 }}>Group not found</h2>
          <Link to="/groups" style={{ color: '#00c805', textDecoration: 'none' }}>← Back to Groups</Link>
        </div>
      </div>
    );
  }

  const members = users.filter(u => group.memberIds.includes(u.id));
  const isOwner = group.ownerId === 'me';

  function showToastMsg(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function toggleLike(postId) {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    setFeedPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, likes: likedPosts[postId] ? p.likes - 1 : p.likes + 1 } : p
    ));
  }

  function handlePost() {
    if (!postContent.trim()) return;
    const newPost = {
      id: Date.now(),
      userId: 1,
      userName: 'Marcus Johnson',
      userAvatar: 'https://picsum.photos/seed/user1/100/100',
      userTags: ['Wholesaler'],
      timestamp: 'Just now',
      isPinned: false,
      content: postContent,
      likes: 0,
      comments: 0,
      type: 'text',
    };
    setFeedPosts([newPost, ...feedPosts]);
    setPostContent('');
    showToastMsg('Post shared to the group!');
  }

  function handleSendComment(postId) {
    const text = commentText[postId];
    if (!text?.trim()) return;
    setCommentText(prev => ({ ...prev, [postId]: '' }));
    showToastMsg('Comment posted!');
  }

  function handleRsvp(eventId) {
    const isGoing = rsvpEvents[eventId];
    setRsvpEvents(prev => ({ ...prev, [eventId]: !isGoing }));
    if (!isGoing) {
      setLocalEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendees: e.attendees + 1 } : e));
      showToastMsg("You're going! Added to your calendar.");
    } else {
      setLocalEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendees: Math.max(0, e.attendees - 1) } : e));
    }
  }

  function handleCreateEvent(e) {
    e.preventDefault();
    if (!eventForm.title.trim()) return;
    const newEvent = {
      id: Date.now(),
      title: eventForm.title,
      date: eventForm.date || 'TBD',
      time: eventForm.time || 'TBD',
      location: eventForm.location || 'TBD',
      description: eventForm.description,
      attendees: 0,
    };
    setLocalEvents(prev => [...prev, newEvent]);
    setShowHostEvent(false);
    setEventForm({ title: '', date: '', time: '', location: '', description: '' });
    showToastMsg('Event created! Members will be notified.');
    setActiveTab('Events');
  }

  function handleLeaveGroup() {
    showToastMsg('You left the group.');
    setTimeout(() => navigate('/groups'), 1500);
  }

  return (
    <div style={{ background: '#0a0b0a', minHeight: '100vh' }}>
      {/* Banner */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src={group.bannerImage}
          alt={group.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.background = 'linear-gradient(135deg,#1a1f1b,#131614)'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(10,10,15,0.95) 100%)' }} />
        <Link to="/groups" style={{ position: 'absolute', top: '16px', left: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#f8fafc', textDecoration: 'none', fontSize: '14px', fontWeight: 600, background: 'rgba(0,0,0,0.5)', borderRadius: '20px', padding: '6px 14px', backdropFilter: 'blur(8px)' }}>
          <ArrowLeft size={15} /> Groups
        </Link>
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            {group.isPrivate ? <Lock size={14} style={{ color: '#f59e0b' }} /> : <Globe size={14} style={{ color: '#10b981' }} />}
            <span style={{ color: group.isPrivate ? '#f59e0b' : '#10b981', fontSize: '12px', fontWeight: 700 }}>{group.isPrivate ? 'Private Group' : 'Public Group'}</span>
            <span style={{ color: '#5a675f', fontSize: '12px' }}>•</span>
            <span style={{ color: '#95a29b', fontSize: '12px' }}>{group.category}</span>
          </div>
          <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '26px', margin: '0 0 6px' }}>{group.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#95a29b', fontSize: '13px' }}>
              <Users size={13} />{group.memberCount.toLocaleString()} members
            </div>
            <div style={{ color: '#5a675f', fontSize: '13px' }}>Created {new Date(group.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div style={{ background: '#0e100e', borderBottom: '1px solid #232925', padding: '12px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === tab ? 'rgba(0, 200, 5,0.15)' : 'transparent', color: activeTab === tab ? '#00c805' : '#95a29b', fontWeight: activeTab === tab ? 700 : 500, fontSize: '14px', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid #00c805' : '2px solid transparent', transition: 'all 0.15s' }}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setMuted(!muted)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid #232925', borderRadius: '8px', color: '#95a29b', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              {muted ? <BellOff size={14} /> : <Bell size={14} />}
              {muted ? 'Unmute' : 'Mute'}
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowManageMenu(!showManageMenu)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid #232925', borderRadius: '8px', color: '#95a29b', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                <Settings size={14} /> Manage
              </button>
              {showManageMenu && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowManageMenu(false)} />
                  <div style={{ position: 'absolute', right: 0, top: '42px', background: '#131614', border: '1px solid #232925', borderRadius: '10px', zIndex: 100, minWidth: '160px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                    <button onClick={() => { setShowManageMenu(false); setShowHostEvent(true); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'none', border: 'none', color: '#95a29b', cursor: 'pointer', fontSize: '13px', textAlign: 'left' }}>
                      <Calendar size={13} /> Host Event
                    </button>
                    <button onClick={() => { setShowManageMenu(false); handleLeaveGroup(); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', textAlign: 'left', borderTop: '1px solid #232925' }}>
                      <LogOut size={13} /> Leave Group
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
          <div>
            {activeTab === 'Feed' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Post composer */}
                <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '16px', padding: '18px' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                    <img src="https://picsum.photos/seed/user1/100/100" alt="You" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
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
                        <button key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid #232925', color: '#95a29b', cursor: 'pointer', fontSize: '12px' }}>
                          <Icon size={13} style={{ color }} /> {label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handlePost}
                      className="gradient-btn"
                      style={{ padding: '8px 20px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', opacity: postContent.trim() ? 1 : 0.5 }}
                    >
                      Post
                    </button>
                  </div>
                </div>

                {/* Posts */}
                {feedPosts.map(post => (
                  <div key={post.id} style={{ background: '#131614', border: `1px solid ${post.isPinned ? 'rgba(245,158,11,0.3)' : '#232925'}`, borderRadius: '16px', overflow: 'hidden' }}>
                    {post.isPinned && (
                      <div style={{ background: 'rgba(245,158,11,0.08)', borderBottom: '1px solid rgba(245,158,11,0.2)', padding: '5px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Pin size={11} style={{ color: '#f59e0b' }} />
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
                                <span key={t} style={{ background: 'rgba(0, 200, 5,0.1)', color: '#00c805', borderRadius: '20px', padding: '1px 6px', fontSize: '10px', fontWeight: 600 }}>{t}</span>
                              ))}
                              <span style={{ color: '#5a675f', fontSize: '11px' }}>• {post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <button style={{ background: 'none', border: 'none', color: '#5a675f', cursor: 'pointer' }}><MoreHorizontal size={16} /></button>
                      </div>
                      <p style={{ color: '#f8fafc', fontSize: '14px', lineHeight: 1.7, margin: '0 0 12px' }}>{post.content}</p>
                      {post.image && (
                        <img src={post.image} alt="" style={{ width: '100%', borderRadius: '10px', marginBottom: '12px', maxHeight: '320px', objectFit: 'cover' }} />
                      )}
                      <div style={{ display: 'flex', gap: '16px', paddingTop: '10px', borderTop: '1px solid #232925' }}>
                        <button
                          onClick={() => toggleLike(post.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: likedPosts[post.id] ? '#ef4444' : '#5a675f', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'color 0.15s' }}
                        >
                          <Heart size={15} fill={likedPosts[post.id] ? '#ef4444' : 'none'} />
                          {post.likes}
                        </button>
                        <button
                          onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: expandedComments[post.id] ? '#00c805' : '#5a675f', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                        >
                          <MessageSquare size={15} />
                          {post.comments} Comment{post.comments !== 1 ? 's' : ''}
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#5a675f', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                          <Share2 size={15} /> Share
                        </button>
                      </div>

                      {/* Inline comment box */}
                      {expandedComments[post.id] && (
                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #232925', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <img src="https://picsum.photos/seed/user1/100/100" alt="" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                          <input
                            value={commentText[post.id] || ''}
                            onChange={e => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && handleSendComment(post.id)}
                            placeholder="Write a comment..."
                            className="input-dark"
                            style={{ flex: 1, padding: '8px 14px', borderRadius: '20px', fontSize: '13px' }}
                          />
                          <button
                            onClick={() => handleSendComment(post.id)}
                            style={{ padding: '8px 14px', borderRadius: '20px', background: 'linear-gradient(135deg, #00c805, #00e5a0)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}
                          >
                            Post
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Events' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', margin: 0 }}>Upcoming Events ({localEvents.length})</h3>
                  <button onClick={() => setShowHostEvent(true)} className="gradient-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                    <Plus size={14} /> Host Event
                  </button>
                </div>
                {localEvents.map(ev => (
                  <div key={ev.id} style={{ background: '#131614', border: '1px solid #232925', borderRadius: '14px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', margin: '0 0 8px' }}>{ev.title}</h4>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00c805', fontSize: '13px', fontWeight: 600 }}>
                            <Calendar size={13} /> {ev.date} at {ev.time}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#95a29b', fontSize: '13px' }}>
                            <Users size={13} /> {ev.attendees} attending
                          </div>
                        </div>
                        <p style={{ color: '#95a29b', fontSize: '13px', margin: '0 0 6px', lineHeight: 1.6 }}>{ev.description}</p>
                        <div style={{ color: '#5a675f', fontSize: '12px' }}>📍 {ev.location}</div>
                      </div>
                      <button
                        onClick={() => handleRsvp(ev.id)}
                        style={{
                          padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', flexShrink: 0,
                          background: rsvpEvents[ev.id] ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, #00c805, #00e5a0)',
                          border: rsvpEvents[ev.id] ? '1px solid rgba(16,185,129,0.3)' : 'none',
                          color: rsvpEvents[ev.id] ? '#10b981' : '#fff',
                        }}
                      >
                        {rsvpEvents[ev.id] ? '✓ Going' : 'RSVP'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Members' && (
              <div>
                <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', margin: '0 0 16px' }}>Members ({group.memberCount.toLocaleString()})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                  {members.map(member => (
                    <Link key={member.id} to={`/profile/${member.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#00c805'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#232925'}
                      >
                        <img src={member.avatar} alt={member.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.name}</div>
                            {member.id === group.ownerId && <Crown size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />}
                          </div>
                          <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '2px' }}>
                            {member.tags.slice(0, 2).map(t => (
                              <span key={t} style={{ background: 'rgba(0, 200, 5,0.1)', color: '#00c805', borderRadius: '20px', padding: '1px 6px', fontSize: '10px', fontWeight: 600 }}>{t}</span>
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
                <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '14px', padding: '20px' }}>
                  <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', margin: '0 0 10px' }}>About This Group</h4>
                  <p style={{ color: '#95a29b', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{group.description}</p>
                </div>
                <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '14px', padding: '20px' }}>
                  <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', margin: '0 0 14px' }}>Group Rules</h4>
                  {['No spam, unsolicited DMs, or self-promotion without value.', 'Verify deal numbers before posting — misleading listings will be removed.', 'Be respectful. No personal attacks or discrimination.', 'No off-topic content. Keep discussions real estate focused.', 'Share your wins AND your losses — the community learns from both.'].map((rule, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ background: 'rgba(0, 200, 5,0.15)', color: '#00c805', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>{i + 1}</div>
                      <p style={{ color: '#95a29b', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{rule}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'linear-gradient(135deg, rgba(0, 200, 5,0.08), rgba(0, 229, 160,0.05))', border: '1px solid rgba(0, 200, 5,0.2)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                  <h4 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px' }}>Invite people you know</h4>
                  <p style={{ color: '#95a29b', fontSize: '14px', marginBottom: '16px' }}>The best deals happen in tight networks. Grow this group with quality investors.</p>
                  <button className="gradient-btn" style={{ padding: '10px 20px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                    Invite Members
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '14px', padding: '18px' }}>
              <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px', margin: '0 0 14px' }}>Group Info</h4>
              {[
                { label: 'Members', value: group.memberCount.toLocaleString() },
                { label: 'Type', value: group.isPrivate ? '🔒 Private' : '🌐 Public' },
                { label: 'Category', value: group.category },
                { label: 'Created', value: new Date(group.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
                { label: 'Events this month', value: '2' },
                { label: 'Posts this week', value: feedPosts.length + '' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #232925' }}>
                  <span style={{ color: '#95a29b', fontSize: '13px' }}>{label}</span>
                  <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '13px' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '14px', padding: '18px' }}>
              <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px', margin: '0 0 14px' }}>Members</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {members.slice(0, 9).map(m => (
                  <img key={m.id} src={m.avatar} alt={m.name} title={m.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0a0b0a' }} />
                ))}
              </div>
              <button onClick={() => setActiveTab('Members')} style={{ color: '#00c805', background: 'none', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                View all {group.memberCount.toLocaleString()} members →
              </button>
            </div>

            <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '14px', padding: '18px' }}>
              <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px', margin: '0 0 14px' }}>Next Event</h4>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{localEvents[0]?.title || 'No upcoming events'}</div>
              {localEvents[0] && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00c805', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    <Calendar size={12} /> {localEvents[0].date}
                  </div>
                  <div style={{ color: '#5a675f', fontSize: '12px', marginBottom: '12px' }}>{localEvents[0].attendees} attending</div>
                </>
              )}
              <button onClick={() => setActiveTab('Events')} style={{ color: '#00c805', background: 'none', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                See all events →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Host Event Modal */}
      {showHostEvent && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowHostEvent(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#131614', border: '1px solid #232925', borderRadius: '20px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #232925', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', margin: 0 }}>Host an Event</h2>
              <button onClick={() => setShowHostEvent(false)} style={{ background: 'none', border: 'none', color: '#5a675f', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateEvent} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Event Title *', key: 'title', placeholder: 'Monthly Deal Review', type: 'text' },
                { label: 'Date', key: 'date', placeholder: '', type: 'date' },
                { label: 'Time', key: 'time', placeholder: '', type: 'time' },
                { label: 'Location', key: 'location', placeholder: 'Dallas, TX (+ Zoom)', type: 'text' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label style={{ color: '#95a29b', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={eventForm[key]} onChange={e => setEventForm({ ...eventForm, [key]: e.target.value })} className="input-dark" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }} required={label.includes('*')} />
                </div>
              ))}
              <div>
                <label style={{ color: '#95a29b', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} placeholder="What will happen at this event?" className="input-dark" rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowHostEvent(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #232925', color: '#95a29b', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" className="gradient-btn" style={{ flex: 2, padding: '12px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, background: '#131614', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <Check size={16} style={{ color: '#10b981', flexShrink: 0 }} />
          <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 500 }}>{toast}</span>
        </div>
      )}
    </div>
  );
}
