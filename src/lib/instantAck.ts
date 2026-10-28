const TELUGU = /[\u0C00-\u0C7F]/;

const rules: { test: RegExp; lines: string[]; visual: boolean }[] = [
  { test: /(explain|what is|what's|how does|how do|meaning|why|tell me about)/i,
    lines: ["Sure, let me explain that clearly.", "Got it, let me break this down."], visual: true },
  { test: /(code|python|java|function|script|program|bug|error|fix|build)/i,
    lines: ["On it, putting this together for you.", "Sure, working on that now."], visual: false },
  { test: /(plan|mvp|startup|idea|strategy|roadmap|steps|flow)/i,
    lines: ["Let me map this out for you.", "Good one, structuring this now."], visual: true },
  { test: /(compare|difference|vs|versus)/i,
    lines: ["Let me compare them side by side."], visual: true },
];

const fallback = ["Sure, let me look into that.", "Got it, working on it now."];

export interface InstantAck { text: string; willVisual: boolean }

export function getInstantAck(query: string): InstantAck {
  const q = query.trim();
  if (TELUGU.test(q)) return { text: "సరే, చూస్తున్నాను.", willVisual: false };
  if (q.split(/\s+/).length <= 2) return { text: "Hey! Give me a second.", willVisual: false };
  const m = rules.find(r => r.test.test(q));
  const pool = m ? m.lines : fallback;
  return {
    text: pool[Math.floor(Math.random() * pool.length)],
    willVisual: m?.visual ?? q.split(/\s+/).length > 8,
  };
}