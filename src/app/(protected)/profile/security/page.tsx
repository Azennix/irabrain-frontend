"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth/AuthProvider";
import { changePassword } from "@/services/api/authApi";

export default function SecurityPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    try {
      setIsSaving(true);

      const result = await changePassword(
        token,
        currentPassword,
        newPassword
      );

      setMessage(result.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to change password."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <MainLayout>
      <main className="min-h-full px-5 pb-10 pt-28 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-2xl">

          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-[#EEE3D1]/60
                transition
                hover:bg-white/[0.04]
                hover:text-[#EEE3D1]
              "
              aria-label="Go back"
            >
              <ArrowLeft size={19} strokeWidth={1.5} />
            </button>

            <div>
              <h1 className="text-xl font-semibold text-[#EEE3D1]">
                Security
              </h1>

              <p className="mt-1 text-sm text-[#EEE3D1]/50">
                Manage your account security
              </p>
            </div>
          </div>

          {/* Password section */}
          <section
            className="
              rounded-2xl
              border
              border-white/[0.07]
              bg-white/[0.02]
              p-5
              md:p-6
            "
          >
            <div className="mb-6 flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.03]
                "
              >
                <Lock
                  size={18}
                  strokeWidth={1.5}
                  className="text-[#EEE3D1]/70"
                />
              </div>

              <div>
                <h2 className="text-sm font-medium text-[#EEE3D1]">
                  Change password
                </h2>

                <p className="mt-1 text-xs text-[#EEE3D1]/45">
                  Use a strong password with at least 8 characters.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Current password */}
              <PasswordField
                label="Current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                show={showCurrent}
                onToggle={() =>
                  setShowCurrent((value) => !value)
                }
                autoComplete="current-password"
              />

              {/* New password */}
              <PasswordField
                label="New password"
                value={newPassword}
                onChange={setNewPassword}
                show={showNew}
                onToggle={() =>
                  setShowNew((value) => !value)
                }
                autoComplete="new-password"
              />

              {/* Confirm password */}
              <PasswordField
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showConfirm}
                onToggle={() =>
                  setShowConfirm((value) => !value)
                }
                autoComplete="new-password"
              />

              {/* Error */}
              {error && (
                <div
                  className="
                    rounded-xl
                    border
                    border-[#8A0303]/30
                    bg-[#8A0303]/10
                    px-4
                    py-3
                    text-sm
                    text-[#EEE3D1]
                  "
                >
                  {error}
                </div>
              )}

              {/* Success */}
              {message && (
                <div
                  className="
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.03]
                    px-4
                    py-3
                    text-sm
                    text-[#EEE3D1]
                  "
                >
                  {message}
                </div>
              )}

              {/* Save */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="
                    rounded-xl
                    bg-[#EEE3D1]
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-black
                    transition
                    hover:bg-[#EEE3D1]/90
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isSaving
                    ? "Changing..."
                    : "Change password"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete: "current-password" | "new-password";
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-[#EEE3D1]/70">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="
            w-full
            rounded-xl
            border
            border-white/[0.08]
            bg-black
            px-4
            py-3
            pr-11
            text-sm
            text-[#EEE3D1]
            outline-none
            placeholder:text-[#EEE3D1]/25
            focus:border-white/[0.16]
          "
          placeholder="Enter password"
        />

        <button
          type="button"
          onClick={onToggle}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-[#EEE3D1]/40
            transition
            hover:text-[#EEE3D1]/70
          "
          aria-label={
            show ? "Hide password" : "Show password"
          }
        >
          {show ? (
            <EyeOff size={17} strokeWidth={1.5} />
          ) : (
            <Eye size={17} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </div>
  );
}