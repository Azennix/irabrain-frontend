"use client";
import React, { memo, useState, Children, isValidElement } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Lightbulb, AlertTriangle, Check, Copy, Clock, Sparkles } from "lucide-react";

interface IRAMarkdownProps { content: string; }

/* ---------- fonts (add the Google fonts in layout.tsx, see note below) ---------- */
const SERIF = { fontFamily: "'Instrument Serif', 'Playfair Display', Georgia, serif" };
const MONO = { fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace" };

const ACCENTS = ["#FF8A2B", "#A3E635", "#38BDF8", "#F472B6", "#A78BFA", "#FBBF24"];

/* ---------- helpers ---------- */
const getText = (node: any): string =>
  Children.toArray(node)
    .map((c: any) => (typeof c === "string" || typeof c === "number" ? String(c) : isValidElement(c) ? getText((c.props as any).children) : ""))
    .join("");

type Section = { title: string; label: string; body: string };

function parse(content: string) {
  const lines = content.split("\n");
  let inFence = false;
  const introLines: string[] = [];
  const sections: { title: string; lines: string[] }[] = [];
  let cur: { title: string; lines: string[] } | null = null;

  for (const line of lines) {
    if (line.trim().startsWith("```")) inFence = !inFence;
    const h2 = !inFence && /^##\s+(.+)/.exec(line);
    if (h2) {
      cur = { title: h2[1].trim(), lines: [] };
      sections.push(cur);
    } else if (cur) cur.lines.push(line);
    else introLines.push(line);
  }

  const out: Section[] = sections.map((s, i) => {
    let body = s.lines.join("\n").trim();
    let label = `Part ${String(i + 1).padStart(2, "0")}`;
    const m = /^\[([^\]\n]+)\]\s*\n?/.exec(body);
    if (m) {
      label = m[1].trim();
      body = body.slice(m[0].length).trim();
    }
    return { title: s.title, label, body };
  });

  let intro = introLines.join("\n").trim();
  let eyebrow = "";
  const h1 = /^#\s+(.+)\n?/.exec(intro);
  if (h1) {
    eyebrow = h1[1].trim();
    intro = intro.slice(h1[0].length).trim();
  }
  return { eyebrow, intro, sections: out };
}

/* ---------- callout ---------- */
const Callout = ({ type, children }: { type: "TIP" | "WARNING" | "INSIGHT"; children: any }) => {
  const map = {
    TIP: { border: "border-emerald-500/20", bg: "bg-emerald-500/[0.06]", icon: <Check size={14} className="text-emerald-400" /> },
    WARNING: { border: "border-red-500/20", bg: "bg-red-500/[0.06]", icon: <AlertTriangle size={14} className="text-red-400" /> },
    INSIGHT: { border: "border-[#EEE3D1]/10", bg: "bg-[#EEE3D1]/[0.03]", icon: <Lightbulb size={14} className="text-[#EEE3D1]/60" /> },
  }[type];
  return (
    <div className={`my-4 rounded-xl border ${map.border} ${map.bg} px-4 py-3`}>
      <div className="flex gap-2.5">
        <span className="mt-0.5">{map.icon}</span>
        <div className="text-[14px] leading-7 text-[#EEE3D1]/80">{children}</div>
      </div>
    </div>
  );
};

/* ---------- code block ---------- */
const CodeBlock = ({ lang, code }: { lang: string; code: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="my-5 overflow-hidden rounded-xl border border-[#EEE3D1]/10 bg-[#0f0f0e]">
      <div className="flex items-center justify-between border-b border-[#EEE3D1]/10 bg-[#EEE3D1]/[0.03] px-4 py-2">
        <span className="text-[11px] uppercase tracking-wider text-[#EEE3D1]/40" style={MONO}>{lang}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
          className="flex items-center gap-1 text-[12px] text-[#EEE3D1]/40 hover:text-[#EEE3D1]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter language={lang} style={vscDarkPlus} PreTag="div" customStyle={{ margin: 0, padding: "16px", background: "transparent", fontSize: "13px", lineHeight: "1.6" }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

/* ---------- markdown elements (inside cards) ---------- */
const components: Components = {
  h1: ({ children }) => <h1 className="mb-3 mt-6 text-[22px] leading-8 text-[#EEE3D1]" style={SERIF}>{children}</h1>,
  h3: ({ children }) => <h3 className="mb-2 mt-5 text-[16px] font-semibold text-[#EEE3D1]/90">{children}</h3>,
  h4: ({ children }) => <h4 className="mb-2 mt-4 text-[14px] font-semibold text-[#EEE3D1]/80">{children}</h4>,

  p: ({ children }) => {
    const text = getText(children).trim();
    if (text.startsWith("[!TIP]")) return <Callout type="TIP">{text.replace("[!TIP]", "")}</Callout>;
    if (text.startsWith("[!WARNING]")) return <Callout type="WARNING">{text.replace("[!WARNING]", "")}</Callout>;
    if (text.startsWith("[!INSIGHT]")) return <Callout type="INSIGHT">{text.replace("[!INSIGHT]", "")}</Callout>;

    // "Examples: a, b, c"  ->  dashed divider + mono footer
    if (/^examples?:/i.test(text)) {
      return (
        <div className="mt-5 border-t border-dashed border-[#EEE3D1]/15 pt-4">
          <p className="text-[13px] leading-6 text-[#EEE3D1]/55 [&_strong]:font-bold [&_strong]:text-[color:var(--accent)]" style={MONO}>
            {children}
          </p>
        </div>
      );
    }
    return <p className="mb-4 text-[16px] leading-[1.75] text-[#EEE3D1]/65 last:mb-0">{children}</p>;
  },

  ul: ({ children }) => <ul className="mb-4 ml-5 list-disc space-y-2.5 text-[16px] leading-[1.75] text-[#EEE3D1]/65 marker:text-[color:var(--accent)]">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 ml-5 list-decimal space-y-2.5 text-[16px] leading-[1.75] text-[#EEE3D1]/65 marker:text-[color:var(--accent)] marker:font-semibold">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,

  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-[#EEE3D1]/85">{children}</em>,

  blockquote: ({ children }) => <blockquote className="my-4 border-l-2 border-[#EEE3D1]/15 pl-4 italic text-[#EEE3D1]/60">{children}</blockquote>,
  a: ({ href, children }) => <a href={href} target="_blank" className="text-[#EEE3D1] underline decoration-[#EEE3D1]/20 underline-offset-4 hover:decoration-[#EEE3D1]/50">{children}</a>,
  hr: () => <hr className="my-6 border-[#EEE3D1]/10" />,

  table: ({ children }) => <div className="my-4 overflow-x-auto rounded-xl border border-[#EEE3D1]/10"><table className="w-full text-left text-[14px]">{children}</table></div>,
  thead: ({ children }) => <thead className="bg-[#EEE3D1]/[0.04] text-[#EEE3D1]/70">{children}</thead>,
  th: ({ children }) => <th className="border-b border-[#EEE3D1]/10 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider">{children}</th>,
  td: ({ children }) => <td className="border-b border-[#EEE3D1]/[0.06] px-4 py-2.5 text-[#EEE3D1]/70">{children}</td>,

  code: ({ children, className }) => {
    const match = /language-([\w+#.-]+)/.exec(className || "");
    if (!match) {
      return <code className="rounded-md bg-[#EEE3D1]/10 px-1.5 py-0.5 text-[13px] text-[#EEE3D1]" style={MONO}>{children}</code>;
    }
    return <CodeBlock lang={match[1]} code={String(children).replace(/\n$/, "")} />;
  },
};

const MD = ({ children }: { children: string }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{children}</ReactMarkdown>
);

/* ---------- the card (image-1 style) ---------- */
const Card = ({ index, accent, label, title, body }: { index: number; accent: string; label: string; title?: string; body: string }) => (
  <section
    className="relative mb-5 overflow-hidden rounded-[22px] border border-[#EEE3D1]/[0.07] bg-[#1b1916] py-6 pl-7 pr-6"
    style={{ ["--accent" as any]: accent, borderLeft: `4px solid ${accent}` }}
  >
    
   
    {/* label */}
    <div className="mb-2 flex items-center gap-2.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
      <span className="text-[12px] font-medium uppercase tracking-[0.22em]" style={{ ...MONO, color: accent }}>{label}</span>
    </div>

    
    <MD>{body}</MD>
  </section>
);

/* ---------- main ---------- */
function IRAMarkdown({ content }: IRAMarkdownProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const words = content.trim().split(/\s+/).length;
  const read = Math.max(1, Math.ceil(words / 200));
  const { eyebrow, intro, sections } = parse(content);

  // short & simple reply -> plain text, no card, no meta bar
  const isShort =
    words < 40 &&
    sections.length === 0 &&
    !/```|^\s*([-*]|\d+\.)\s/m.test(content);

  if (isShort) {
    return (
      <div className="ira-markdown min-w-0 break-words">
        <MD>{content}</MD>
      </div>
    );
  }
  return (
    <div className="ira-markdown min-w-0 break-words">
      {/* meta bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#EEE3D1]/35">
          <span className="flex items-center gap-1.5"><Clock size={11} /> {read} min read</span>
          <span className="h-3 w-px bg-[#EEE3D1]/10" />
          <span>{words} words</span>
          <span className="h-3 w-px bg-[#EEE3D1]/10" />
          <span className="flex items-center gap-1 text-[#EEE3D1]/50"><Sparkles size={11} /> Action ready</span>
        </div>
        <button
          onClick={() => { navigator.clipboard.writeText(content); setCopiedAll(true); setTimeout(() => setCopiedAll(false), 1200); }}
          className="flex items-center gap-1 rounded-full border border-[#EEE3D1]/10 bg-[#EEE3D1]/[0.04] px-3 py-1 text-[12px] text-[#EEE3D1]/50 hover:text-[#EEE3D1]"
        >
          {copiedAll ? <Check size={11} /> : <Copy size={11} />} {copiedAll ? "Copied!" : "Copy response"}
        </button>
      </div>

      {/* eyebrow from "# Title" */}
      {eyebrow && (
        <div className="mb-4 flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: ACCENTS[0] }} />
          <span className="text-[13px] uppercase tracking-[0.25em] text-[#EEE3D1]/55" style={MONO}>{eyebrow}</span>
        </div>
      )}

      {/* intro text before the first ## */}
      {intro && sections.length > 0 && (
        <div className="mb-5"><MD>{intro}</MD></div>
      )}

      {/* cards */}
      {sections.length > 0 ? (
        sections.map((s, i) => (
          <Card key={i} index={i} accent={ACCENTS[i % ACCENTS.length]} label={s.label} title={s.title} body={s.body} />
        ))
      ) : (
        // no "##" headings (plain answers / lists) -> still one card
        <Card index={0} accent={ACCENTS[0]} label="Answer" body={intro || content} />
      )}
    </div>
  );
}

export default memo(IRAMarkdown);