"use client";

import { ArrowLeft, Bug } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth/AuthProvider";
import { submitFeedback } from "@/services/api/feedbackApi";
export default function BugReportPage() {
  const router = useRouter();

  const { token } = useAuth();

const [message, setMessage] =
  useState("");

const [isSubmitting, setIsSubmitting] =
  useState(false);

const [success, setSuccess] =
  useState(false);

const [error, setError] =
  useState<string | null>(null);

async function handleSubmit() {
  if (!token) {
    setError("Please sign in again.");
    return;
  }

  if (!message.trim()) {
    setError("Please describe the problem.");
    return;
  }

  setIsSubmitting(true);
  setError(null);
  setSuccess(false);

  try {
    await submitFeedback(
      token,
      "bug_report",
      message.trim()
    );

    setSuccess(true);
    setMessage("");
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to submit the bug report."
    );
  } finally {
    setIsSubmitting(false);
  }
}



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

          <div className="mb-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--muted)]">
              <Bug size={19} strokeWidth={1.5} />
            </div>

            <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
              Report a Problem
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Tell us what went wrong so we can investigate and improve
              IRABRAIN.
            </p>
          </div>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="border-b border-[var(--border)] px-5 py-4">
              <p className="text-sm font-medium text-[var(--foreground)]">
                Bug report
              </p>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <label
                  htmlFor="bug-message"
                  className="mb-2 block text-sm text-[var(--foreground)]"
                >
                  What happened?
                </label>

                <textarea
                  id="bug-message"
                  rows={7}
                  value={message}
               onChange={(event) =>
             setMessage(event.target.value)
}
                  placeholder="Describe the problem and what you were doing when it happened..."
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--foreground)]/30"
                />
              </div>

              {error && (
  <p className="text-sm text-[var(--muted)]">
    {error}
  </p>
)}

{success && (
  <p className="text-sm text-[var(--muted)]">
    Your bug report has been submitted successfully.
  </p>
)}

              <button
  type="button"
  onClick={handleSubmit}
  disabled={isSubmitting}
  className="h-11 w-full rounded-xl bg-[var(--foreground)] px-4 text-sm font-medium text-[var(--background)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
>
  {isSubmitting
    ? "Submitting..."
    : "Submit bug report"}
</button>
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}