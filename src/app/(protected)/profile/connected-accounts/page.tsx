"use client";

import { ArrowLeft, CheckCircle2, Link2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function ConnectedAccountsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const googleConnected = user?.google_connected ?? false;

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
                Connected accounts
              </h1>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Manage accounts connected to IRABRAIN.
              </p>
            </div>
          </div>

          {/* GOOGLE */}
          <section
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
                  text-[var(--foreground)]
                "
              >
                <Link2 size={18} strokeWidth={1.5} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-[var(--foreground)]">
                  Google
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  {googleConnected
                    ? user?.email
                    : "Not connected"}
                </p>
              </div>

              {googleConnected ? (
                <div className="flex shrink-0 items-center gap-2 text-xs text-[var(--muted)]">
                  <CheckCircle2 size={16} strokeWidth={1.5} />
                  <span className="hidden sm:inline">
                    Connected
                  </span>
                </div>
              ) : (
                <div className="flex shrink-0 items-center gap-2 text-xs text-[var(--muted)]">
                  <XCircle size={16} strokeWidth={1.5} />
                  <span className="hidden sm:inline">
                    Not connected
                  </span>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </MainLayout>
  );
}