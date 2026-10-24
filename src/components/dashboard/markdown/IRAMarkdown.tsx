
"use client";

import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface IRAMarkdownProps {
  content: string;
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-7 text-2xl font-semibold tracking-tight text-[#EEE3D1] first:mt-0">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="mb-3 mt-6 text-xl font-semibold tracking-tight text-[#EEE3D1] first:mt-0">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="mb-2 mt-5 text-lg font-semibold text-[#EEE3D1] first:mt-0">
      {children}
    </h3>
  ),

  p: ({ children }) => (
    <p className="mb-4 text-[14px] leading-7 text-[#EEE3D1]/90 last:mb-0 sm:text-[15px]">
      {children}
    </p>
  ),

  ul: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2 text-[14px] leading-7 text-[#EEE3D1]/90 sm:text-[15px]">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2 text-[14px] leading-7 text-[#EEE3D1]/90 sm:text-[15px]">
      {children}
    </ol>
  ),

  li: ({ children }) => <li className="pl-1">{children}</li>,

  strong: ({ children }) => (
    <strong className="font-semibold text-[#EEE3D1]">
      {children}
    </strong>
  ),

  em: ({ children }) => (
    <em className="italic text-[#EEE3D1]/90">{children}</em>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-[#8A0303]/70 pl-4 text-[#EEE3D1]/70">
      {children}
    </blockquote>
  ),

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#EEE3D1] underline decoration-[#8A0303]/70 underline-offset-4 hover:decoration-[#EEE3D1]"
    >
      {children}
    </a>
  ),

  hr: () => <hr className="my-6 border-[#EEE3D1]/10" />,

  table: ({ children }) => (
    <div className="my-5 w-full overflow-x-auto rounded-lg border border-[#EEE3D1]/10">
      <table className="w-full border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-[#EEE3D1]/[0.06] text-[#EEE3D1]">
      {children}
    </thead>
  ),

  th: ({ children }) => (
    <th className="border-b border-[#EEE3D1]/10 px-4 py-3 font-semibold">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="border-b border-[#EEE3D1]/[0.07] px-4 py-3 text-[#EEE3D1]/80">
      {children}
    </td>
  ),

  code: ({ children, className }) => {
    const match = /language-([\w+#.-]+)/.exec(className || "");
    const code = String(children).replace(/\n$/, "");

    if (!match) {
      return (
        <code className="rounded-md border border-[#EEE3D1]/10 bg-[#EEE3D1]/[0.07] px-1.5 py-0.5 font-mono text-[0.88em] text-[#EEE3D1]">
          {children}
        </code>
      );
    }

    return (
      <div className="my-5 overflow-hidden rounded-xl border border-[#EEE3D1]/10">
        <div className="flex items-center justify-between border-b border-[#EEE3D1]/10 bg-[#EEE3D1]/[0.05] px-4 py-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#EEE3D1]/50">
            {match[1]}
          </span>
          <span className="text-[10px] text-[#EEE3D1]/35">
            Code
          </span>
        </div>

        <SyntaxHighlighter
          language={match[1]}
          style={vscDarkPlus}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "16px",
            background: "#101010",
            fontSize: "13px",
            lineHeight: "1.7",
            overflowX: "auto",
          }}
          codeTagProps={{
            style: {
              fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  },
};

function IRAMarkdown({ content }: IRAMarkdownProps) {
  return (
    <div className="ira-markdown min-w-0 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default memo(IRAMarkdown);

