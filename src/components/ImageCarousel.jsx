import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export default function ImageCarousel({ images = [], youtubeId, height = 480 }) {
  const slides = [
    ...images.map(src => ({ type: 'image', src })),
    ...(youtubeId ? [{ type: 'youtube', id: youtubeId }] : []),
  ];
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (slides.length === 0) return null;

  const prev = () => setIdx(i => (i > 0 ? i - 1 : slides.length - 1));
  const next = () => setIdx(i => (i < slides.length - 1 ? i + 1 : 0));
  const current = slides[idx];

  return (
    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#131614' }}>
      <div style={{ width: '100%', height: `${height}px`, background: '#000', position: 'relative' }}>
        {current.type === 'image' ? (
          <>
            <img
              src={current.src}
              alt=""
              onClick={() => setLightbox(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
            />
            <button
              onClick={() => setLightbox(true)}
              aria-label="Expand photo"
              style={{
                position: 'absolute', top: 12, right: 12,
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Maximize2 size={15} />
            </button>
          </>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${current.id}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
            title="Video tour"
          />
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
              width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', backdropFilter: 'blur(8px)',
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            style={{
              position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
              width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', backdropFilter: 'blur(8px)',
            }}
          >
            <ChevronRight size={20} />
          </button>

          <div style={{
            position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '8px',
            background: 'rgba(0,0,0,0.5)', borderRadius: '20px', padding: '6px 12px',
            backdropFilter: 'blur(8px)',
          }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? '20px' : '8px', height: '8px', borderRadius: '4px',
                  background: i === idx ? '#00c805' : 'rgba(255,255,255,0.4)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}

      {lightbox && current.type === 'image' && typeof document !== 'undefined' && createPortal(
        <Lightbox
          slides={slides}
          idx={idx}
          setIdx={setIdx}
          onClose={() => setLightbox(false)}
        />,
        document.body
      )}
    </div>
  );
}

function Lightbox({ slides, idx, setIdx, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx(i => (i > 0 ? i - 1 : slides.length - 1));
      if (e.key === 'ArrowRight') setIdx(i => (i < slides.length - 1 ? i + 1 : 0));
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, setIdx, slides.length]);

  const imageSlides = slides.filter(s => s.type === 'image');
  const current = slides[idx];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 650,
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: '14px 16px', paddingTop: 'calc(14px + env(safe-area-inset-top))',
          display: 'flex', alignItems: 'center', gap: 12,
          color: '#fff',
        }}
      >
        <div style={{ flex: 1, fontSize: 13, color: '#95a29b' }}>
          {idx + 1} / {imageSlides.length}
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 16px 24px',
        }}
      >
        {current.type === 'image' && (
          <img
            src={current.src}
            alt=""
            style={{
              maxWidth: '100%', maxHeight: '100%',
              borderRadius: 8,
              boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
              objectFit: 'contain',
            }}
          />
        )}

        {slides.length > 1 && (
          <>
            <button
              onClick={() => setIdx(i => (i > 0 ? i - 1 : slides.length - 1))}
              aria-label="Previous"
              style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => setIdx(i => (i < slides.length - 1 ? i + 1 : 0))}
              aria-label="Next"
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
