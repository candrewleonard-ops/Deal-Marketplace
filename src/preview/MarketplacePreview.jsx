import { useMemo, useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';

import { T } from './theme';
import { useBreakpoint } from './useBreakpoint';
import { DEALS } from './data';

import TopNav from './components/TopNav';
import KPIRow from './components/KPIRow';
import FilterSidebar from './components/FilterSidebar';
import MobileFilterDrawer from './components/MobileFilterDrawer';
import SearchFilters from './components/SearchFilters';
import CategoryChips from './components/CategoryChips';
import StateMapPanel from './components/StateMapPanel';
import MobileMarketPulse from './components/MobileMarketPulse';
import DealCard from './components/DealCard';
import RightInsightsPanel, {
  MarketInsightsCard,
  PostYourDealCard,
  TrustedByInvestorsCard,
} from './components/RightInsightsPanel';
import MobileInsightCarousel from './components/MobileInsightCarousel';
import MobileBottomNav from './components/MobileBottomNav';
import FloatingChat from './components/FloatingChat';

const DEFAULT_FILTER_STATE = {
  dealTypes: ['all'],
  minPrice: '', maxPrice: '',
  minArv: '', maxArv: '',
  minCoC: '', maxCoC: '',
  minCap: '', maxCap: '',
  beds: 0, baths: 0,
  status: 'any',
};

function PreviewBanner() {
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, rgba(217,255,79,0.18), rgba(217,255,79,0.06) 60%, transparent)',
        borderBottom: `1px solid ${T.border}`,
        color: T.lime,
        fontSize: 11.5,
        fontWeight: 800,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        padding: '6px 18px',
        textAlign: 'center',
      }}
    >
      Preview · New Marketplace UI · Live data untouched
    </div>
  );
}

export default function MarketplacePreview() {
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';

  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState(DEFAULT_FILTER_STATE);
  const [selectedStates, setSelectedStates] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filteredDeals = useMemo(() => {
    return DEALS.filter((d) => {
      if (featuredOnly && d.badge !== 'FEATURED') return false;
      if (category !== 'all' && d.dealType !== category) return false;
      if (selectedStates.length && !selectedStates.includes(d.state)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !d.address.toLowerCase().includes(q) &&
          !d.city.toLowerCase().includes(q) &&
          !d.state.toLowerCase().includes(q) &&
          !d.dealTypeLabel.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [category, search, selectedStates, featuredOnly]);

  // Filter chips for mobile counter
  const activeFilterCount =
    (filters.dealTypes.length > 1 || (filters.dealTypes[0] !== 'all') ? 1 : 0) +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (filters.minArv || filters.maxArv ? 1 : 0) +
    (filters.minCoC || filters.maxCoC ? 1 : 0) +
    (filters.minCap || filters.maxCap ? 1 : 0) +
    (filters.beds ? 1 : 0) +
    (filters.baths ? 1 : 0) +
    (filters.status !== 'any' ? 1 : 0);

  const onPost = () => {
    // hook into real PostDealModal later; for preview, just a noop
  };

  const toggleState = (abbr) =>
    setSelectedStates((prev) =>
      prev.includes(abbr) ? prev.filter((s) => s !== abbr) : [...prev, abbr]
    );

  return (
    <div
      style={{
        background: T.bg,
        color: T.text,
        minHeight: '100dvh',
        fontFamily: T.font,
        paddingBottom: isMobile ? 'calc(76px + env(safe-area-inset-bottom))' : 0,
      }}
    >
      <PreviewBanner />
      <TopNav active="marketplace" isMobile={isMobile} onPost={onPost} />

      {/* KPI strip */}
      <div
        style={{
          background: `linear-gradient(180deg, ${T.bgRaised} 0%, ${T.bg} 100%)`,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1480,
            margin: '0 auto',
            padding: isMobile ? '4px 0 0' : '14px 24px 18px',
          }}
        >
          {!isMobile && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: T.textDim,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              <span>Marketplace Overview · Live</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: T.lime,
                    boxShadow: `0 0 8px ${T.limeGlow}`,
                  }}
                />
                Updated just now
              </span>
            </div>
          )}
          <KPIRow isMobile={isMobile} />
        </div>
      </div>

      {/* Main body */}
      <div
        style={{
          maxWidth: 1480,
          margin: '0 auto',
          padding: isMobile ? '14px 14px 32px' : '20px 24px 40px',
          display: isMobile ? 'flex' : 'grid',
          flexDirection: isMobile ? 'column' : undefined,
          gap: isMobile ? 16 : 20,
          gridTemplateColumns: isTablet ? '1fr 300px' : '280px 1fr 300px',
        }}
      >
        {/* LEFT SIDEBAR (desktop only) */}
        {!isMobile && !isTablet && (
          <FilterSidebar
            state={filters}
            setState={setFilters}
            matchedCount={2318}
          />
        )}

        {/* CENTER COLUMN */}
        <main style={{ minWidth: 0 }}>
          {/* Mobile: market pulse first */}
          {isMobile && <MobileMarketPulse />}

          {/* Search / Filters row */}
          <div
            style={{
              background: isMobile ? 'transparent' : T.card,
              border: isMobile ? 'none' : `1px solid ${T.border}`,
              borderRadius: isMobile ? 0 : T.rLg,
              padding: isMobile ? '12px 0 0' : 14,
              marginTop: isMobile ? 12 : 0,
              position: isMobile ? 'sticky' : 'static',
              top: isMobile ? 56 : undefined,
              zIndex: isMobile ? 40 : undefined,
              backgroundColor: isMobile ? T.bg : undefined,
              backdropFilter: isMobile ? 'blur(12px)' : undefined,
              WebkitBackdropFilter: isMobile ? 'blur(12px)' : undefined,
            }}
          >
            <SearchFilters
              search={search}
              onSearchChange={setSearch}
              view={view}
              setView={setView}
              onFiltersClick={() => setShowFilters(true)}
              isMobile={isMobile}
              activeFilterCount={activeFilterCount}
            />
            <div style={{ marginTop: 12 }}>
              <CategoryChips value={category} onChange={setCategory} isMobile={isMobile} />
            </div>
          </div>

          {/* Tablet: tap-to-show filters button */}
          {isTablet && (
            <button
              onClick={() => setShowFilters(true)}
              style={{
                marginTop: 14,
                padding: '11px 16px',
                borderRadius: 11,
                border: `1px solid ${T.border}`,
                background: T.card,
                color: T.text,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
              }}
            >
              Filters
              {activeFilterCount > 0 && (
                <span
                  style={{
                    padding: '1px 8px',
                    borderRadius: 999,
                    background: T.lime,
                    color: '#07080b',
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}

          {/* Browse by State map — desktop/tablet (above deals on desktop) */}
          {!isMobile && (
            <div style={{ marginTop: 16 }}>
              <StateMapPanel
                selected={selectedStates}
                onToggle={toggleState}
              />
            </div>
          )}

          {/* Deal count + featured pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              marginTop: isMobile ? 18 : 22,
              marginBottom: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span
                style={{
                  color: T.text,
                  fontSize: isMobile ? 18 : 22,
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                }}
              >
                {filteredDeals.length === DEALS.length ? '2,318 Deals Found' : `${filteredDeals.length} Deals`}
              </span>
              <span style={{ color: T.textMuted, fontSize: 12 }}>· sorted by Newest</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setFeaturedOnly((v) => !v)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '7px 12px',
                  borderRadius: 999,
                  border: `1px solid ${featuredOnly ? T.lime : T.border}`,
                  background: featuredOnly ? T.limeSoft : T.card,
                  color: featuredOnly ? T.lime : T.textDim,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Sparkles size={12} />
                Featured
                <ChevronDown size={12} />
              </button>
            </div>
          </div>

          {/* Deal grid */}
          {filteredDeals.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: T.rLg,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>🏚️</div>
              <div style={{ color: T.text, fontWeight: 800, fontSize: 16, marginBottom: 6 }}>No deals match</div>
              <div style={{ color: T.textMuted, fontSize: 13 }}>Try clearing some filters.</div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : isTablet
                    ? 'repeat(2, minmax(0, 1fr))'
                    : 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: isMobile ? 14 : 16,
              }}
            >
              {filteredDeals.map((d, i) => (
                <div key={d.id} style={{ display: 'contents' }}>
                  <DealCard deal={d} />
                  {/* Mobile inline CTA after 3rd card */}
                  {isMobile && i === 2 && (
                    <PostYourDealCard onPost={onPost} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Mobile-only: extra modules below the feed */}
          {isMobile && (
            <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <MobileInsightCarousel />
              <TrustedByInvestorsCard />
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        {!isMobile && (
          <RightInsightsPanel onPost={onPost} />
        )}
      </div>

      {/* Mobile filter drawer */}
      {(isMobile || isTablet) && (
        <MobileFilterDrawer
          open={showFilters}
          onClose={() => setShowFilters(false)}
          state={filters}
          setState={setFilters}
          matchedCount={2318}
        />
      )}

      {/* Bottom nav on mobile */}
      {isMobile && <MobileBottomNav />}

      <FloatingChat offsetForBottomNav={isMobile} />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
