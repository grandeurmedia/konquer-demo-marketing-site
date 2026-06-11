'use client';

import React, { useMemo, useState } from 'react';

type Insights = {
  ev_compound: number;
  monthly_values: number[];
  payback_month: number | null;
  cascade_value: number;
  multiplier: number;
  nbms_score: number;
  ranking_basis: number;
  beta: number;
  kappa: number;
  points: number;
  badges: string[];
};

const number = (v: any, d = 0) => (typeof v === 'number' ? v.toFixed(d) : String(v));

export default function BDInsightsClient() {
  const UI_BASE = process.env.NEXT_PUBLIC_UI_API || 'http://localhost:8010';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Insights | null>(null);
  // Plan accumulation: store monthly series from actions you add
  const [planSeries, setPlanSeries] = useState<number[][]>([]);

  // Minimal form state (defaults tuned for quick testing)
  const [leverage, setLeverage] = useState('multiplier');
  const [baseMonthly, setBaseMonthly] = useState(20000);
  const [startMonth, setStartMonth] = useState(0);
  const [horizon, setHorizon] = useState(12);
  const [ramp, setRamp] = useState<'step' | 'linear'>('linear');
  const [hours, setHours] = useState(12);
  const [cash, setCash] = useState(0);
  const [coord, setCoord] = useState(2);
  const [readiness, setReadiness] = useState(1.0);
  const [momentum, setMomentum] = useState(1.05);
  const [salesH, setSalesH] = useState(10);
  const [opsH, setOpsH] = useState(6);
  const [prodH, setProdH] = useState(4);
  const [salesR, setSalesR] = useState(300);
  const [opsR, setOpsR] = useState(150);
  const [prodR, setProdR] = useState(200);
  const [fitOk, setFitOk] = useState(true);
  const [unstableP, setUnstableP] = useState(false);
  const [ratesStale, setRatesStale] = useState(false);
  const [kappa, setKappa] = useState<string>(''); // optional override

  async function run(ev: React.FormEvent) {
    ev.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body: any = {
        leverage_type: leverage,
        base_monthly: Number(baseMonthly),
        start_month: Number(startMonth),
        horizon: Number(horizon),
        ramp,
        effort_hours: Number(hours),
        cash_cost: Number(cash),
        coordination_cost: Number(coord),
        readiness: Number(readiness),
        momentum: Number(momentum),
        freed_hours_by_role: { sales: Number(salesH), ops: Number(opsH), product: Number(prodH) },
        value_rate_per_role: { sales: Number(salesR), ops: Number(opsR), product: Number(prodR) },
        fit_ok: fitOk,
        unstable_p: unstableP,
        rates_stale: ratesStale,
      };
      if (kappa.trim() !== '') body.kappa = Number(kappa);

      const r = await fetch(`${UI_BASE}/ui/insights/compound`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const js = (await r.json()) as Insights;
      setResult(js);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  function addToPlan() {
    if (!result) return;
    setPlanSeries((prev) => [...prev, result.monthly_values.slice()]);
  }

  function clearPlan() {
    setPlanSeries([]);
  }

  function sumMonthly(seriesList: number[][]): number[] {
    if (seriesList.length === 0) return [];
    const L = Math.max(...seriesList.map((s) => s.length));
    const out = new Array(L).fill(0);
    for (const s of seriesList) {
      for (let i = 0; i < L; i++) {
        out[i] += (s[i] ?? 0);
      }
    }
    return out;
  }

  function cumulative(arr: number[]): number[] {
    const out: number[] = [];
    let c = 0;
    for (const v of arr) {
      c += (v || 0);
      out.push(c);
    }
    return out;
  }

  return (
    <section style={{ marginTop: 24 }}>
      <h2>Compound Insights (Test Panel)</h2>
      <form onSubmit={run} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))', gap: 12, alignItems: 'end', marginBottom: 12 }}>
        <label>
          Leverage
          <select value={leverage} onChange={(e) => setLeverage(e.target.value)}>
            <option value="linear">linear</option>
            <option value="recurring">recurring</option>
            <option value="multiplier">multiplier</option>
            <option value="exponential">exponential</option>
          </select>
        </label>
        <label>
          Base monthly ($)
          <input type="number" value={baseMonthly} onChange={(e) => setBaseMonthly(Number(e.target.value))} />
        </label>
        <label>
          Horizon (months)
          <input type="number" value={horizon} onChange={(e) => setHorizon(Number(e.target.value))} />
        </label>
        <label>
          Start month
          <input type="number" value={startMonth} onChange={(e) => setStartMonth(Number(e.target.value))} />
        </label>
        <label>
          Ramp
          <select value={ramp} onChange={(e) => setRamp(e.target.value as any)}>
            <option value="step">step</option>
            <option value="linear">linear</option>
          </select>
        </label>
        <div />
        <label>
          Effort hours
          <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} />
        </label>
        <label>
          Cash cost ($)
          <input type="number" value={cash} onChange={(e) => setCash(Number(e.target.value))} />
        </label>
        <label>
          Coordination
          <input type="number" value={coord} onChange={(e) => setCoord(Number(e.target.value))} />
        </label>
        <label>
          Readiness (0..1)
          <input type="number" step="0.05" value={readiness} onChange={(e) => setReadiness(Number(e.target.value))} />
        </label>
        <label>
          Momentum (≥0)
          <input type="number" step="0.01" value={momentum} onChange={(e) => setMomentum(Number(e.target.value))} />
        </label>
        <div />
        <label>
          Sales freed hrs
          <input type="number" value={salesH} onChange={(e) => setSalesH(Number(e.target.value))} />
        </label>
        <label>
          Ops freed hrs
          <input type="number" value={opsH} onChange={(e) => setOpsH(Number(e.target.value))} />
        </label>
        <label>
          Product freed hrs
          <input type="number" value={prodH} onChange={(e) => setProdH(Number(e.target.value))} />
        </label>
        <label>
          Sales $/hr
          <input type="number" value={salesR} onChange={(e) => setSalesR(Number(e.target.value))} />
        </label>
        <label>
          Ops $/hr
          <input type="number" value={opsR} onChange={(e) => setOpsR(Number(e.target.value))} />
        </label>
        <label>
          Product $/hr
          <input type="number" value={prodR} onChange={(e) => setProdR(Number(e.target.value))} />
        </label>
        <label>
          κ override (0..1)
          <input type="number" step="0.05" value={kappa} onChange={(e) => setKappa(e.target.value)} />
        </label>
        <label>
          Fit OK
          <input type="checkbox" checked={fitOk} onChange={(e) => setFitOk(e.target.checked)} />
        </label>
        <label>
          Unstable P
          <input type="checkbox" checked={unstableP} onChange={(e) => setUnstableP(e.target.checked)} />
        </label>
        <label>
          Rates stale
          <input type="checkbox" checked={ratesStale} onChange={(e) => setRatesStale(e.target.checked)} />
        </label>
        <div />
        <button disabled={loading} type="submit">Run</button>
      </form>

      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
      {result && (
        <div style={{ border: '1px solid #ddd', padding: 12 }}>
          <p><strong>Direct value:</strong> ${number(result.ev_compound, 0)} (this is the value from each month added up)</p>
          <p><strong>Team lift (extra):</strong> ${number(result.cascade_value, 0)} | <strong>beta (weight):</strong> {number(result.beta, 2)} | <strong>kappa (confidence):</strong> {number(result.kappa, 2)}</p>
          <p><strong>Multiplier:</strong> {number(result.multiplier, 2)} | <strong>Score:</strong> {number(result.nbms_score, 2)}</p>
          <p><strong>Total used for ranking:</strong> ${number(result.ranking_basis, 0)}</p>
          <p><strong>Payback month:</strong> {result.payback_month ?? '—'}</p>
          <p><strong>Points:</strong> {result.points} | <strong>Badges:</strong> {result.badges?.join(', ') || '—'}</p>
          <p style={{ marginTop: 8 }}><strong>Monthly values:</strong> {result.monthly_values.map((v) => number(v, 0)).join(', ')}</p>
          <Sparkline data={result.monthly_values} width={420} height={64} color="#0a66c2" label="Monthly value sparkline" />
          <p style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
            Each dot shows one month. The line shows how value changes over time.
          </p>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button type="button" onClick={addToPlan}>Add this action to plan</button>
            <button type="button" onClick={clearPlan} disabled={planSeries.length === 0}>Clear plan</button>
          </div>
        </div>
      )}

      {planSeries.length > 0 && (
        <div style={{ border: '1px solid #ddd', padding: 12, marginTop: 12 }}>
          <h3>Your plan (combined)</h3>
          <p style={{ marginTop: 0 }}>This shows the total value each month from all the actions you added.</p>
          {(() => {
            const monthlySum = sumMonthly(planSeries);
            const cum = cumulative(monthlySum);
            const total = cum[cum.length - 1] || 0;
            return (
              <>
                <p><strong>Actions added:</strong> {planSeries.length} | <strong>Total after {monthlySum.length} months:</strong> ${number(total, 0)}</p>
                <Sparkline data={monthlySum} width={420} height={64} color="#16a34a" label="Total monthly value (all actions)" />
                <p style={{ fontSize: 12, color: '#555', marginTop: 4 }}>Green line shows the sum of all your actions each month.</p>
                <Sparkline data={cum} width={420} height={64} color="#ea580c" label="Accumulated total value" />
                <p style={{ fontSize: 12, color: '#555', marginTop: 4 }}>Orange line shows the running total (adds up month by month).</p>
              </>
            );
          })()}
        </div>
      )}
    </section>
  );
}

function Sparkline({ data, width = 420, height = 64, color = '#0070f3', label = 'sparkline' }: { data: number[]; width?: number; height?: number; color?: string; label?: string }) {
  const pad = 6;
  const w = Math.max(2 * pad + 1, width);
  const h = Math.max(2 * pad + 1, height);
  const n = Math.max(1, data.length);
  const min = Math.min(...data, 0);
  const max = Math.max(...data, 1);
  const span = Math.max(1e-9, max - min);
  const points = data.map((v, i) => {
    const x = pad + (i * (w - 2 * pad)) / (n - 1 || 1);
    const y = h - pad - ((v - min) * (h - 2 * pad)) / span;
    return `${x},${y}`;
  }).join(' ');
  const midY = h - pad - ((0 - min) * (h - 2 * pad)) / span; // zero baseline if in range
  return (
    <svg role="img" aria-label={label} width={w} height={h} style={{ display: 'block', marginTop: 6 }}>
      {/* baseline (zero) if visible */}
      {min < 0 && max > 0 && (
        <line x1={pad} y1={midY} x2={w - pad} y2={midY} stroke="#eee" strokeWidth={1} />
      )}
      <polyline fill="none" stroke={color} strokeWidth={2} points={points} />
      {/* end dot for focus */}
      {data.length > 0 && (
        (() => {
          const i = data.length - 1;
          const x = pad + (i * (w - 2 * pad)) / (n - 1 || 1);
          const y = h - pad - ((data[i] - min) * (h - 2 * pad)) / span;
          return <circle cx={x} cy={y} r={3} fill={color} />;
        })()
      )}
    </svg>
  );
}
