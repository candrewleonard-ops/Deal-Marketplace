import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, Send, Image, Paperclip, MoreVertical, Phone, Video, ArrowLeft,
  Plus, MessageSquare, Sparkles, UserPlus, Briefcase,
} from 'lucide-react';
import { getUserById, users } from '../data/users';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import UserHoverCard from '../components/UserHoverCard';
import CallOverlay from '../components/CallOverlay';
import { sendDM, fetchThread, fetchConversations, markThreadSeen, unreadFromConversations } from '../lib/dms';
import { getStartedThreads, ensureThread, getFollowing, subscribeInbox } from '../lib/inbox';
import { listLiveDeals } from '../lib/deals';
import { getViewCounts } from '../lib/engagement';
import { dealPath } from '../utils/slug';

const DM_LIMITS = { Basic: 5, VIP: 30, 'VIP Max': 100 };

/** Any id → something presentable, even if it isn't a local test account. */
function displayUser(id) {
  const known = getUserById(id);
  if (known) return known;
  const short = String(id).replace(/^u_/, '').slice(0, 8);
  return {
    id,
    name: `Member ${short}`,
    username: `member_${short}`,
    avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(short)}&backgroundColor=232925&textColor=95a29b`,
    bio: 'AllStreet Live member.',
    location: '',
  };
}

function suggestedOpeners(user) {
  return [
    `Hey ${user?.name?.split(' ')[0] || 'there'}! Saw your listings — what markets are you focused on right now?`,
    'Do you have anything under contract right now that fits a fix & flip?',
    'Add me to your buyers list? I can move fast on the right numbers.',
  ];
}

const timeAgo = (ts) => {
  if (!ts) return '';
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

export default function Messages() {
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePartner, setActivePartner] = useState(null); // partner user id
  const [message, setMessage] = useState('');
  const [inboxTab, setInboxTab] = useState('inbox'); // inbox | buyers
  const [searchVal, setSearchVal] = useState('');
  const [conversations, setConversations] = useState([]);
  const [thread, setThread] = useState([]);
  const [mobileView, setMobileView] = useState('list');
  const [call, setCall] = useState(null); // { mode: 'video' | 'audio' }
  const [featured, setFeatured] = useState([]); // top live deals by views
  const [, bump] = useState(0);
  const messagesEndRef = useRef(null);
  const myId = String(currentUser?.id ?? 'me');

  useEffect(() => subscribeInbox(() => bump(x => x + 1)), []);

  /* ── Conversations: Supabase + locally-started empty threads, polled ── */
  const loadConversations = useCallback(async () => {
    const convs = await fetchConversations(myId);
    const started = getStartedThreads()
      .filter(t => !convs.some(c => String(c.partnerId) === String(t.userId)))
      .map(t => ({ partnerId: String(t.userId), lastText: 'New conversation — say hello!', lastTs: t.startedAt, lastFromMe: true, isNew: true }));
    setConversations([...convs, ...started].sort((a, b) => new Date(b.lastTs) - new Date(a.lastTs)));
  }, [myId]);

  useEffect(() => {
    loadConversations();
    const iv = setInterval(loadConversations, 6000);
    return () => clearInterval(iv);
  }, [loadConversations]);

  /* ── Open thread: fetch + poll while open ── */
  const loadThread = useCallback(async (partnerId) => {
    const msgs = await fetchThread(myId, partnerId);
    setThread(msgs);
  }, [myId]);

  useEffect(() => {
    if (!activePartner) return;
    loadThread(activePartner);
    markThreadSeen(activePartner);
    const iv = setInterval(() => loadThread(activePartner), 4000);
    return () => clearInterval(iv);
  }, [activePartner, loadThread]);

  /* ── Deep link: /messages?to=<userId> ── */
  const toParam = searchParams.get('to');
  const openConversationWith = useCallback((userId) => {
    ensureThread(userId);
    setActivePartner(String(userId));
    setInboxTab('inbox');
    setMobileView('chat');
    markThreadSeen(userId);
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (toParam) {
      openConversationWith(toParam);
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toParam]);

  /* ── Featured: top live listings by real views (fills the empty hub) ── */
  useEffect(() => {
    let alive = true;
    (async () => {
      const live = await listLiveDeals(30);
      if (!live.length) return;
      const counts = await getViewCounts(live.map(d => d.id));
      const top = [...live]
        .sort((a, b) => (counts[String(b.id)] || 0) - (counts[String(a.id)] || 0))
        .slice(0, 5)
        .map(d => ({ ...d, viewCount: counts[String(d.id)] || 0 }));
      if (alive) setFeatured(top);
    })();
    return () => { alive = false; };
  }, []);

  const activeUser = activePartner ? displayUser(activePartner) : null;
  const unreadMap = unreadFromConversations(conversations);
  const isWholesaler = (currentUser?.tags || []).includes('Wholesaler');
  const dmLimit = DM_LIMITS[currentUser?.accountTier] || 5;

  const filteredConvs = conversations.filter(c => {
    if (!searchVal) return true;
    return displayUser(c.partnerId).name.toLowerCase().includes(searchVal.toLowerCase());
  });

  // Buyers = people who messaged me (their message is the latest or they ever wrote)
  const buyerConvs = conversations.filter(c => !c.lastFromMe);

  const followedUsers = getFollowing()
    .map(displayUser)
    .filter(u => String(u.id) !== myId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  async function handleSend() {
    const text = message.trim();
    if (!text || !activePartner) return;
    setMessage('');
    // optimistic append
    const optimistic = { id: `tmp-${Date.now()}`, fromId: myId, toId: activePartner, text, ts: new Date().toISOString() };
    setThread(prev => [...prev, optimistic]);
    await sendDM({
      fromId: myId, fromName: currentUser?.name,
      toId: activePartner, toName: activeUser?.name, text,
    });
    loadThread(activePartner);
    loadConversations();
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const fmtPrice = (n) => n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n || 0}`;

  const tabBtn = (on) => ({
    padding: '5px 12px', borderRadius: '16px',
    background: on ? 'rgba(0, 200, 5, 0.2)' : 'transparent',
    border: `1px solid ${on ? '#00c805' : '#232925'}`,
    color: on ? '#4ade80' : '#95a29b',
    fontSize: '11px', fontWeight: 700, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 5,
  });

  const badge = (n, color = '#ef4444') => n > 0 && (
    <span style={{
      minWidth: 16, height: 16, borderRadius: 999, padding: '0 4px',
      background: color, color: '#fff', fontSize: 10, fontWeight: 900,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      !{n}
    </span>
  );

  const totalUnreadCount = Object.keys(unreadMap).length;

  return (
    <div style={{ background: '#0a0b0a', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* VIP upsell banner */}
      {currentUser?.accountTier === 'Basic' && (
        <div style={{ background: 'linear-gradient(135deg, rgba(0, 200, 5,0.12), rgba(0, 229, 160,0.08))', borderBottom: '1px solid rgba(0, 200, 5,0.2)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexShrink: 0 }}>
          <span style={{ color: '#e4eae6', fontSize: '13px' }}>
            📣 Need to reach more buyers? <strong>Upgrade to VIP Max</strong> for 100 DMs/day
          </span>
          <Link to="/premium" className="gradient-btn" style={{ padding: '6px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', textDecoration: 'none', flexShrink: 0 }}>
            Upgrade
          </Link>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* ── LEFT HUB ── */}
        <div style={{
          width: '340px', flexShrink: 0,
          background: '#0e100e', borderRight: '1px solid #232925',
          display: (isMobile && mobileView === 'chat') ? 'none' : 'flex',
          flexDirection: 'column',
          ...(isMobile ? { width: '100%' } : {}),
        }}>
          {/* Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid #232925', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', margin: 0 }}>Messages</h2>
              <div style={{ color: '#95a29b', fontSize: '11px', fontWeight: 600 }}>
                <strong style={{ color: '#00c805' }}>{dmLimit}</strong> DMs/day
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => setInboxTab('inbox')} style={tabBtn(inboxTab === 'inbox')}>
                Inbox {badge(totalUnreadCount, '#00c805')}
              </button>
              {isWholesaler && (
                <button onClick={() => setInboxTab('buyers')} style={tabBtn(inboxTab === 'buyers')}>
                  <Briefcase size={11} /> My Buyers {badge(buyerConvs.filter(c => unreadMap[c.partnerId]).length)}
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#5a675f' }} />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search conversations..."
                className="input-dark"
                style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '10px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Hub body */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {(inboxTab === 'buyers' ? buyerConvs : filteredConvs).length === 0 && (
              <div style={{ padding: '26px 20px 10px', textAlign: 'center', color: '#5a675f', fontSize: '13px', lineHeight: 1.6 }}>
                {inboxTab === 'buyers'
                  ? 'Buyers who message you about your listings will show up here.'
                  : 'No conversations yet. Find a deal you like and hit "Message Seller" — or start with someone below 👇'}
              </div>
            )}
            {(inboxTab === 'buyers' ? buyerConvs : filteredConvs).map(conv => {
              const user = displayUser(conv.partnerId);
              const isActive = String(activePartner) === String(conv.partnerId);
              const unread = unreadMap[conv.partnerId] ? 1 : 0;
              return (
                <div
                  key={conv.partnerId}
                  onClick={() => openConversationWith(conv.partnerId)}
                  style={{
                    display: 'flex', gap: '12px', padding: '12px 14px',
                    cursor: 'pointer', transition: 'background 0.15s',
                    background: isActive ? 'rgba(0, 200, 5, 0.08)' : 'transparent',
                    borderLeft: isActive ? '3px solid #00c805' : '3px solid transparent',
                  }}
                >
                  <UserHoverCard user={user}>
                    <img src={user.avatar} alt={user.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  </UserHoverCard>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                      <span style={{ color: '#f8fafc', fontWeight: unread ? 800 : 700, fontSize: '14px' }}>{user.name}</span>
                      <span style={{ color: '#3e4a43', fontSize: '11px', flexShrink: 0 }}>{timeAgo(conv.lastTs)}</span>
                    </div>
                    <p style={{ color: unread ? '#e4eae6' : '#95a29b', fontSize: '12px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: unread ? 600 : 400 }}>
                      {conv.lastFromMe ? 'You: ' : ''}{conv.lastText}
                    </p>
                  </div>
                  {unread > 0 && (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00c805', flexShrink: 0, alignSelf: 'center' }} />
                  )}
                </div>
              );
            })}

            {/* People you follow / featured wholesalers */}
            {inboxTab === 'inbox' && (
              <div style={{ padding: '16px 14px 8px', borderTop: '1px solid #232925', marginTop: 8 }}>
                {followedUsers.length > 0 && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4ade80', fontSize: 11, fontWeight: 800, letterSpacing: 0.6, marginBottom: 10 }}>
                      <UserPlus size={12} /> PEOPLE YOU FOLLOW
                    </div>
                    {followedUsers.map(u => (
                      <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
                        <img src={u.avatar} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: '#f8fafc', fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                          <div style={{ color: '#707d75', fontSize: 11 }}>{u.location}</div>
                        </div>
                        <button
                          onClick={() => openConversationWith(u.id)}
                          style={{
                            padding: '5px 11px', borderRadius: 9, cursor: 'pointer',
                            background: 'rgba(0, 200, 5, 0.12)', border: '1px solid rgba(0, 200, 5, 0.3)',
                            color: '#4ade80', fontSize: 11, fontWeight: 800, flexShrink: 0,
                          }}
                        >
                          Message
                        </button>
                      </div>
                    ))}
                  </>
                )}

                {/* Test accounts — quick way to try the DM loop */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4ade80', fontSize: 11, fontWeight: 800, letterSpacing: 0.6, margin: followedUsers.length ? '14px 0 10px' : '0 0 10px' }}>
                  <UserPlus size={12} /> TEST ACCOUNTS
                </div>
                {users.filter(u => String(u.id) !== myId).map(u => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
                    <img src={u.avatar} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#f8fafc', fontSize: 13, fontWeight: 700 }}>{u.name}</div>
                      <div style={{ color: '#707d75', fontSize: 11 }}>{(u.tags || []).join(' · ')}</div>
                    </div>
                    <button
                      onClick={() => openConversationWith(u.id)}
                      style={{
                        padding: '5px 11px', borderRadius: 9, cursor: 'pointer',
                        background: 'rgba(0, 200, 5, 0.12)', border: '1px solid rgba(0, 200, 5, 0.3)',
                        color: '#4ade80', fontSize: 11, fontWeight: 800, flexShrink: 0,
                      }}
                    >
                      Message
                    </button>
                  </div>
                ))}

                {/* Featured wholesalers — top live listings by real views */}
                {featured.length > 0 && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fbbf24', fontSize: 11, fontWeight: 800, letterSpacing: 0.6, margin: '14px 0 10px' }}>
                      <Sparkles size={12} /> FEATURED WHOLESALERS
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 16 }}>
                      {featured.map(d => (
                        <div key={d.id} style={{
                          borderRadius: 12, overflow: 'hidden',
                          background: '#131614', border: '1px solid #232925',
                        }}>
                          <Link to={dealPath(d)} style={{ textDecoration: 'none', display: 'block' }}>
                            <img src={d.images?.[0]} alt="" loading="lazy" style={{ width: '100%', height: 64, objectFit: 'cover', display: 'block', background: '#1a1f1b' }} />
                          </Link>
                          <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ color: '#f8fafc', fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {d.title}
                              </div>
                              <div style={{ fontSize: 11, marginTop: 1 }}>
                                <span style={{ color: '#00c805', fontWeight: 900 }}>{fmtPrice(d.listingPrice || d.price)}</span>
                                <span style={{ color: '#707d75' }}> · {d.sellerName} · {d.viewCount} views</span>
                              </div>
                            </div>
                            <button
                              onClick={() => openConversationWith(d.sellerId)}
                              style={{
                                padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
                                background: 'rgba(0, 200, 5, 0.12)', border: '1px solid rgba(0, 200, 5, 0.3)',
                                color: '#4ade80', fontSize: 11, fontWeight: 800, flexShrink: 0,
                              }}
                            >
                              Message
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Chat panel ── */}
        <div style={{
          flex: 1, display: (isMobile && mobileView === 'list') ? 'none' : 'flex',
          flexDirection: 'column', overflow: 'hidden',
        }}>
          {activePartner && activeUser ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #232925', background: '#0e100e', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                {isMobile && (
                  <button
                    onClick={() => setMobileView('list')}
                    style={{ background: 'none', border: 'none', color: '#95a29b', cursor: 'pointer', padding: '4px' }}
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <Link to={`/profile/${activeUser.id}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flex: 1 }}>
                  <img src={activeUser.avatar} alt={activeUser.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{activeUser.name}</div>
                    <div style={{ color: '#707d75', fontSize: '12px', fontWeight: 500 }}>@{activeUser.username}</div>
                  </div>
                </Link>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setCall({ mode: 'audio' })}
                    aria-label="Voice call"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #232925', borderRadius: '8px', padding: '7px', color: '#95a29b', cursor: 'pointer', display: 'flex' }}
                  >
                    <Phone size={16} />
                  </button>
                  <button
                    onClick={() => setCall({ mode: 'video' })}
                    aria-label="Video call"
                    style={{ background: 'rgba(0, 200, 5, 0.10)', border: '1px solid rgba(0, 200, 5, 0.3)', borderRadius: '8px', padding: '7px', color: '#4ade80', cursor: 'pointer', display: 'flex' }}
                  >
                    <Video size={16} />
                  </button>
                  <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #232925', borderRadius: '8px', padding: '7px', color: '#95a29b', cursor: 'pointer', display: 'flex' }}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {thread.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', maxWidth: 420, padding: '10px 16px' }}>
                    <img src={activeUser.avatar} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: '2px solid #00c805', marginBottom: 12 }} />
                    <div style={{ color: '#f8fafc', fontWeight: 900, fontSize: 19, letterSpacing: '-0.3px' }}>
                      Start the conversation with {activeUser.name.split(' ')[0]}
                    </div>
                    <div style={{ color: '#95a29b', fontSize: 13, lineHeight: 1.6, margin: '8px 0 16px' }}>
                      {activeUser.bio ? activeUser.bio.slice(0, 110) : 'Active investor on AllStreet Live.'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {suggestedOpeners(activeUser).map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => setMessage(sug)}
                          style={{
                            padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
                            background: 'rgba(0, 200, 5, 0.07)', border: '1px solid rgba(0, 200, 5, 0.25)',
                            color: '#e4eae6', fontSize: 13, textAlign: 'left', lineHeight: 1.45,
                          }}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : thread.map(msg => {
                  const isMe = String(msg.fromId) === myId;
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
                      {!isMe && (
                        <img src={activeUser.avatar} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      )}
                      <div style={{ maxWidth: '65%' }}>
                        <div className={isMe ? 'bubble-sent' : 'bubble-received'} style={{ padding: '10px 14px' }}>
                          <p style={{ color: '#f8fafc', margin: 0, fontSize: '14px', lineHeight: 1.6 }}>{msg.text}</p>
                        </div>
                        <div style={{ color: '#3e4a43', fontSize: '11px', marginTop: '3px', textAlign: isMe ? 'right' : 'left' }}>
                          {msg.ts ? new Date(msg.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                      {isMe && (
                        <img src={currentUser?.avatar} alt="You" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid #232925', background: '#0e100e', display: 'flex', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[Image, Paperclip].map((Icon, i) => (
                    <button key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #232925', borderRadius: '10px', padding: '9px', color: '#95a29b', cursor: 'pointer', display: 'flex' }}>
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message... (Enter to send)"
                  rows={1}
                  className="input-dark"
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', fontSize: '14px', resize: 'none', lineHeight: 1.5, maxHeight: '100px', overflow: 'auto' }}
                />
                <button
                  onClick={handleSend}
                  className="gradient-btn"
                  style={{ padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', opacity: message.trim() ? 1 : 0.5, flexShrink: 0 }}
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#5a675f', gap: '16px', padding: '40px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0, 200, 5, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={36} style={{ color: '#00c805' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px', fontSize: '18px' }}>Your Messages</h3>
                <p style={{ color: '#5a675f', fontSize: '14px', marginBottom: '20px' }}>Pick a conversation — or message a test account to try it out</p>
                <div style={{ background: 'linear-gradient(135deg, rgba(0, 200, 5,0.1), rgba(0, 229, 160,0.07))', border: '1px solid rgba(0, 200, 5,0.2)', borderRadius: '12px', padding: '16px 20px', maxWidth: '320px' }}>
                  <p style={{ color: '#95a29b', fontSize: '13px', margin: '0 0 10px' }}>
                    <strong style={{ color: '#f8fafc' }}>Pro tip:</strong> VIP Max members get 100 DMs/day — close more deals by reaching more buyers.
                  </p>
                  <Link to="/premium" style={{ color: '#00c805', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Learn about VIP Max →</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* In-app calls (device camera/mic) */}
      {call && activeUser && (
        <CallOverlay user={activeUser} mode={call.mode} onClose={() => setCall(null)} />
      )}
    </div>
  );
}
