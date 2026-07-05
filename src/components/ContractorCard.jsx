import { Star, Phone, Shield, CheckCircle } from 'lucide-react';

const tradeColors = {
  'HVAC': '#00e5a0',
  'Plumbing': '#3b82f6',
  'Electrical': '#f59e0b',
  'Painting/Cosmetic': '#f59e0b',
  'Flooring': '#00c805',
  'Roofing': '#ef4444',
  'Foundation/Structural': '#10b981',
};

export default function ContractorCard({ contractor, revealed }) {
  return (
    <div style={{
      background: '#1a1f1b',
      border: '1px solid #232925',
      borderRadius: '12px',
      padding: '16px',
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
          background: `${tradeColors[contractor.trade] || '#00c805'}22`,
          border: `1px solid ${tradeColors[contractor.trade] || '#00c805'}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', fontWeight: 700, color: tradeColors[contractor.trade] || '#00c805',
        }}>
          {contractor.name.charAt(0)}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
            <div>
              <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px', margin: 0 }}>
                {contractor.name}
              </h4>
              <p style={{ color: '#95a29b', fontSize: '13px', margin: '2px 0 0' }}>
                {contractor.company}
              </p>
            </div>
            <span style={{
              background: `${tradeColors[contractor.trade] || '#00c805'}18`,
              color: tradeColors[contractor.trade] || '#00c805',
              border: `1px solid ${tradeColors[contractor.trade] || '#00c805'}30`,
              borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 700,
              flexShrink: 0,
            }}>
              {contractor.trade}
            </span>
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[1,2,3,4,5].map(s => (
                <Star
                  key={s}
                  size={12}
                  fill={s <= Math.round(contractor.rating) ? '#f59e0b' : 'none'}
                  style={{ color: '#f59e0b' }}
                />
              ))}
              <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 700 }}>{contractor.rating}</span>
            </div>
            <span style={{ color: '#5a675f', fontSize: '12px' }}>({contractor.reviewCount} reviews)</span>
            <span style={{ color: '#5a675f', fontSize: '12px' }}>• {contractor.yearsExp} yrs exp</span>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {contractor.licensed && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '20px', padding: '2px 8px', fontSize: '11px', fontWeight: 600,
              }}>
                <CheckCircle size={10} />
                Licensed
              </span>
            )}
            {contractor.insured && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'rgba(0, 229, 160, 0.1)', color: '#00e5a0',
                border: '1px solid rgba(0, 229, 160, 0.2)',
                borderRadius: '20px', padding: '2px 8px', fontSize: '11px', fontWeight: 600,
              }}>
                <Shield size={10} />
                Insured
              </span>
            )}
          </div>

          {/* Phone */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={14} style={{ color: '#5a675f' }} />
            {revealed ? (
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: '15px', letterSpacing: '0.5px' }}>
                {contractor.phone}
              </span>
            ) : (
              <span style={{
                color: '#5a675f', fontSize: '14px',
                filter: 'blur(4px)', userSelect: 'none',
              }}>
                {contractor.phone}
              </span>
            )}
            {!revealed && (
              <span style={{
                background: 'rgba(0, 200, 5, 0.1)', color: '#00c805',
                border: '1px solid rgba(0, 200, 5, 0.2)',
                borderRadius: '4px', padding: '1px 6px', fontSize: '11px', fontWeight: 600,
              }}>
                Unlock to reveal
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
