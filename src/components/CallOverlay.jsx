import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, AlertTriangle } from 'lucide-react';

/**
 * In-app call screen (video or voice). Uses the device's real camera and
 * microphone via getUserMedia — works in any modern browser over HTTPS,
 * desktop and mobile. The far side is presence-simulated until realtime
 * infrastructure (WebRTC signaling) is wired to a backend: the callee's
 * avatar "rings" then connects, while your own audio/video is fully live.
 */
export default function CallOverlay({ user, mode = 'video', onClose }) {
  const [phase, setPhase] = useState('starting'); // starting | ringing | connected | error
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(mode !== 'video');
  const [elapsed, setElapsed] = useState(0);
  const [errMsg, setErrMsg] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Acquire camera/mic
  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: mode === 'video' ? { facingMode: 'user' } : false,
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current && mode === 'video') {
          videoRef.current.srcObject = stream;
        }
        setPhase('ringing');
      } catch (err) {
        if (!cancelled) {
          setErrMsg(err?.name === 'NotAllowedError'
            ? 'Camera/mic permission was blocked. Allow access in your browser and try again.'
            : `Couldn't start your ${mode === 'video' ? 'camera' : 'microphone'} (${err?.name || 'unknown error'}).`);
          setPhase('error');
        }
      }
    }
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [mode]);

  // Ring → connect
  useEffect(() => {
    if (phase !== 'ringing') return;
    const t = setTimeout(() => setPhase('connected'), 2600);
    return () => clearTimeout(t);
  }, [phase]);

  // Call timer
  useEffect(() => {
    if (phase !== 'connected') return;
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    streamRef.current?.getAudioTracks().forEach(t => { t.enabled = !next; });
  }

  function toggleCam() {
    const next = !camOff;
    setCamOff(next);
    streamRef.current?.getVideoTracks().forEach(t => { t.enabled = !next; });
  }

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: '#060806',
      display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @keyframes call-ring {
          0% { box-shadow: 0 0 0 0 rgba(0, 200, 5, 0.45); }
          100% { box-shadow: 0 0 0 26px rgba(0, 200, 5, 0); }
        }
        @keyframes call-bar {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
      `}</style>

      {/* Remote side (avatar + status until realtime is wired) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 20 }}>
        {phase === 'error' ? (
          <>
            <AlertTriangle size={40} style={{ color: '#f59e0b' }} />
            <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: 18, textAlign: 'center' }}>Can't start the call</div>
            <div style={{ color: '#95a29b', fontSize: 14, textAlign: 'center', maxWidth: 380, lineHeight: 1.6 }}>{errMsg}</div>
          </>
        ) : (
          <>
            <div style={{ position: 'relative' }}>
              <img
                src={user?.avatar}
                alt={user?.name}
                style={{
                  width: 128, height: 128, borderRadius: '50%', objectFit: 'cover',
                  border: '3px solid #00c805',
                  animation: phase === 'ringing' ? 'call-ring 1.6s ease-out infinite' : 'none',
                }}
              />
              {phase === 'connected' && (
                <div style={{
                  position: 'absolute', bottom: 2, right: 6, width: 20, height: 20,
                  borderRadius: '50%', background: '#00c805', border: '3px solid #060806',
                }} />
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#f8fafc', fontWeight: 900, fontSize: 22, letterSpacing: '-0.3px' }}>{user?.name}</div>
              <div style={{ color: phase === 'connected' ? '#4ade80' : '#95a29b', fontSize: 14, fontWeight: 700, marginTop: 6 }}>
                {phase === 'connected' ? mmss : phase === 'ringing' ? 'Ringing…' : 'Starting…'}
              </div>
            </div>
            {phase === 'connected' && (
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 26 }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} style={{
                    width: 5, height: 24, borderRadius: 3, background: '#00c805',
                    transformOrigin: 'bottom',
                    animation: `call-bar ${0.9 + i * 0.13}s ease-in-out ${i * 0.1}s infinite`,
                  }} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Your live camera (PiP) */}
      {mode === 'video' && phase !== 'error' && (
        <div style={{
          position: 'absolute', right: 16, bottom: 120,
          width: 'min(34vw, 190px)', aspectRatio: '3 / 4',
          borderRadius: 16, overflow: 'hidden',
          border: '2px solid #232925', background: '#0e100e',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        }}>
          <video
            ref={videoRef}
            autoPlay muted playsInline
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: 'scaleX(-1)',
              display: camOff ? 'none' : 'block',
            }}
          />
          {camOff && (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <VideoOff size={22} style={{ color: '#5a675f' }} />
            </div>
          )}
          <div style={{
            position: 'absolute', bottom: 6, left: 8,
            color: '#e4eae6', fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          }}>
            YOU
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{
        padding: '18px 20px calc(22px + env(safe-area-inset-bottom))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        background: 'linear-gradient(to top, rgba(6,8,6,0.95), transparent)',
      }}>
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          style={{
            width: 56, height: 56, borderRadius: '50%', cursor: 'pointer',
            background: muted ? '#f8fafc' : 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.14)',
            color: muted ? '#0a0b0a' : '#f8fafc',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {muted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>
        {mode === 'video' && (
          <button
            onClick={toggleCam}
            aria-label={camOff ? 'Turn camera on' : 'Turn camera off'}
            style={{
              width: 56, height: 56, borderRadius: '50%', cursor: 'pointer',
              background: camOff ? '#f8fafc' : 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: camOff ? '#0a0b0a' : '#f8fafc',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {camOff ? <VideoOff size={22} /> : <VideoIcon size={22} />}
          </button>
        )}
        <button
          onClick={onClose}
          aria-label="End call"
          style={{
            width: 68, height: 56, borderRadius: 28, cursor: 'pointer',
            background: '#ef4444', border: 'none', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 26px rgba(239,68,68,0.45)',
          }}
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>,
    document.body
  );
}
