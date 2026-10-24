"use client";

import {
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import IRABrainThinking from "./IRABrainThinking";
import type { IRAState, Message } from "./types";
import { useAuth } from "@/lib/auth/AuthProvider";
import { submitResponseFeedback } from "@/services/api/responseFeedbackApi";
import IRAVisualRenderer from "./IRAVisualRenderer";

interface IRAConversationProps {
  messages: Message[];
  isSending: boolean;
  iraState?: IRAState;
  error?: string | null;
  conversationId?: string;
  workspaceMode?: "personal" | "private";
  onOpenRecharge?: () => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;

}

type FeedbackValue = "like" | "dislike";

export default function IRAConversation({
  messages,
  isSending,
  iraState = "thinking",
  error,
  conversationId,
  workspaceMode = "personal",
  onOpenRecharge,
}: IRAConversationProps) {
   const { token } = useAuth();
  const [feedback, setFeedback] = useState<
    Record<string, FeedbackValue>
  >({});

 const bottomRef = useRef<HTMLDivElement | null>(null);
const scrollContainerRef = useRef<HTMLDivElement | null>(null);
const shouldAutoScrollRef = useRef(true);

useEffect(() => {
  const container = scrollContainerRef.current;

  if (!container) return;

  const handleScroll = () => {
    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    shouldAutoScrollRef.current = distanceFromBottom < 100;
  };

  container.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  return () => {
    container.removeEventListener("scroll", handleScroll);
  };
}, []);

useEffect(() => {
  const container = scrollContainerRef.current;

  if (!container || !shouldAutoScrollRef.current) return;

  container.scrollTop = container.scrollHeight;
}, [messages, isSending]);

  async function handleFeedback(
  messageId: string,
  value: FeedbackValue
) {
  setFeedback((current) => ({
    ...current,
    [messageId]: value,
  }));

  if (
    !token ||
    workspaceMode === "private"
  ) {
    return;
  }

  try {
    await submitResponseFeedback(
      token,
      conversationId,
      messageId,
      value
    );
  } catch (error) {
    console.error(
      "Failed to submit response feedback:",
      error
    );
  }
}




  if (messages.length === 0 && !isSending && !error) {
    return null;
  }

  return (
    <section className="relative mx-auto flex h-full w-full max-w-4xl flex-col px-4 sm:px-6 lg:px-8">

      <div className="flex min-h-0 flex-1 flex-col">
       <div className="relative space-y-7 pb-36 pt-6 sm:space-y-8 sm:pb-40 sm:pt-8">

          {/* MESSAGES */}

          {messages.map((message) => {
            const isUser = message.role === "user";
            const selectedFeedback = feedback[message.id];

            return (
              <div
                key={message.id}
                className={`flex w-full ${
                  isUser
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={
                    isUser
                      ? "max-w-[88%] rounded-2xl bg-[#EEE3D1]/[0.07] px-4 py-3 sm:max-w-[72%]"
                      : "max-w-[94%] px-0.5 py-1 sm:max-w-[82%]"
                  }
                >
                  <p
                    className={`mb-1.5 text-[9px] uppercase tracking-[0.2em] ${
                      isUser
                        ? "text-[#EEE3D1]/35"
                        : "text-[#EEE3D1]/40"
                    }`}
                  >
                    {isUser ? "You" : "IRA"}
                  </p>

                  {/* MESSAGE ATTACHMENTS */}

{(() => {
  const legacyFiles = message.attachment?.files ?? [];

  const messageAttachments =
    message.attachments ??
    (legacyFiles.length > 0
      ? legacyFiles.map((file) => ({
          type: "image" as const,
          name: file.name,
          mimeType: file.mimeType,
          size: file.size,
          previewUrl: file.previewUrl,
        }))
      : message.attachment
        ? [message.attachment]
        : []);

  if (messageAttachments.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 space-y-2">
      {messageAttachments.map((attachment, index) => {
        const isPastedText =
          attachment.type === "pasted_text";

        const isImage =
          attachment.type === "image" ||
          attachment.mimeType?.startsWith("image/") === true;

        return (
          <div
            key={`${message.id}-attachment-${index}`}
            className="
              overflow-hidden rounded-xl
              border border-[#EEE3D1]/10
              bg-[#EEE3D1]/[0.045]
            "
          >
            {isImage && attachment.previewUrl && (
              <img
                src={attachment.previewUrl}
                alt={attachment.name ?? "Attached image"}
                className="
                  max-h-64 w-full
                  bg-black/20 object-contain
                "
              />
            )}

            <div className="flex items-center gap-3 px-3 py-2.5">
              <div
                className="
                  flex h-9 w-9 shrink-0 items-center
                  justify-center rounded-lg
                  bg-[#EEE3D1]/[0.06]
                  text-[#EEE3D1]/65
                "
              >
                {isImage ? "🖼️" : "📄"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-[#EEE3D1]/85">
                  {isPastedText
                    ? "Pasted content"
                    : attachment.name ?? "Attachment"}
                </p>

                {isPastedText ? (
                  <p className="mt-0.5 text-[10px] text-[#EEE3D1]/40">
                    {"characterCount" in attachment &&
                    attachment.characterCount !== undefined
                      ? `${attachment.characterCount.toLocaleString()} characters`
                      : "Text attachment"}

                    {"lineCount" in attachment &&
                      attachment.lineCount !== undefined &&
                      ` · ${attachment.lineCount.toLocaleString()} lines`}
                  </p>
                ) : attachment.size !== undefined ? (
                  <p className="mt-0.5 text-[10px] text-[#EEE3D1]/40">
                    {attachment.size < 1024 * 1024
                      ? `${(attachment.size / 1024).toFixed(1)} KB`
                      : `${(attachment.size / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
})()}

                  

    

                  {(isUser || !message.visual) && (
  <p className="whitespace-pre-wrap text-sm leading-6 text-[#EEE3D1] sm:text-base">
    {message.content}
    {/* BRAIN RECHARGE ACTION */}

{!isUser &&
  workspaceMode === "personal" &&
  onOpenRecharge &&
  (
    message.content.includes(
      "Explore your Brain Recharge options"
    ) ||
    message.content.includes(
      "Explore Brain Recharge options"
    )
  ) && (
    <button
      type="button"
      onClick={onOpenRecharge}
      className="
        mt-3 inline-flex items-center gap-2
        rounded-lg border border-[#EEE3D1]/15
        px-3 py-2
        text-xs font-medium text-[#EEE3D1]/80
        transition-colors
        hover:bg-[#EEE3D1]/[0.06]
        hover:text-[#EEE3D1]
      "
    >
      Explore Brain Recharge
      <span aria-hidden="true">→</span>
    </button>
  )}
                  </p>
                  )}

                  {!isUser && message.visual && (
    <IRAVisualRenderer visual={message.visual} />
)}


                  {/* IRA RESPONSE FEEDBACK */}

                  {!isUser && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-[11px] text-[#EEE3D1]/35">
                        Did you like this conversation?
                      </span>

                      <button
                        type="button"
                        aria-label="Like this response"
                        onClick={() =>
                          handleFeedback(
                            message.id,
                            "like"
                          )
                        }
                        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                          selectedFeedback === "like"
                            ? "bg-[#EEE3D1]/10 text-[#EEE3D1]/80"
                            : "text-[#EEE3D1]/35 hover:bg-[#EEE3D1]/[0.06] hover:text-[#EEE3D1]/65"
                        }`}
                      >
                        <ThumbsUp
                          size={14}
                          strokeWidth={1.5}
                        />
                      </button>

                      <button
                        type="button"
                        aria-label="Dislike this response"
                        onClick={() =>
                          handleFeedback(
                            message.id,
                            "dislike"
                          )
                        }
                        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                          selectedFeedback === "dislike"
                            ? "bg-[#EEE3D1]/10 text-[#EEE3D1]/80"
                            : "text-[#EEE3D1]/35 hover:bg-[#EEE3D1]/[0.06] hover:text-[#EEE3D1]/65"
                        }`}
                      >
                        <ThumbsDown
                          size={14}
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* IRA THINKING */}

          {isSending && (
            <div className="flex justify-start">
              <IRABrainThinking state={iraState} />
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="flex justify-start">
              <div className="max-w-[94%] px-0.5 py-1">
                <p className="mb-1.5 text-[9px] uppercase tracking-[0.2em] text-[#8A0303]/70">
                  IRA
                </p>

                <p className="text-sm leading-6 text-[#EEE3D1]/60">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* AUTO SCROLL ANCHOR */}

          <div
            ref={bottomRef}
            className="h-px w-full"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}