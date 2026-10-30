"use client";
import React, { useState, useRef, useLayoutEffect, useMemo } from "react";
import {
  ChevronDown, ChevronUp,
  Workflow, Network, ListOrdered, Scale,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from "recharts";
import type { VisualPayload, VisualNode, VisualEdge } from "./types";
import IRAMarkdown from "./markdown/IRAMarkdown";

interface SingleProps {
  visual: VisualPayload;
  content?: string;
  defaultOpen?: boolean;
}

interface Props {
  visual: VisualPayload | VisualPayload[];
  content?: string;
  defaultOpen?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  "0": "bg-[#000000] border-[#8A0303]/70 text-[#EEE3D1]",
  "1": "bg-[#171614] border-[#EEE3D1]/25 text-[#EEE3D1]",
  "2": "bg-[#171614] border-[#EEE3D1]/40 text-[#EEE3D1]",
  "3": "bg-[#171614] border-[#EEE3D1]/20 text-[#EEE3D1]/85",
  side: "bg-[#171614] border-[#EEE3D1]/20 text-[#EEE3D1]/70",
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

/* ---------------- concept map ---------------- */
function ConceptMap({
  nodes, edges, centerNodeId,
}: { nodes: VisualNode[]; edges: VisualEdge[]; centerNodeId?: string }) {
  const center =
    nodes.find(n => n.id === centerNodeId) ??
    nodes.find(n => !edges.some(e => e.to === n.id)) ??
    nodes[0];
  const others = nodes.filter(n => n.id !== center?.id);

  return (
    <div className="flex flex-col items-center gap-5 bg-[#000000] px-4 py-8">
      {center && (
        <div className="rounded-2xl border border-[#8A0303]/70 bg-[#171614] px-6 py-4 text-center shadow-[0_0_24px_rgba(138,3,3,0.08)]">
          <p className="text-base font-semibold text-[#EEE3D1]">{center.label}</p>
          {center.description && <p className="mt-1 text-sm text-[#EEE3D1]/60">{center.description}</p>}
        </div>
      )}
      {others.length > 0 && <div className="h-7 w-px bg-[#EEE3D1]/35" />}
      <div className="flex w-full flex-wrap justify-center gap-3">
        {others.map(n => {
          const relation = edges.find(e =>
            (e.from === center?.id && e.to === n.id) ||
            (e.to === center?.id && e.from === n.id)
          );
          return (
            <div key={n.id} className="max-w-[220px] rounded-xl border border-[#EEE3D1]/20 bg-[#171614] px-4 py-3 text-center">
              {relation?.label && <p className="mb-1 font-mono text-[10px] text-[#EEE3D1]/45">{relation.label}</p>}
              <p className="text-sm font-medium text-[#EEE3D1]">{n.label}</p>
              {n.description && <p className="mt-1 text-xs text-[#EEE3D1]/55">{n.description}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- hierarchy ---------------- */
function HierarchyView({ nodes }: { nodes: VisualNode[] }) {
  const roots = nodes.filter(n => !n.parentId || !nodes.some(p => p.id === n.parentId));
  const children = (id: string) => nodes.filter(n => n.parentId === id);

  const branch = (node: VisualNode, depth = 0): React.ReactNode => (
    <div key={node.id} className="flex flex-col items-center">
      <div className={`max-w-[220px] rounded-xl border px-4 py-3 text-center ${depth === 0 ? "border-[#8A0303]/60 bg-[#171614]" : "border-[#EEE3D1]/20 bg-[#000000]"}`}>
        <p className="text-sm font-semibold text-[#EEE3D1]">{node.label}</p>
        {node.description && <p className="mt-1 text-xs text-[#EEE3D1]/55">{node.description}</p>}
      </div>
      {children(node.id).length > 0 && (
        <>
          <div className="h-6 w-px bg-[#EEE3D1]/35" />
          <div className="flex flex-wrap items-start justify-center gap-4 border-t border-[#EEE3D1]/20 pt-4">
            {children(node.id).map(child => branch(child, depth + 1))}
          </div>
        </>
      )}
    </div>
  );

  return <div className="flex flex-wrap justify-center gap-8 overflow-x-auto bg-[#000000] px-4 py-8">{roots.map(root => branch(root))}</div>;
}

/* ---------------- timeline ---------------- */
function TimelineView({ events }: { events: { title: string; date?: string; description?: string }[] }) {
  return (
    <div className="bg-[#000000] px-5 py-7">
      {events.map((event, i) => (
        <div key={`${event.title}-${i}`} className="relative flex gap-4 pb-7 last:pb-0">
          {i < events.length - 1 && <div className="absolute left-[7px] top-4 h-full w-px bg-[#EEE3D1]/25" />}
          <span className="relative mt-1.5 h-4 w-4 shrink-0 rounded-full border border-[#8A0303]/70 bg-[#171614]" />
          <div className="min-w-0 flex-1 rounded-xl border border-[#EEE3D1]/15 bg-[#171614] p-4">
            {event.date && <p className="mb-1 font-mono text-[11px] text-[#EEE3D1]/45">{event.date}</p>}
            <p className="text-sm font-semibold text-[#EEE3D1]">{event.title}</p>
            {event.description && <p className="mt-1 text-sm text-[#EEE3D1]/60">{event.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- cycle ---------------- */
function CycleView({ nodes }: { nodes: VisualNode[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 bg-[#000000] px-4 py-8">
      {nodes.map((node, i) => (
        <React.Fragment key={node.id}>
          <div className="max-w-[200px] rounded-xl border border-[#EEE3D1]/25 bg-[#171614] px-4 py-3 text-center">
            <p className="text-sm font-semibold text-[#EEE3D1]">{node.label}</p>
            {node.description && <p className="mt-1 text-xs text-[#EEE3D1]/55">{node.description}</p>}
          </div>
          {i < nodes.length - 1 && <span className="text-[#8A0303]">→</span>}
        </React.Fragment>
      ))}
      {nodes.length > 1 && <span className="text-xs text-[#EEE3D1]/50">↺ back to start</span>}
    </div>
  );
}

/* ---------------- comparison ---------------- */
function ComparisonView({ columns, comparisons }: {
  columns: string[];
  comparisons: { label: string; values: string[] }[];
}) {
  let normalizedColumns = columns;
  let normalizedComparisons = comparisons;

  const firstCol = columns[0]?.toLowerCase() || "";
  if (["stage", "step", "phase", "aspect", "feature"].includes(firstCol)) {
    normalizedColumns = columns.slice(1);
    normalizedComparisons = comparisons.map(row => {
      if (row.values.length === columns.length) {
        return { ...row, values: row.values.slice(0, normalizedColumns.length) };
      }
      return row;
    });
  }

  const count = Math.max(normalizedColumns.length, ...normalizedComparisons.map(row => row.values.length), 0);
  const headers = Array.from({ length: count }, (_, i) => normalizedColumns[i] ?? `Option ${i + 1}`);

  return (
    <div className="overflow-x-auto bg-[#000000] p-4">
      <div className="min-w-[480px]">
        <div className="grid gap-2" style={{ gridTemplateColumns: `minmax(110px,0.8fr) repeat(${headers.length},minmax(120px,1fr))` }}>
          <div className="p-2" />
          {headers.map((header, i) => (
            <div key={i} className="rounded-lg border border-[#EEE3D1]/20 bg-[#171614] p-3 text-sm font-semibold text-[#EEE3D1]">{header}</div>
          ))}
          {normalizedComparisons.map((row, ri) => (
            <React.Fragment key={`${row.label}-${ri}`}>
              <div className="flex items-center border-b border-[#EEE3D1]/10 py-3 text-xs font-semibold text-[#EEE3D1]/65">{row.label}</div>
              {headers.map((_, i) => (
                <div key={i} className="border-b border-[#EEE3D1]/10 px-3 py-3 text-sm text-[#EEE3D1]/85">{row.values[i] ?? "—"}</div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- charts (bar / line / pie) ---------------- */
const CHART_COLORS = ["#c24848", "#EEE3D1", "#8A8578", "#d9a05b", "#6b9080", "#7a6a9a"];

function ChartView({ chart }: { chart: NonNullable<VisualPayload["chart"]> }) {
  const kind = chart.kind ?? "bar";
  const data = chart.labels.map((label, i) => {
    const row: Record<string, any> = { name: label };
    chart.series.forEach(s => { row[s.name] = s.values[i]; });
    return row;
  });
  const tip = {
    contentStyle: { background: "#171614", border: "1px solid rgba(238,227,209,0.2)", borderRadius: 8, color: "#EEE3D1" },
    labelStyle: { color: "#EEE3D1" },
  };
  const axis = { stroke: "rgba(238,227,209,0.4)", fontSize: 11 };
  const unit = chart.unit ? ` ${chart.unit}` : "";

  return (
    <div className="h-72 w-full bg-[#000000] p-4">
      <ResponsiveContainer width="100%" height="100%">
        {kind === "pie" ? (
          <PieChart>
            <Pie data={data} dataKey={chart.series[0].name} nameKey="name" outerRadius="75%" label>
              {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip {...tip} />
            <Legend />
          </PieChart>
        ) : kind === "line" ? (
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(238,227,209,0.08)" />
            <XAxis dataKey="name" {...axis} />
            <YAxis {...axis} unit={unit} />
            <Tooltip {...tip} />
            {chart.series.length > 1 && <Legend />}
            {chart.series.map((s, i) => (
              <Line
                key={s.name}
                type="monotone"
                dataKey={s.name}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(238,227,209,0.08)" />
            <XAxis dataKey="name" {...axis} />
            <YAxis {...axis} unit={unit} />
            <Tooltip {...tip} cursor={{ fill: "rgba(238,227,209,0.05)" }} />
            {chart.series.length > 1 && <Legend />}
            {chart.series.map((s, i) => (
              <Bar
                key={s.name}
                dataKey={s.name}
                fill={CHART_COLORS[i % CHART_COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------- system architecture (layers) ---------------- */
function ArchitectureView({ nodes }: { nodes: VisualNode[] }) {
  const layers: { name: string; items: VisualNode[] }[] = [];
  nodes.forEach(n => {
    const name = (n as any).layer || (n as any).group || "Components";
    let l = layers.find(x => x.name === name);
    if (!l) { l = { name, items: [] }; layers.push(l); }
    l.items.push(n);
  });

  return (
    <div className="space-y-3 bg-[#000000] p-4">
      {layers.map((layer, i) => (
        <div key={layer.name}>
          <div className="rounded-xl border border-dashed border-[#EEE3D1]/20 p-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A0303]">{layer.name}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {layer.items.map(n => <NodeCard key={n.id} node={n} variant="1" />)}
            </div>
          </div>
          {i < layers.length - 1 && <p className="py-1 text-center text-[#EEE3D1]/40">↓</p>}
        </div>
      ))}
    </div>
  );
}

/* ---------------- connection graph (network) ---------------- */
function ConnectionGraphView({ nodes, edges }: { nodes: VisualNode[]; edges: VisualEdge[] }) {
  const W = 640, H = 420, cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2 - 70;
  const pos = new Map(nodes.map((n, i) => {
    const a = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    return [n.id, { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }];
  }));

  return (
    <div className="overflow-x-auto bg-[#000000] p-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full min-w-[480px]">
        {edges.map((e, i) => {
          const a = pos.get(e.from), b = pos.get(e.to);
          if (!a || !b) return null;
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(238,227,209,0.35)" strokeWidth={1.2} />
              {e.label && (
                <text
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2}
                  fill="rgba(238,227,209,0.55)"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {nodes.map(n => {
          const p = pos.get(n.id)!;
          return (
            <g key={n.id}>
              <circle cx={p.x} cy={p.y} r={26} fill="#171614" stroke="rgba(138,3,3,0.7)" strokeWidth={1.5} />
              <text x={p.x} y={p.y + 4} fill="#EEE3D1" fontSize="10" textAnchor="middle">
                {n.label.length > 12 ? n.label.slice(0, 11) + "…" : n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------------- labels ---------------- */
const TYPE_LABEL: Record<string, string> = {
  flowchart: "Flowchart",
  concept_map: "Concept map",
  steps: "Steps",
  comparison: "Comparison",
  system_architecture: "System architecture",
  connection_graph: "Connection graph",
  hierarchy: "Hierarchy",
  decision_tree: "Decision tree",
  cycle: "Cycle",
  timeline: "Timeline",
  data_chart: "Data chart",
};

/* ---------------- single card ---------------- */
function SingleCard({ visual, defaultOpen = false }: SingleProps) {
  const nodes = visual.nodes ?? [];
  const edges = visual.edges ?? [];
  const steps = visual.steps ?? [];

  const hasDiagram =
    nodes.length > 0 || steps.length > 0 ||
    !!visual.comparisons?.length || !!visual.timeline?.length || !!visual.chart;
  const bigDiagram = nodes.length > 7;
  const [expanded, setExpanded] = useState(hasDiagram && defaultOpen && !bigDiagram);

  if (!hasDiagram) return null;

  const count =
    nodes.length || steps.length || visual.comparisons?.length || visual.timeline?.length || 0;

  const iconMap: Record<string, React.ReactNode> = {
    concept_map: <Network size={18} strokeWidth={1.75} />,
    connection_graph: <Network size={18} strokeWidth={1.75} />,
    hierarchy: <Network size={18} strokeWidth={1.75} />,
    steps: <ListOrdered size={18} strokeWidth={1.75} />,
    timeline: <ListOrdered size={18} strokeWidth={1.75} />,
    comparison: <Scale size={18} strokeWidth={1.75} />,
    data_chart: <Scale size={18} strokeWidth={1.75} />,
  };

  const visualIcon = iconMap[visual.type as string] ?? (
    <Workflow size={18} strokeWidth={1.75} />
  );

  return (
    <section className="w-full">
      <button
        onClick={() => setExpanded(v => !v)}
        className="group flex w-full items-center gap-3 border-l-2 border-[#8A0303] py-1 pl-3 text-left"
      >
        <span className="shrink-0 text-[#c24848]">{visualIcon}</span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-[#EEE3D1]">
            {visual.title || "Visual structure"}
          </h3>
          <p className="text-[12px] text-[#EEE3D1]/45">
            {TYPE_LABEL[visual.type] ?? "Visual"}{count > 0 && ` · ${count} items`}
          </p>
        </div>

        <span className="flex shrink-0 items-center gap-1 text-[12.5px] text-[#EEE3D1]/60 transition group-hover:text-[#EEE3D1]">
          {expanded ? "Hide" : "View related visuals"}
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>

      {expanded && (
        <div className="mt-3 overflow-hidden rounded-xl border border-[#EEE3D1]/10 bg-[#0A0A0A]">
          {visual.description && (
            <div className="px-4 pt-3 text-sm text-[#EEE3D1]/60">
              <IRAMarkdown content={visual.description} />
            </div>
          )}

          {visual.type === "comparison" && visual.comparisons?.length ? (
            <ComparisonView columns={visual.columns ?? []} comparisons={visual.comparisons} />
          ) : visual.type === "data_chart" && visual.chart ? (
            <ChartView chart={visual.chart} />
          ) : visual.type === "timeline" && visual.timeline?.length ? (
            <TimelineView events={visual.timeline} />
          ) : visual.type === "cycle" && nodes.length ? (
            <CycleView nodes={nodes} />
          ) : visual.type === "hierarchy" && nodes.length ? (
            <HierarchyView nodes={nodes} />
          ) : visual.type === "concept_map" && nodes.length ? (
            <ConceptMap
              nodes={nodes}
              edges={edges}
              centerNodeId={(visual as any).centerNodeId}
            />
          ) : visual.type === "system_architecture" && nodes.length ? (
            <ArchitectureView nodes={nodes} />
          ) : visual.type === "connection_graph" && nodes.length ? (
            <ConnectionGraphView nodes={nodes} edges={edges} />
          ) : nodes.length > 0 ? (
            <Flowchart nodes={nodes} edges={edges} />
          ) : steps.length > 0 ? (
            <StepsList steps={steps} />
          ) : null}
        </div>
      )}
    </section>
  );
}

/* ---------------- MAIN - SINGLE VISUAL PER ANSWER ---------------- */
export default function IRAVisualRenderer({
  visual,
  content = "",
  defaultOpen = false,
}: Props) {
  const singleVisual = Array.isArray(visual) ? visual[0] : visual;

  if (!singleVisual || singleVisual.type === undefined) {
    return null;
  }

  return (
    <div className="my-4 w-full max-w-2xl">
      <SingleCard
        key={`${singleVisual.title}-${singleVisual.type}`}
        visual={singleVisual}
        content={content}
        defaultOpen={defaultOpen}
      />
    </div>
  );
}