"use client";

import {
  ArrowLeft,
  Brain,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";

export default function PrivacySettingsPage() {
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
                Data & privacy
              </h1>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Control your data and privacy.
              </p>
            </div>
          </div>

          <div className="space-y-8">

            {/* YOUR DATA */}
            <section>
              <h2
                className="
                  mb-3 px-1
                  text-xs font-medium
                  uppercase tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                Your data
              </h2>

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border border-[var(--border)]
                  bg-[var(--surface)]
                "
              >
                <div className="flex items-center gap-4 px-5 py-5">
                  <div
                    className="
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-lg
                      bg-[var(--surface-soft)]
                      text-[var(--muted)]
                    "
                  >
                    <ShieldCheck size={18} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--foreground)]">
                      Your IRABRAIN data
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-[var(--muted)]">
                      Your account, conversations, projects, notes, and other
                      product data are associated with your account.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* MEMORY */}
            <section>
              <h2
                className="
                  mb-3 px-1
                  text-xs font-medium
                  uppercase tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                Memory
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
                  onClick={() => router.push("/settings/memory")}
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
                    <Brain size={18} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--foreground)]">
                      Memory settings
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      Review and manage how IRABRAIN remembers you.
                    </p>
                  </div>

                  <span className="text-xs text-[var(--muted)]">
                    Manage
                  </span>
                </button>
              </div>
            </section>

            {/* PRIVATE SPACE */}
            <section>
              <h2
                className="
                  mb-3 px-1
                  text-xs font-medium
                  uppercase tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                Private Space
              </h2>

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border border-[var(--border)]
                  bg-[var(--surface)]
                "
              >
                <div className="flex items-center gap-4 px-5 py-5">
                  <div
                    className="
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-lg
                      bg-[var(--surface-soft)]
                      text-[var(--muted)]
                    "
                  >
                    <EyeOff size={18} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--foreground)]">
                      Private conversations
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-[var(--muted)]">
                      Private Space is designed for conversations that should
                      not become part of your normal persistent memory.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ACCOUNT SECURITY */}
            <section>
              <h2
                className="
                  mb-3 px-1
                  text-xs font-medium
                  uppercase tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                Account
              </h2>

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border border-[var(--border)]
                  bg-[var(--surface)]
                "
              >
                <div className="flex items-center gap-4 px-5 py-5">
                  <div
                    className="
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-lg
                      bg-[var(--surface-soft)]
                      text-[var(--muted)]
                    "
                  >
                    <LockKeyhole size={18} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--foreground)]">
                      Account data controls
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-[var(--muted)]">
                      Data export and account deletion controls can be added
                      here when those account actions are available.
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </MainLayout>
  );
}