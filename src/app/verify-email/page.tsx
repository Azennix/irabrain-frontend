"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
import {
  useSearchParams,
  useRouter,
} from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "verifying" | "success" | "error"
  >("verifying");

  const [message, setMessage] = useState(
    "Verifying your email..."
  );

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/auth/verify-email?token=${encodeURIComponent(
            token
          )}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "This verification link is invalid or expired."
          );
        }

        setStatus("success");
        setMessage(
          "Your email has been verified successfully."
        );
      } catch (error) {
        setStatus("error");

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify your email."
        );
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-5">
      <div className="w-full max-w-md text-center">

        <div className="mb-8 flex justify-center">
          <img
            src="/irabrain-logo.png"
            alt="IRABRAIN"
            width={64}
            height={64}
          />
        </div>

        {status === "verifying" && (
          <>
            <h1 className="text-2xl font-semibold text-[#EEE3D1]">
              Verifying your email
            </h1>

            <p className="mt-3 text-sm text-[#EEE3D1]/45">
              Please wait a moment...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-semibold text-[#EEE3D1]">
              Email verified.
            </h1>

            <p className="mt-3 text-sm text-[#EEE3D1]/50">
              {message}
            </p>

            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="mt-8 h-12 w-full rounded-xl bg-[#8A0303] text-sm font-medium text-[#EEE3D1] transition hover:opacity-90"
            >
              Continue to sign in
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-semibold text-[#EEE3D1]">
              Verification failed.
            </h1>

            <p className="mt-3 text-sm text-[#EEE3D1]/50">
              {message}
            </p>

            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="mt-8 h-12 w-full border border-[#EEE3D1]/10 rounded-xl bg-[#EEE3D1]/[0.025] text-sm font-medium text-[#EEE3D1] transition hover:border-[#EEE3D1]/20"
            >
              Back to sign in
            </button>
          </>
        )}

      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-black px-5">
          <div className="text-center">
            <img
              src="/irabrain-logo.png"
              alt="IRABRAIN"
              width={64}
              height={64}
              className="mx-auto mb-8"
            />

            <p className="text-sm text-[#EEE3D1]/50">
              Verifying your email...
            </p>
          </div>
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}