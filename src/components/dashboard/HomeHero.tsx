"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/lib/auth/AuthProvider";
import { getGreeting } from "@/lib/ui/greeting";

export default function HomeHero() {
  const { user } = useAuth();

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    function updateGreeting() {
      setGreeting(getGreeting(user?.full_name));
    }

    updateGreeting();

    // Update when the app remains open across a time boundary.
    const interval = window.setInterval(
      updateGreeting,
      60_000
    );

    // Refresh the greeting when the user returns to the app.
    window.addEventListener("focus", updateGreeting);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", updateGreeting);
    };
  }, [user?.full_name]);

  return (
    <section className="flex w-full justify-center px-5 pb-2 text-center sm:px-8">
      <div className="max-w-2xl">
        <h1 className="text-[30px] font-normal leading-tight tracking-[-0.025em] text-[var(--foreground)] sm:text-[38px] md:text-[44px]">
          {greeting || "\u00A0"}
        </h1>

        <p className="mt-3 text-[16px] font-normal leading-6 text-[var(--muted)] sm:text-[18px]">
          Why not build something of you own? lets start it.
        </p>
      </div>
    </section>
  );
}