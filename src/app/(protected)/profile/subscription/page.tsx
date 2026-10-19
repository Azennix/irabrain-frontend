"use client";

import {
  ArrowLeft,
  Check,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";

export default function SubscriptionPage() {
  const router = useRouter();

  return (
    <MainLayout>
      <main className="min-h-full px-5 pb-10 pt-28 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-2xl">

          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-[var(--muted)]
                transition
                hover:bg-[var(--surface-soft)]
                hover:text-[var(--foreground)]
              "
            >
              <ArrowLeft
                size={18}
                strokeWidth={1.5}
              />
            </button>

            <div>
              <h1 className="text-xl font-medium text-[var(--foreground)]">
                Subscription
              </h1>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Manage your IRABRAIN plan.
              </p>
            </div>
          </div>

          {/* Current plan */}
          <section
            className="
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-5
              md:p-6
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--surface-soft)]
                  text-[var(--muted)]
                "
              >
                <CreditCard
                  size={18}
                  strokeWidth={1.5}
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                  Current plan
                </p>

                <h2 className="mt-2 text-lg font-medium text-[var(--foreground)]">
                  Free
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Your current IRABRAIN plan.
                </p>
              </div>
            </div>
          </section>

          {/* Plan details */}
          <section
            className="
              mt-5
              overflow-hidden
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
            "
          >
            <div className="px-5 py-4">
              <p className="text-sm font-medium text-[var(--foreground)]">
                Included
              </p>
            </div>

            <div className="border-t border-[var(--border)]">
              {[
                "Core IRABRAIN experience",
                "Memory",
                "Projects",
                "Personal Space",
              ].map((feature) => (
                <div
                  key={feature}
                  className="
                    flex
                    items-center
                    gap-3
                    border-b
                    border-[var(--border)]
                    px-5
                    py-4
                    last:border-b-0
                  "
                >
                  <Check
                    size={16}
                    strokeWidth={1.5}
                    className="text-[var(--muted)]"
                  />

                  <span className="text-sm text-[var(--foreground)]">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </MainLayout>
  );
}