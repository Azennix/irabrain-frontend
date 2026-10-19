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

import { useAuth } from "@/lib/auth/AuthProvider";

import { checkEmail } from "@/services/api/authApi";

import GoogleButton from "./GoogleButton";

export default function LoginForm() {
  const { login } = useAuth();

  const router = useRouter();

  // =====================================================
  // STATE
  // =====================================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  // =====================================================
  // CLEAR ERROR
  // =====================================================

  function clearError() {
    setError("");
  }

  // =====================================================
  // LOGIN
  // =====================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearError();

    const normalizedEmail =
      email.trim().toLowerCase();

    const normalizedPassword =
      password;

    if (!normalizedEmail) {
      setError(
        "Please enter your email."
      );
      return;
    }

    if (!normalizedPassword) {
      setError(
        "Please enter your password."
      );
      return;
    }

    try {
      setIsLoading(true);

      // -------------------------------------------------
      // CHECK ACCOUNT
      // -------------------------------------------------

      const result =
        await checkEmail(
          normalizedEmail
        );

      // -------------------------------------------------
      // ACCOUNT NOT FOUND
      // -------------------------------------------------

      if (!result.exists) {
        setError(
          "No account found with this email. Please create your IRABRAIN account first."
        );
        return;
      }

      // -------------------------------------------------
      // EMAIL NOT VERIFIED
      // -------------------------------------------------

      if (
        result.email_verified === false
      ) {
        setError(
          "Please verify your email before signing in."
        );
        return;
      }

      // -------------------------------------------------
      // PASSWORD LOGIN
      // -------------------------------------------------

      await login(
        normalizedEmail,
        normalizedPassword,
        rememberMe
      );

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      window.location.href = "/";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main
      className="
        min-h-screen
        w-full
        bg-[#050505]
        flex
        items-center
        justify-center
        px-4
        py-8
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
            Welcome back.
          </h1>

          {/* SUBTITLE */}

          <p
            className="
              mt-2
              text-sm
              text-[#EEE3D1]/45
            "
          >
            Continue with IRA.
          </p>

        </div>


        {/* =================================================
            GOOGLE
            ================================================= */}

        <GoogleButton />


        {/* =================================================
            DIVIDER
            ================================================= */}

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


        {/* =================================================
            LOGIN FORM
            ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="
            space-y-4
          "
        >

          {/* =================================================
              EMAIL
              ================================================= */}

          <div>

            <label
              htmlFor="login-email"
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
              id="login-email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="you@example.com"
              disabled={isLoading}
              className="
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
              "
            />

          </div>


          {/* =================================================
              PASSWORD
              ================================================= */}

          <div>

            <label
              htmlFor="login-password"
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
                id="login-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Password"
                disabled={isLoading}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#EEE3D1]/10
                  bg-[#EEE3D1]/[0.025]
                  px-4
                  pr-12
                  text-sm
                  text-[#EEE3D1]
                  outline-none
                  placeholder:text-[#EEE3D1]/25
                  focus:border-[#EEE3D1]/25
                  disabled:opacity-50
                "
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
                  disabled:opacity-40
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

          </div>


          {/* =================================================
              REMEMBER / FORGOT
              ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              pt-1
            "
          >

            <label
              className="
                flex
                cursor-pointer
                items-center
                gap-2
              "
            >

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(
                    event.target.checked
                  )
                }
                disabled={isLoading}
                className="
                  h-4
                  w-4
                  appearance-none
                  rounded-[4px]
                  border
                  border-[#EEE3D1]/30
                  bg-transparent
                  checked:border-[#EEE3D1]
                  checked:bg-[#EEE3D1]
                  checked:shadow-[inset_0_0_0_3px_#171716]
                "
              />

              <span
                className="
                  text-xs
                  text-[#EEE3D1]/45
                "
              >
                Remember me
              </span>

            </label>


            <button
              type="button"
              disabled={isLoading}
              className="
                text-xs
                text-[#EEE3D1]/45
                transition
                hover:text-[#EEE3D1]/70
                disabled:opacity-40
              "
            >
              Forgot password?
            </button>

          </div>


          {/* =================================================
              ERROR
              ================================================= */}

          {error && (
            <p
              role="alert"
              className="
                pt-1
                text-center
                text-xs
                leading-5
                text-[#8A0303]
              "
            >
              {error}
            </p>
          )}


          {/* =================================================
              SIGN IN
              ================================================= */}

          <button
            type="submit"
            disabled={isLoading}
            className="
              mt-1
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
                ? "Signing in..."
                : "Sign in"}
            </span>

            {!isLoading && (
              <span>
                →
              </span>
            )}

          </button>

        </form>


        {/* =================================================
            CREATE ACCOUNT DIVIDER
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

          <button
            type="button"
            onClick={() =>
              router.push("/register")
            }
            className="
              text-sm
              text-[#EEE3D1]/45
              transition
              hover:text-[#EEE3D1]/80
            "
          >
            Create IRABRAIN account
            <span
              className="
                ml-2
                text-[#EEE3D1]/60
              "
            >
              →
            </span>
          </button>

        </div>

      </div>

    </main>
  );
}