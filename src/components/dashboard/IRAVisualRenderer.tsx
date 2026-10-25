"use client";
import { useState, useRef, useLayoutEffect, useMemo } from "react";
import {
  ChevronDown, ChevronUp, BookOpen,
  Workflow, Network, ListOrdered, Scale,
} from "lucide-react";
import type { VisualPayload, VisualNode, VisualEdge } from "./types";
import IRAMarkdown from "./markdown/IRAMarkdown";

interface Props { visual: VisualPayload; content?: string; defaultOpen?: boolean; }

const COLOR_MAP: Record<string, string> = {
  "0": "bg-[#3d2314] border-orange-400/70 text-[#f5d0b0]",
  "1": "bg-[#162e1a] border-[#8cff3a]/80 text-[#c8f5a8]",
  "2": "bg-[#0f2d45] border-[#38b6ff]/80 text-[#a6dfff]",
  "3": "bg-[#34132d] border-[#ff7acc]/80 text-[#ffb3e3]",
  side: "bg-[#22201e] border-[#EEE3D1]/20 text-[#EEE3D1]/60",
};

const LINE = "rgba(238,227,209,0.45)";

/* ---------------- node ---------------- */
const NodeCard = ({ node, variant = "0" }: { node: VisualNode; variant?: string }) => {
  const colorClass = (node as any).color || COLOR_MAP[variant] || COLOR_MAP.side;
  return (
    <div className={`w-[150px] rounded-xl border px-3 py-2.5 text-center shadow-sm sm:w-[200px] sm:px-4 sm:py-3 ${colorClass}`}>
      <p className="text-[13px] font-semibold leading-5 sm:text-[14px]">{node.label}</p>
      {node.description && (
        <p className="mt-1 text-[11.5px] leading-4 opacity-70 sm:text-[12.5px] sm:leading-5">{node.description}</p>
      )}
    </div>
  );
};

/* ---------------- layering ---------------- */
function buildLevels(nodes: VisualNode[], edges: VisualEdge[]) {
  const ids = new Set(nodes.map(n => n.id));
  const valid = edges.filter(e => ids.has(e.from) && ids.has(e.to) && e.from !== e.to);

  // find back-edges (cycles) with DFS so they don't break layering
  const adj = new Map<string, string[]>();
  nodes.forEach(n => adj.set(n.id, []));
  valid.forEach(e => adj.get(e.from)!.push(e.to));

  const state = new Map<string, 0 | 1 | 2>();
  const back = new Set<string>();
  const dfs = (u: string) => {
    state.set(u, 1);
    for (const v of adj.get(u)!) {
      if (state.get(v) === 1) back.add(`${u}->${v}`);
      else if (!state.get(v)) dfs(v);
    }
    state.set(u, 2);
  };
  const hasIncoming = new Set(valid.map(e => e.to));
  nodes.filter(n => !hasIncoming.has(n.id)).forEach(n => !state.get(n.id) && dfs(n.id));
  nodes.forEach(n => !state.get(n.id) && dfs(n.id));

  const forward = valid.filter(e => !back.has(`${e.from}->${e.to}`));

  // longest-path layering
  const level = new Map<string, number>(nodes.map(n => [n.id, 0]));
  for (let i = 0; i < nodes.length; i++) {
    let changed = false;
    for (const e of forward) {
      const next = (level.get(e.from) ?? 0) + 1;
      if (next > (level.get(e.to) ?? 0)) { level.set(e.to, next); changed = true; }
    }
    if (!changed) break;
  }

  const rows: VisualNode[][] = [];
  nodes.forEach(n => {
    const l = level.get(n.id) ?? 0;
    (rows[l] ||= []).push(n);
  });
  return { rows: rows.filter(Boolean), level, edges: valid };
}

/* ---------------- flowchart ---------------- */
type Box = { x: number; y: number; w: number; h: number };

function Flowchart({ nodes, edges }: { nodes: VisualNode[]; edges: VisualEdge[] }) {
  const { rows, level, edges: validEdges } = useMemo(() => buildLevels(nodes, edges), [nodes, edges]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });

  const sig = nodes.map(n => n.id).join("|") + "#" + edges.map(e => `${e.from}>${e.to}`).join("|");

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const base = el.getBoundingClientRect();
      const next: Record<string, Box> = {};
      for (const [id, node] of Object.entries(refs.current)) {
        if (!node) continue;
        const r = node.getBoundingClientRect();
        next[id] = { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
      }
      setBoxes(next);
      setSize({ w: base.width, h: base.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  const drawn = validEdges
    .map((e, i) => {
      const a = boxes[e.from], b = boxes[e.to];
      if (!a || !b) return null;
      const la = level.get(e.from) ?? 0, lb = level.get(e.to) ?? 0;
      let d = "", lx = 0, ly = 0;

      if (lb > la) {
        const x1 = a.x + a.w / 2, y1 = a.y + a.h;
        const x2 = b.x + b.w / 2, y2 = b.y;
        const k = Math.max(24, (y2 - y1) * 0.5);
        d = `M ${x1} ${y1} C ${x1} ${y1 + k}, ${x2} ${y2 - k}, ${x2} ${y2 - 1}`;
        lx = (x1 + x2) / 2; ly = (y1 + y2) / 2;
      } else if (lb === la) {
        const leftToRight = a.x < b.x;
        const x1 = leftToRight ? a.x + a.w : a.x;
        const x2 = leftToRight ? b.x : b.x + b.w;
        const y = a.y + a.h / 2;
        d = `M ${x1} ${y} L ${x2 + (leftToRight ? -1 : 1)} ${y}`;
        lx = (x1 + x2) / 2; ly = y;
      } else {
        const x1 = a.x + a.w, y1 = a.y + a.h / 2;
        const x2 = b.x + b.w, y2 = b.y + b.h / 2;
        const out = Math.max(x1, x2) + 36;
        d = `M ${x1} ${y1} C ${out} ${y1}, ${out} ${y2}, ${x2 + 1} ${y2}`;
        lx = out; ly = (y1 + y2) / 2;
      }
      return { key: i, d, lx, ly, label: e.label };
    })
    .filter(Boolean) as { key: number; d: string; lx: number; ly: number; label?: string }[];

  return (
    <div className="w-full overflow-x-auto bg-[#171614]">
      <div ref={wrapRef} className="relative mx-auto flex w-fit min-w-full flex-col items-center gap-14 px-10 py-8 sm:gap-16">
        {/* connectors */}
        <svg className="pointer-events-none absolute left-0 top-0" width={size.w} height={size.h} style={{ overflow: "visible" }}>
          <defs>
            <marker id="ira-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE} />
            </marker>
          </defs>
          {drawn.map(p => (
            <path key={p.key} d={p.d} fill="none" stroke={LINE} strokeWidth={1.5} markerEnd="url(#ira-arrow)" />
          ))}
        </svg>

        {/* edge labels */}
        {drawn.map(p =>
          p.label ? (
            <span
              key={`l-${p.key}`}
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-[#EEE3D1]/15 bg-[#171614] px-2 py-0.5 font-mono text-[10.5px] tracking-wider text-[#EEE3D1]/60"
              style={{ left: p.lx, top: p.ly }}
            >
              {p.label}
            </span>
          ) : null
        )}

        {/* rows */}
        {rows.map((row, ri) => (
          <div key={ri} className="relative z-[1] flex flex-wrap items-stretch justify-center gap-x-8 gap-y-14">
            {row.map(n => (
              <div key={n.id} ref={el => { refs.current[n.id] = el; }}>
                <NodeCard node={n} variant={String(ri % 4)} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- steps (simple vertical) ---------------- */
function StepsList({ steps }: { steps: { title: string; description?: string }[] }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center p-6">
      {steps.map((s, i) => (
        <div key={i} className="flex w-full flex-col items-center">
          <NodeCard node={{ id: String(i), label: s.title, description: s.description } as any} variant={String(i % 4)} />
          {i < steps.length - 1 && (
            <div className="flex flex-col items-center py-1">
              <div className="h-6 w-px bg-[#EEE3D1]/40" />
              <div className="h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-[#EEE3D1]/50" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------- small UI bits ---------------- */
const TYPE_LABEL: Record<string, string> = {
  flowchart: "Flowchart",
  concept_map: "Concept map",
  steps: "Steps",
  comparison: "Comparison",
};

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border border-[#EEE3D1]/10 bg-[#EEE3D1]/[0.05] px-2.5 py-0.5 text-[11px] text-[#EEE3D1]/60">
    {children}
  </span>
);

const Pill = ({ open, openText, closeText }: { open: boolean; openText: string; closeText: string }) => (
  <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#EEE3D1]/15 bg-[#EEE3D1]/[0.06] px-3.5 py-1.5 text-[12px] font-medium text-[#EEE3D1]/80 transition group-hover:bg-[#EEE3D1]/[0.12]">
    {open ? closeText : openText}
    {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
  </span>
);

/* ---------------- main ---------------- */
export default function IRAVisualRenderer({
  visual,
  content = "",
  defaultOpen = false,
}: Props) {
  const nodes = visual.nodes ?? [];
  const edges = visual.edges ?? [];
  const steps = visual.steps ?? [];

  const hasDiagram = nodes.length > 0 || steps.length > 0;
  const bigDiagram = nodes.length > 7;

  const [expanded, setExpanded] = useState(hasDiagram && defaultOpen && !bigDiagram);
  const [textExpanded, setTextExpanded] = useState(!hasDiagram);

  const visualIcon = {
    flowchart: <Workflow size={22} strokeWidth={1.75} />,
    concept_map: <Network size={22} strokeWidth={1.75} />,
    steps: <ListOrdered size={22} strokeWidth={1.75} />,
    comparison: <Scale size={22} strokeWidth={1.75} />,
  }[visual.type] ?? <Workflow size={22} strokeWidth={1.75} />;

  // short plain-text preview of the explanation
  const preview = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*`>\[\]_]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 110);

  return (
    <section className="my-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-[#EEE3D1]/15 bg-[#171614] shadow-lg shadow-black/20">
      {/* ===== diagram header ===== */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-[#EEE3D1]/[0.03]"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-400/30 bg-orange-400/10 text-orange-300">
          {visualIcon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-[#EEE3D1]">{visual.title || "Visual structure"}</h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Chip>{TYPE_LABEL[visual.type] ?? "Visual"}</Chip>
            {nodes.length > 0 && <Chip>{nodes.length} steps</Chip>}
            {edges.length > 0 && <Chip>{edges.length} connections</Chip>}
            {nodes.length === 0 && steps.length > 0 && <Chip>{steps.length} steps</Chip>}
          </div>
        </div>

        <Pill open={expanded} openText="Open diagram" closeText="Close" />
      </button>

      {/* ===== diagram body ===== */}
      {expanded && (
        <div className="border-t border-[#EEE3D1]/10 bg-[#0e0e0d]">
          {visual.description && (
            <div className="p-4 text-sm text-[#EEE3D1]/60"><IRAMarkdown content={visual.description} /></div>
          )}
          {nodes.length > 0 ? (
            <Flowchart nodes={nodes} edges={edges} />
          ) : steps.length > 0 ? (
            <StepsList steps={steps} />
          ) : (
            <div className="p-10 text-center text-sm text-[#EEE3D1]/30">No nodes</div>
          )}
        </div>
      )}

      {/* ===== explanation ===== */}
      {content.trim() && (
        <div className="border-t border-[#EEE3D1]/10">
          <button
            onClick={() => setTextExpanded(v => !v)}
            className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-[#EEE3D1]/[0.03]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-400/10 text-sky-300">
              <BookOpen size={22} strokeWidth={1.75} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-[#EEE3D1]">Read explanation</p>
              <p className="mt-0.5 truncate text-[12.5px] text-[#EEE3D1]/45">
                {textExpanded ? "Full answer in simple words" : preview || "Tap to read the full answer"}
              </p>
            </div>

            <Pill open={textExpanded} openText="Show" closeText="Hide" />
          </button>

          {textExpanded && (
            <div className="border-t border-[#EEE3D1]/10 p-5">
              <IRAMarkdown content={content} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}