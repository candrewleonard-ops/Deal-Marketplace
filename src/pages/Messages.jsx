import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Send, Image, Paperclip, MoreVertical, Phone, Video, ArrowLeft, Crown, Plus, X, Check } from 'lucide-react';
import { users } from '../data/users';
import { useAuth } from '../context/AuthContext';
import UserHoverCard from '../components/UserHoverCard';

const conversations = [
  { id: 1, userId: 2, lastMessage: "Hey! I saw your deal in Atlanta - very interested. What's the closing timeline?", time: '2m ago', unread: 3 },
  { id: 2, userId: 4, lastMessage: 'The subject-to deal I mentioned is still available. Can we hop on a call?', time: '15m ago', unread: 1 },
  { id: 3, userId: 7, lastMessage: 'Sent you the comps for the KC deal. Let me know what you think.', time: '1h ago', unread: 0 },
  { id: 4, userId: 5, lastMessage: "Thanks for connecting! Memphis is on fire right now. I'll have 3 new deals next week.", time: '3h ago', unread: 0 },
  { id: 5, userId: 8, lastMessage: 'Can you add me to your buyers list? Cash buyer, can close in 7 days.', time: '1d ago', unread: 0 },
  { id: 6, userId: 9, lastMessage: 'Great meeting you at the Jacksonville meetup! Congrats on the deal.', time: '2d ago', unread: 0 },
];

const initialMessageHistory = {
  1: [
    { id: 1, from: 2, text: "Hey Marcus! I saw your Atlanta deal on TREIM.", time: '10:32 AM', type: 'text' },
    { id: 2, from: 1, text: "Hey Diana! Yes, great deal - 3/2 brick ranch, ARV $320k. Can close in 10 days.", time: '10:35 AM', type: 'text' },
    { id: 3, from: 2, text: "Very interested! Is the assignment fee negotiable?", time: '10:36 AM', type: 'text' },
    { id: 4, from: 1, text: "It's firm at $25k - we have another buyer interested and the numbers are solid. ARV supported by 3 comps.", time: '10:40 AM', type: 'text' },
    { id: 5, from: 2, text: "Understood. Can you send me the inspection report and the comps? I'll have my partner review tonight.", time: '10:41 AM', type: 'text' },
    { id: 6, from: 1, text: "Absolutely! Sending the due diligence package now. Full comps, inspection report, title search.", time: '10:45 AM', type: 'text' },
    { id: 7, from: 2, text: "Hey! I saw your deal in Atlanta - very interested. What's the closing timeline?", time: '11:02 AM', type: 'text' },
  ],
  2: [
    { id: 1, from: 4, text: "Marcus! The Houston subject-to deal is still available. 3.25% rate locked in.", time: 'Yesterday', type: 'text' },
    { id: 2, from: 1, text: "Sarah I know, I'm seriously considering it. What's the existing loan balance?", time: 'Yesterday', type: 'text' },
    { id: 3, from: 4, text: "$85k at 3.25%. House will appraise at $220k. You're picking up $135k in equity day 1.", time: 'Yesterday', type: 'text' },
    { id: 4, from: 4, text: 'The subject-to deal I mentioned is still available. Can we hop on a call?', time: 'Today', type: 'text' },
  ],
};

const messageRequests = [
  { id: 101, userId: 6, lastMessage: 'Hi! Would love to connect about Indy market deals.', time: '4h ago' },
  { id: 102, userId: 10, lastMessage: 'Are you doing STR deals? I have a lead.', time: '1d ago' },
  { id: 103, userId: 9, lastMessage: 'Hey, interested in lending on your next flip!', time: '2d ago' },
];

const DM_LIMITS = { Basic: 5, VIP: 30, 'VIP Max': 100 };

export default function Messages() {
  const { currentUser } = useAuth();
  const [activeConv, setActiveConv] = useState(null);
  const [message, setMessage] = useState('');
  const [inboxTab, setInboxTab] = useState('inbox');
  const [requestSort, setRequestSort] = useState('recent');
  const [searchVal, setSearchVal] = useState('');
  const [messages, setMessages] = useState(initialMessageHistory);
  const [typing, setTyping] = useState(false);
  const [mobileView, setMobileView] = useState('list');
  const [requests, setRequests] = useState(messageRequests);
  const [acceptedRequests, setAcceptedRequests] = useState({});
  const messagesEndRef = useRef(null);

  const dmLimit = DM_LIMITS[currentUser?.accountTier] || 5;
  const dmsUsed = 2;

  const activeUser = activeConv ? users.find(u => u.id === activeConv.userId) : null;
  const activeMessages = activeConv ? (messages[activeConv.id] || []) : [];

  const filteredConvs = conversations.filter(c => {
    if (!searchVal) return true;
    const u = users.find(u => u.id === c.userId);
    return u?.name.toLowerCase().includes(searchVal.toLowerCase());
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, typing]);

  function sendMessage() {
    if (!message.trim() || !activeConv) return;
    const newMsg = { id: Date.now(), from: 1, text: message, time: 'Now', type: 'text' };
    setMessages(prev => ({
      ...prev,
      [activeConv.id]: [...(prev[activeConv.id] || []), newMsg],
    }));
    setMessage('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = { id: Date.now() + 1, from: activeConv.userId, text: 'Got it! I\'ll take a look and get back to you shortly.', time: 'Now', type: 'text' };
      setMessages(prev => ({
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
    const newConv = { id: req.id, userId: req.userId, lastMessage: req.lastMessage, time: req.time, unread: 1 };
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

  return (
    <div style={{ background: '#0a0a0f', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* VIP upsell banner */}
      {currentUser?.accountTier === 'Basic' && (
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))', borderBottom: '1px solid rgba(139,92,246,0.2)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexShrink: 0 }}>
          <span style={{ color: '#e2e8f0', fontSize: '13px' }}>
            📣 Need to reach more buyers? <strong>Upgrade to VIP Max</strong> for 100 DMs/day
          </span>
          <Link to="/premium" style={{ padding: '6px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', color: '#fff', fontWeight: 700, fontSize: '12px', textDecoration: 'none', flexShrink: 0 }}>
            Upgrade
          </Link>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Conversation List */}
        <div style={{
          width: '340px', flexShrink: 0,
          background: '#0d0d1a', borderRight: '1px solid #1e1e2e',
          display: 'flex', flexDirection: 'column',
          ...(mobileView === 'chat' ? { display: 'none' } : {}),
        }} className="hidden md:flex flex-col">
          {/* Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid #1e1e2e', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', margin: 0 }}>Messages</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }}>
                  <strong style={{ color: '#8b5cf6' }}>{dmsUsed}/{dmLimit}</strong> DMs
                </div>
                <button style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#8b5cf6', display: 'flex' }}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
              <button onClick={() => setInboxTab('inbox')} style={{ padding: '5px 12px', borderRadius: '16px', background: inboxTab === 'inbox' ? 'rgba(139, 92, 246, 0.2)' : 'transparent', border: `1px solid ${inboxTab === 'inbox' ? '#8b5cf6' : '#1e1e2e'}`, color: inboxTab === 'inbox' ? '#8b5cf6' : '#94a3b8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Inbox</button>
              <button onClick={() => setInboxTab('requests')} style={{ padding: '5px 12px', borderRadius: '16px', background: inboxTab === 'requests' ? 'rgba(139, 92, 246, 0.2)' : 'transparent', border: `1px solid ${inboxTab === 'requests' ? '#8b5cf6' : '#1e1e2e'}`, color: inboxTab === 'requests' ? '#8b5cf6' : '#94a3b8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                Requests {requests.length > 0 && `(${requests.length})`}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search conversations..."
                className="input-dark"
                style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '10px', fontSize: '13px' }}
              />
            </div>
            {inboxTab === 'requests' && (
              <div style={{ marginTop: '8px' }}>
                <select value={requestSort} onChange={e => setRequestSort(e.target.value)} className="input-dark" style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
                  <option value="recent">Sort: Most Recent</option>
                  <option value="vip">Sort: VIP Status First</option>
                </select>
              </div>
            )}
          </div>

          {/* Convs */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {inboxTab === 'requests' ? (
              requests.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
                  No pending message requests
                </div>
              ) : [...requests].sort((a, b) => {
                if (requestSort === 'vip') {
                  const tierRank = { 'VIP Max': 3, 'VIP': 2, 'Basic': 1 };
                  const ua = users.find(u => u.id === a.userId);
                  const ub = users.find(u => u.id === b.userId);
                  return (tierRank[ub?.accountTier] || 1) - (tierRank[ua?.accountTier] || 1);
                }
                return 0;
              }).map(req => {
                const u = users.find(u => u.id === req.userId);
                const tier = u?.accountTier || 'Basic';
                return (
                  <div key={req.id} style={{ padding: '12px 14px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: '10px' }}>
                    <img src={u?.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 700 }}>{u?.name}</span>
                        {tier === 'VIP Max' && <Crown size={11} style={{ color: '#f59e0b' }} />}
                        {tier === 'VIP' && <Crown size={11} style={{ color: '#8b5cf6' }} />}
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.lastMessage}</p>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleAcceptRequest(req)} style={{ padding: '3px 10px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', border: 'none', color: '#fff', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>Accept</button>
                        <button onClick={() => handleDeclineRequest(req.id)} style={{ padding: '3px 10px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>Decline</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : allConvs.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
                No conversations yet. Start connecting with investors!
              </div>
            ) : allConvs.map(conv => {
              const user = users.find(u => u.id === conv.userId);
              const isActive = activeConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => { setActiveConv(conv); setMobileView('chat'); }}
                  style={{
                    display: 'flex', gap: '12px', padding: '12px 14px',
                    cursor: 'pointer', transition: 'background 0.15s',
                    background: isActive ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                    borderLeft: isActive ? '3px solid #8b5cf6' : '3px solid transparent',
                  }}
                >
                  <UserHoverCard user={user}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={user?.avatar} alt={user?.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: '0', right: '0', width: '11px', height: '11px', borderRadius: '50%', background: '#10b981', border: '2px solid #0d0d1a' }} />
                    </div>
                  </UserHoverCard>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                      <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>{user?.name}</span>
                      <span style={{ color: '#334155', fontSize: '11px', flexShrink: 0 }}>{conv.time}</span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <div style={{ minWidth: '18px', height: '18px', borderRadius: '50%', background: '#8b5cf6', color: '#fff', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center', padding: '0 4px' }}>
                      {conv.unread}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeConv && activeUser ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e1e2e', background: '#0d0d1a', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <button
                  onClick={() => setMobileView('list')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'none', padding: '4px' }}
                  className="md:hidden"
                >
                  <ArrowLeft size={20} />
                </button>
                <Link to={`/profile/${activeUser.id}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flex: 1 }}>
                  <div style={{ position: 'relative' }}>
                    <img src={activeUser.avatar} alt={activeUser.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '11px', height: '11px', borderRadius: '50%', background: '#10b981', border: '2px solid #0d0d1a' }} />
                  </div>
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{activeUser.name}</div>
                    <div style={{ color: '#10b981', fontSize: '12px', fontWeight: 500 }}>Active now</div>
                  </div>
                </Link>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[Phone, Video, MoreVertical].map((Icon, i) => (
                    <button key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', borderRadius: '8px', padding: '7px', color: '#94a3b8', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' }}>
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeMessages.map(msg => {
                  const isMe = msg.from === 1;
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
                      {!isMe && (
                        <img src={activeUser.avatar} alt={activeUser.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      )}
                      <div style={{ maxWidth: '65%' }}>
                        <div className={isMe ? 'bubble-sent' : 'bubble-received'} style={{ padding: '10px 14px' }}>
                          <p style={{ color: '#f8fafc', margin: 0, fontSize: '14px', lineHeight: 1.6 }}>{msg.text}</p>
                        </div>
                        <div style={{ color: '#334155', fontSize: '11px', marginTop: '3px', textAlign: isMe ? 'right' : 'left' }}>{msg.time}</div>
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
                          <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#475569', animation: `pulse-glow 1.4s ease-in-out ${i * 0.2}s infinite` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid #1e1e2e', background: '#0d0d1a', display: 'flex', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[Image, Paperclip].map((Icon, i) => (
                    <button key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', borderRadius: '10px', padding: '9px', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s', display: 'flex' }}>
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
                  <Send size={16} style={{ color: '#fff' }} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#475569', gap: '16px', padding: '40px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={36} style={{ color: '#8b5cf6' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px', fontSize: '18px' }}>Your Messages</h3>
                <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px' }}>Select a conversation to start chatting</p>
                <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.07))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', padding: '16px 20px', maxWidth: '320px' }}>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 10px' }}>
                    <strong style={{ color: '#f8fafc' }}>Pro tip:</strong> VIP Max members get 100 DMs/day — close more deals by reaching more buyers.
                  </p>
                  <Link to="/premium" style={{ color: '#8b5cf6', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Learn about VIP Max →</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
