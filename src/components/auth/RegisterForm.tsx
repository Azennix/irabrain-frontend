"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  checkEmail,
  register,
  verifyEmailCode,
  resendVerification,
} from "@/services/api/authApi";

import GoogleButton from "./GoogleButton";

type Step =
  | "email"
  | "password"
  | "verification";

export default function RegisterForm() {
  const router = useRouter();

  // =====================================================
  // STATE
  // =====================================================

  const [step, setStep] =
    useState<Step>("email");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [verificationCode, setVerificationCode] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =====================================================
  // CLEAR MESSAGES
  // =====================================================

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  // =====================================================
  // EMAIL CONTINUE
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
      setError(
        "Please enter your full name."
      );
      return;
    }

    if (!normalizedEmail) {
      setError(
        "Please enter your email."
      );
      return;
    }

    try {
      setIsLoading(true);

      const result =
        await checkEmail(
          normalizedEmail
        );

      // -------------------------------------------------
      // EXISTING VERIFIED ACCOUNT
      // -------------------------------------------------

      if (
        result.exists &&
        result.email_verified
      ) {
        setError(
          "An account with this email already exists. Please sign in instead."
        );
        return;
      }

      // -------------------------------------------------
      // EXISTING UNVERIFIED ACCOUNT
      // -------------------------------------------------

      if (
  result.exists &&
  !result.email_verified
) {
  setEmail(normalizedEmail);
  setVerificationCode("");
  setSuccess(
    "Your account already exists. Continue by verifying your email."
  );
  setStep("verification");
  return;
}

      setFullName(normalizedName);
      setEmail(normalizedEmail);
      setStep("password");

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to check this email."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // =====================================================
  // CREATE ACCOUNT
  // =====================================================

  async function handleRegister(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearMessages();

    if (!fullName.trim()) {
      setError(
        "Please enter your full name."
      );
      return;
    }

    if (!password || !confirmPassword) {
      setError(
        "Please complete all fields."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setIsLoading(true);

      await register(
        fullName.trim(),
        email,
        password
      );

      setVerificationCode("");

      setSuccess(
        "Verification code sent to your email."
      );

      setStep("verification");

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // =====================================================
  // VERIFY EMAIL
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

      await verifyEmailCode(
        email,
        code
      );

      setSuccess(
        "Email verified successfully. Redirecting to sign in..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1000);

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


  async function handleResendVerification() {
  clearMessages();

  try {
    setIsLoading(true);

    await resendVerification(email);

    setVerificationCode("");

    setSuccess(
      "A new verification code has been sent to your email."
    );
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to resend verification code."
    );
  } finally {
    setIsLoading(false);
  }
}

  // =====================================================
  // BACK TO EMAIL
  // =====================================================

  function goBackToEmail() {
    clearMessages();

    setPassword("");
    setConfirmPassword("");

    setStep("email");
  }

  // =====================================================
  // SHARED INPUT STYLE
  // =====================================================

  const inputClassName = `
    h-12
    w-full
    rounded-xl
    border
    border-[#EEE3D1]/10
    bg-[#EEE3D1]/[0.025]
    px-4
    text-sm
    text-[#EEE3D1]
    outline-none
    placeholder:text-[#EEE3D1]/25
    focus:border-[#EEE3D1]/25
    disabled:opacity-50
  `;

  // =====================================================
  // UI
  // =====================================================

  return (
    <main
      className="
        min-h-screen
        w-full
        bg-[#050505]
        px-4
        py-8
        flex
        items-center
        justify-center
      "
    >

      {/* =================================================
          AUTH CARD
          ================================================= */}

      <div
        className="
          w-full
          max-w-[508px]
          rounded-[18px]
          border
          border-[#EEE3D1]/10
          bg-[#171716]
          px-7
          py-7
          sm:px-8
          sm:py-8
        "
      >

        {/* =================================================
            HEADER
            ================================================= */}

        <div
          className="
            mb-6
            text-center
          "
        >

          {/* BRAND */}

          <div
            className="
              mb-4
              text-[11px]
              font-medium
              tracking-[0.34em]
              text-[#EEE3D1]/45
            "
          >
            IRABRAIN
          </div>

          {/* TITLE */}

          <h1
            className="
              text-[24px]
              font-medium
              tracking-[-0.02em]
              text-[#EEE3D1]
              sm:text-[25px]
            "
          >
            {step === "verification"
              ? "Verify your email."
              : "Create your account"}
          </h1>

          {/* SUBTITLE */}

          <p
            className="
              mt-2
              text-sm
              text-[#EEE3D1]/45
            "
          >
            {step === "email" &&
              "Start your journey with IRABRAIN."}

            {step === "password" &&
              "Set a password for your account."}

            {step === "verification" &&
              `Enter the code sent to ${email}.`}
          </p>

        </div>


        {/* =================================================
            EMAIL STEP
            ================================================= */}

        {step === "email" && (
          <div>

            {/* GOOGLE */}

            <GoogleButton />


            {/* DIVIDER */}

            <div
              className="
                my-5
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  h-px
                  flex-1
                  bg-[#EEE3D1]/10
                "
              />

              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-wide
                  text-[#EEE3D1]/30
                "
              >
                or
              </span>

              <div
                className="
                  h-px
                  flex-1
                  bg-[#EEE3D1]/10
                "
              />

            </div>


            {/* FORM */}

            <form
              onSubmit={handleEmailSubmit}
              className="
                space-y-4
              "
            >

              {/* NAME */}

              <div>

                <label
                  htmlFor="register-full-name"
                  className="
                    mb-2
                    block
                    text-[11px]
                    tracking-wide
                    text-[#EEE3D1]/45
                  "
                >
                  Your name
                </label>

                <input
                  id="register-full-name"
                  type="text"
                  autoComplete="name"
                  autoFocus
                  value={fullName}
                  onChange={(event) =>
                    setFullName(
                      event.target.value
                    )
                  }
                  placeholder="Enter your name"
                  disabled={isLoading}
                  className={inputClassName}
                />

              </div>


              {/* EMAIL */}

              <div>

                <label
                  htmlFor="register-email"
                  className="
                    mb-2
                    block
                    text-[11px]
                    tracking-wide
                    text-[#EEE3D1]/45
                  "
                >
                  Email
                </label>

                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className={inputClassName}
                />

              </div>


              {/* ERROR */}

              {error && (
                <p
                  role="alert"
                  className="
                    text-center
                    text-xs
                    leading-5
                    text-[#8A0303]
                  "
                >
                  {error}
                </p>
              )}


              {/* CONTINUE */}

              <button
                type="submit"
                disabled={isLoading}
                className="
                  h-12
                  w-full
                  rounded-xl
                  bg-[#EEE3D1]
                  text-sm
                  font-medium
                  text-[#171716]
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {isLoading
                  ? "Checking..."
                  : "Continue with email"}

                {!isLoading && (
                  <span className="ml-2">
                    →
                  </span>
                )}

              </button>

            </form>


            {/* =================================================
                SIGN IN
                ================================================= */}

            <div
              className="
                mt-6
                border-t
                border-[#EEE3D1]/10
                pt-5
                text-center
              "
            >

              <span
                className="
                  text-sm
                  text-[#EEE3D1]/40
                "
              >
                Already have an account?
              </span>

              <button
                type="button"
                onClick={() =>
                  router.push("/login")
                }
                className="
                  ml-2
                  text-sm
                  text-[#EEE3D1]/65
                  transition
                  hover:text-[#EEE3D1]
                "
              >
                Sign in →
              </button>

            </div>

          </div>
        )}


        {/* =================================================
            PASSWORD STEP
            ================================================= */}

        {step === "password" && (
          <form
            onSubmit={handleRegister}
            className="
              space-y-4
            "
          >

            {/* PASSWORD */}

            <div>

              <label
                htmlFor="register-password"
                className="
                  mb-2
                  block
                  text-[11px]
                  tracking-wide
                  text-[#EEE3D1]/45
                "
              >
                Password
              </label>

              <div
                className="
                  relative
                "
              >

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  autoFocus
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Password"
                  disabled={isLoading}
                  className={`${inputClassName} pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  disabled={isLoading}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#EEE3D1]/35
                    transition
                    hover:text-[#EEE3D1]/70
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <EyeOff
                      size={17}
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Eye
                      size={17}
                      strokeWidth={1.5}
                    />
                  )}

                </button>

              </div>

              <p
                className="
                  mt-2
                  text-[10px]
                  text-[#EEE3D1]/30
                "
              >
                Use at least 8 characters.
              </p>

            </div>


            {/* CONFIRM PASSWORD */}

            <div>

              <label
                htmlFor="confirm-password"
                className="
                  mb-2
                  block
                  text-[11px]
                  tracking-wide
                  text-[#EEE3D1]/45
                "
              >
                Confirm password
              </label>

              <div
                className="
                  relative
                "
              >

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Confirm password"
                  disabled={isLoading}
                  className={`${inputClassName} pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) => !value
                    )
                  }
                  disabled={isLoading}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#EEE3D1]/35
                    transition
                    hover:text-[#EEE3D1]/70
                  "
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >

                  {showConfirmPassword ? (
                    <EyeOff
                      size={17}
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Eye
                      size={17}
                      strokeWidth={1.5}
                    />
                  )}

                </button>

              </div>

            </div>


            {/* ERROR */}

            {error && (
              <p
                role="alert"
                className="
                  text-center
                  text-xs
                  leading-5
                  text-[#8A0303]
                "
              >
                {error}
              </p>
            )}


            {/* SUCCESS */}

            {success && (
              <p
                role="status"
                className="
                  text-center
                  text-xs
                  leading-5
                  text-[#EEE3D1]/60
                "
              >
                {success}
              </p>
            )}


            {/* CREATE */}

            <button
              type="submit"
              disabled={isLoading}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#EEE3D1]
                text-sm
                font-medium
                text-[#171716]
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              <span>
                {isLoading
                  ? "Creating account..."
                  : "Create account"}
              </span>

              {!isLoading && (
                <span>
                  →
                </span>
              )}

            </button>


            {/* BACK */}

            <button
              type="button"
              onClick={goBackToEmail}
              disabled={isLoading}
              className="
                block
                w-full
                pt-2
                text-center
                text-xs
                text-[#EEE3D1]/35
                transition
                hover:text-[#EEE3D1]/65
                disabled:opacity-40
              "
            >
              ← Back
            </button>

          </form>
        )}


        {/* =================================================
            VERIFICATION STEP
            ================================================= */}

        {step === "verification" && (
          <form
            onSubmit={handleVerification}
            className="
              space-y-4
            "
          >

            {/* CODE */}

            <div>

              <label
                htmlFor="verification-code"
                className="
                  mb-2
                  block
                  text-[11px]
                  tracking-wide
                  text-[#EEE3D1]/45
                "
              >
                Verification code
              </label>

              <input
                id="verification-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
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
                disabled={isLoading}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#EEE3D1]/10
                  bg-[#EEE3D1]/[0.025]
                  px-4
                  text-center
                  text-lg
                  tracking-[0.35em]
                  text-[#EEE3D1]
                  outline-none
                  placeholder:text-[#EEE3D1]/20
                  focus:border-[#EEE3D1]/25
                  disabled:opacity-50
                "
              />

            </div>


            {/* ERROR */}

            {error && (
              <p
                role="alert"
                className="
                  text-center
                  text-xs
                  leading-5
                  text-[#8A0303]
                "
              >
                {error}
              </p>
            )}


            {/* SUCCESS */}

            {success && (
              <p
                role="status"
                className="
                  text-center
                  text-xs
                  leading-5
                  text-[#EEE3D1]/60
                "
              >
                {success}
              </p>
            )}


            {/* VERIFY */}

            <button
              type="submit"
              disabled={
                isLoading ||
                verificationCode.length !== 6
              }
              className="
                h-12
                w-full
                rounded-xl
                bg-[#EEE3D1]
                text-sm
                font-medium
                text-[#171716]
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isLoading
                ? "Verifying..."
                : "Verify email →"}
            </button>


            {/* EXPIRY */}

            <p
              className="
                text-center
                text-[10px]
                text-[#EEE3D1]/30
              "
            >
              The verification code expires in 10 minutes.
            </p>

            <button
  type="button"
  onClick={handleResendVerification}
  disabled={isLoading}
  className="
    block
    w-full
    pt-2
    text-center
    text-xs
    text-[#EEE3D1]/55
    transition
    hover:text-[#EEE3D1]
    disabled:cursor-not-allowed
    disabled:opacity-40
  "
>
  {isLoading
    ? "Sending new code..."
    : "Didn't receive the code? Resend"}
</button>

          </form>
        )}

      </div>

    </main>
  );
}