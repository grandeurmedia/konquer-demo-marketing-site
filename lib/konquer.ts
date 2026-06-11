// Konquer SDK — minimal ESM client
// Usage:
//   const k = new KonquerClient({ baseUrl: "http://localhost:8025", token: "..." });
//   const dec = await k.decide({ pack_id, query: "What's my highest leverage move?" });

export interface ClientOptions {
  baseUrl: string;
  token?: string;
  timeoutMs?: number;
}

export interface DecideRequest {
  pack_id: string;
  query: string;
  constraints?: Record<string, unknown>;
}

export interface ScoreVector {
  money: number;
  time: number;
  energy: number;
  certainty: number;
  confidence: number;
}

export interface DecideResponse {
  id: string;
  title: string;
  summary: string;
  rationale: string;
  scores: ScoreVector;
  actions?: Array<{ name: string; params?: Record<string, unknown> }>;
}

export interface PackBuildRequest {
  anchor: { type: string; value: string };
  walk?: Record<string, unknown>;
  rank?: Record<string, unknown>;
  cache?: boolean;
}

export interface PackBuildResponse {
  id: string;
  size: number;
  created_at: string;
}

export interface FeatureFlags {
  [k: string]: boolean;
}

export class KonquerClient {
  baseUrl: string;
  token?: string;
  timeoutMs: number;

  constructor(opts: ClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, "");
    this.token = opts.token;
    this.timeoutMs = opts.timeoutMs ?? 30000;
  }

  private async req<T>(path: string, init: RequestInit = {}): Promise<T> {
    const ctl = new AbortController();
    const to = setTimeout(() => ctl.abort(), this.timeoutMs);
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(init.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
    };
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers,
        signal: ctl.signal
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} — ${text}`);
      }
      const ct = res.headers.get("content-type") || "";
      return ct.includes("application/json")
        ? ((await res.json()) as T)
        : ((await res.text()) as unknown as T);
    } finally {
      clearTimeout(to);
    }
  }

  health(): Promise<string> {
    return this.req("/health");
  }

  buildPack(body: PackBuildRequest): Promise<PackBuildResponse> {
    return this.req("/context/pack", {
      method: "POST",
      body: JSON.stringify(body)
    });
  }

  decide(body: DecideRequest): Promise<DecideResponse> {
    return this.req("/kernel/decide", {
      method: "POST",
      body: JSON.stringify(body)
    });
  }

  upsertMemory(body: Record<string, unknown>): Promise<{ ok: boolean }> {
    return this.req("/memory/upsert", {
      method: "POST",
      body: JSON.stringify(body)
    });
  }

  linkGraph(body: Record<string, unknown>): Promise<{ ok: boolean }> {
    return this.req("/graph/link", {
      method: "POST",
      body: JSON.stringify(body)
    });
  }

  getFeatureFlags(): Promise<FeatureFlags> {
    return this.req("/feature-flags");
  }

  setFeatureFlags(flags: Partial<FeatureFlags>): Promise<FeatureFlags> {
    return this.req("/feature-flags", {
      method: "PUT",
      body: JSON.stringify(flags)
    });
  }

  getPresenceTone(): Promise<Record<string, unknown>> {
    return this.req("/presence/tone");
  }
}
