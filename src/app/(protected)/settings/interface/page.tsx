"use client";

import { ArrowLeft, Check, LayoutPanelTop, Send } from "lucide-react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";

export default function InterfacePreferencesPage() {
  const router = useRouter();

  return (
    <MainLayout>
      <main className="min-h-full px-5 pb-10 pt-28 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-3xl">

          {/* HEADER */}
          <div className="mb-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-lg
                text-[var(--muted)]
                transition
                hover:bg-[var(--surface-soft)]
                hover:text-[var(--foreground)]
              "
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>

            <div>
              <h1 className="text-xl font-medium text-[var(--foreground)]">
                Interface preferences
              </h1>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Customize how you interact with IRABRAIN.
              </p>
            </div>
          </div>

          <div className="space-y-8">

            {/* DENSITY */}
            <section>
              <h2
                className="
                  mb-3 px-1
                  text-xs font-medium
                  uppercase tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                Interface
              </h2>

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border border-[var(--border)]
                  bg-[var(--surface)]
                "
              >
                <button
                  type="button"
                  className="
                    flex w-full items-center gap-4
                    px-5 py-5
                    text-left
                    transition
                    hover:bg-[var(--surface-soft)]
                  "
                >
                  <div
                    className="
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-lg
                      bg-[var(--surface-soft)]
                      text-[var(--muted)]
                    "
                  >
                    <LayoutPanelTop size={18} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--foreground)]">
                      Interface density
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      Control the spacing of interface elements.
                    </p>
                  </div>

                  <span className="text-xs text-[var(--muted)]">
                    Comfortable
                  </span>
                </button>
              </div>
            </section>

            {/* CHAT */}
            <section>
              <h2
                className="
                  mb-3 px-1
                  text-xs font-medium
                  uppercase tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                Chat
              </h2>

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border border-[var(--border)]
                  bg-[var(--surface)]
                "
              >
                <button
                  type="button"
                  className="
                    flex w-full items-center gap-4
                    px-5 py-5
                    text-left
                    transition
                    hover:bg-[var(--surface-soft)]
                  "
                >
                  <div
                    className="
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-lg
                      bg-[var(--surface-soft)]
                      text-[var(--muted)]
                    "
                  >
                    <Send size={18} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--foreground)]">
                      Send messages with Enter
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      Press Enter to send a message.
                    </p>
                  </div>

                  <div
                    className="
                      flex h-5 w-5 shrink-0
                      items-center justify-center
                      rounded-full
                      border border-[var(--accent)]
                    "
                  >
                    <Check
                      size={12}
                      strokeWidth={2}
                      className="text-[var(--accent)]"
                    />
                  </div>
                </button>
              </div>
            </section>

          </div>
        </div>
      </main>
    </MainLayout>
  );
}