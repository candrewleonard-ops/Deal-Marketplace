import { useState, useMemo } from 'react';
import { Calculator, Info, TrendingUp, RotateCcw } from 'lucide-react';

const money = (n) => {
  const v = Math.round(Number(n) || 0);
  return (v < 0 ? '-$' : '$') + Math.abs(v).toLocaleString();
};
const pct = (n) => `${(Number(n) || 0).toFixed(1)}%`;

/**
 * Fully-editable fix & flip profit + cash-on-cash calculator.
 *
 * Every figure is an *estimate*. Numbers vary deal to deal and by financing,
 * which is exactly why this is interactive rather than a single hard-coded
 * "profit" badge.
 *
 * Defaults:
 *   - Purchase price → the listing price of this deal (editable)
 *   - Rehab          → the wholesaler's estimate / range midpoint (editable)
 *   - ARV            → seller-reported ARV (editable — see disclaimer)
 *   - HML rate       → 10% APR
 *   - Points / fees  → 3.5% of the loan (varies by borrower type)
 *   - Hold           → 6 months
 *   - Down payment   → 10% of (price + rehab)
 *   - Closing costs  → 0.75% of ARV, charged twice (buy + sell) = 1.5% ARV
 *   - Insurance      → 0.5% of ARV
 *   - Realtor        → 6% of ARV  (defaults to 5% when ARV ≥ $300k)
 */
export default function ProfitCalculator({
  listingPrice = 0,
  arv = 0,
  rehabDefault = 0,
  isMobile = false,
}) {
  const defaults = useMemo(() => ({
    price: listingPrice || 0,
    rehab: rehabDefault || 0,
    arv: arv || 0,
    rate: 10,
    points: 3.5,
    months: 6,
    down: 10,
    realtor: (arv || 0) >= 300000 ? 5 : 6,
  }), [listingPrice, arv, rehabDefault]);

  const [v, setV] = useState(defaults);
  // Down payment + total cash invested are editable $ figures. `null` =
  // "untouched", so they auto-track price+rehab until the buyer types their
  // own number, then they hold it (buyer does their own calc).
  const [downOverride, setDownOverride] = useState(null);
  const [cashOverride, setCashOverride] = useState(null);

  const set = (k) => (e) => {
    const raw = e.target.value;
    setV((s) => ({ ...s, [k]: raw === '' ? '' : Number(raw) }));
  };
  const num = (k) => (v[k] === '' ? 0 : Number(v[k]) || 0);

  function resetAll() {
    setV(defaults);
    setDownOverride(null);
    setCashOverride(null);
  }

  const r = useMemo(() => {
    const price = num('price');
    const rehab = num('rehab');
    const av = num('arv');
    const rate = num('rate');
    const points = num('points');
    const months = num('months');
    const realtorPct = num('realtor');

    const basis = price + rehab;
    const downDefault = Math.round(basis * 0.10);          // 10% of price+rehab
    const downCash = downOverride === null || downOverride === ''
      ? downDefault : Number(downOverride) || 0;
    // Total cash invested defaults to the FULL deal cost (all-cash).
    const cashDefault = basis;
    const cashInvested = cashOverride === null || cashOverride === ''
      ? cashDefault : Number(cashOverride) || 0;

    const loan = Math.max(0, basis - downCash);
    const interest = loan * (rate / 100) * (months / 12);
    const pointsCost = loan * (points / 100);
    const closing = av * 0.0075 * 2;        // 0.75% ARV, buy + sell
    const insurance = av * 0.005;            // 0.5% ARV
    const realtor = av * (realtorPct / 100); // sale commission

    const totalCosts = price + rehab + interest + pointsCost + closing + insurance + realtor;
    const netProfit = av - totalCosts;
    const coc = cashInvested > 0 ? (netProfit / cashInvested) * 100 : 0;

    return {
      basis, downDefault, downCash, cashDefault, cashInvested,
      loan, interest, pointsCost, closing, insurance, realtor, netProfit, coc,
    };
  }, [v, downOverride, cashOverride]); // eslint-disable-line react-hooks/exhaustive-deps

  // What the two editable $ fields actually display.
  const downDisplay = downOverride === null ? r.downDefault : downOverride;
  const cashDisplay = cashOverride === null ? r.cashDefault : cashOverride;

  const positive = r.netProfit >= 0;

  return (
    <div style={{
      background: '#12121e', border: '1px solid #1e1e2e',
      borderRadius: 16, padding: isMobile ? 16 : 24, marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Calculator size={18} color="#fff" />
          </div>
          <div>
            <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: 17, margin: 0 }}>Deal Calculator</h3>
            <div style={{ color: '#64748b', fontSize: 12 }}>Run your own numbers — estimate only</div>
          </div>
        </div>
        <button
          onClick={resetAll}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e',
            color: '#94a3b8', borderRadius: 8, padding: '7px 11px',
            cursor: 'pointer', fontSize: 12, fontWeight: 700,
          }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Inputs */}
      <div style={{
        display: 'grid', gap: 12, marginTop: 18,
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
      }}>
        <NumberField label="Purchase price" value={v.price} onChange={set('price')} prefix="$" />
        <NumberField label="Rehab estimate" value={v.rehab} onChange={set('rehab')} prefix="$" />
        <NumberField label="ARV" value={v.arv} onChange={set('arv')} prefix="$" highlight />
        <NumberField label="HML rate" value={v.rate} onChange={set('rate')} suffix="%" />
        <NumberField label="Points / fees" value={v.points} onChange={set('points')} suffix="%" />
        <NumberField label="Hold (months)" value={v.months} onChange={set('months')} />
        <NumberField
          label="Down payment"
          value={downDisplay}
          onChange={(e) => setDownOverride(e.target.value === '' ? '' : Number(e.target.value))}
          prefix="$"
        />
        <NumberField label="Realtor" value={v.realtor} onChange={set('realtor')} suffix="%" />
      </div>

      {/* ARV disclaimer */}
      <div style={{
        marginTop: 14, padding: '10px 12px', borderRadius: 8,
        background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
        display: 'flex', gap: 8,
      }}>
        <Info size={14} style={{ color: '#fbbf24', flexShrink: 0, marginTop: 1 }} />
        <span style={{ color: '#fbbf24', fontSize: 12, lineHeight: 1.5 }}>
          A wholesaler's ARV is user-input data and is <strong>not to be treated as fact</strong>.
          Do your due diligence wisely to avoid overpaying for a property.
        </span>
      </div>

      {/* Cost breakdown */}
      <div style={{
        marginTop: 18, background: '#0d0d1a', border: '1px solid #1e1e2e',
        borderRadius: 12, padding: 14,
      }}>
        {[
          ['ARV (sale)', money(num('arv')), '#10b981'],
          ['– Purchase price', money(num('price')), '#cbd5e1'],
          ['– Rehab', money(num('rehab')), '#cbd5e1'],
          [`– Loan interest (${pct(num('rate'))} · ${num('months')}mo)`, money(r.interest), '#cbd5e1'],
          [`– Points / fees (${pct(num('points'))})`, money(r.pointsCost), '#cbd5e1'],
          ['– Closing costs (1.5% ARV)', money(r.closing), '#cbd5e1'],
          ['– Insurance (0.5% ARV)', money(r.insurance), '#cbd5e1'],
          [`– Realtor (${pct(num('realtor'))} ARV)`, money(r.realtor), '#cbd5e1'],
        ].map(([label, value, color]) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '5px 0', fontSize: 13,
          }}>
            <span style={{ color: '#94a3b8' }}>{label}</span>
            <span style={{ color, fontWeight: 600 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Headline results */}
      <div style={{
        display: 'grid', gap: 12, marginTop: 14,
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      }}>
        <div style={{
          background: positive ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)',
          border: `1px solid ${positive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          borderRadius: 12, padding: 16,
        }}>
          <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>ESTIMATED NET PROFIT</div>
          <div style={{ color: positive ? '#10b981' : '#ef4444', fontWeight: 900, fontSize: 28, marginTop: 4 }}>
            {money(r.netProfit)}
          </div>
        </div>
        <div style={{
          background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 12, padding: 16,
        }}>
          <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 5 }}>
            <TrendingUp size={12} /> TOTAL CASH INVESTED
          </div>
          <div style={{ position: 'relative', marginTop: 4 }}>
            <span style={{
              position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
              color: '#a78bfa', fontWeight: 900, fontSize: 28, pointerEvents: 'none',
            }}>$</span>
            <input
              type="number"
              value={cashDisplay}
              onChange={(e) => setCashOverride(e.target.value === '' ? '' : Number(e.target.value))}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: '#a78bfa', fontWeight: 900, fontSize: 28,
                padding: '0 0 0 20px',
              }}
            />
          </div>
          <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>
            Defaults to the full price + rehab — edit to your real cash in.
            <span style={{ color: '#94a3b8', fontWeight: 700 }}>
              {' '}Cash-on-cash ≈ {(Number.isFinite(r.coc) ? r.coc : 0).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div style={{ color: '#475569', fontSize: 11, lineHeight: 1.5, marginTop: 12 }}>
        Purchase + rehab is assumed HML-financed; the down payment is your cash at close
        (defaults to 10% of price + rehab). <strong style={{ color: '#64748b' }}>Total cash
        invested</strong> defaults to the full price + rehab (all-cash) so cash-on-cash starts
        conservative — change it to whatever you actually put in. All figures are estimates and
        change with your real financing, timeline, and market.
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, prefix, suffix, highlight }) {
  return (
    <div>
      <label style={{
        color: '#94a3b8', fontSize: 11, fontWeight: 700,
        display: 'block', marginBottom: 6, letterSpacing: 0.3,
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {prefix && (
          <span style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            color: '#64748b', fontSize: 13, fontWeight: 700, pointerEvents: 'none',
          }}>{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            padding: `9px ${suffix ? '26px' : '10px'} 9px ${prefix ? '22px' : '10px'}`,
            borderRadius: 9,
            background: '#0d0d1a',
            border: `1px solid ${highlight ? 'rgba(16,185,129,0.4)' : '#1e1e2e'}`,
            color: '#f8fafc', fontSize: 14, fontWeight: 700, outline: 'none',
          }}
        />
        {suffix && (
          <span style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            color: '#64748b', fontSize: 13, fontWeight: 700, pointerEvents: 'none',
          }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}
