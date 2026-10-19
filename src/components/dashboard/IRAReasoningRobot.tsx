"use client";

import { Bot } from "lucide-react";

export default function IRAReasoningRobot() {
  return (
    <div className="ira-robot">

      {/* =================================================
          ROBOT BODY
      ================================================= */}

      <div className="ira-robot-core">
        <Bot
          size={34}
          strokeWidth={1.5}
        />
      </div>


      {/* =================================================
          SIX ROBOT LEGS
      ================================================= */}

      <div className="ira-leg ira-leg-1">
        <span />
      </div>

      <div className="ira-leg ira-leg-2">
        <span />
      </div>

      <div className="ira-leg ira-leg-3">
        <span />
      </div>

      <div className="ira-leg ira-leg-4">
        <span />
      </div>

      <div className="ira-leg ira-leg-5">
        <span />
      </div>

      <div className="ira-leg ira-leg-6">
        <span />
      </div>

    </div>
  );
}