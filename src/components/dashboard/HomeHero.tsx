"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/lib/auth/AuthProvider";
import { getGreeting } from "@/lib/ui/greeting";
import IRABrainThinking from "./IRABrainThinking"; // CHANGED: new import

export default function HomeHero() {
  const { user } = useAuth();

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    function updateGreeting() {
      setGreeting(getGreeting(user?.full_name));
    }

    updateGreeting();

    const interval = window.setInterval(updateGreeting, 60_000);
    window.addEventListener("focus", updateGreeting);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", updateGreeting);
    };
  }, [user?.full_name]);

  return (
    // CHANGED: added flex-col items-center
    <section className="flex w-full flex-col items-center justify-center px-5 pb-2 text-center sm:px-8">
      {/* CHANGED: new logo block, above the greeting */}
            {/* outer div = size, inner div = animation (kept separate so they don't conflict) */}
            <div className="mb-6 mt-4 origin-center scale-[1.6] sm:mb-7 sm:mt-5 sm:scale-[1.8]">
        <div className="animate-in fade-in zoom-in-95 duration-700">
          <IRABrainThinking state="analyzing" hideLabel />
        </div>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-[30px] font-normal leading-tight tracking-[-0.025em] text-[var(--foreground)] sm:text-[38px] md:text-[44px]">
          {greeting || "\u00A0"}
        </h1>

        <p className="mt-3 text-[16px] font-normal leading-6 text-[var(--muted)] sm:text-[18px]">
          Why not build something of your own? Let's start it.
        </p>
      </div>
    </section>
  );
}