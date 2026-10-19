"use client";

import {
  ArrowLeft,
  Building2,
  Check,
  ChevronRight,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";

export default function WorkspacePreferencesPage() {
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
                Workspace preferences
              </h1>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Manage your workspace settings.
              </p>
            </div>
          </div>

          <div className="space-y-8">

            {/* CURRENT WORKSPACE */}
            <section>
              <h2
                className="
                  mb-3 px-1
                  text-xs font-medium
                  uppercase tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                Current workspace
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
                    <UserRound size={18} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--foreground)]">
                      Personal workspace
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      Your private IRABRAIN workspace.
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
                </div>
              </div>
            </section>

            {/* WORKSPACE */}
            <section>
              <h2
                className="
                  mb-3 px-1
                  text-xs font-medium
                  uppercase tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                Workspace
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
                  onClick={() => router.push("/settings/workspace/information")}
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
                    <Building2 size={18} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--foreground)]">
                      Workspace information
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      View information about your current workspace.
                    </p>
                  </div>

                  <ChevronRight
                    size={17}
                    strokeWidth={1.5}
                    className="shrink-0 text-[var(--muted)]"
                  />
                </button>
              </div>
            </section>

          </div>
        </div>
      </main>
    </MainLayout>
  );
}