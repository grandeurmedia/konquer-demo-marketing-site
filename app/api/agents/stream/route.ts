/**
 * SSE streaming route for Agent Actions Panel.
 * Proxies the orchestrator's Redis-backed SSE stream to the browser.
 *
 * GET /api/agents/stream
 */

import { NextRequest } from 'next/server';

const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://localhost:8011';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(`${ORCHESTRATOR_URL}/agent-actions/stream`, {
          headers: { Accept: 'text/event-stream' },
          signal: request.signal,
        });

        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
      } catch {
        // Stream closed by client -- normal
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
