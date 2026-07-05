import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, Send, Image, Paperclip, MoreVertical, Phone, Video, ArrowLeft,
  Crown, Plus, MessageSquare, Sparkles, UserPlus, Briefcase,
} from 'lucide-react';
import { users } from '../data/users';
import { deals } from '../data/deals';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import UserHoverCard from '../components/UserHoverCard';
import CallOverlay from '../components/CallOverlay';
import { recordDM, getThread } from '../lib/dmHistory';
import {
  getUnreadMap, markConversationRead, getStartedThreads, ensureThread,
  getFollowing, newBuyerCount, markBuyersSeen, subscribeInbox,
} from '../lib/inbox';
import { dealPath } from '../utils/slug';

const seedConversations = [
  { id: 1, userId: 2, lastMessage: "Hey! I saw your deal in Atlanta - very interested. What's the closing timeline?", time: '2m ago' },
  { id: 2, userId: 4, lastMessage: 'The subject-to deal I mentioned is still available. Can we hop on a call?', time: '15m ago' },
  { id: 3, userId: 7, lastMessage: 'Sent you the comps for the KC deal. Let me know what you think.', time: '1h ago' },
  { id: 4, userId: 5, lastMessage: "Thanks for connecting! Memphis is on fire right now. I'll have 3 new deals next week.", time: '3h ago' },
  { id: 5, userId: 8, lastMessage: 'Can you add me to your buyers list? Cash buyer, can close in 7 days.', time: '1d ago' },
  { id: 6, userId: 9, lastMessage: 'Great meeting you at the Jacksonville meetup! Congrats on the deal.', time: '2d ago' },
];

const initialMessageHistory = {
  1: [
    { id: 1, from: 'them', text: "Hey Marcus! I saw your Atlanta deal on All Street Live.", time: '10:32 AM' },
    { id: 2, from: 'me', text: "Hey Diana! Yes, great deal - 3/2 brick ranch, ARV $320k. Can close in 10 days.", time: '10:35 AM' },
    { id: 3, from: 'them', text: "Very interested! Is the assignment fee negotiable?", time: '10:36 AM' },
    { id: 4, from: 'me', text: "It's firm at $25k - we have another buyer interested and the numbers are solid. ARV supported by 3 comps.", time: '10:40 AM' },
    { id: 5, from: 'them', text: "Understood. Can you send me the inspection report and the comps? I'll have my partner review tonight.", time: '10:41 AM' },
    { id: 6, from: 'me', text: "Absolutely! Sending the due diligence package now. Full comps, inspection report, title search.", time: '10:45 AM' },
    { id: 7, from: 'them', text: "Hey! I saw your deal in Atlanta - very interested. What's the closing timeline?", time: '11:02 AM' },
  ],
  2: [
    { id: 1, from: 'them', text: "Marcus! The Houston subject-to deal is still available. 3.25% rate locked in.", time: 'Yesterday' },
    { id: 2, from: 'me', text: "Sarah I know, I'm seriously considering it. What's the existing loan balance?", time: 'Yesterday' },
    { id: 3, from: 'them', text: "$85k at 3.25%. House will appraise at $220k. You're picking up $135k in equity day 1.", time: 'Yesterday' },
    { id: 4, from: 'them', text: 'The subject-to deal I mentioned is still available. Can we hop on a call?', time: 'Today' },
  ],
};

const messageRequests = [
  { id: 101, userId: 6, lastMessage: 'Hi! Would love to connect about Indy market deals.', time: '4h ago' },
  { id: 102, userId: 10, lastMessage: 'Are you doing STR deals? I have a lead.', time: '1d ago' },
  { id: 103, userId: 9, lastMessage: 'Hey, interested in lending on your next flip!', time: '2d ago' },
];

// Buyers who raised their hand on your listings (drives the My Buyers tab).
const buyerLeads = [
  { userId: 8, note: 'Cash buyer · closes in 7 days', source: 'Got the address on “Stunning Brick Ranch”' },
  { userId: 5, note: 'Buys in TN & GA · proof of funds on file', source: 'Saved 2 of your deals' },
  { userId: 6, note: 'Flipper · 12 projects/yr', source: 'Requested the address on “Phoenix Fixer”' },
];

const DM_LIMITS = { Basic: 5, VIP: 30, 'VIP Max': 100 };

const findUser = (id) => users.find(u => String(u.id) === String(id));

function suggestedOpeners(user) {
  return [
    `Hey ${user?.name?.split(' ')[0] || 'there'}! Saw your listings — what markets are you focused on right now?`,
    'Do you have anything under contract right now that fits a fix & flip?',
    'Add me to your buyers list? I can move fast on the right numbers.',
  ];
}

export default function Messages() {
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeConv, setActiveConv] = useState(null);
  const [message, setMessage] = useState('');
  const [inboxTab, setInboxTab] = useState('inbox'); // inbox | requests | buyers
  const [searchVal, setSearchVal] = useState('');
  const [sessionMessages, setSessionMessages] = useState({}); // convKey → extra msgs this session
  const [typing, setTyping] = useState(false);
  const [mobileView, setMobileView] = useState('list');
  const [requests, setRequests] = useState(messageRequests);
  const [acceptedRequests, setAcceptedRequests] = useState({});
  const [call, setCall] = useState(null); // { mode: 'video' | 'audio' }
  const [, forceInbox] = useState(0);
  const messagesEndRef = useRef(null);

  // Re-render on inbox changes (unread counts, follows) from anywhere.
  useEffect(() => subscribeInbox(() => forceInbox(x => x + 1)), []);

  const unreadMap = getUnreadMap();
  const following = getFollowing();
  const isWholesaler = (currentUser?.tags || []).includes('Wholesaler');

  const dmLimit = DM_LIMITS[currentUser?.accountTier] || 5;
  const dmsUsed = 2;

  /* ── Conversation list = seeded demo convs + threads the user started ── */
  const startedThreads = getStartedThreads();
  const allConversations = useMemo(() => {
    const started = startedThreads
      .filter(t => !seedConversations.some(c => String(c.userId) === String(t.userId)))
      .map(t => {
        const dm = getThread(currentUser?.id, t.userId);
        const last = dm[dm.length - 1];
        return {
          id: `u${t.userId}`,
          userId: t.userId,
          lastMessage: last ? last.text : 'New conversation — say hello!',
          time: last ? 'Recent' : 'Now',
          isNew: !last,
        };
      });
    return [...started, ...seedConversations];
  }, [startedThreads, currentUser?.id, sessionMessages]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Deep link: /messages?to=<userId> opens (or starts) that thread ── */
  const toParam = searchParams.get('to');
  const openConversationWith = useCallback((userId) => {
    const existing = [...allConversations, ...Object.values(acceptedRequests)]
      .find(c => String(c.userId) === String(userId));
    if (existing) {
      setActiveConv(existing);
      markConversationRead(existing.id);
    } else {
      ensureThread(userId);
      setActiveConv({
        id: `u${userId}`, userId,
        lastMessage: 'New conversation — say hello!',
        time: 'Now', isNew: true,
      });
    }
    setInboxTab('inbox');
    setMobileView('chat');
  }, [allConversations, acceptedRequests]);

  useEffect(() => {
    if (toParam && findUser(toParam)) {
      openConversationWith(toParam);
      // keep the param out of history so Back doesn't reopen it forever
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toParam]);

  const activeUser = activeConv ? findUser(activeConv.userId) : null;

  /* ── Messages for the open thread: seed + persisted DMs + this session ── */
  const activeMessages = useMemo(() => {
    if (!activeConv) return [];
    const seed = (initialMessageHistory[activeConv.id] || []).map(m => ({
      ...m, isMe: m.from === 'me',
    }));
    const persisted = getThread(currentUser?.id, activeConv.userId).map(m => ({
      id: m.id, text: m.text,
      time: new Date(m.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      isMe: String(m.fromId) === String(currentUser?.id),
    }));
    const session = sessionMessages[activeConv.id] || [];
    return [...seed, ...persisted, ...session];
  }, [activeConv, currentUser?.id, sessionMessages]);

  const filteredConvs = allConversations.filter(c => {
    if (!searchVal) return true;
    const u = findUser(c.userId);
    return u?.name.toLowerCase().includes(searchVal.toLowerCase());
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, typing]);

  function openConv(conv) {
    setActiveConv(conv);
    setMobileView('chat');
    markConversationRead(conv.id);
  }

  function sendMessage() {
    if (!message.trim() || !activeConv) return;
    const text = message.trim();
    // Persist through DM history (also powers "buyers I've DM'd" unlocks).
    recordDM({
      fromId: currentUser?.id, fromName: currentUser?.name,
      toId: activeConv.userId, toName: activeUser?.name, text,
    });
    setMessage('');
    // Demo users type back.
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = {
        id: Date.now() + 1,
        text: activeConv.isNew
          ? `Hey! Thanks for reaching out — always happy to talk deals. What are you looking for?`
          : 'Got it! I\'ll take a look and get back to you shortly.',
        time: 'Now', isMe: false,
      };
      setSessionMessages(prev => ({
        ...prev,
        [activeConv.id]: [...(prev[activeConv.id] || []), reply],
      }));
    }, 2200);
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleAcceptRequest(req) {
    const newConv = { id: req.id, userId: req.userId, lastMessage: req.lastMessage, time: req.time };
    setAcceptedRequests(prev => ({ ...prev, [req.id]: newConv }));
    setRequests(prev => prev.filter(r => r.id !== req.id));
    setActiveConv(newConv);
    setInboxTab('inbox');
    setMobileView('chat');
  }

  function handleDeclineRequest(reqId) {
    setRequests(prev => prev.filter(r => r.id !== reqId));
  }

  const allConvs = [...filteredConvs, ...Object.values(acceptedRequests)];

  /* ── Hub extras: people you follow / featured wholesalers ── */
  const followedUsers = following
    .map(findUser)
    .filter(u => u && String(u.id) !== String(currentUser?.id));

  // Top 5 listings by views → their sellers, suggested as people to message.
  const featuredDeals = useMemo(() => (
    [...deals]
      .sort((a, b) => (b.views || 0) - (a.views || 0) || a.daysListed - b.daysListed)
      .slice(0, 5)
  ), []);

  const buyerLeadIds = buyerLeads.map(l => l.userId);
  const newBuyers = newBuyerCount(buyerLeadIds);

  function openBuyersTab() {
    setInboxTab('buyers');
    markBuyersSeen(buyerLeadIds);
  }

  const fmtPrice = (n) => n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;

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
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
    }}>
      !{n}
    </span>
  );

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
        {/* ── LEFT HUB: conversations, follows, featured wholesalers ── */}
        <div style={{
          width: '340px', flexShrink: 0,
          background: '#0e100e', borderRight: '1px solid #232925',
          display: 'flex', flexDirection: 'column',
          ...(isMobile && mobileView === 'chat' ? { display: 'none' } : {}),
        }} className="hidden md:flex flex-col">
          {/* Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid #232925', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', margin: 0 }}>Messages</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ color: '#95a29b', fontSize: '11px', fontWeight: 600 }}>
                  <strong style={{ color: '#00c805' }}>{dmsUsed}/{dmLimit}</strong> DMs
                </div>
                <button style={{ background: 'rgba(0, 200, 5, 0.1)', border: '1px solid rgba(0, 200, 5, 0.2)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#00c805', display: 'flex' }}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => setInboxTab('inbox')} style={tabBtn(inboxTab === 'inbox')}>
                Inbox {badge(Object.values(unreadMap).reduce((a, b) => a + b, 0), '#00c805')}
              </button>
              <button onClick={() => setInboxTab('requests')} style={tabBtn(inboxTab === 'requests')}>
                Requests {badge(requests.length)}
              </button>
              {isWholesaler && (
                <button onClick={openBuyersTab} style={tabBtn(inboxTab === 'buyers')}>
                  <Briefcase size={11} /> My Buyers {badge(newBuyers)}
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

          {/* Scrollable hub body */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {inboxTab === 'requests' ? (
              requests.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#5a675f', fontSize: '13px' }}>
                  No pending message requests
                </div>
              ) : requests.map(req => {
                const u = findUser(req.userId);
                const tier = u?.accountTier || 'Basic';
                return (
                  <div key={req.id} style={{ padding: '12px 14px', borderBottom: '1px solid #232925', display: 'flex', gap: '10px' }}>
                    <img src={u?.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 700 }}>{u?.name}</span>
                        {tier === 'VIP Max' && <Crown size={11} style={{ color: '#f59e0b' }} />}
                        {tier === 'VIP' && <Crown size={11} style={{ color: '#00c805' }} />}
                      </div>
                      <p style={{ color: '#95a29b', fontSize: '12px', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.lastMessage}</p>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleAcceptRequest(req)} className="gradient-btn" style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 700 }}>Accept</button>
                        <button onClick={() => handleDeclineRequest(req.id)} style={{ padding: '3px 10px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>Decline</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : inboxTab === 'buyers' ? (
              <div>
                <div style={{ padding: '12px 14px 6px', color: '#95a29b', fontSize: 12, lineHeight: 1.5 }}>
                  Buyers who engaged with <strong style={{ color: '#f8fafc' }}>your listings</strong>. Follow up while they're hot.
                </div>
                {buyerLeads.map(lead => {
                  const u = findUser(lead.userId);
                  return (
                    <div key={lead.userId} style={{ padding: '12px 14px', borderBottom: '1px solid #232925', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <img src={u?.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 700 }}>{u?.name}</span>
                        <div style={{ color: '#4ade80', fontSize: '11px', fontWeight: 700, margin: '2px 0' }}>{lead.note}</div>
                        <div style={{ color: '#707d75', fontSize: '11px' }}>{lead.source}</div>
                      </div>
                      <button
                        onClick={() => openConversationWith(lead.userId)}
                        className="gradient-btn"
                        style={{ padding: '6px 12px', borderRadius: '9px', fontSize: '11px', fontWeight: 800, flexShrink: 0 }}
                      >
                        Message
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                {/* Recent conversations */}
                {allConvs.length === 0 && (
                  <div style={{ padding: '30px 20px', textAlign: 'center', color: '#5a675f', fontSize: '13px' }}>
                    No conversations yet. Start with someone below 👇
                  </div>
                )}
                {allConvs.map(conv => {
                  const user = findUser(conv.userId);
                  const isActive = activeConv?.id === conv.id;
                  const unread = unreadMap[conv.id] || 0;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => openConv(conv)}
                      style={{
                        display: 'flex', gap: '12px', padding: '12px 14px',
                        cursor: 'pointer', transition: 'background 0.15s',
                        background: isActive ? 'rgba(0, 200, 5, 0.08)' : 'transparent',
                        borderLeft: isActive ? '3px solid #00c805' : '3px solid transparent',
                      }}
                    >
                      <UserHoverCard user={user}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <img src={user?.avatar} alt={user?.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', bottom: '0', right: '0', width: '11px', height: '11px', borderRadius: '50%', background: '#10b981', border: '2px solid #0e100e' }} />
                        </div>
                      </UserHoverCard>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                          <span style={{ color: '#f8fafc', fontWeight: unread ? 800 : 700, fontSize: '14px' }}>{user?.name}</span>
                          <span style={{ color: '#3e4a43', fontSize: '11px', flexShrink: 0 }}>{conv.time}</span>
                        </div>
                        <p style={{ color: unread ? '#e4eae6' : '#95a29b', fontSize: '12px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: unread ? 600 : 400 }}>
                          {conv.lastMessage}
                        </p>
                      </div>
                      {unread > 0 && (
                        <div style={{ minWidth: '18px', height: '18px', borderRadius: '50%', background: '#00c805', color: '#052012', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center', padding: '0 4px' }}>
                          {unread}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* People you follow / featured wholesalers */}
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

                  {/* Featured wholesalers — top 5 listings by views */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fbbf24', fontSize: 11, fontWeight: 800, letterSpacing: 0.6, margin: followedUsers.length > 0 ? '14px 0 10px' : '0 0 10px' }}>
                    <Sparkles size={12} /> FEATURED WHOLESALERS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 16 }}>
                    {featuredDeals.map(d => (
                      <div key={d.id} style={{
                        borderRadius: 12, overflow: 'hidden',
                        background: '#131614', border: '1px solid #232925',
                      }}>
                        <Link to={dealPath(d)} style={{ textDecoration: 'none', display: 'block' }}>
                          <img src={d.images?.[0]} alt="" style={{ width: '100%', height: 64, objectFit: 'cover', display: 'block', background: '#1a1f1b' }} />
                        </Link>
                        <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: '#f8fafc', fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {d.title}
                            </div>
                            <div style={{ fontSize: 11, marginTop: 1 }}>
                              <span style={{ color: '#00c805', fontWeight: 900 }}>{fmtPrice(d.listingPrice || d.price)}</span>
                              <span style={{ color: '#707d75' }}> · {d.sellerName}</span>
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
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Chat panel ── */}
        <div style={{
          flex: 1, display: (isMobile && mobileView === 'list') ? 'none' : 'flex',
          flexDirection: 'column', overflow: 'hidden',
        }}>
          {activeConv && activeUser ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #232925', background: '#0e100e', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <button
                  onClick={() => setMobileView('list')}
                  style={{ background: 'none', border: 'none', color: '#95a29b', cursor: 'pointer', display: 'none', padding: '4px' }}
                  className="md:hidden"
                >
                  <ArrowLeft size={20} />
                </button>
                <Link to={`/profile/${activeUser.id}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flex: 1 }}>
                  <div style={{ position: 'relative' }}>
                    <img src={activeUser.avatar} alt={activeUser.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '11px', height: '11px', borderRadius: '50%', background: '#10b981', border: '2px solid #0e100e' }} />
                  </div>
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{activeUser.name}</div>
                    <div style={{ color: '#10b981', fontSize: '12px', fontWeight: 500 }}>Active now</div>
                  </div>
                </Link>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setCall({ mode: 'audio' })}
                    aria-label="Voice call"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #232925', borderRadius: '8px', padding: '7px', color: '#95a29b', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' }}
                  >
                    <Phone size={16} />
                  </button>
                  <button
                    onClick={() => setCall({ mode: 'video' })}
                    aria-label="Video call"
                    style={{ background: 'rgba(0, 200, 5, 0.10)', border: '1px solid rgba(0, 200, 5, 0.3)', borderRadius: '8px', padding: '7px', color: '#4ade80', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' }}
                  >
                    <Video size={16} />
                  </button>
                  <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #232925', borderRadius: '8px', padding: '7px', color: '#95a29b', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' }}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeMessages.length === 0 ? (
                  /* ── Engaging fresh-thread screen ── */
                  <div style={{ margin: 'auto', textAlign: 'center', maxWidth: 420, padding: '10px 16px' }}>
                    <img src={activeUser.avatar} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: '2px solid #00c805', marginBottom: 12 }} />
                    <div style={{ color: '#f8fafc', fontWeight: 900, fontSize: 19, letterSpacing: '-0.3px' }}>
                      Start the conversation with {activeUser.name.split(' ')[0]}
                    </div>
                    <div style={{ color: '#95a29b', fontSize: 13, lineHeight: 1.6, margin: '8px 0 16px' }}>
                      {activeUser.bio ? activeUser.bio.slice(0, 110) : 'Active investor on AllStreet Live.'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {suggestedOpeners(activeUser).map((s, i) => (
                        <button
                          key={i}
                          onClick={() => setMessage(s)}
                          style={{
                            padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
                            background: 'rgba(0, 200, 5, 0.07)', border: '1px solid rgba(0, 200, 5, 0.25)',
                            color: '#e4eae6', fontSize: 13, textAlign: 'left', lineHeight: 1.45,
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div style={{ color: '#707d75', fontSize: 12, marginTop: 14 }}>
                      …or check <button onClick={() => { setActiveConv(null); setMobileView('list'); }} style={{ background: 'none', border: 'none', color: '#4ade80', fontWeight: 700, cursor: 'pointer', fontSize: 12, padding: 0 }}>Featured Wholesalers</button> for more people moving deals right now.
                    </div>
                  </div>
                ) : activeMessages.map(msg => {
                  const isMe = msg.isMe;
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
                      {!isMe && (
                        <img src={activeUser.avatar} alt={activeUser.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      )}
                      <div style={{ maxWidth: '65%' }}>
                        <div className={isMe ? 'bubble-sent' : 'bubble-received'} style={{ padding: '10px 14px' }}>
                          <p style={{ color: '#f8fafc', margin: 0, fontSize: '14px', lineHeight: 1.6 }}>{msg.text}</p>
                        </div>
                        <div style={{ color: '#3e4a43', fontSize: '11px', marginTop: '3px', textAlign: isMe ? 'right' : 'left' }}>{msg.time}</div>
                      </div>
                      {isMe && (
                        <img src={currentUser.avatar || 'https://picsum.photos/seed/user1/100/100'} alt="You" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      )}
                    </div>
                  );
                })}

                {typing && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                    <img src={activeUser.avatar} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div className="bubble-received" style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#5a675f', animation: `pulse-glow 1.4s ease-in-out ${i * 0.2}s infinite` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid #232925', background: '#0e100e', display: 'flex', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[Image, Paperclip].map((Icon, i) => (
                    <button key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #232925', borderRadius: '10px', padding: '9px', color: '#95a29b', cursor: 'pointer', transition: 'all 0.2s', display: 'flex' }}>
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
                  onClick={sendMessage}
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
                <p style={{ color: '#5a675f', fontSize: '14px', marginBottom: '20px' }}>Select a conversation, or message a featured wholesaler</p>
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
