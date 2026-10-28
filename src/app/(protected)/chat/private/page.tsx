"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import IRAConversation from "@/components/dashboard/IRAConversation";
import IRAInput from "@/components/dashboard/IRAInput";

import type {
  IRAState,
  Message,
} from "@/components/dashboard/types";

import { useWorkspace } from "@/lib/workspace/WorkspaceContext";
import MainLayout from "@/components/layout/MainLayout";

function createId(): string {
  const bytes = new Uint8Array(16);

  crypto.getRandomValues(bytes);

  bytes[6] =
    (bytes[6] & 0x0f) | 0x40;

  bytes[8] =
    (bytes[8] & 0x3f) | 0x80;

  return Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  )
    .join("")
    .replace(
      /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
      "$1-$2-$3-$4-$5"
    );
}

function IncognitoIcon({
  size = 82,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Hat */}
      <path
        d="M25 43H75"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M31 43L37 27C38.5 23 42 20 46 20H54C58 20 61.5 23 63 27L69 43"
        fill="currentColor"
      />

      {/* Glasses bridge */}
      <path
        d="M47 62H53"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Left lens */}
      <circle
        cx="34"
        cy="63"
        r="13"
        stroke="currentColor"
        strokeWidth="7"
      />

      {/* Right lens */}
      <circle
        cx="66"
        cy="63"
        r="13"
        stroke="currentColor"
        strokeWidth="7"
      />
    </svg>
  );
}

export default function PrivateChatPage() {
  const { setWorkspaceMode } = useWorkspace();

  const sessionIdRef =
    useRef<string>(createId());

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [isSending, setIsSending] =
    useState(false);

  const [iraState, setIRAState] =
    useState<IRAState>("analyzing");

  useEffect(() => {
  setWorkspaceMode("private");
}, []);

function handleMessage(message: Message) {
  setMessages((current) => {
    const filtered = current.filter(
      (item) => item.id !== message.id
    );

    return [...filtered, message];
  });
}

  const conversationStarted =
    messages.length > 0 || isSending;

  return (
    <MainLayout>
      <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[var(--background)]">

        {/* =================================================
            CHAT AREA
        ================================================= */}

        <main className="relative min-h-0 flex-1 overflow-hidden">

          {/* TOP FADE */}

          <div
            className="
              pointer-events-none
              absolute
              left-0
              right-0
              top-0
              z-20
              h-12
              bg-gradient-to-b
              from-[var(--background)]
              to-transparent
            "
          />

          {/* MESSAGE AREA */}

          <div
            className="
              h-full
              overflow-y-auto
              overscroll-contain
              scroll-smooth
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            <div className="min-h-full pb-44 pt-6 sm:pt-8">

              {messages.length === 0 ? (
                <div
                  className="
                    flex
                    min-h-[calc(100dvh-12rem)]
                    flex-col
                    items-center
                    justify-center
                    px-6
                    text-center
                  "
                >
                  <IncognitoIcon
               size={82}
               />

                  <h1
                    className="
                      text-3xl
                      font-medium
                      tracking-[-0.03em]
                      text-[var(--foreground)]
                    "
                  >
                    Private Chat
                  </h1>

                  <p
                    className="
                      mt-4
                      max-w-md
                      text-sm
                      leading-6
                      text-[var(--muted)]
                    "
                  >
                    This chat won't appear in your
                    history and won't be saved to
                    personal memory.
                  </p>
                </div>
              ) : (
                <IRAConversation
                  messages={messages}
                  isSending={isSending}
                  iraState={iraState}
                />
              )}

            </div>
          </div>

          {/* BOTTOM FADE */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              right-0
              z-20
              h-16
              bg-gradient-to-t
              from-[var(--background)]
              to-transparent
            "
          />

        </main>

        {/* =================================================
            PRIVATE INPUT
        ================================================= */}

        <IRAInput
          onMessage={handleMessage}
          onSendingChange={setIsSending}
          onStateChange={setIRAState}
          conversationStarted={
            conversationStarted
          }
          sessionId={
            sessionIdRef.current
          }
        />

      </div>
    </MainLayout>
  );
}