import { Check, Crown, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  'Priority listing placement',
  'Unlimited address requests',
  'Advanced analytics dashboard',
  'Custom branded profile page',
  '10x sponsored ad discount',
  '100 DMs per day (vs 5 Basic)',
  'Verified VIP Max badge',
  'Early access to new features',
  'Direct support line',
  'Free contractor vetting',
];

const tiers = [
  { name: 'Basic', price: 'Free', perks: ['5 DMs/day', '3 address requests/day', 'Standard listings'], popular: false, tier: '#94a3b8' },
  { name: 'VIP', price: '$29/mo', perks: ['30 DMs/day', 'Unlimited address requests', 'Sponsored discount 3x', 'Priority support', 'VIP badge'], popular: false, tier: '#8b5cf6' },
  { name: 'VIP Max', price: '$99/mo', perks: features, popular: true, tier: '#f59e0b' },
];

export default function Premium() {
  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(6, 182, 212, 0.08))', padding: '60px 20px', borderBottom: '1px solid #1e1e2e' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <Crown size={48} style={{ color: '#f59e0b', marginBottom: '12px' }} />
          <h1 style={{ color: '#f8fafc', fontWeight: 900, fontSize: '48px', margin: '0 0 10px', lineHeight: 1.1 }}>
            TREIM Premium
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '18px', margin: 0 }}>Unlock your full investor potential</p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {tiers.map(t => (
            <div key={t.name} style={{
              background: t.popular ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(139, 92, 246, 0.08))' : '#12121e',
              border: t.popular ? '2px solid #f59e0b' : '1px solid #1e1e2e',
              borderRadius: '16px', padding: '28px', position: 'relative',
            }}>
              {t.popular && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#0a0a0f', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ color: t.tier, fontWeight: 800, fontSize: '18px', margin: 0 }}>{t.name}</h3>
              <div style={{ color: '#f8fafc', fontWeight: 900, fontSize: '36px', margin: '8px 0 16px' }}>{t.price}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {t.perks.map(p => (
                  <li key={p} style={{ display: 'flex', gap: '8px', color: '#e2e8f0', fontSize: '13px', alignItems: 'flex-start' }}>
                    <Check size={16} style={{ color: t.tier, marginTop: '2px', flexShrink: 0 }} /> {p}
                  </li>
                ))}
              </ul>
              <button
                className={t.popular ? 'gradient-btn' : ''}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  background: t.popular ? undefined : (t.name === 'Basic' ? 'rgba(255,255,255,0.04)' : 'rgba(139, 92, 246, 0.15)'),
                  border: t.popular ? 'none' : `1px solid ${t.name === 'Basic' ? '#1e1e2e' : 'rgba(139, 92, 246, 0.3)'}`,
                  color: t.popular ? '#fff' : (t.name === 'Basic' ? '#94a3b8' : '#8b5cf6'),
                  fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                }}
              >
                {t.name === 'Basic' ? 'Current Plan' : `Subscribe for ${t.price}`}
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '28px', textAlign: 'center' }}>
          <Zap size={32} style={{ color: '#8b5cf6', marginBottom: '12px' }} />
          <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '20px', margin: '0 0 8px' }}>Cancel anytime. No long-term contracts.</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>30-day money back guarantee.</p>
        </div>
      </div>
    </div>
  );
}
