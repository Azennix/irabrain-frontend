"use client";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Shield,
} from "lucide-react";

import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";

export default function AboutPage() {
  const router = useRouter();

  return (
    <MainLayout>
      <main className="min-h-full px-5 pb-8 pt-28 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-2xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            <ArrowLeft size={17} strokeWidth={1.5} />
            Back
          </button>

          <div className="flex flex-col items-center text-center">
            
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <Image
                 src="/irabrain-logo.png"
                    alt="IRABRAIN"
                     width={34}
                     height={34}
                       priority
                 className="object-contain"
                     />
                       </div>

            <h1 className="text-3xl font-medium tracking-tight text-[var(--foreground)]">
              IRABRAIN
            </h1>

            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
              A Smarter You
            </p>

            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
              A Bigger Tomorrow
            </p>

            <p className="mt-5 text-sm text-[var(--muted)]">
              Version 1.0.0
            </p>
          </div>

          <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="border-b border-[var(--border)] px-5 py-4">
              <p className="text-sm font-medium text-[var(--foreground)]">
                About IRABRAIN
              </p>
            </div>

            <div className="p-5">
              <p className="text-sm leading-7 text-[var(--muted)]">
                IRABRAIN is a personal AI system designed to help
                you think, plan, build, learn, and grow with greater
                clarity.
              </p>

              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                It brings conversations, memory, projects, and
                intelligent assistance together to help you move
                from ideas to meaningful action.
              </p>
            </div>
          </section>

          <section className="mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <a
              href="https://irabrain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-14 items-center gap-3 px-5 text-sm text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]"
            >
              <ExternalLink
                size={17}
                strokeWidth={1.5}
                className="text-[var(--muted)]"
              />

              <span className="flex-1">
                Visit Website
              </span>

              <ExternalLink
                size={15}
                strokeWidth={1.5}
                className="text-[var(--muted)]"
              />
            </a>

            <div className="border-t border-[var(--border)]" />

            <button
              type="button"
              className="flex min-h-14 w-full items-center gap-3 px-5 text-left text-sm text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]"
            >
              <FileText
                size={17}
                strokeWidth={1.5}
                className="text-[var(--muted)]"
              />

              <span className="flex-1">
                Terms of Service
              </span>

              <span className="text-xs text-[var(--muted)]">
                Coming soon
              </span>
            </button>

            <div className="border-t border-[var(--border)]" />

            <button
              type="button"
              className="flex min-h-14 w-full items-center gap-3 px-5 text-left text-sm text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]"
            >
              <Shield
                size={17}
                strokeWidth={1.5}
                className="text-[var(--muted)]"
              />

              <span className="flex-1">
                Privacy Policy
              </span>

              <span className="text-xs text-[var(--muted)]">
                Coming soon
              </span>
            </button>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}