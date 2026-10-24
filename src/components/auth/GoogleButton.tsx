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
          credentials: "include",
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
      {/* Google's real button. It must stay visible, or Google ignores clicks. */}
      <div
        ref={holderRef}
        className="mx-auto flex h-12 w-full max-w-[400px] items-center justify-center overflow-hidden rounded-lg"
      />

      {error && (
        <p className="mt-2 text-center text-xs text-[#EEE3D1]/60">{error}</p>
      )}
    </div>
  );
}