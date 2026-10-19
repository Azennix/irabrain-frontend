"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth/AuthProvider";
import { updateCurrentUser } from "@/services/api/authApi";

export default function PersonalInformationPage() {
  const router = useRouter();
  const { user, token, updateUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;

    setFullName(user.full_name || "");
    setEmail(user.email || "");
  }, [user]);

  async function handleSave() {
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Full name is required.");
      setSuccess("");
      return;
    }

    if (!trimmedEmail) {
      setError("Email is required.");
      setSuccess("");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedUser = await updateCurrentUser(
        token,
        trimmedName,
        trimmedEmail
      );

      updateUser(updatedUser);

      setFullName(updatedUser.full_name || "");
      setEmail(updatedUser.email);

      setSuccess("Your information has been updated.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update your information."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <MainLayout>
      <main className="min-h-full px-5 pb-10 pt-28 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-3xl">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-lg
                border border-[var(--border)]
                bg-[var(--surface)]
                text-[var(--muted)]
                transition
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--foreground)]
              "
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>

            <div>
              <h1 className="text-xl font-medium text-[var(--foreground)]">
                Personal information
              </h1>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Manage your name and email address.
              </p>
            </div>
          </div>

          {/* Form */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
            <div className="space-y-6">
              {/* Full name */}
              <div>
                <label
                  htmlFor="full-name"
                  className="mb-2 block text-sm text-[var(--foreground)]"
                >
                  Full name
                </label>

                <input
                  id="full-name"
                  type="text"
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Enter your full name"
                  className="
                    w-full rounded-xl
                    border border-[var(--border)]
                    bg-[var(--background)]
                    px-4 py-3
                    text-sm text-[var(--foreground)]
                    outline-none
                    placeholder:text-[var(--muted)]
                    focus:border-[var(--foreground)]
                  "
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm text-[var(--foreground)]"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Enter your email"
                  className="
                    w-full rounded-xl
                    border border-[var(--border)]
                    bg-[var(--background)]
                    px-4 py-3
                    text-sm text-[var(--foreground)]
                    outline-none
                    placeholder:text-[var(--muted)]
                    focus:border-[var(--foreground)]
                  "
                />
              </div>

              {/* Messages */}
              {error && (
                <p className="text-sm text-[var(--accent)]">
                  {error}
                </p>
              )}

              {success && (
                <p className="text-sm text-[var(--foreground)]">
                  {success}
                </p>
              )}

              {/* Save */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="
                    inline-flex items-center gap-2
                    rounded-xl
                    border border-[var(--border)]
                    bg-[var(--foreground)]
                    px-4 py-2.5
                    text-sm font-medium
                    text-[var(--background)]
                    transition
                    hover:opacity-90
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Save size={16} strokeWidth={1.5} />

                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}