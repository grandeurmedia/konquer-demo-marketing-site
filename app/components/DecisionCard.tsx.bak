import React from "react";

/**
 * DecisionCard
 * Shows a single recommended move with M/T/E/C and confidence.
 *
 * Props:
 * - decision: { id: string, title: string, summary: string }
 * - scores: { money:number, time:number, energy:number, certainty:number, confidence:number }
 * - rationale: string
 * - onSimulate: (id:string) => void
 * - onCommit: (id:string) => void
 */
export default function DecisionCard({
  decision,
  scores,
  rationale,
  onSimulate,
  onCommit
}: {
  decision?: { id: string; title: string; summary: string };
  scores?: { money?: number; time?: number; energy?: number; certainty?: number; confidence?: number };
  rationale?: string;
  onSimulate?: (id: string) => void;
  onCommit?: (id: string) => void;
}) {
  if (!decision) return null;
  const s = scores || {};
  const badge = (label: string, v?: number) => (
    <span className="px-2 py-1 rounded-lg bg-white/10 text-white/80 text-[10px]">
      {label}: {Math.round((v ?? 0) * 100)}%
    </span>
  );

  return (
    <article
      className="w-full p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10 shadow"
      data-konq="decision-card"
    >
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/90">{decision.title}</h3>
        <span className="text-[10px] text-white/60">
          Conf: {Math.round((s.confidence ?? 0) * 100)}%
        </span>
      </header>

      <p className="mt-2 text-sm text-white/80">{decision.summary}</p>
      <p className="mt-2 text-xs text-white/60 line-clamp-3">{rationale}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {badge("Money", s.money)}
        {badge("Time", s.time)}
        {badge("Energy", s.energy)}
        {badge("Certainty", s.certainty)}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSimulate?.(decision.id)}
          className="px-3 py-2 text-xs font-medium rounded-xl bg-white text-black hover:opacity-90"
        >
          Simulate
        </button>
        <button
          type="button"
          onClick={() => onCommit?.(decision.id)}
          className="px-3 py-2 text-xs font-medium rounded-xl bg-white/10 text-white hover:bg-white/20"
        >
          Commit
        </button>
      </div>
    </article>
  );
}
