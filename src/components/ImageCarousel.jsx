import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageCarousel({ images = [], youtubeId, height = 480 }) {
  const slides = [
    ...images.map(src => ({ type: 'image', src })),
    ...(youtubeId ? [{ type: 'youtube', id: youtubeId }] : []),
  ];
  const [idx, setIdx] = useState(0);

  if (slides.length === 0) return null;

  const prev = () => setIdx(i => (i > 0 ? i - 1 : slides.length - 1));
  const next = () => setIdx(i => (i < slides.length - 1 ? i + 1 : 0));

  const current = slides[idx];

  return (
    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#12121e' }}>
      <div style={{ width: '100%', height: `${height}px`, background: '#000' }}>
        {current.type === 'image' ? (
          <img src={current.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

          {/* Dots */}
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
                  background: i === idx ? '#8b5cf6' : 'rgba(255,255,255,0.4)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
