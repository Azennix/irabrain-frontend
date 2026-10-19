"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/AuthProvider";
import type { AuthSession } from "@/lib/auth/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000";


const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdentityServices {
  initialize: (config: {
    client_id: string;
    callback: (
      response: GoogleCredentialResponse
    ) => void;
  }) => void;

  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: string;
      size?: string;
      width?: number;
      text?: string;
      shape?: string;
    }
  ) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleIdentityServices;
      };
    };
  }
}

export default function GoogleButton() {
  const googleButtonRef =
    useRef<HTMLDivElement>(null);

  const initializedRef =
    useRef(false);

  const router = useRouter();

  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error(
        "NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured."
      );
      return;
    }

    if (initializedRef.current) {
      return;
    }

    const initializeGoogle = () => {
      if (
        !window.google ||
        !googleButtonRef.current ||
        initializedRef.current
      ) {
        return;
      }

      initializedRef.current = true;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,

        callback: async (
          response: GoogleCredentialResponse
        ) => {
          try {
            if (!response.credential) {
              throw new Error(
                "Google did not return a credential."
              );
            }

            const apiResponse = await fetch(
              `${API_BASE_URL}/auth/google`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  credential:
                    response.credential,
                }),
              }
            );

            if (!apiResponse.ok) {
              const errorData =
                await apiResponse
                  .json()
                  .catch(() => null);

              throw new Error(
                errorData?.detail ||
                  "Google authentication failed."
              );
            }

            const data: AuthSession =
              await apiResponse.json();

            loginWithGoogle(data);

            window.location.href = "/chat";
          } catch (error) {
            console.error(
              "Google authentication failed:",
              error
            );

            initializedRef.current = false;
          }
        },
      });

      googleButtonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: "filled_black",
          size: "large",
          width: 400,
          text: "continue_with",
          shape: "rectangular",
        }
      );
    };

    const existingScript =
      document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );

    if (existingScript) {
      if (window.google) {
        initializeGoogle();
      } else {
        existingScript.addEventListener(
          "load",
          initializeGoogle,
          { once: true }
        );
      }

      return;
    }

    const script =
      document.createElement("script");

    script.src =
      "https://accounts.google.com/gsi/client";

    script.async = true;
    script.defer = true;

    script.onload = initializeGoogle;

    document.head.appendChild(script);
  }, [router, loginWithGoogle]);

  return (
    <div className="relative h-12 w-full">
      {/* =================================================
          IRABRAIN CUSTOM GOOGLE BUTTON
      ================================================= */}

      <button
        type="button"
        className="
          absolute
          inset-0
          z-0
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-3
          rounded-lg
          border
          border-[#EEE3D1]/15
          bg-[#2B2821]/45
          text-sm
          font-medium
          text-[#EEE3D1]
          transition-all
          duration-200
          hover:border-[#EEE3D1]/25
          hover:bg-[#2B2821]/65
        "
        aria-label="Continue with Google"
      >
        {/* Google G */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M21.35 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.95 2.94v2.45h3.16c1.85-1.7 2.9-4.2 2.9-7.22Z"
          />
          <path
            fill="#34A853"
            d="M12 21.75c2.64 0 4.86-.87 6.48-2.35l-3.16-2.45c-.87.58-1.98.92-3.32.92-2.55 0-4.71-1.72-5.49-4.03H3.24v2.53A9.8 9.8 0 0 0 12 21.75Z"
          />
          <path
            fill="#FBBC05"
            d="M6.51 13.84A5.88 5.88 0 0 1 6.2 12c0-.64.11-1.26.31-1.84V7.63H3.24A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.05.99 4.37l3.27-2.53Z"
          />
          <path
            fill="#EA4335"
            d="M12 6.13c1.44 0 2.73.5 3.75 1.48l2.81-2.81C16.85 3.25 14.63 2.25 12 2.25a9.8 9.8 0 0 0-8.76 5.38l3.27 2.53c.78-2.31 2.94-4.03 5.49-4.03Z"
          />
        </svg>

        <span>
          Continue with Google
        </span>
      </button>

      {/* =================================================
          GOOGLE AUTHENTICATION CLICK LAYER
          Invisible — Google's real button stays functional
      ================================================= */}

      <div
        ref={googleButtonRef}
        className="
          absolute
          inset-0
          z-10
          flex
          items-center
          justify-center
          overflow-hidden
          opacity-0
        "
      />
    </div>
  );
}