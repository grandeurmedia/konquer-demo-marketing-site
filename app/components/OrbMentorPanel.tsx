import React, { useState } from "react";

/**
 * OrbMentorPanel
 * Compact mentor panel that surfaces a single micro-lesson or prompt
 * and a primary next step. Designed for the Presence layer.
 *
 * Props:
 * - title: string
 * - lesson: string
 * - onStart: () => void
 * - onLater: () => void
 * - tips?: string[]
 * - dense?: boolean
 */
export default function OrbMentorPanel({
  title = "Mentor Orb",
  lesson = "Ask me for your highest‑leverage move.",
  onStart = () => {},
  onLater = () => {},
  tips = [],
  dense = false
}: {
  title?: string;
  lesson?: string;
  onStart?: () => void;
  onLater?: () => void;
  tips?: string[];
  dense?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className={`w-full ${dense ? "p-3" : "p-4"} rounded-2xl bg-white/5 backdrop-blur border border-white/10 shadow`}
      data-konq="orb-mentor-panel"
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/70 to-white/10 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wide text-white/90">{title}</h3>
        </div>
        <button
          className="text-xs text-white/60 hover:text-white"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? "Hide" : "Details"}
        </button>
      </header>

      <p className={`mt-3 text-white/80 ${dense ? "text-xs" : "text-sm"}`}>{lesson}</p>

      {expanded && tips?.length > 0 && (
        <ul className={`mt-3 list-disc pl-5 space-y-1 ${dense ? "text-xs" : "text-sm"} text-white/70`}>
          {tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={onStart}
          className="px-3 py-2 text-xs font-medium rounded-xl bg-white text-black hover:opacity-90"
        >
          Start
        </button>
        <button
          onClick={onLater}
          className="px-3 py-2 text-xs font-medium rounded-xl bg-white/10 text-white hover:bg-white/20"
        >
          Later
        </button>
      </div>
    </section>
  );
}
