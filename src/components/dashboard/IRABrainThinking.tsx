"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { IRAState } from "./types";



interface IRABrainThinkingProps {
  state?: IRAState;
}

const stateLabels: Record<IRAState, string> = {
  thinking: "Thinking...",
  reasoning: "Reasoning...",
  retrieving: "Retrieving...",
  brainstorming: "Brainstorming...",
  connecting: "Connecting ideas...",
  preparing: "Preparing response...",
};

const stateSequence: IRAState[] = [
  "thinking",
  "reasoning",
  "retrieving",
  "brainstorming",
  "connecting",
  "preparing",
];

export default function IRABrainThinking({
  state,
}: IRABrainThinkingProps) {
  const [internalState, setInternalState] =
    useState<IRAState>("thinking");

  useEffect(() => {
    // If parent controls the state,
    // don't run the internal state cycle.
    if (state) {
      return;
    }

    let index = 0;

    const timer = setInterval(() => {
      index = (index + 1) % stateSequence.length;

      setInternalState(stateSequence[index]);
    }, 1400);

    return () => {
      clearInterval(timer);
    };
  }, [state]);

  const currentState = state ?? internalState;

  return (
    <div className="flex items-center gap-3 px-1 py-2">
      
      {/* =========================================
          IRA INTELLIGENCE CORE
      ========================================= */}

      <div className="relative flex h-9 w-9 items-center justify-center">

        {/* Subtle glow */}
        <div
          className="
            absolute
            h-8
            w-8
            rounded-full
            bg-[#EEE3D1]/[0.025]
            blur-md
            animate-pulse
          "
        />

        {/* Rotating IRABRAIN logo */}
        <div
          className="
            relative
            flex
            h-8
            w-8
            items-center
            justify-center
            animate-[spin_5s_linear_infinite]
          "
        >
          <Image
            src="/irabrain-logo.png"
            alt="IRABRAIN"
            width={25}
            height={25}
            priority
            className="object-contain"
          />
        </div>

      </div>

      {/* =========================================
          IRA STATE
      ========================================= */}

      <div className="flex items-center">

        <span
          className="
            text-xs
            text-[#EEE3D1]/40
            transition-opacity
            duration-300
          "
        >
          {stateLabels[currentState]}
        </span>

        {/* Processing dots */}
        <span className="ml-1.5 flex items-center gap-1">

          <span
            className="
              h-1
              w-1
              rounded-full
              bg-[#EEE3D1]/35
              animate-pulse
            "
          />

          <span
            className="
              h-1
              w-1
              rounded-full
              bg-[#EEE3D1]/35
              animate-pulse
            "
            style={{
              animationDelay: "180ms",
            }}
          />

          <span
            className="
              h-1
              w-1
              rounded-full
              bg-[#EEE3D1]/35
              animate-pulse
            "
            style={{
              animationDelay: "360ms",
            }}
          />

        </span>

      </div>

    </div>
  );
}