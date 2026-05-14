import { Search, ChevronDown, SlidersHorizontal, Bookmark, LayoutGrid, List } from 'lucide-react';
import { T } from '../theme';

function DSelect({ label, fullWidth }) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '11px 14px',
        borderRadius: 11,
        border: `1px solid ${T.border}`,
        background: T.card,
        color: T.text,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        width: fullWidth ? '100%' : undefined,
        justifyContent: fullWidth ? 'space-between' : undefined,
      }}
    >
      {label}
      <ChevronDown size={14} color={T.textDim} />
    </button>
  );
}

export default function SearchFilters({
  search,
  onSearchChange,
  view,
  setView,
  onFiltersClick,
  isMobile,
  activeFilterCount = 0,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          alignItems: 'center',
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: 0 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: T.lime,
              pointerEvents: 'none',
            }}
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by city, state, zip, or keyword"
            style={{
              width: '100%',
              padding: '12px 14px 12px 40px',
              borderRadius: 12,
              border: `1px solid ${T.border}`,
              background: T.card,
              color: T.text,
              fontSize: 14,
              fontWeight: 500,
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = T.lime;
              e.currentTarget.style.boxShadow = `0 0 0 3px rgba(217,255,79,0.18)`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {!isMobile && (
          <>
            <DSelect label="All States" />
            <DSelect label="All Categories" />
            <DSelect label="All Deal Types" />
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '11px 14px',
                borderRadius: 11,
                border: `1px solid ${T.border}`,
                background: T.card,
                color: T.text,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Bookmark size={13} />
              Save Search
            </button>
            <DSelect label="Newest" />
            <div
              style={{
                display: 'inline-flex',
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 11,
                padding: 3,
              }}
            >
              <button
                onClick={() => setView('grid')}
                aria-label="Grid view"
                style={{
                  width: 32,
                  height: 32,
                  border: 'none',
                  background: view === 'grid' ? T.limeSoft : 'transparent',
                  color: view === 'grid' ? T.lime : T.textDim,
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setView('list')}
                aria-label="List view"
                style={{
                  width: 32,
                  height: 32,
                  border: 'none',
                  background: view === 'list' ? T.limeSoft : 'transparent',
                  color: view === 'list' ? T.lime : T.textDim,
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <List size={14} />
              </button>
            </div>
          </>
        )}

        {isMobile && (
          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
            <button
              onClick={onFiltersClick}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                padding: '12px 14px',
                borderRadius: 12,
                border: `1px solid ${T.border}`,
                background: T.card,
                color: T.text,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span
                  style={{
                    padding: '1px 7px',
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
            <DSelect label="Newest" fullWidth />
          </div>
        )}
      </div>
    </div>
  );
}
