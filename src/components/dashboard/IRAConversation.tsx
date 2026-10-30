"use client";

import {
  Bot,
  Pencil,
  Copy,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import type { InstantAck } from "@/lib/instantAck";
import IRABrainThinking from "./IRABrainThinking";
import type { IRAState, Message } from "./types";
import { useAuth } from "@/lib/auth/AuthProvider";
import { submitResponseFeedback } from "@/services/api/responseFeedbackApi";
import IRAVisualRenderer from "./IRAVisualRenderer";
import IRAMarkdown from "./markdown/IRAMarkdown";

interface IRAConversationProps {
  messages: Message[];
  isSending: boolean;
  iraState?: IRAState;
  error?: string | null;
  conversationId?: string;
  workspaceMode?: "personal" | "private";
  onOpenRecharge?: () => void;
  ack?: InstantAck | null;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  onEditMessage?: (message: Message) => void;
}

type FeedbackValue = "like" | "dislike";

export default function IRAConversation({
  messages,
  isSending,
  onEditMessage,
  iraState = "analyzing",
  error,
  conversationId,
  workspaceMode = "personal",
  onOpenRecharge,
  ack,
  scrollContainerRef: providedScrollContainerRef,
}: IRAConversationProps) {
  const { token } = useAuth();

  const [feedback, setFeedback] = useState<
    Record<string, FeedbackValue>
  >({});

  const [activeActionsMessageId, setActiveActionsMessageId] =
    useState<string | null>(null);

  const [textIdle, setTextIdle] = useState(false);

  const prevSendingRef = useRef(false);
  const knownBeforeSendRef = useRef<Set<string>>(new Set());
  const liveIdsRef = useRef<Set<string>>(new Set());

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // =====================================================
  // MESSAGE ACTIONS
  // =====================================================

  function handleMessageTouchStart(messageId: string) {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    longPressTimer.current = setTimeout(() => {
      setActiveActionsMessageId(messageId);
    }, 500);
  }

  function handleMessageTouchEnd() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  async function handleCopyMessage(content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setActiveActionsMessageId(null);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  }

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  // =====================================================
  // SCROLL TRACKING
  // =====================================================

  useEffect(() => {
    const container = providedScrollContainerRef?.current;

    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      shouldAutoScrollRef.current = distanceFromBottom < 120;
    };

    container.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [providedScrollContainerRef]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    const isNewUserMessage =
      lastMessage?.role === "user" && isSending;

    if (!shouldAutoScrollRef.current && !isNewUserMessage) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      const container = providedScrollContainerRef?.current;

      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "auto",
        });
      } else {
        bottomRef.current?.scrollIntoView({
          behavior: "auto",
          block: "end",
        });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [messages, isSending, providedScrollContainerRef]);

  // =====================================================
  // RESPONSE FEEDBACK
  // =====================================================

  async function handleFeedback(
    messageId: string,
    value: FeedbackValue
  ) {
    setFeedback((current) => ({
      ...current,
      [messageId]: value,
    }));

    if (!token || workspaceMode === "private") {
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

  // =====================================================
  // STREAMING MESSAGE TRACKING
  // =====================================================

  if (isSending && !prevSendingRef.current) {
    knownBeforeSendRef.current = new Set(
      messages.map((message) => message.id)
    );
  }

  prevSendingRef.current = isSending;

  if (isSending) {
    messages.forEach((message) => {
      if (
        message.role !== "user" &&
        !knownBeforeSendRef.current.has(message.id)
      ) {
        liveIdsRef.current.add(message.id);
      }
    });
  }

  // =====================================================
  // TEXT IDLE DETECTION
  // =====================================================

  useEffect(() => {
    setTextIdle(false);

    if (!isSending) return;

    const last = messages[messages.length - 1];

    if (!last || last.role === "user" || last.visual) {
      return;
    }

    const timer = setTimeout(() => {
      setTextIdle(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [messages, isSending]);

  if (messages.length === 0 && !isSending && !error) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="relative mx-auto flex h-full w-full max-w-4xl flex-col px-4 sm:px-6 lg:px-8">

      <div className="flex min-h-0 flex-1 flex-col">

        <div className="relative space-y-7 pb-36 pt-6 sm:space-y-8 sm:pb-40 sm:pt-8">

          {/* ================================================= */}
          {/* MESSAGES */}
          {/* ================================================= */}

          {messages.map((message) => {
            const isUser = message.role === "user";

            const selectedFeedback = feedback[message.id];

            const lastMessage = messages[messages.length - 1];

            const isStreamingMessage =
              isSending &&
              !isUser &&
              message.id === lastMessage?.id;

            return (
              <div
                key={message.id}
                className={`group flex w-full flex-col ${
                  isUser ? "items-end" : "items-start"
                }`}
                onTouchStart={
                  isUser
                    ? () => handleMessageTouchStart(message.id)
                    : undefined
                }
                onTouchEnd={
                  isUser ? handleMessageTouchEnd : undefined
                }
                onTouchMove={
                  isUser ? handleMessageTouchEnd : undefined
                }
              >

                {/* ================================================= */}
                {/* MESSAGE BUBBLE */}
                {/* ================================================= */}

                <div
                  className={
                    isUser
                      ? "w-fit max-w-[88%] rounded-2xl bg-[#EEE3D1]/[0.07] px-4 py-3 sm:max-w-[72%]"
                      : "w-full max-w-full px-0.5 py-1"
                  }
                >

                  {/* MESSAGE LABEL */}

                  <div
                    className={`mb-2 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] ${
                      isUser
                        ? "text-[#EEE3D1]/35"
                        : "text-[#EEE3D1]/45"
                    }`}
                  >
                    {isUser ? (
                      <span>You</span>
                    ) : (
                      <>
                        <Bot
                          size={12}
                          strokeWidth={1.6}
                          className="shrink-0 text-[#EEE3D1]/65"
                          aria-hidden="true"
                        />

                        <span>IRA</span>
                      </>
                    )}
                  </div>

                  {/* ================================================= */}
                  {/* MESSAGE ATTACHMENTS */}
                  {/* ================================================= */}

                  {(() => {
                    const legacyFiles =
                      message.attachment?.files ?? [];

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
                        {messageAttachments.map(
                          (attachment, index) => {
                            const isPastedText =
                              attachment.type === "pasted_text";

                            const isImage =
                              attachment.type === "image" ||
                              attachment.mimeType?.startsWith(
                                "image/"
                              ) === true;

                            return (
                              <div
                                key={`${message.id}-attachment-${index}`}
                                className="
                                  overflow-hidden rounded-xl
                                  border border-[#EEE3D1]/10
                                  bg-[#EEE3D1]/[0.045]
                                "
                              >
                                {isImage &&
                                  attachment.previewUrl && (
                                    <img
                                      src={attachment.previewUrl}
                                      alt={
                                        attachment.name ??
                                        "Attached image"
                                      }
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
                                        : attachment.name ??
                                          "Attachment"}
                                    </p>

                                    {isPastedText ? (
                                      <p className="mt-0.5 text-[10px] text-[#EEE3D1]/40">
                                        {"characterCount" in
                                          attachment &&
                                        attachment.characterCount !==
                                          undefined
                                          ? `${attachment.characterCount.toLocaleString()} characters`
                                          : "Text attachment"}

                                        {"lineCount" in attachment &&
                                          attachment.lineCount !==
                                            undefined &&
                                          ` · ${attachment.lineCount.toLocaleString()} lines`}
                                      </p>
                                    ) : attachment.size !==
                                      undefined ? (
                                      <p className="mt-0.5 text-[10px] text-[#EEE3D1]/40">
                                        {attachment.size <
                                        1024 * 1024
                                          ? `${(
                                              attachment.size / 1024
                                            ).toFixed(1)} KB`
                                          : `${(
                                              attachment.size /
                                              (1024 * 1024)
                                            ).toFixed(1)} MB`}
                                      </p>
                                    ) : null}

                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    );
                  })()}

                  {/* ================================================= */}
                  {/* MESSAGE TEXT + VISUAL */}
                  {/* ================================================= */}

                  <div className="min-w-0">

                    {isUser ? (
                      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#EEE3D1] sm:text-base">
                        {message.content}
                      </p>
                    ) : (
                      <>

                        <IRAMarkdown
                          content={message.content}
                          isStreaming={isStreamingMessage}
                        />

                        {/* BRAIN RECHARGE ACTION */}

                        {workspaceMode === "personal" &&
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
                                px-3 py-2 text-xs font-medium
                                text-[#EEE3D1]/80
                                transition-colors
                                hover:bg-[#EEE3D1]/[0.06]
                                hover:text-[#EEE3D1]
                              "
                            >
                              Explore Brain Recharge
                              <span aria-hidden="true">→</span>
                            </button>
                          )}

                        {/* VISUAL */}

                        {message.visual && (
                          <div className="mt-4 animate-in fade-in duration-300">
                            <IRAVisualRenderer
                              visual={message.visual}
                              defaultOpen={liveIdsRef.current.has(
                                message.id
                              )}
                            />
                          </div>
                        )}

                      </>
                    )}

                  </div>

                  {/* ================================================= */}
                  {/* IRA RESPONSE FEEDBACK */}
                  {/* ================================================= */}

                  {!isUser && (
                    <div className="mt-5 flex flex-wrap items-center gap-2">

                      <span className="mr-1 text-[11px] text-[#EEE3D1]/35">
                        Was this helpful?
                      </span>

                      <button
                        type="button"
                        aria-label="Like this response"
                        aria-pressed={
                          selectedFeedback === "like"
                        }
                        onClick={() =>
                          handleFeedback(
                            message.id,
                            "like"
                          )
                        }
                        className={`
                          group/feedback
                          flex h-8 w-8 items-center justify-center
                          rounded-full border
                          transition-all duration-200
                          ${
                            selectedFeedback === "like"
                              ? "border-[#EEE3D1]/25 bg-[#EEE3D1]/[0.10] text-[#EEE3D1]"
                              : "border-transparent text-[#EEE3D1]/40 hover:border-[#EEE3D1]/10 hover:bg-[#EEE3D1]/[0.06] hover:text-[#EEE3D1]/80"
                          }
                        `}
                      >
                        <ThumbsUp
                          size={15}
                          strokeWidth={1.6}
                          className="transition-transform group-hover/feedback:-translate-y-0.5"
                        />
                      </button>

                      <button
                        type="button"
                        aria-label="Dislike this response"
                        aria-pressed={
                          selectedFeedback === "dislike"
                        }
                        onClick={() =>
                          handleFeedback(
                            message.id,
                            "dislike"
                          )
                        }
                        className={`
                          group/feedback
                          flex h-8 w-8 items-center justify-center
                          rounded-full border
                          transition-all duration-200
                          ${
                            selectedFeedback === "dislike"
                              ? "border-[#EEE3D1]/25 bg-[#EEE3D1]/[0.10] text-[#EEE3D1]"
                              : "border-transparent text-[#EEE3D1]/40 hover:border-[#EEE3D1]/10 hover:bg-[#EEE3D1]/[0.06] hover:text-[#EEE3D1]/80"
                          }
                        `}
                      >
                        <ThumbsDown
                          size={15}
                          strokeWidth={1.6}
                          className="transition-transform group-hover/feedback:translate-y-0.5"
                        />
                      </button>

                      {selectedFeedback && (
                        <span className="ml-1 animate-in fade-in text-[10px] text-[#EEE3D1]/40 duration-200">
                          Thanks for your feedback
                        </span>
                      )}

                    </div>
                  )}

                </div>

                {/* ================================================= */}
                {/* USER MESSAGE ACTIONS — OUTSIDE BUBBLE */}
                {/* ================================================= */}

                {isUser && (
                  <div
                    className={`
                      flex w-full justify-end gap-1.5 pr-1 pt-2
                      transition-opacity duration-150

                      md:pointer-events-none
                      md:opacity-0

                      md:group-hover:pointer-events-auto
                      md:group-hover:opacity-100

                      ${
                        activeActionsMessageId === message.id
                          ? "pointer-events-auto opacity-100"
                          : "pointer-events-none opacity-0"
                      }
                    `}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        handleCopyMessage(message.content)
                      }
                      title="Copy message"
                      aria-label="Copy message"
                      className="
                        flex h-8 w-8 items-center justify-center
                        rounded-lg
                        text-[#EEE3D1]/45
                        transition
                        hover:bg-[#EEE3D1]/[0.07]
                        hover:text-[#EEE3D1]
                        active:scale-95
                      "
                    >
                      <Copy
                        size={18}
                        strokeWidth={1.7}
                      />
                    </button>

                    {onEditMessage && (
                      <button
                        type="button"
                        onClick={() => {
                          onEditMessage(message);
                          setActiveActionsMessageId(null);
                        }}
                        title="Edit message"
                        aria-label="Edit message"
                        className="
                          flex h-8 w-8 items-center justify-center
                          rounded-lg
                          text-[#EEE3D1]/45
                          transition
                          hover:bg-[#EEE3D1]/[0.07]
                          hover:text-[#EEE3D1]
                          active:scale-95
                        "
                      >
                        <Pencil
                          size={18}
                          strokeWidth={1.7}
                        />
                      </button>
                    )}

                  </div>
                )}

              </div>
            );
          })}

          {/* ================================================= */}
          {/* PREPARING VISUAL */}
          {/* ================================================= */}

          {isSending &&
            textIdle &&
            (() => {
              const last = messages[messages.length - 1];

              if (
                !last ||
                last.role === "user" ||
                last.visual
              ) {
                return null;
              }

              return (
                <div className="flex animate-in items-center gap-2 pl-0.5 fade-in duration-300">

  <span className="ira-state-dot ira-state-dot-2" />

  <span className="ira-state-loading text-[12.5px] font-medium tracking-wide">
    Preparing related visual…
  </span>

</div>
              );
            })()}

          {/* ================================================= */}
          {/* IRA THINKING */}
          {/* ================================================= */}

          {isSending &&
            (() => {
              const last = messages[messages.length - 1];

              const streaming =
                !!last && last.role !== "user";

              if (streaming) return null;

              return (
                <div className="flex w-full justify-start">

                  <div className="max-w-[94%] px-0.5 py-1 sm:max-w-[82%]">

                    <p className="mb-1.5 text-[9px] uppercase tracking-[0.2em] text-[#EEE3D1]/40">
                      IRA
                    </p>

                    <div className="mt-1">
                      <IRABrainThinking state={iraState} />
                    </div>

                    {ack && (
                      <p className="animate-in text-sm leading-6 text-[#EEE3D1]/80 fade-in duration-300 sm:text-base">
                        {ack.text}
                      </p>
                    )}

                  </div>

                </div>
              );
            })()}

          {/* ================================================= */}
          {/* ERROR */}
          {/* ================================================= */}

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

          {/* ================================================= */}
          {/* AUTO SCROLL ANCHOR */}
          {/* ================================================= */}

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