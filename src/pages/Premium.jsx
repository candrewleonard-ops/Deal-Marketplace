import { useState } from 'react';
import { Check, Crown, Zap, X, CreditCard, Shield, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

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
  {
    name: 'Basic',
    price: 'Free',
    monthly: 0,
    perks: ['5 DMs/day', '3 address requests/day', 'Standard listings', 'Access marketplace', 'Join groups'],
    popular: false,
    color: '#94a3b8',
    cta: 'Current Plan',
  },
  {
    name: 'VIP',
    price: '$29/mo',
    monthly: 29,
    perks: ['30 DMs/day', 'Unlimited address requests', 'Sponsored discount 3x', 'Priority support', 'VIP badge', 'Advanced search filters', 'Deal analytics'],
    popular: false,
    color: '#8b5cf6',
    cta: 'Upgrade to VIP',
  },
  {
    name: 'VIP Max',
    price: '$99/mo',
    monthly: 99,
    perks: features,
    popular: true,
    color: '#f59e0b',
    cta: 'Get VIP Max',
  },
];

const testimonials = [
  {
    name: 'Marcus J.',
    role: 'Wholesaler, Atlanta GA',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    text: 'VIP Max changed my business. I went from 5 DMs a day to 100 — my buyer list doubled in 30 days. The ROI on $99/mo is insane when you\'re moving $25k+ assignments.',
    stars: 5,
  },
  {
    name: 'Sarah M.',
    role: 'Fix & Flip Investor, Dallas TX',
    avatar: 'https://picsum.photos/seed/user4/100/100',
    text: 'The priority listing placement alone is worth it. My deals get 3x more address requests now. Closed 4 extra deals last quarter that I attribute directly to TREIM VIP.',
    stars: 5,
  },
  {
    name: 'Kevin W.',
    role: 'Hard Money Lender, Phoenix AZ',
    avatar: 'https://picsum.photos/seed/user5/100/100',
    text: 'As a lender, finding quality deal flow is everything. The VIP analytics dashboard shows me exactly which investors are most active. Well worth the investment.',
    stars: 5,
  },
];

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes, absolutely. Cancel anytime from your account settings. No long-term contracts, no cancellation fees. Your access continues until the end of the billing period.' },
  { q: 'What happens to my deals if I downgrade?', a: 'Your deals remain active. You\'ll just revert to Basic limits (5 DMs/day, 3 address requests/day). All your data is preserved.' },
  { q: 'Is there a free trial?', a: 'Yes! VIP comes with a 7-day free trial. VIP Max comes with a 3-day trial. No credit card required to start the trial.' },
  { q: 'What is the money-back guarantee?', a: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not completely satisfied, contact support and we\'ll issue a full refund.' },
  { q: 'Can I switch between VIP and VIP Max?', a: 'Yes, you can upgrade or downgrade at any time. Changes take effect immediately for upgrades, and at the next billing cycle for downgrades.' },
  { q: 'Do you offer team/business plans?', a: 'Yes! Business accounts get custom pricing for teams of 3+. Contact us at team@treim.app for enterprise pricing.' },
];

export default function Premium() {
  useSEO({
    title: 'VIP Premium Plans',
    description: 'Upgrade to VIP or VIP Max for priority listings, unlimited address requests, advanced analytics, and 10x sponsored ad discounts.',
  });
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [paySuccess, setPaySuccess] = useState(false);
  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  function handleUpgrade(tier) {
    setSelectedTier(tier);
    setShowPayModal(true);
    setPaySuccess(false);
  }

  function handlePay(e) {
    e.preventDefault();
    setPaySuccess(true);
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(6, 182, 212, 0.08))', padding: '72px 20px 60px', borderBottom: '1px solid #1e1e2e' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <Crown size={52} style={{ color: '#f59e0b', marginBottom: '16px' }} />
          <h1 style={{
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 52px)',
            margin: '0 0 14px', lineHeight: 1.1,
          }}>
            Close More Deals, Faster
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '18px', margin: '0 0 20px' }}>
            Unlock your full investor potential on TREIM
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {['30 DMs/day instead of 5', 'Priority deal placement', 'Unlimited address requests'].map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', fontSize: '15px' }}>
                <Check size={16} style={{ color: '#10b981' }} />
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 20px' }}>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '64px' }}>
          {tiers.map(t => (
            <div key={t.name} style={{
              background: t.popular ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(139, 92, 246, 0.08))' : '#12121e',
              border: t.popular ? '2px solid #f59e0b' : '1px solid #1e1e2e',
              borderRadius: '20px', padding: '32px 28px', position: 'relative',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: t.popular ? '0 0 40px rgba(245,158,11,0.12)' : 'none',
            }}
              onMouseEnter={e => { if (!t.popular) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'; } }}
              onMouseLeave={e => { if (!t.popular) { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; } }}
            >
              {t.popular && (
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#0a0a0f', padding: '5px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <Crown size={20} style={{ color: t.color }} />
                <h3 style={{ color: t.color, fontWeight: 800, fontSize: '20px', margin: 0 }}>{t.name}</h3>
              </div>
              <div style={{ color: '#f8fafc', fontWeight: 900, fontSize: '40px', margin: '12px 0 20px', lineHeight: 1 }}>{t.price}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {t.perks.map(p => (
                  <li key={p} style={{ display: 'flex', gap: '10px', color: '#e2e8f0', fontSize: '13px', alignItems: 'flex-start' }}>
                    <Check size={15} style={{ color: t.color, marginTop: '2px', flexShrink: 0 }} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => t.name !== 'Basic' && handleUpgrade(t)}
                className={t.popular ? 'gradient-btn' : ''}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  background: t.popular ? undefined : (t.name === 'Basic' ? 'rgba(255,255,255,0.04)' : 'rgba(139, 92, 246, 0.15)'),
                  border: t.popular ? 'none' : `1px solid ${t.name === 'Basic' ? '#1e1e2e' : 'rgba(139, 92, 246, 0.3)'}`,
                  color: t.popular ? '#fff' : (t.name === 'Basic' ? '#94a3b8' : '#8b5cf6'),
                  fontWeight: 700, fontSize: '15px', cursor: t.name === 'Basic' ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {t.cta}
              </button>
              {t.name !== 'Basic' && (
                <p style={{ color: '#475569', fontSize: '12px', textAlign: 'center', marginTop: '10px', marginBottom: 0 }}>
                  {t.name === 'VIP' ? '7-day free trial' : '3-day free trial'} • Cancel anytime
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', overflow: 'hidden', marginBottom: '64px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e' }}>
            <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '20px', margin: 0 }}>Feature Comparison</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1a1a2e' }}>
                  <th style={{ textAlign: 'left', padding: '14px 20px', color: '#94a3b8', fontSize: '13px', fontWeight: 700, borderBottom: '1px solid #1e1e2e' }}>Feature</th>
                  {['Basic', 'VIP', 'VIP Max'].map(n => (
                    <th key={n} style={{ textAlign: 'center', padding: '14px 20px', color: n === 'VIP Max' ? '#f59e0b' : n === 'VIP' ? '#8b5cf6' : '#94a3b8', fontSize: '13px', fontWeight: 700, borderBottom: '1px solid #1e1e2e' }}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { f: 'Daily DMs', vals: ['5', '30', '100'] },
                  { f: 'Address Requests/day', vals: ['3', 'Unlimited', 'Unlimited'] },
                  { f: 'Deal Listings', vals: ['Standard', 'Priority', 'Featured'] },
                  { f: 'Analytics', vals: ['Basic', 'Advanced', 'Full Dashboard'] },
                  { f: 'Contractor Vetting', vals: [false, false, true] },
                  { f: 'VIP Badge', vals: [false, true, true] },
                  { f: 'Sponsored Discount', vals: ['—', '3x', '10x'] },
                  { f: 'Support', vals: ['Community', 'Priority', 'Direct Line'] },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e1e2e', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '13px 20px', color: '#94a3b8', fontSize: '14px' }}>{row.f}</td>
                    {row.vals.map((v, vi) => (
                      <td key={vi} style={{ textAlign: 'center', padding: '13px 20px', color: '#f8fafc', fontSize: '14px', fontWeight: 600 }}>
                        {v === true ? <Check size={16} style={{ color: '#10b981', margin: '0 auto' }} /> : v === false ? <span style={{ color: '#334155' }}>—</span> : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>SOCIAL PROOF</div>
            <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '28px', margin: 0 }}>Investors Love TREIM Premium</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={16} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                  ))}
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: 1.7, margin: '0 0 18px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={t.avatar} alt={t.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>{t.name}</div>
                    <div style={{ color: '#475569', fontSize: '12px' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '28px', margin: 0 }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '15px' }}>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} style={{ color: '#8b5cf6', flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 16px' }}>
                    <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={28} style={{ color: '#10b981' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>30-Day Guarantee</div>
                <div style={{ color: '#475569', fontSize: '13px' }}>Full money-back, no questions</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={28} style={{ color: '#8b5cf6' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>Cancel Anytime</div>
                <div style={{ color: '#475569', fontSize: '13px' }}>No long-term contracts</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Crown size={28} style={{ color: '#f59e0b' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>Free Trials</div>
                <div style={{ color: '#475569', fontSize: '13px' }}>Try before you commit</div>
              </div>
            </div>
          </div>
          <button onClick={() => handleUpgrade(tiers[2])} className="gradient-btn" style={{ padding: '16px 40px', borderRadius: '12px', color: '#fff', fontWeight: 800, fontSize: '16px', border: 'none', cursor: 'pointer' }}>
            Start Free Trial Today
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayModal && selectedTier && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => { setShowPayModal(false); setPaySuccess(false); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', margin: 0 }}>
                {paySuccess ? '🎉 Welcome to ' + selectedTier.name + '!' : `Upgrade to ${selectedTier.name}`}
              </h3>
              <button onClick={() => { setShowPayModal(false); setPaySuccess(false); }} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '24px' }}>
              {paySuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚀</div>
                  <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '10px' }}>You're now {selectedTier.name}!</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                    Your upgraded features are now active. Start reaching more buyers and closing more deals today.
                  </p>
                  <button onClick={() => { setShowPayModal(false); setPaySuccess(false); }} className="gradient-btn" style={{ padding: '12px 32px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}>
                    Let's Go! →
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{selectedTier.name} Plan</div>
                      <div style={{ color: '#94a3b8', fontSize: '13px' }}>Billed monthly</div>
                    </div>
                    <div style={{ color: selectedTier.color, fontWeight: 900, fontSize: '22px' }}>{selectedTier.price}</div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Card Number</label>
                    <div style={{ position: 'relative' }}>
                      <CreditCard size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input
                        value={cardNum}
                        onChange={e => setCardNum(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
                        placeholder="1234 5678 9012 3456"
                        className="input-dark"
                        style={{ width: '100%', padding: '11px 14px 11px 38px', borderRadius: '8px', fontSize: '14px', letterSpacing: '1px' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Expiry</label>
                      <input
                        value={cardExp}
                        onChange={e => setCardExp(e.target.value)}
                        placeholder="MM / YY"
                        className="input-dark"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>CVV</label>
                      <input
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        className="input-dark"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '12px' }}>
                    <Shield size={14} style={{ color: '#10b981' }} />
                    256-bit SSL encryption. Your card data is never stored.
                  </div>
                  <button type="submit" className="gradient-btn" style={{ padding: '14px', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}>
                    Start {selectedTier.name === 'VIP' ? '7' : '3'}-Day Free Trial →
                  </button>
                  <p style={{ color: '#475569', fontSize: '12px', textAlign: 'center', margin: 0 }}>
                    No charge today. {selectedTier.price} begins after trial. Cancel anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
