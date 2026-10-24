"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";

import IRAConversation from "@/components/dashboard/IRAConversation";
import IRAInput from "@/components/dashboard/IRAInput";

import { useAuth } from "@/lib/auth/AuthProvider";

import {
  getConversationHistory,
  sendMessageToIRAStream,
} from "@/services/api/brainApi";

import type {
  IRAState,
  Message,
} from "@/components/dashboard/types";

import {
  getPendingConversation,
  setPendingConversation,
  updatePendingConversationState,
  clearPendingConversation,
} from "@/lib/chat/pendingConversationStore";

import {
  useWorkspace,
} from "@/lib/workspace/WorkspaceContext";

import MainLayout from "@/components/layout/MainLayout";
import HomeHero from "@/components/dashboard/HomeHero";
import BrainRechargeModal from "@/components/brain/BrainRechargeModal";


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

export default function ChatPage() {
  const { token } = useAuth();
  const { workspaceMode } = useWorkspace();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  
  const searchParams = useSearchParams();

  const conversationId =
    searchParams.get("conversation");

  const projectId =
    searchParams.get("project");

  const activeConversationId =
    conversationId ?? undefined;

  const activeProjectId =
    projectId ?? undefined;

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [isSending, setIsSending] =
    useState(false);

  const [iraState, setIRAState] =
    useState<IRAState>("thinking");

  const initializedConversation =
    useRef<string | null>(null);
  
  const [isRechargeOpen, setIsRechargeOpen] =
  useState(false);

  // =====================================================
  // RESET CHAT WHEN CONVERSATION CHANGES
  // =====================================================

  useEffect(() => {
    initializedConversation.current = null;

    if (!activeConversationId) {
      setMessages([]);
      setIsSending(false);
      setIRAState("thinking");
    }
  }, [activeConversationId]);

  // =====================================================
  // LOAD CONVERSATION / PROCESS FIRST MESSAGE
  // =====================================================

  useEffect(() => {
  if (!token || !activeConversationId) {
    return;
  }

  const conversationId =
    activeConversationId;

  if (
    initializedConversation.current ===
    conversationId
  ) {
    return;
  }

  initializedConversation.current =
    conversationId;

  const accessToken = token;

  async function initializeConversation() {

    // =================================================
    // EXISTING PENDING CONVERSATION
    // =================================================

    const pendingConversation =
      getPendingConversation(
        conversationId
      );

        if (pendingConversation) {
      try {
        const history =
          await getConversationHistory(
            accessToken,
            conversationId
          );

        const loadedMessages: Message[] =
          history.map((message) => ({
            id: String(message.id),
            role:
              message.role === "assistant"
                ? "ira"
                : "user",
            content: message.content,
            attachments: Array.isArray(message.attachments) ? message.attachments.map((a) => ({
              type: a.type === "pasted_text" ? "pasted_text" as const : a.type === "image" ? "image" as const : "file_upload" as const,
              name: a.name ?? undefined,
              mimeType: a.mime_type ?? undefined,
            })) : undefined,
            visual: message.visual_data ?? undefined,
          }));

        const lastMessage =
          loadedMessages[
            loadedMessages.length - 1
          ];

        const pendingMessageAlreadyExists =
          lastMessage?.role === "user" &&
          lastMessage.content ===
            pendingConversation.message.content;

        if (!pendingMessageAlreadyExists) {
          loadedMessages.push(
            pendingConversation.message
          );
        }

        setMessages(loadedMessages);
        setIsSending(true);

        const elapsed =
          Date.now() -
          pendingConversation.startedAt;

        if (elapsed < 1200) {
          setIRAState("thinking");
        } else if (elapsed < 2600) {
          setIRAState("reasoning");
        } else if (elapsed < 4000) {
          setIRAState("brainstorming");
        } else if (elapsed < 5400) {
          setIRAState("retrieving");
        } else if (elapsed < 6800) {
          setIRAState("connecting");
        } else {
          setIRAState("preparing");
        }

        const stateTimer1 =
          setTimeout(() => {
            setIRAState("reasoning");
            updatePendingConversationState(
              conversationId,
              "reasoning"
            );
          }, 1200);

        const stateTimer2 =
          setTimeout(() => {
            setIRAState("brainstorming");
            updatePendingConversationState(
              conversationId,
              "brainstorming"
            );
          }, 2600);

        const stateTimer3 =
          setTimeout(() => {
            setIRAState("retrieving");
            updatePendingConversationState(
              conversationId,
              "retrieving"
            );
          }, 4000);

        const stateTimer4 =
          setTimeout(() => {
            setIRAState("connecting");
            updatePendingConversationState(
              conversationId,
              "connecting"
            );
          }, 5400);

        const stateTimer5 =
          setTimeout(() => {
            setIRAState("preparing");
            updatePendingConversationState(
              conversationId,
              "preparing"
            );
          }, 6800);

        try {
          
          const streamingMessageId = createId();
let response = "";
let responseVisual: Message["visual"] = undefined;



response = await sendMessageToIRAStream(
  pendingConversation.message.content,
  accessToken,
  conversationId,
  activeProjectId,
  pendingConversation.attachments,
  workspaceMode,
  undefined,
  (chunk) => {
    response += chunk;

    setMessages((current) => [
      ...current.filter(
        (message) => message.id !== streamingMessageId
      ),
      {
        id: streamingMessageId,
        role: "ira",
        content: response,
        visual: responseVisual,
      },
    ]);
  },
  (visual) => {
    responseVisual = visual;

    setMessages((current) => [
      ...current.filter(
        (message) => message.id !== streamingMessageId
      ),
      {
        id: streamingMessageId,
        role: "ira",
        content: response,
        visual: responseVisual,
      },
    ]);
  }
);
  
        } catch (error) {
  console.error("IRA request failed:", error);

  const apiError = error as Error & {
    code?: string;
    status?: number;
  };

  const isCapabilityRestriction =
    apiError.code === "CAPABILITY_NOT_INCLUDED" ||
    apiError.code === "CONTEXT_LIMIT_EXCEEDED" ||
    apiError.code === "COMPLEXITY_LIMIT_EXCEEDED";

  const errorMessage: Message = {
    id: createId(),
    role: "ira",
    content:
      error instanceof Error && error.message
        ? error.message
        : "Sorry, I couldn't process that right now. Please try again.",
  };

  setMessages((current) => [
    ...current,
    errorMessage,
  ]);

  if (isCapabilityRestriction) {
    window.dispatchEvent(
      new CustomEvent("ira:capability-restricted", {
        detail: {
          code: apiError.code,
        },
      })
    );
  }
}
        
        finally {
          clearTimeout(stateTimer1);
          clearTimeout(stateTimer2);
          clearTimeout(stateTimer3);
          clearTimeout(stateTimer4);
          clearTimeout(stateTimer5);

          clearPendingConversation(
            conversationId
          );

          setIsSending(false);
          setIRAState("thinking");
        }
      } catch (error) {
        console.error(
          "Failed to restore pending conversation:",
          error
        );

        setMessages([
          pendingConversation.message,
        ]);

        setIsSending(false);
        setIRAState("thinking");

        clearPendingConversation(
          conversationId
        );
      }

      return;
    }


    // =================================================
    // EXISTING COMPLETED CONVERSATION
    // =================================================

    try {
      const history =
        await getConversationHistory(
          accessToken,
          conversationId
        );

      const loadedMessages: Message[] =
        history.map((message) => ({
          id: String(message.id),

          role:
            message.role === "assistant"
              ? "ira"
              : "user",

          content: message.content,
            attachments: Array.isArray(message.attachments) ? message.attachments.map((a) => ({
              type: a.type === "pasted_text" ? "pasted_text" as const : a.type === "image" ? "image" as const : "file_upload" as const,
              name: a.name ?? undefined,
              mimeType: a.mime_type ?? undefined,
            })) : undefined,
            visual: message.visual_data ?? undefined,
        }));

      setMessages(
        loadedMessages
      );

      setIsSending(false);
      setIRAState("thinking");

    } catch (error) {
      console.error(
        "Failed to load conversation:",
        error
      );

      setMessages([]);
      setIsSending(false);
    }
  }

  initializeConversation();

}, [
  token,
  activeConversationId,
  activeProjectId,
  workspaceMode,
]);
  // =====================================================
  // MESSAGE HANDLER
  // =====================================================

 function handleMessage(message: Message) {
  setMessages((current) => {
    const filtered = current.filter(
      (item) => item.id !== message.id
    );

    return [...filtered, message];
  });
}
  // =====================================================
  // CONVERSATION STATE
  // =====================================================

 const conversationStarted =
  Boolean(activeConversationId) ||
  messages.length > 0 ||
  isSending;

  // =====================================================
  // UI
  // =====================================================

  return (
    <MainLayout>
       <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[var(--background)]">
        

        {/* MAIN CHAT AREA */}

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">

          {!conversationStarted ? (
            /* EMPTY CHAT — SAME LAYOUT AS ORIGINAL HOME */
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-4">

              <HomeHero />

              <div className="w-full max-w-[800px]">
                <IRAInput
                  onMessage={handleMessage}
                  isProcessing={isSending}
                  onSendingChange={setIsSending}
                  onStateChange={setIRAState}
                  conversationStarted={false}
                  conversationId={undefined}
                  projectId={activeProjectId}
                  onStartConversation={undefined}
                />
              </div>

            </div>
          ) : (
            /* ACTIVE CONVERSATION */
            <>
              <div className="relative min-h-0 flex-1 overflow-hidden">
  {/* Scrollable conversation */}
  <div
    ref={scrollContainerRef}
    className="h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    <IRAConversation
      messages={messages}
      isSending={isSending}
      iraState={iraState}
      conversationId={activeConversationId}
      workspaceMode={workspaceMode}
      onOpenRecharge={() => setIsRechargeOpen(true)}
    />
  </div>

  {/* Fixed top fade */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[var(--background)] via-[var(--background)]/80 to-transparent"
  />
</div>

              <div className="relative z-20 shrink-0">
  {/* Soft fade above the composer */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 bottom-full h-16 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/70 to-transparent"
  />

  <IRAInput
    onMessage={handleMessage}
    isProcessing={isSending}
    onSendingChange={setIsSending}
    onStateChange={setIRAState}
    conversationStarted={true}
    conversationId={activeConversationId}
    projectId={activeProjectId}
  />
</div>
            </>
          )}

        </main>

      </div>
      <BrainRechargeModal
  open={isRechargeOpen}
  onClose={() => setIsRechargeOpen(false)}
  onPaymentSuccess={async () => {
    window.dispatchEvent(
      new CustomEvent("ira:brain-balance-updated")
    );
  }}
/>
      
    </MainLayout>
  );
}