import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Heart, Send, Eye, X, Users as UsersIcon, Video as VideoIcon,
  MicOff, Mic, AlertTriangle, Radio, UserPlus, Check,
} from 'lucide-react';
import { getLiveSession } from '../data/liveTours';
import { getDealById } from '../data/deals';
import { users } from '../data/users';
import { dealPath } from '../utils/slug';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSEO } from '../hooks/useSEO';

/**
 * Live room — both sides of a tour:
 *   /live/broadcast → you're the host: your real camera streams full-bleed
 *   /live/:id       → you're a viewer on a demo session
 * Viewers comment, tap likes (floating hearts), and can request to join the
 * screen — accepted joiners appear Instagram-Live-style in a split view.
 * Comments/viewers are presence-simulated until realtime infra lands.
 */

const COMMENT_POOL = [
  { userId: 8, text: 'What are taxes running on this one?' },
  { userId: 5, text: 'That roof looks newer than I expected 👀' },
  { userId: 6, text: 'Can you show the electrical panel?' },
  { userId: 9, text: 'Numbers? ARV and asking?' },
  { userId: 10, text: '🔥🔥🔥' },
  { userId: 7, text: 'How bad is the foundation on the back side?' },
  { userId: 4, text: 'DM me the address please!' },
  { userId: 8, text: 'Is the seller flexible on the fee?' },
  { userId: 5, text: 'This street has great comps, I know the area' },
  { userId: 6, text: 'Walk the backyard if you can 🙏' },
];

const findUser = (id) => users.find(u => String(u.id) === String(id));

let heartSeq = 0;

export default function LiveRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { currentUser, isAuthenticated, requireAuth } = useAuth();
  const isMobile = useIsMobile();

  const isBroadcast = id === 'broadcast';
  const session = isBroadcast ? null : getLiveSession(id);
  const broadcastTitle = location.state?.title || 'Live property tour';
  const attachedDeal = isBroadcast
    ? (location.state?.dealId ? getDealById(location.state.dealId) : null)
    : (session?.dealId ? getDealById(session.dealId) : null);

  useSEO({
    title: isBroadcast ? 'You are LIVE' : (session ? `LIVE: ${session.title}` : 'Live tour'),
    description: 'Live real estate tour on AllStreetLive.',
  });

  const [viewers, setViewers] = useState(isBroadcast ? 1 : (session?.viewers || 0));
  const [comments, setComments] = useState([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [hearts, setHearts] = useState([]); // floating hearts {id, left}
  const [elapsed, setElapsed] = useState(isBroadcast ? 0 : (session?.startedMinutesAgo || 0) * 60);
  const [camError, setCamError] = useState('');
  const [muted, setMuted] = useState(false);
  const [joinState, setJoinState] = useState('idle'); // viewer: idle|requested|joined ; host: idle|incoming|cohost
  const [coHost, setCoHost] = useState(null); // the other tile in split view
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const commentsEndRef = useRef(null);

  // Camera: host always; viewer only once they join the screen.
  const needCamera = isBroadcast || joinState === 'joined';
  useEffect(() => {
    if (!needCamera) return;
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        if (!cancelled) {
          setCamError(err?.name === 'NotAllowedError'
            ? 'Camera access was blocked — allow it in your browser to stream.'
            : `Couldn't start the camera (${err?.name || 'error'}).`);
        }
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [needCamera]);

  // Simulated presence: viewers drift up, comments trickle in.
  useEffect(() => {
    const iv = setInterval(() => {
      setViewers(v => Math.max(1, v + Math.floor(Math.random() * 7) - 2));
      setElapsed(s => s + 4);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      const c = COMMENT_POOL[i % COMMENT_POOL.length];
      i += 1;
      setComments(prev => [...prev.slice(-40), { id: `sim-${Date.now()}`, userId: c.userId, text: c.text }]);
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  // Host: someone asks to join a bit into the stream.
  useEffect(() => {
    if (!isBroadcast) return;
    const t = setTimeout(() => {
      setJoinState(js => (js === 'idle' ? 'incoming' : js));
    }, 15000);
    return () => clearTimeout(t);
  }, [isBroadcast]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  function sendHeart() {
    const id = ++heartSeq;
    setHearts(prev => [...prev.slice(-14), { id, left: 12 + Math.random() * 60 }]);
    setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 2400);
  }

  function postComment() {
    const text = commentDraft.trim();
    if (!text) return;
    if (!isAuthenticated) { requireAuth('comment on live tours', 'live-comment', null); return; }
    setComments(prev => [...prev.slice(-40), { id: `me-${Date.now()}`, userId: currentUser?.id, text, mine: true }]);
    setCommentDraft('');
  }

  function requestToJoin() {
    if (!isAuthenticated) { requireAuth('join a live tour on camera', 'live-join', null); return; }
    setJoinState('requested');
    toast(`Request sent to ${session?.hostName}…`, 'info', 2500);
    setTimeout(() => {
      setJoinState('joined');
      toast(`${session?.hostName} brought you on screen! You're live.`, 'success', 3500);
    }, 2600);
  }

  function acceptJoin() {
    setCoHost(findUser(8) || users[3]);
    setJoinState('cohost');
  }

  function endStream() {
    navigate('/live');
  }

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  const host = isBroadcast
    ? { name: currentUser?.name || 'You', avatar: currentUser?.avatar }
    : { name: session?.hostName, avatar: session?.hostAvatar };

  if (!isBroadcast && !session) {
    return (
      <div style={{ background: '#0a0b0a', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
        <h2 style={{ color: '#f8fafc', fontWeight: 800 }}>This tour has ended</h2>
        <Link to="/live" style={{ color: '#00c805', textDecoration: 'none', fontWeight: 700 }}>← Back to Live Tours</Link>
      </div>
    );
  }

  const splitView = joinState === 'joined' || joinState === 'cohost';

  /* The "stage": host camera (broadcast) or session feed (viewer), optionally split. */
  const stage = (
    <div style={{ position: 'relative', flex: 1, minHeight: 0, background: '#060806', display: 'flex' }}>
      {/* Primary tile */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        {isBroadcast ? (
          camError ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
              <AlertTriangle size={36} style={{ color: '#f59e0b' }} />
              <div style={{ color: '#e4eae6', fontSize: 14, textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}>{camError}</div>
            </div>
          ) : (
            <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
          )
        ) : (
          <img src={session.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        {/* Host chip on the tile */}
        <div style={{
          position: 'absolute', bottom: 10, left: 10,
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: 'rgba(6,8,6,0.7)', backdropFilter: 'blur(6px)',
          borderRadius: 999, padding: '4px 12px 4px 5px',
        }}>
          <img src={host.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: '#f8fafc', fontSize: 12, fontWeight: 800 }}>{host.name}</span>
        </div>
      </div>

      {/* Split view second tile (IG-live style) */}
      {splitView && (
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden', borderLeft: '2px solid #060806' }}>
          {joinState === 'joined' ? (
            camError ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <div style={{ color: '#e4eae6', fontSize: 13, textAlign: 'center' }}>{camError}</div>
              </div>
            ) : (
              <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
            )
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#0e100e' }}>
              <img src={coHost?.avatar} alt="" style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: '3px solid #00c805' }} />
              <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 18 }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: 4, height: 16, borderRadius: 2, background: '#00c805', transformOrigin: 'bottom',
                    animation: `call-bar-live ${0.8 + i * 0.15}s ease-in-out ${i * 0.1}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div style={{
            position: 'absolute', bottom: 10, left: 10,
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(6,8,6,0.7)', backdropFilter: 'blur(6px)',
            borderRadius: 999, padding: '4px 12px 4px 5px',
          }}>
            <img src={joinState === 'joined' ? currentUser?.avatar : coHost?.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ color: '#f8fafc', fontSize: 12, fontWeight: 800 }}>
              {joinState === 'joined' ? 'You' : coHost?.name}
            </span>
          </div>
        </div>
      )}

      {/* Floating hearts */}
      {hearts.map(h => (
        <Heart
          key={h.id}
          size={26}
          fill="#ef4444"
          style={{
            position: 'absolute', bottom: 20, right: `${h.left}px`,
            color: '#ef4444', pointerEvents: 'none',
            animation: 'heart-float 2.3s ease-out forwards',
          }}
        />
      ))}

      {/* Top overlay: LIVE + viewers + timer */}
      <div style={{
        position: 'absolute', top: 10, left: 10, right: 10,
        display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none',
      }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#ef4444', color: '#fff', borderRadius: 7,
          padding: '3px 10px', fontSize: 11, fontWeight: 900, letterSpacing: 0.8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'live-pulse-room 1.4s ease-in-out infinite' }} />
          LIVE · {mmss}
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'rgba(6,8,6,0.7)', backdropFilter: 'blur(6px)',
          color: '#f8fafc', borderRadius: 7, padding: '3px 10px',
          fontSize: 11, fontWeight: 800,
        }}>
          <Eye size={12} /> {viewers.toLocaleString()}
        </span>
        {attachedDeal && (
          <Link to={dealPath(attachedDeal)} style={{
            marginLeft: 'auto', pointerEvents: 'auto',
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(0, 200, 5, 0.85)', color: '#052012', borderRadius: 7,
            padding: '3px 10px', fontSize: 11, fontWeight: 900, textDecoration: 'none',
          }}>
            View this deal →
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      background: '#0a0b0a',
      height: 'calc(100dvh - 64px)',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes heart-float {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          15% { opacity: 1; transform: translateY(-30px) scale(1.1); }
          100% { transform: translateY(-280px) scale(0.9) rotate(-12deg); opacity: 0; }
        }
        @keyframes live-pulse-room {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes call-bar-live {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}</style>

      {/* Stage + title column */}
      <div style={{ flex: isMobile ? '1 1 55%' : 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
        {stage}
        {/* Title / controls bar */}
        <div style={{
          padding: '12px 16px', borderTop: '1px solid #232925', background: '#0e100e',
          display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: 14 }} className="line-clamp-1">
              {isBroadcast ? broadcastTitle : session.title}
            </div>
            <div style={{ color: '#707d75', fontSize: 12, marginTop: 1 }}>
              {isBroadcast ? 'You are live — followers were notified' : `${session.hostName} · live now`}
            </div>
          </div>
          {isBroadcast ? (
            <>
              <button
                onClick={() => {
                  const next = !muted;
                  setMuted(next);
                  streamRef.current?.getAudioTracks().forEach(t => { t.enabled = !next; });
                }}
                aria-label={muted ? 'Unmute' : 'Mute'}
                style={{
                  width: 42, height: 42, borderRadius: 12, cursor: 'pointer',
                  background: muted ? '#f8fafc' : 'rgba(255,255,255,0.07)',
                  border: '1px solid #232925', color: muted ? '#0a0b0a' : '#f8fafc',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                {muted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                onClick={endStream}
                style={{
                  padding: '11px 18px', borderRadius: 12, cursor: 'pointer',
                  background: '#ef4444', border: 'none', color: '#fff',
                  fontWeight: 900, fontSize: 13, flexShrink: 0,
                }}
              >
                End stream
              </button>
            </>
          ) : (
            joinState === 'idle' ? (
              <button
                onClick={requestToJoin}
                className="gradient-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '11px 16px', borderRadius: 12,
                  fontWeight: 900, fontSize: 13, flexShrink: 0,
                }}
              >
                <UserPlus size={15} /> Request to join
              </button>
            ) : joinState === 'requested' ? (
              <span style={{ color: '#fbbf24', fontSize: 12.5, fontWeight: 800, flexShrink: 0 }}>Waiting for host…</span>
            ) : (
              <span style={{ color: '#4ade80', fontSize: 12.5, fontWeight: 800, flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Radio size={14} /> You're on screen
              </span>
            )
          )}
        </div>
      </div>

      {/* Comments rail */}
      <div style={{
        width: isMobile ? '100%' : 340, flexShrink: 0,
        borderLeft: isMobile ? 'none' : '1px solid #232925',
        borderTop: isMobile ? '1px solid #232925' : 'none',
        background: '#0e100e',
        display: 'flex', flexDirection: 'column',
        flex: isMobile ? '1 1 45%' : 'none',
        minHeight: 0,
      }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #232925', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <UsersIcon size={15} style={{ color: '#4ade80' }} />
          <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: 13 }}>Live chat</span>
          <span style={{ color: '#707d75', fontSize: 12 }}>· {viewers.toLocaleString()} watching</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          {comments.map(c => {
            const u = c.mine ? currentUser : findUser(c.userId);
            return (
              <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <img src={u?.avatar} alt="" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <span style={{ color: c.mine ? '#4ade80' : '#95a29b', fontSize: 11.5, fontWeight: 800 }}>
                    {c.mine ? 'You' : u?.name}
                  </span>
                  <div style={{ color: '#e4eae6', fontSize: 13, lineHeight: 1.45, wordBreak: 'break-word' }}>{c.text}</div>
                </div>
              </div>
            );
          })}
          <div ref={commentsEndRef} />
        </div>

        {/* Host: incoming join request */}
        {isBroadcast && joinState === 'incoming' && (
          <div style={{
            margin: '0 12px 10px', padding: '10px 12px', borderRadius: 12, flexShrink: 0,
            background: 'rgba(0, 200, 5, 0.10)', border: '1px solid rgba(0, 200, 5, 0.35)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <img src={findUser(8)?.avatar} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#f8fafc', fontSize: 12.5, fontWeight: 800 }}>{findUser(8)?.name}</div>
              <div style={{ color: '#95a29b', fontSize: 11.5 }}>wants to join your screen</div>
            </div>
            <button onClick={acceptJoin} className="gradient-btn" style={{ padding: '7px 12px', borderRadius: 9, fontWeight: 900, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Check size={13} /> Accept
            </button>
            <button onClick={() => setJoinState('idle')} style={{ padding: 7, borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid #232925', color: '#95a29b', cursor: 'pointer', display: 'flex' }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Composer + like */}
        <div style={{ padding: '10px 12px calc(10px + env(safe-area-inset-bottom))', borderTop: '1px solid #232925', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <input
            value={commentDraft}
            onChange={e => setCommentDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') postComment(); }}
            placeholder="Say something…"
            className="input-dark"
            style={{ flex: 1, padding: '10px 14px', borderRadius: 999, fontSize: 13 }}
          />
          <button
            onClick={postComment}
            className="gradient-btn"
            style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            aria-label="Send comment"
          >
            <Send size={15} />
          </button>
          <button
            onClick={sendHeart}
            aria-label="Send a like"
            style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)',
              color: '#ef4444', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Heart size={17} fill="#ef4444" />
          </button>
        </div>
      </div>
    </div>
  );
}
