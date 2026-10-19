"use client";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function WorkspaceInformationPage() {
  const router = useRouter();
  const { user } = useAuth();

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
                Workspace information
              </h1>

              <p className="mt-1 text-sm text-[var(--muted)]">
                View information about your current workspace.
              </p>
            </div>
          </div>

          <div className="space-y-8">

            {/* PERSONAL WORKSPACE */}
            <section>
              <h2
                className="
                  mb-3 px-1
                  text-xs font-medium
                  uppercase tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                Personal workspace
              </h2>

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border border-[var(--border)]
                  bg-[var(--surface)]
                "
              >

                {/* WORKSPACE NAME */}
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
                    <Building2 size={18} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--foreground)]">
                      Workspace name
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      Personal workspace
                    </p>
                  </div>
                </div>

                <div className="border-t border-[var(--border)]" />

                {/* WORKSPACE TYPE */}
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
                    <Building2 size={18} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--foreground)]">
                      Workspace type
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      Personal
                    </p>
                  </div>
                </div>

                <div className="border-t border-[var(--border)]" />

                {/* OWNER */}
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
                      Owner
                    </p>

                    <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                      {user?.full_name || "Account owner"}
                    </p>

                    {user?.email && (
                      <p className="mt-0.5 truncate text-xs text-[var(--muted)] opacity-70">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-[var(--border)]" />

                {/* CREATION DATE */}
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
                    <CalendarDays size={18} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--foreground)]">
                      Created
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      Not available
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