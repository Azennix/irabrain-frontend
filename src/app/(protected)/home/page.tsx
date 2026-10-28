"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import HomeHero from "@/components/dashboard/HomeHero";
import IRAConversation from "@/components/dashboard/IRAConversation";
import IRAInput from "@/components/dashboard/IRAInput";

import { useAuth } from "@/lib/auth/AuthProvider";
import { createConversation } from "@/services/api/brainApi";

import type {
  IRAState,
  Message,
} from "@/components/dashboard/types";

import {
  notifyConversationChange,
  setPendingConversation,
} from "@/lib/chat/pendingConversationStore";

export default function Home() {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [isSending, setIsSending] =
    useState(false);

  const [iraState, setIRAState] =
    useState<IRAState>("analyzing");

  const { token } = useAuth();
  const router = useRouter();

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





  async function handleStartConversation(query: string) {
  if (!token) return;

  try {
    const conversation = await createConversation(
      token,
      query.slice(0, 60)
    );

    const conversationId = conversation.conversation_id;

    const firstMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
    };

    // Register the first message for ChatPage.
    setPendingConversation(
      conversation.conversation_id,
      firstMessage,
      "analyzing"
    );

    // Keep the message available for the existing flow.
    sessionStorage.setItem("ira_pending_message", query);

    // Refresh the sidebar using its existing subscription.
    notifyConversationChange();

    // Open the newly created conversation.
    router.push(
      `/chat?conversation=${encodeURIComponent(conversationId)}`
    );
  } catch (error) {
    console.error("Failed to create conversation:", error);
    setIsSending(false);
    setIRAState("analyzing");
  }
}

  return (
    <MainLayout>
      <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[var(--background)]">

        {/* HEADER */}

        <div className="shrink-0 bg-[var(--background)]">
        </div>

        {/* HOME VIEWPORT */}

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">

          {!conversationStarted ? (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-4">

              <HomeHero />

              <div className="w-full max-w-[800px]">
                <IRAInput
                  onMessage={handleMessage}
                  onSendingChange={
                    setIsSending
                  }
                  onStateChange={
                    setIRAState
                  }
                  conversationStarted={
                    conversationStarted
                  }
                  onStartConversation={
                    handleStartConversation
                  }
                />
              </div>

            </div>
          ) : (
            <>
              <IRAConversation
                messages={messages}
                isSending={isSending}
                iraState={iraState}
              />

              <IRAInput
                onMessage={handleMessage}
                onSendingChange={
                  setIsSending
                }
                onStateChange={
                  setIRAState
                }
                conversationStarted={
                  conversationStarted
                }
                onStartConversation={
                  handleStartConversation
                }
              />
            </>
          )}

        </main>

      </div>
    </MainLayout>
  );
}