import { useState } from 'react';
import {
  Heart, Bed, Bath, Maximize2, MapPin, Eye, Sparkles, Flame, Crown, TrendingDown,
  TrendingUp, Trees, Building2, Layers,
} from 'lucide-react';
import { T, formatPrice, formatFull } from '../theme';

const BADGE_STYLES = {
  FEATURED:    { bg: 'rgba(217,255,79,0.92)', text: '#07080b', icon: Crown },
  HOT:         { bg: 'rgba(239,68,68,0.92)',  text: '#ffffff', icon: Flame },
  NEW:         { bg: 'rgba(56,189,248,0.92)', text: '#06121a', icon: Sparkles },
  'PRICE DROP':{ bg: 'rgba(251,191,36,0.92)', text: '#1a1407', icon: TrendingDown },
};

const VELOCITY_COLORS = {
  'Very High': { bg: 'rgba(239,68,68,0.14)',  color: '#fca5a5', border: 'rgba(239,68,68,0.32)' },
  High:        { bg: 'rgba(217,255,79,0.14)', color: T.lime,    border: 'rgba(217,255,79,0.32)' },
  Medium:      { bg: 'rgba(56,189,248,0.14)', color: '#7dd3fc', border: 'rgba(56,189,248,0.32)' },
};

function MetricPill({ label, value, accent }) {
  return (
    <div
      style={{
        background: T.cardAlt,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: '6px 9px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
      }}
    >
      <span
        style={{
          color: T.textMuted,
          fontSize: 9.5,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: accent || T.text,
          fontSize: 12.5,
          fontWeight: 800,
          letterSpacing: '-0.1px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function StatTile({ icon, value }) {
  const Cmp = icon;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: T.textDim,
        fontSize: 11.5,
        fontWeight: 600,
      }}
    >
      <Cmp size={12} color={T.lime} />
      {value}
    </div>
  );
}

export default function DealCard({ deal }) {
  const [hover, setHover] = useState(false);
  const [saved, setSaved] = useState(false);
  const badge = BADGE_STYLES[deal.badge];
  const BadgeIcon = badge?.icon;
  const velocity = VELOCITY_COLORS[deal.velocity];

  const isLand = deal.dealType === 'land';
  const isCommercial = deal.dealType === 'commercial';

  return (
    <article
      style={{
        position: 'relative',
        background: T.card,
        border: `1px solid ${hover ? 'rgba(217,255,79,0.32)' : T.border}`,
        borderRadius: T.rLg,
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hover
          ? `${T.shadowLg}, 0 0 0 1px rgba(217,255,79,0.18), 0 0 28px rgba(217,255,79,0.08)`
          : T.shadow,
        transition: 'transform 0.22s cubic-bezier(.2,.9,.3,1), box-shadow 0.22s ease, border-color 0.2s ease',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden', background: '#0a0c10' }}>
        <img
          src={deal.image}
          alt=""
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(.2,.9,.3,1)',
            transform: hover ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        {/* gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(7,8,11,0.10) 0%, rgba(7,8,11,0) 30%, rgba(7,8,11,0.55) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Badge */}
        {badge && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 999,
              background: badge.bg,
              color: badge.text,
              fontSize: 10.5,
              fontWeight: 900,
              letterSpacing: 0.8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {BadgeIcon && <BadgeIcon size={11} strokeWidth={2.6} />}
            {deal.badge}
          </div>
        )}

        {/* AI Match Score */}
        {deal.aiMatch != null && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: badge ? 'auto' : 10,
              right: badge ? 60 : 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 999,
              background: 'rgba(7,8,11,0.78)',
              border: `1px solid rgba(217,255,79,0.4)`,
              color: T.lime,
              fontSize: 10,
              fontWeight: 800,
              backdropFilter: 'blur(8px)',
            }}
          >
            <Sparkles size={10} />
            AI {deal.aiMatch}%
          </div>
        )}

        {/* Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSaved((v) => !v);
          }}
          aria-label={saved ? 'Unsave deal' : 'Save deal'}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(7,8,11,0.7)',
            color: saved ? '#ef4444' : T.text,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            transition: 'transform 0.15s, background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart size={15} fill={saved ? '#ef4444' : 'none'} />
        </button>

        {/* ROI bottom-left */}
        {deal.roi != null && (
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 11px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(217,255,79,0.95) 0%, rgba(168,204,47,0.95) 100%)',
              color: '#07080b',
              fontSize: 11.5,
              fontWeight: 900,
              boxShadow: `0 4px 14px rgba(217,255,79,0.35)`,
            }}
          >
            <TrendingUp size={11} strokeWidth={3} />
            {deal.roi}% ROI
          </div>
        )}

        {/* Velocity */}
        {velocity && (
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              padding: '4px 9px',
              borderRadius: 999,
              background: 'rgba(7,8,11,0.78)',
              border: `1px solid ${velocity.border}`,
              color: velocity.color,
              fontSize: 10,
              fontWeight: 800,
              backdropFilter: 'blur(8px)',
              letterSpacing: 0.4,
            }}
          >
            {deal.velocity} Velocity
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 14px 14px' }}>
        {/* type + price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span
            style={{
              padding: '3px 9px',
              borderRadius: 999,
              background: T.bg,
              border: `1px solid ${T.border}`,
              color: T.lime,
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {deal.dealTypeLabel}
          </span>
          {deal.heat != null && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                color: T.textMuted,
                fontSize: 10.5,
                fontWeight: 700,
              }}
            >
              <Flame size={11} color="#fbbf24" /> Heat {deal.heat}
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <span
            style={{
              color: T.text,
              fontWeight: 900,
              fontSize: 24,
              letterSpacing: '-0.6px',
              lineHeight: 1,
            }}
          >
            {formatFull(deal.price)}
          </span>
          {deal.priceDrop && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                color: '#fbbf24',
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              <TrendingDown size={11} /> -{formatPrice(deal.priceDrop)}
            </span>
          )}
        </div>

        {/* address */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            color: T.textDim,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 12,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          <MapPin size={11} color={T.lime} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.address}</span>
        </div>

        {/* metric pills row — varies by type */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {isLand ? (
            <>
              <MetricPill label="Acres" value={`${deal.acres}`} accent={T.lime} />
              <MetricPill label="Zoning" value={deal.zoning} />
              <MetricPill label="Topo" value={deal.topography} />
            </>
          ) : isCommercial ? (
            <>
              <MetricPill label="Cap" value={`${deal.capRate}%`} accent={T.lime} />
              <MetricPill label="NOI" value={formatPrice(deal.noi)} />
              <MetricPill label="Occ" value={`${deal.occupancy}%`} />
            </>
          ) : deal.dealType === 'fix-flip' ? (
            <>
              <MetricPill label="ARV" value={formatPrice(deal.arv)} accent={T.lime} />
              <MetricPill label="Profit" value={`+${formatPrice(deal.estProfit)}`} accent="#4ade80" />
              <MetricPill label="Rehab" value={formatPrice(deal.estRehab)} accent="#fbbf24" />
            </>
          ) : (
            <>
              <MetricPill label="Cap" value={`${deal.capRate}%`} accent={T.lime} />
              <MetricPill label="Rent" value={`${formatPrice(deal.estRent)}/mo`} />
              <MetricPill label="Cashflow" value={`+${formatPrice(deal.cashFlow)}/mo`} accent="#4ade80" />
            </>
          )}
        </div>

        {/* stats row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            paddingTop: 10,
            marginTop: 0,
            borderTop: `1px solid ${T.borderSoft}`,
            color: T.textDim,
            fontSize: 11.5,
            fontWeight: 600,
            flexWrap: 'wrap',
          }}
        >
          {isLand ? (
            <>
              <StatTile icon={Trees} value={`${deal.acres} ac`} />
              <StatTile icon={MapPin} value={`${deal.city}, ${deal.state}`} />
            </>
          ) : isCommercial ? (
            <>
              <StatTile icon={Building2} value={`${(deal.sqft || 0).toLocaleString()} sqft`} />
              <StatTile icon={Layers} value={`Built ${deal.yearBuilt}`} />
            </>
          ) : (
            <>
              <StatTile icon={Bed} value={`${deal.beds} bd`} />
              <StatTile icon={Bath} value={`${deal.baths} ba`} />
              <StatTile icon={Maximize2} value={`${(deal.sqft || 0).toLocaleString()} sqft`} />
              {deal.yearBuilt && (
                <StatTile icon={Layers} value={deal.yearBuilt} />
              )}
            </>
          )}
          <span style={{ marginLeft: 'auto', color: T.textMuted, fontSize: 11 }}>
            {deal.daysListed}d listed
          </span>
        </div>

        {/* Seller + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 14,
          }}
        >
          <img
            src={deal.sellerAvatar}
            alt=""
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              objectFit: 'cover',
              border: `1.5px solid ${T.border}`,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: T.text,
                fontSize: 12.5,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {deal.sellerName}
            </div>
            <div
              style={{
                color: T.lime,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: 0.3,
              }}
            >
              {deal.sellerBadge}
            </div>
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '8px 14px',
              borderRadius: 10,
              border: 'none',
              background: T.lime,
              color: '#07080b',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: `0 0 0 1px rgba(217,255,79,0.4), 0 4px 14px rgba(217,255,79,0.28)`,
              flexShrink: 0,
            }}
          >
            <Eye size={12} strokeWidth={2.6} />
            View Deal
          </button>
        </div>
      </div>
    </article>
  );
}
