"use client";

import Image from "next/image";
import type { IRAState } from "./types";

interface Props {
  state?: IRAState;
}

const stateLabels: Record<IRAState, string> = {
  analyzing: "Analyzing message...",
  retrieving: "Retrieving memories...",
  memorizing: "Memorizing context...",
  tool_checking: "Checking tools...",
  tool_executing: "Executing tools...",
  routing: "Routing intelligence...",
  translating: "Detecting language...",
  reasoning: "Reasoning...",
  visualizing: "Visualizing ideas...",
  composing: "Composing response...",
};

export default function IRABrainThinking({ state }: Props) {
  if (!state) return null;

  return (
    <div
      className="flex items-center gap-3 px-1 py-2"
      role="status"
      aria-live="polite"
    >
      {/* IRABRAIN INTELLIGENCE CORE */}
      <div className="ira-core relative flex h-11 w-11 shrink-0 items-center justify-center">

        {/* Ambient energy */}
        <div className="ira-core-aura absolute inset-1 rounded-full" />

        {/* Outer orbital ring */}
        <div className="ira-orbit ira-orbit-outer absolute inset-0 rounded-full">
          <span className="ira-orbit-point" />
        </div>

        {/* Inner orbital ring */}
        <div className="ira-orbit ira-orbit-inner absolute rounded-full">
          <span className="ira-orbit-point" />
        </div>

        {/* Existing brand logo */}
       <div className="ira-core-logo relative z-10 flex h-7 w-7 items-center justify-center">
  <span className="ira-metallic-logo">
    <Image
      src="/irabrain-logo.png"
      alt="IRABRAIN"
      width={25}
      height={25}
      priority
      className="object-contain"
    />
  </span>
</div>

        {/* Tiny intelligence signal */}
        <span className="ira-core-signal absolute right-[2px] top-[5px]" />
      </div>

      {/* LIVE PIPELINE STATE */}
      <div className="min-w-0">
  <span
    key={state}
    className="ira-state-label ira-state-loading text-xs"
  >
    {stateLabels[state]}
  </span>
</div>
    </div>
  );
}