"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/AuthProvider";

import {
  requestEmailCode,
} from "@/services/api/authApi";

import GoogleButton from "./GoogleButton";

type Step =
  | "email"
  | "verification";

export default function IRAAuth() {
  const router = useRouter();
  const {
  loginWithEmailCode,
  isAuthenticated,
  isLoading: authLoading,
} = useAuth();
 

  const [step, setStep] =
    useState<Step>("email");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [verificationCode, setVerificationCode] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);


      // =====================================================
  // RESTORE EXISTING AUTHENTICATED SESSION
  // =====================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (isAuthenticated) {
      window.location.href = "/chat";
    }
  }, [
    authLoading,
    isAuthenticated,
  ]);

  // =====================================================
  // CLEAR MESSAGES
  // =====================================================

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  // =====================================================
  // REQUEST EMAIL CODE
  // =====================================================

  async function handleEmailSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearMessages();

    const normalizedName =
      fullName.trim();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedName) {
      setError("Please enter your name.");
      return;
    }

    if (!normalizedEmail) {
      setError("Please enter your email.");
      return;
    }

    try {
      setIsLoading(true);

      await requestEmailCode(
        normalizedName,
        normalizedEmail
      );

      setFullName(normalizedName);
      setEmail(normalizedEmail);
      setVerificationCode("");

      setSuccess(
        "Verification code sent to your email."
      );

      setStep("verification");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }


    // =====================================================
  // AUTO VERIFY OTP
  // =====================================================

  async function verifyCodeAutomatically(
    code: string
  ) {
    if (
      isLoading ||
      step !== "verification" ||
      !/^\d{6}$/.test(code)
    ) {
      return;
    }

    clearMessages();

    try {
      setIsLoading(true);

      await loginWithEmailCode(
        email,
        code
      );

      window.location.href = "/chat";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid verification code."
      );
    } finally {
      setIsLoading(false);
    }
  }

     useEffect(() => {
    if (
      step !== "verification" ||
      isLoading ||
      !/^\d{6}$/.test(
        verificationCode
      )
    ) {
      return;
    }

    verifyCodeAutomatically(
      verificationCode
    );
  }, [
    verificationCode,
    step,
  ]);

  // =====================================================
  // VERIFY EMAIL CODE
  // =====================================================

  async function handleVerification(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearMessages();

    const code =
      verificationCode.trim();

    if (!/^\d{6}$/.test(code)) {
      setError(
        "Please enter the 6-digit verification code."
      );
      return;
    }

    try {
      setIsLoading(true);

      await loginWithEmailCode(
        email,
        code
      );

      window.location.href = "/chat";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid verification code."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // =====================================================
// RESEND EMAIL CODE
// =====================================================

async function handleResendCode() {
  if (isLoading || !email) {
    return;
  }

  clearMessages();

  try {
    setIsLoading(true);

    await requestEmailCode(
      fullName,
      email
    );

    setVerificationCode("");

    setSuccess(
      "A new verification code has been sent."
    );
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to resend verification code. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
}

  // =====================================================
  // BACK TO AUTH SCREEN
  // =====================================================

  function handleBack() {
    clearMessages();
    setVerificationCode("");
    setStep("email");
  }

  // =====================================================
  // UI
  // =====================================================

  if (authLoading || isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full">

      {/* BRAND */}

      <div className="mb-7 text-center">

        <div className="mb-4 text-xs font-medium tracking-[0.28em] text-[#EEE3D1]/45">
          IRABRAIN
        </div>

        <h1 className="text-xl font-medium tracking-tight text-[#EEE3D1]">
          {step === "verification"
            ? "Verify your email."
            : "Welcome back."}
        </h1>

        <p className="mt-2 text-sm text-[#EEE3D1]/45">
          {step === "verification"
            ? `Enter the code sent to ${email}`
            : "Continue with IRA."}
        </p>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-4 rounded-xl border border-[#8A0303]/30 bg-[#8A0303]/[0.06] px-4 py-3 text-center text-sm text-[#EEE3D1]/75">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="mb-4 rounded-xl border border-[#EEE3D1]/10 bg-[#EEE3D1]/[0.03] px-4 py-3 text-center text-sm text-[#EEE3D1]/70">
          {success}
        </div>
      )}

      {/* =================================================
          SCREEN 1 — AUTH
          ================================================= */}

      {step === "email" && (
        <div className="space-y-5">

          {/* GOOGLE */}

          <GoogleButton />

          {/* DIVIDER */}

          <div className="flex items-center gap-3">

            <div className="h-px flex-1 bg-[#EEE3D1]/10" />

            <span className="text-[11px] uppercase tracking-wide text-[#EEE3D1]/30">
              or
            </span>

            <div className="h-px flex-1 bg-[#EEE3D1]/10" />

          </div>

          {/* NAME + EMAIL */}

          <form
            onSubmit={handleEmailSubmit}
            className="space-y-4"
          >

            {/* NAME */}

            <div>

              <label className="mb-2 block text-[11px] tracking-wide text-[#EEE3D1]/45">
                Your name
              </label>

              <input
                autoFocus
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                placeholder="Enter your name"
                className="h-12 w-full rounded-xl border border-[#EEE3D1]/10 bg-[#EEE3D1]/[0.025] px-4 text-sm text-[#EEE3D1] outline-none placeholder:text-[#EEE3D1]/25 focus:border-[#EEE3D1]/25"
              />

            </div>

            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-[11px] tracking-wide text-[#EEE3D1]/45">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-[#EEE3D1]/10 bg-[#EEE3D1]/[0.025] px-4 text-sm text-[#EEE3D1] outline-none placeholder:text-[#EEE3D1]/25 focus:border-[#EEE3D1]/25"
              />

            </div>

            {/* CONTINUE */}

            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl bg-[#EEE3D1] text-sm font-medium text-[#171716] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading
                ? "Sending..."
                : "Continue with email"}

              {!isLoading && (
                <span className="ml-2">
                  →
                </span>
              )}
            </button>

          </form>
                    {/* SIGN UP WITH PASSWORD */}

          <div className="mt-6 border-t border-[#EEE3D1]/10 pt-5 text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-[#EEE3D1]/45 transition hover:text-[#EEE3D1]/80"
            >
              Sign up with password
            </button>
          </div>

        </div>
      )}

      {/* =================================================
          SCREEN 2 — VERIFICATION
          ================================================= */}

      {step === "verification" && (
        <form
          onSubmit={handleVerification}
          className="space-y-4"
        >

          <div>

            <label className="mb-2 block text-[11px] tracking-wide text-[#EEE3D1]/45">
              Verification code
            </label>

            <input
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={verificationCode}
              onChange={(event) =>
                setVerificationCode(
                  event.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              placeholder="000000"
              className="h-12 w-full rounded-xl border border-[#EEE3D1]/10 bg-[#EEE3D1]/[0.025] px-4 text-center text-lg tracking-[0.35em] text-[#EEE3D1] outline-none placeholder:text-[#EEE3D1]/20 focus:border-[#EEE3D1]/25"
            />

          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-[#EEE3D1] text-sm font-medium text-[#171716] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading
              ? "Verifying..."
              : "Verify email"}

            {!isLoading && (
              <span className="ml-2">
                →
              </span>
            )}
          </button>

                    <button
            type="button"
            onClick={handleResendCode}
            disabled={isLoading}
            className="w-full text-sm text-[#EEE3D1]/50 transition hover:text-[#EEE3D1]/80 disabled:opacity-40"
          >
            {isLoading
              ? "Sending new code..."
              : "Resend code"}
          </button>

          <button
            type="button"
            onClick={handleBack}
            disabled={isLoading}
            className="w-full text-sm text-[#EEE3D1]/40 transition hover:text-[#EEE3D1]/70 disabled:opacity-40"
          >
            Back
          </button>

        </form>
      )}

    </div>
  );
}