"use client";

import Image from "next/image";
import type { IRAState } from "./types";

interface Props {
  state?: IRAState;
  hideLabel?: boolean;
}

const stateLabels: Record<IRAState, string> = {
  analyzing:
    "IRA is carefully analyzing your request to understand what you're looking for...",

  retrieving:
    "IRA is recalling relevant memories and context to make this response more useful for you...",

  memorizing:
    "IRA is organizing relevant information and context for your request...",

  tool_checking:
    "IRA is identifying the most suitable tools and approach for your request...",

  tool_executing:
    "IRA is working through the necessary steps to complete your request...",

  routing:
    "IRA is selecting the appropriate intelligence and capabilities for your request...",

  translating:
    "IRA is understanding your language and preparing a response in the right communication style...",

  reasoning:
    "IRA is thinking through your request carefully, evaluating the details and working towards the best possible response...",

  visualizing:
    "IRA is preparing relevant visual elements to make the explanation easier to understand...",

  composing:
    "IRA is putting everything together to prepare a clear, thoughtful and helpful response for you...",
};

export default function IRABrainThinking({
  state,
  hideLabel = false,
}: Props) {
  if (!state) return null;

  return (
    <div
      className={`flex items-center gap-3 px-1 py-2 ${
        hideLabel ? "justify-center" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* EXISTING IRA INTELLIGENCE CORE */}

      <div className="ira-core relative flex h-11 w-11 shrink-0 items-center justify-center">
        <div className="ira-core-aura absolute inset-1 rounded-full" />

        <div className="ira-orbit ira-orbit-outer absolute inset-0 rounded-full">
          <span className="ira-orbit-point" />
        </div>

        <div className="ira-orbit ira-orbit-inner absolute rounded-full">
          <span className="ira-orbit-point" />
        </div>

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
      </div>

      {/* DYNAMIC PIPELINE MESSAGE */}

      {!hideLabel && (
        <div className="min-w-0 max-w-[min(75vw,620px)]">
          <span
            key={state}
            className="ira-state-label ira-state-loading block !whitespace-normal !overflow-visible !text-clip break-words text-sm leading-7 text-[#EEE3D1]/75"
          >
            {stateLabels[state]}
          </span>
        </div>
      )}
    </div>
  );
}