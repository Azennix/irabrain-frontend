"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import IRAConversation from "@/components/dashboard/IRAConversation";
import IRAInput from "@/components/dashboard/IRAInput";
import { WorkspaceProvider } from "@/lib/workspace/WorkspaceContext";
import type {
  IRAState,
  Message,
} from "@/components/dashboard/types";
import IRAAuth from "@/components/auth/IRAAuth";
import MainLayout from "@/components/layout/MainLayout";
import HomeHero from "@/components/dashboard/HomeHero";

export default function PublicHome() {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [isSending, setIsSending] =
    useState(false);

  const [iraState, setIRAState] =
    useState<IRAState>("thinking");

  const [guestLimitReached,setGuestLimitReached]=useState(false);

  const conversationStarted =
    messages.length > 0 || isSending;

  const router = useRouter();
const pathname = usePathname();

  function handleMessage(message: Message) {
  setMessages((current) => {
    const filtered = current.filter(
      (item) => item.id !== message.id
    );

    return [...filtered, message];
  });
}
  function handleGuestLimitReached() {
  setGuestLimitReached(true);
}


  return (
    <WorkspaceProvider>
        <MainLayout>
      <main className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[var(--background)]">

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {!conversationStarted ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-6">
          
            <HomeHero />

            <IRAInput
              onMessage={handleMessage}
              onSendingChange={setIsSending}
              onStateChange={setIRAState}
              conversationStarted={
                conversationStarted
              }
              guestMode
              onGuestLimitReached={handleGuestLimitReached}
            />

          </div>
        ) : (
          <>
            <main className="min-h-0 flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <div className="mx-auto max-w-4xl pb-40 pt-8">
                  <IRAConversation
                    messages={messages}
                    isSending={isSending}
                    iraState={iraState}
                  />
                </div>
              </div>
            </main>

            {!guestLimitReached ? (
  <IRAInput
    onMessage={handleMessage}
    onSendingChange={setIsSending}
    onStateChange={setIRAState}
    conversationStarted={conversationStarted}
    guestMode
    onGuestLimitReached={handleGuestLimitReached}
  />
) : (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/55 backdrop-blur-md" />

    <div className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-2xl border border-[#EEE3D1]/10 bg-[#171716] px-7 py-8 shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
      <IRAAuth />
    </div>
  </div>
)}
          </>
        )}

      </div>

    </main>
    </MainLayout>
  </WorkspaceProvider>
  );
}