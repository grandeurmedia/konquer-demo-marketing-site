import React from "react";

/**
 * KernelBar
 * Top presence bar for mode/pack, latency, and quick toggles.
 *
 * Props:
 * - packId?: string
 * - mode?: "build" | "decide" | "observe"
 * - latencyMs?: number
 * - flags?: Record<string, boolean>
 * - onToggleFlag?: (k:string, v:boolean) => void
 */
export default function KernelBar({
  packId,
  mode = "decide",
  latencyMs = 0,
  flags = {},
  onToggleFlag
}: {
  packId?: string;
  mode?: "build" | "decide" | "observe";
  latencyMs?: number;
  flags?: Record<string, boolean>;
  onToggleFlag?: (k: string, v: boolean) => void;
}) {
  const entries = Object.entries(flags || {});

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 min-w-[320px] max-w-3xl w-[90vw]">
      <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur border border-white/10 shadow">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-white/70 to-white/10 animate-pulse" />
          <span className="text-xs text-white/80">
            Mode: <strong className="text-white">{mode}</strong>
          </span>
          {packId && <span className="text-[10px] text-white/60">Pack: {packId}</span>}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/60">p50 {Math.round(latencyMs)}ms</span>
          {entries.length > 0 && (
            <details className="relative">
              <summary className="cursor-pointer text-[10px] text-white/70">Flags</summary>
              <div className="absolute right-0 mt-2 min-w-[220px] p-3 rounded-xl bg-black/80 border border-white/10">
                <ul className="space-y-2">
                  {entries.map(([k, v]) => (
                    <li key={k} className="flex items-center justify-between gap-3">
                      <span className="text-xs text-white/80">{k}</span>
                      <input
                        type="checkbox"
                        checked={!!v}
                        onChange={(e) => onToggleFlag?.(k, e.target.checked)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
