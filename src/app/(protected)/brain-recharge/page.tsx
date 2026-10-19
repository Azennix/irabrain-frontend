"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";

export default function BrainRechargePage() {
  const router = useRouter();

  return (
    <MainLayout>
      <main className="min-h-full bg-[var(--background)] px-4 pb-12 pt-24 sm:px-6 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-7xl">
          <header className="mb-8 flex items-start gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-lg text-[var(--muted)]
                transition hover:bg-[var(--surface-soft)]
                hover:text-[var(--foreground)]
              "
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--muted)]">
                IRABRAIN
              </p>

              <h1 className="mt-2 text-2xl font-medium tracking-tight text-[var(--foreground)] sm:text-3xl">
                Brain Recharge
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
                Choose the Brain capacity that fits your work,
                reasoning, and creativity.
              </p>
            </div>
          </header>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8">
            <div className="py-16 text-center">
              <p className="text-sm text-[var(--muted)]">
                Brain Recharge plans will appear here.
              </p>
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}