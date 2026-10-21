"use client";

import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/lib/auth/AuthProvider";
import type { AuthSession } from "@/lib/auth/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdentityServices {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
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
    google?: { accounts: { id: GoogleIdentityServices } };
  }
}

// ---------------------------------------------------------------
// App-wide Google setup. Runs ONCE, no matter how many buttons mount.
// ---------------------------------------------------------------

type CredentialHandler = (credential: string) => void;

let scriptPromise: Promise<void> | null = null;
let initialized = false;
let activeHandler: CredentialHandler | null = null;

function loadGoogleScript(): Promise<void> {
  if (window.google) return Promise.resolve();

  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error("Google script failed to load."));
      };
      document.head.appendChild(script);
    });
  }

  return scriptPromise;
}

function initializeOnce() {
  if (initialized || !window.google || !GOOGLE_CLIENT_ID) return;

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    // Always forwards to whichever button is mounted right now.
    callback: (response) => activeHandler?.(response.credential),
  });

  initialized = true;
}

export default function GoogleButton() {
  const holderRef = useRef<HTMLDivElement>(null);
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");

  // Always call the latest loginWithGoogle without re-running the effect.
  const loginRef = useRef(loginWithGoogle);
  loginRef.current = loginWithGoogle;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError("Google login is not configured.");
      return;
    }

    let cancelled = false;

    const handler: CredentialHandler = async (credential) => {
      try {
        setError("");

        if (!credential) {
          throw new Error("Google did not return a credential.");
        }

        const apiResponse = await fetch(`${API_BASE_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential }),
        });

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json().catch(() => null);
          throw new Error(
            errorData?.detail || "Google authentication failed."
          );
        }

        const data: AuthSession = await apiResponse.json();

        loginRef.current(data);
        window.location.href = "/chat";
      } catch (err) {
        console.error("Google authentication failed:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Google authentication failed."
        );
      }
    };

    activeHandler = handler;

    loadGoogleScript()
      .then(() => {
        const holder = holderRef.current;
        if (cancelled || !holder || !window.google) return;

        initializeOnce();

        // Google only accepts a button width between 200 and 400.
        const measured = Math.round(holder.getBoundingClientRect().width);
        const width = Math.min(400, Math.max(200, measured || 320));

        holder.innerHTML = "";

        window.google.accounts.id.renderButton(holder, {
          theme: "filled_black",
          size: "large",
          width,
          text: "continue_with",
          shape: "rectangular",
        });
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load Google. Check your connection.");
        }
      });

    return () => {
      cancelled = true;
      if (activeHandler === handler) activeHandler = null;
      if (holderRef.current) holderRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div className="w-full">
      <div className="relative mx-auto h-12 w-full max-w-[400px]">
        {/* IRABRAIN custom button (visual only) */}
        <div
          className="
            pointer-events-none
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
          "
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
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
          <span>Continue with Google</span>
        </div>

        {/* Google's real button: invisible, on top, receives the click */}
        <div
          ref={holderRef}
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

      {error && (
        <p className="mt-2 text-center text-xs text-[#EEE3D1]/60">{error}</p>
      )}
    </div>
  );
}