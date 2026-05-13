import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  GraduationCap, Hammer, Home, Megaphone, TrendingUp, Globe2,
  CheckCircle2, ExternalLink, Phone, Star, MapPin, PlayCircle,
  ArrowRight, Search, ChevronRight,
} from 'lucide-react';
import { sections, sectionOrder } from '../data/howToArticles';
import { lenders } from '../data/lenders';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSEO } from '../hooks/useSEO';
import CyclingText from '../components/CyclingText';

const SECTION_META = {
  flippers:    { icon: Hammer,    color: '#ef4444' },
  landlords:   { icon: Home,      color: '#10b981' },
  wholesalers: { icon: Megaphone, color: '#8b5cf6' },
  lenders:     { icon: GraduationCap, color: '#f59e0b' },
  expand:      { icon: TrendingUp, color: '#f59e0b' },
  remote:      { icon: Globe2,    color: '#06b6d4' },
};

const SECTION_LABEL = {
  flippers:    'For Flippers',
  landlords:   'For Landlords',
  wholesalers: 'For Wholesalers',
  lenders:     'Verified Lenders',
  expand:      'Expand Your Business',
  remote:      'Remote Rehab',
};

export default function HowTo() {
  useSEO({
    title: 'How To — Real Estate Investor Education',
    description: 'Step-by-step playbooks for flippers, landlords, wholesalers, and creative financiers. Plus a directory of vetted hard-money lenders.',
  });
  const isMobile = useIsMobile();
  const [params, setParams] = useSearchParams();
  const activeId = sectionOrder.includes(params.get('s')) ? params.get('s') : 'flippers';

  function setActive(id) {
    setParams(p => { p.set('s', id); return p; }, { replace: true });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      <Hero isMobile={isMobile} />

      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? '20px 14px 40px' : '32px 24px 60px',
        display: isMobile ? 'block' : 'grid',
        gridTemplateColumns: isMobile ? undefined : '240px 1fr',
        gap: isMobile ? 0 : 32,
      }}>
        {/* Sub-tabs — sidebar on desktop, horizontal scroll on mobile */}
        <SectionNav active={activeId} onChange={setActive} isMobile={isMobile} />

        <div style={{ minWidth: 0 }}>
          {activeId === 'lenders'
            ? <LenderDirectory isMobile={isMobile} />
            : <ArticleSection
                section={sections[activeId]}
                isMobile={isMobile}
              />
          }
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Hero with cycling text
// ───────────────────────────────────────────────────────────────────────
function Hero({ isMobile }) {
  return (
    <div style={{
      background: 'radial-gradient(circle at 20% 0%, rgba(139,92,246,0.18), transparent 50%), radial-gradient(circle at 80% 100%, rgba(6,182,212,0.14), transparent 50%), #0d0d1a',
      borderBottom: '1px solid #1e1e2e',
      padding: isMobile ? '36px 16px 32px' : '56px 24px 48px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 999,
          background: 'rgba(139,92,246,0.12)',
          border: '1px solid rgba(139,92,246,0.3)',
          marginBottom: 16,
          color: '#a78bfa', fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
        }}>
          <GraduationCap size={13} /> REI EDUCATION HUB
        </div>

        <h1 style={{
          color: '#f8fafc', fontWeight: 900, margin: 0,
          fontSize: isMobile ? 32 : 52,
          lineHeight: 1.05, letterSpacing: '-1.5px',
        }}>
          How to{' '}
          <span style={{
            background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            <CyclingText
              phrases={[
                'Buy Fix n Flips',
                'Buy Rentals',
                'With No Credit',
                'Get More Deals',
                'Wholesale',
                'Find Wholesale Deals',
              ]}
              interval={3000}
            />
          </span>
        </h1>

        <p style={{
          color: '#94a3b8', fontSize: isMobile ? 14 : 17,
          maxWidth: 640, margin: '14px auto 0', lineHeight: 1.6,
        }}>
          Step-by-step playbooks, vetted lenders, and video walkthroughs from operators actually doing deals.
        </p>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Section nav (sidebar on desktop, horizontal scroll on mobile)
// ───────────────────────────────────────────────────────────────────────
function SectionNav({ active, onChange, isMobile }) {
  if (isMobile) {
    return (
      <div style={{
        margin: '0 -14px 18px',
        padding: '0 14px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
          {sectionOrder.map(id => {
            const meta = SECTION_META[id];
            const Icon = meta.icon;
            const isActive = id === active;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 14px', borderRadius: 999,
                  background: isActive
                    ? `linear-gradient(135deg, ${meta.color}, ${meta.color}aa)`
                    : '#12121e',
                  border: isActive ? 'none' : '1px solid #1e1e2e',
                  color: isActive ? '#fff' : '#94a3b8',
                  fontWeight: 700, fontSize: 13,
                  flexShrink: 0,
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <Icon size={14} /> {SECTION_LABEL[id]}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <aside style={{
      position: 'sticky', top: 80,
      alignSelf: 'start',
      background: '#12121e',
      border: '1px solid #1e1e2e',
      borderRadius: 14,
      padding: 8,
    }}>
      {sectionOrder.map(id => {
        const meta = SECTION_META[id];
        const Icon = meta.icon;
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 12px', borderRadius: 10,
              background: isActive ? `${meta.color}15` : 'transparent',
              border: 'none',
              color: isActive ? meta.color : '#94a3b8',
              fontWeight: 700, fontSize: 14, textAlign: 'left',
              cursor: 'pointer', transition: 'background 0.15s',
              marginBottom: 2,
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon size={16} /> {SECTION_LABEL[id]}
            {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
          </button>
        );
      })}
    </aside>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Article section (flippers, landlords, wholesalers, expand, remote)
// ───────────────────────────────────────────────────────────────────────
function ArticleSection({ section, isMobile }) {
  const [openSlug, setOpenSlug] = useState(null);
  const meta = SECTION_META[section.id];
  const Icon = meta.icon;

  return (
    <div>
      {/* Section header */}
      <div style={{
        background: '#12121e', border: '1px solid #1e1e2e', borderRadius: 14,
        padding: isMobile ? '18px' : '24px 28px',
        display: 'flex', alignItems: 'center', gap: 14,
        marginBottom: 18,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: `${meta.color}18`, border: `1px solid ${meta.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={22} style={{ color: meta.color }} />
        </div>
        <div>
          <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: isMobile ? 20 : 24, margin: 0 }}>
            {section.label}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '2px 0 0', lineHeight: 1.5 }}>
            {section.blurb}
          </p>
        </div>
      </div>

      {/* Articles list */}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
        {section.articles.map(article => (
          <ArticleCard
            key={article.slug}
            article={article}
            color={meta.color}
            open={openSlug === article.slug}
            onToggle={() => setOpenSlug(openSlug === article.slug ? null : article.slug)}
          />
        ))}
      </div>

      {/* YouTube video section */}
      <VideoSection videos={section.videos} color={meta.color} isMobile={isMobile} />
    </div>
  );
}

function ArticleCard({ article, color, open, onToggle }) {
  return (
    <div style={{
      background: '#12121e', border: `1px solid ${open ? color : '#1e1e2e'}`,
      borderRadius: 14, overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          width: '100%', padding: '16px 18px',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            color: '#f8fafc', fontWeight: 800, fontSize: 15, margin: 0,
            lineHeight: 1.35,
          }}>
            {article.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{
              padding: '2px 8px', borderRadius: 999,
              background: `${color}15`, color, fontSize: 10, fontWeight: 800, letterSpacing: 0.4,
            }}>
              {article.readTime?.toUpperCase()}
            </span>
            <span style={{ color: '#64748b', fontSize: 12 }}>
              {article.sections?.length || 0} sections
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '10px 0 0', lineHeight: 1.55 }}>
            {article.summary}
          </p>
        </div>
        <ArrowRight
          size={18}
          style={{
            color: open ? color : '#475569',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s, color 0.2s',
            flexShrink: 0,
          }}
        />
      </button>

      {open && (
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid #1e1e2e' }}>
          {article.sections?.map((s, i) => (
            <div key={i} style={{ marginTop: 16 }}>
              <h4 style={{
                color: '#f8fafc', fontWeight: 800, fontSize: 13,
                margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 0.6,
              }}>
                {s.heading}
              </h4>
              <p style={{
                color: '#cbd5e1', fontSize: 14, lineHeight: 1.7,
                margin: 0, whiteSpace: 'pre-wrap',
              }}>
                {s.body}
              </p>
            </div>
          ))}

          <div style={{
            marginTop: 18, padding: '10px 12px', borderRadius: 8,
            background: 'rgba(255,255,255,0.03)', border: '1px dashed #1e1e2e',
            color: '#64748b', fontSize: 11, lineHeight: 1.5,
          }}>
            <strong style={{ color: '#94a3b8' }}>Template</strong> — replace the placeholder copy by editing
            <code style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', padding: '1px 5px', borderRadius: 4, margin: '0 4px', fontSize: 11 }}>
              src/data/howToArticles.js
            </code>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// YouTube video embeds
// ───────────────────────────────────────────────────────────────────────
function VideoSection({ videos = [], color, isMobile }) {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 14,
      }}>
        <PlayCircle size={20} style={{ color: '#ef4444' }} />
        <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 18, margin: 0 }}>
          Video Walkthroughs
        </h3>
      </div>

      {videos.length === 0 ? (
        <div style={{
          background: '#12121e', border: '1px dashed #1e1e2e',
          borderRadius: 14, padding: '28px 20px', textAlign: 'center',
        }}>
          <PlayCircle size={28} style={{ color: '#475569', marginBottom: 10 }} />
          <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: 15, margin: '0 0 6px' }}>
            Add YouTube videos
          </h4>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 auto', maxWidth: 420, lineHeight: 1.6 }}>
            Drop video IDs into the <code style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>videos</code> array for this section in
            <code style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', padding: '1px 5px', borderRadius: 4, margin: '0 4px', fontSize: 12 }}>
              howToArticles.js
            </code>
            and they'll embed here.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid', gap: 14,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        }}>
          {videos.map((v, i) => (
            <div key={i} style={{
              background: '#12121e', border: '1px solid #1e1e2e',
              borderRadius: 14, overflow: 'hidden',
            }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${v.youtubeId}`}
                  title={v.title || 'Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none',
                  }}
                />
              </div>
              {v.title && (
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 14 }}>{v.title}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Lender directory
// ───────────────────────────────────────────────────────────────────────
function LenderDirectory({ isMobile }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return lenders;
    return lenders.filter(l =>
      l.name.toLowerCase().includes(t) ||
      l.loanTypes.some(lt => lt.toLowerCase().includes(t)) ||
      l.states.toLowerCase().includes(t)
    );
  }, [q]);

  return (
    <div>
      <div style={{
        background: '#12121e', border: '1px solid #1e1e2e', borderRadius: 14,
        padding: isMobile ? '18px' : '24px 28px',
        marginBottom: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <CheckCircle2 size={22} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: isMobile ? 20 : 24, margin: 0 }}>
              Verified Lenders
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: '2px 0 0', lineHeight: 1.5 }}>
              Hard-money, fix & flip, DSCR, and bridge lenders that fund deals across the US.
            </p>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: '#475569' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, loan type, or state…"
            style={{
              width: '100%', padding: '10px 14px 10px 36px', borderRadius: 10,
              background: '#0d0d1a', border: '1px solid #1e1e2e',
              color: '#f8fafc', fontSize: 14, outline: 'none',
            }}
          />
        </div>
      </div>

      <div style={{
        display: 'grid', gap: 12,
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      }}>
        {filtered.map(l => <LenderCard key={l.id} lender={l} />)}
      </div>

      <div style={{
        marginTop: 22, padding: '12px 14px', borderRadius: 10,
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
        color: '#fbbf24', fontSize: 12, lineHeight: 1.6,
      }}>
        <strong>Disclaimer.</strong> Verify rates, terms, and licensing in your state before applying.
        Ratings and phone numbers are publicly listed at the time of writing and can change.
      </div>
    </div>
  );
}

function LenderCard({ lender }) {
  return (
    <div style={{
      background: '#12121e', border: `1px solid ${lender.featured ? 'rgba(245,158,11,0.35)' : '#1e1e2e'}`,
      borderRadius: 14, padding: 18,
      display: 'flex', flexDirection: 'column', gap: 12,
      position: 'relative',
    }}>
      {lender.featured && (
        <span style={{
          position: 'absolute', top: -10, right: 14,
          padding: '3px 10px', borderRadius: 999,
          background: 'linear-gradient(135deg, #f59e0b, #fb923c)',
          color: '#1a1a2e', fontSize: 10, fontWeight: 900, letterSpacing: 0.6,
        }}>
          FEATURED
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(251,146,60,0.15))',
          border: '1px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#f59e0b', fontWeight: 900, fontSize: 16,
          flexShrink: 0,
        }}>
          {lender.name.slice(0, 1)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 16, margin: 0 }}>
            {lender.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <Star size={13} fill="#f59e0b" style={{ color: '#f59e0b' }} />
            <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: 13 }}>
              {lender.googleRating.toFixed(1)}
            </span>
            <span style={{ color: '#64748b', fontSize: 12 }}>
              ({lender.googleReviews.toLocaleString()} reviews)
            </span>
          </div>
        </div>
      </div>

      <p style={{ color: '#cbd5e1', fontSize: 13, margin: 0, lineHeight: 1.55 }}>
        {lender.tagline}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {lender.loanTypes.map(lt => (
          <span key={lt} style={{
            padding: '3px 8px', borderRadius: 6,
            background: 'rgba(139,92,246,0.1)', color: '#a78bfa',
            fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
          }}>
            {lt}
          </span>
        ))}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        color: '#64748b', fontSize: 12,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MapPin size={12} /> {lender.states}
        </span>
        <span>·</span>
        <span>${(lender.minLoan / 1000).toFixed(0)}k–${(lender.maxLoan / 1000000).toFixed(1)}M</span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 6 }}>
        <a
          href={lender.website}
          target="_blank" rel="noopener noreferrer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 12px', borderRadius: 8,
            background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
            color: '#a78bfa', textDecoration: 'none',
            fontWeight: 700, fontSize: 13,
          }}
        >
          Visit site <ExternalLink size={12} />
        </a>
        <a
          href={`tel:${lender.phone}`}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 12px', borderRadius: 8,
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.28)',
            color: '#34d399', textDecoration: 'none',
            fontWeight: 700, fontSize: 13,
          }}
        >
          <Phone size={12} /> Call
        </a>
      </div>
    </div>
  );
}
