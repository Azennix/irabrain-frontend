"use client";

import { useEffect, useState } from "react";
import { Download, X, Sparkles, BrainCircuit } from "lucide-react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallIRABRAINPopup() {
  const [visible, setVisible] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const isStandalone = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean })
        .standalone === true;

    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    if (localStorage.getItem("irabrain-install-dismissed") === "true") {
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), 1200);

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setVisible(false);
      localStorage.setItem("irabrain-install-dismissed", "true");
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleInstallPrompt
    );
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(
        "beforeinstallprompt",
        handleInstallPrompt
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem("irabrain-install-dismissed", "true");
  }

  async function install() {
    if (!installEvent) {
      dismiss();
      return;
    }

    setInstalling(true);

    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;

      if (choice.outcome === "accepted") {
        setVisible(false);
        localStorage.setItem("irabrain-install-dismissed", "true");
      }

      setInstallEvent(null);
    } catch {
      // The browser may reject an installation request.
    } finally {
      setInstalling(false);
    }
  }

  if (!visible || installed) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close installation popup"
        onClick={dismiss}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="irabrain-install-title"
        className="irabrain-install-enter relative w-full max-w-[410px] overflow-hidden rounded-[28px] border border-[#EEE3D1]/15 bg-[#111111] p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.65)] sm:p-9"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Maybe later"
          className="absolute right-4 top-4 rounded-full p-2 text-[#EEE3D1]/60 transition hover:bg-white/10 hover:text-[#EEE3D1]"
        >
          <X size={18} />
        </button>

        <div className="mx-auto mb-6 flex h-[76px] w-[76px] items-center justify-center rounded-[24px] border border-[#EEE3D1]/20 bg-[#EEE3D1]/[0.06] text-[#EEE3D1]">
          <BrainCircuit size={39} strokeWidth={1.4} />
        </div>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#EEE3D1]/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#EEE3D1]/80">
          <Sparkles size={12} />
          Your AI workspace
        </div>

        <h2
          id="irabrain-install-title"
          className="text-2xl font-semibold tracking-tight text-[#EEE3D1] sm:text-[28px]"
        >
          Your Brain. Beyond Limits.
        </h2>

        <p className="mx-auto mt-3 max-w-[300px] text-sm leading-6 text-white/60">
          Bring IRABRAIN closer. Open your AI workspace right from your
          home screen for a focused, app-like experience.
        </p>

        <div className="my-6 grid grid-cols-3 gap-2">
          {[
            ["01", "Think"],
            ["02", "Create"],
            ["03", "Explore"],
          ].map(([number, label]) => (
            <div
              key={number}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-2 py-3"
            >
              <div className="text-[10px] tracking-widest text-[#EEE3D1]/45">
                {number}
              </div>
              <div className="mt-1 text-xs font-medium text-[#EEE3D1]">
                {label}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={install}
          disabled={installing}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EEE3D1] px-5 py-3.5 text-sm font-semibold text-[#111111] transition hover:bg-white disabled:cursor-wait disabled:opacity-70"
        >
          <Download size={17} />
          {installing ? "Opening installer..." : "Install IRABRAIN"}
        </button>

        {!installEvent && (
          <p className="mt-3 text-xs leading-5 text-white/40">
            Installation availability depends on your browser. You can
            also use its menu to add IRABRAIN to your home screen.
          </p>
        )}

        <button
          type="button"
          onClick={dismiss}
          className="mt-4 px-4 py-2 text-xs font-medium text-white/50 transition hover:text-white/90"
        >
          Maybe later
        </button>
      </section>

      <style jsx>{`
        .irabrain-install-enter {
          animation: irabrain-install-in 420ms
            cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        @keyframes irabrain-install-in {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}