"use client";

import {
  ArrowUp,
  LoaderCircle,
  Plus,
  X,
  FileText,
  Brain,
  Paperclip,
  
  Folder,
  
  
} from "lucide-react";

import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/lib/auth/AuthProvider";
import type {
  BrainAttachment,
} from "@/services/api/brainApi";
import { sendMessageToIRA,
        sendMessageToIRAStream,
        sendGuestMessageToIRA,
         createConversation,
 } from "@/services/api/brainApi";

import type { IRAState, Message } from "./types";
import { usePathname } from "next/navigation";
import {
  useWorkspace,
} from "@/lib/workspace/WorkspaceContext";

import {
  setPendingConversation,
  updatePendingConversationState,
  clearPendingConversation,
} from "@/lib/chat/pendingConversationStore";

import {
  getGuestSessionId,
  getGuestDeviceId,
} from "@/lib/guest/guestSession";
import { useRouter } from "next/navigation";
import { useBrainBalance } from "@/hooks/useBrainBalance";
import { getBrainBalanceStatus } from "@/utils/brainBalanceStatus";
import BrainRechargeModal from "@/components/brain/BrainRechargeModal";
import {
  getCurrentUser as fetchCurrentUser,
} from "@/services/api/authApi";
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


function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to read attachment."));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(
        reader.error ??
          new Error(`Failed to read ${file.name}.`)
      );
    };

    reader.readAsDataURL(file);
  });
}



interface IRAInputProps {
  onMessage: (message: Message) => void;
  onSendingChange: (value: boolean) => void;
  isProcessing?: boolean;
  onStateChange: (state: IRAState) => void;
  conversationStarted: boolean;
  conversationId?: string;
  guestMode?: boolean;
  onGuestLimitReached?: () => void;
  guestSessionId?: string;
  guestDeviceId?: string;
  projectId?: string;
  sessionId?: string;
  onStartConversation?: (query: string) => void;
}

interface IRAAttachment {
  id: string;
  file: File;
  previewUrl?: string;
}

interface PastedContent {
  id: string;
  content: string;
  lineCount: number;
  characterCount: number;
}


export default function IRAInput({
  onMessage,
  isProcessing = false,
  guestMode = false,
  onGuestLimitReached,
  onSendingChange,
  onStateChange,
  conversationStarted,
  conversationId,
  projectId,
  sessionId,
  onStartConversation,
}: IRAInputProps) {
  const { token, user, updateUser } = useAuth();
  
  const {
  balance,
  loading: brainBalanceLoading,
  refreshBalance,
} = useBrainBalance();


const brainBalanceStatus = getBrainBalanceStatus(
  balance?.total_balance ?? "0"
);

const brainIconClass =
  Number(balance?.total_balance ?? "0") < 10
    ? "text-[#8A0303] animate-pulse"
    : brainBalanceStatus === "high"
      ? "text-[var(--foreground)]"
      : brainBalanceStatus === "medium"
        ? "text-amber-300"
        : "text-[#8A0303]";

  const {
  workspaceMode,
} = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();
  const isChatPage =
  pathname === "/chat" ||
  pathname === "/chat/private";

  const [query, setQuery] = useState("");
  const [attachments, setAttachments] =
  useState<IRAAttachment[]>([]);

const [attachmentMenuOpen, setAttachmentMenuOpen] =
  useState(false);

const [attachmentError, setAttachmentError] =
  useState<string | null>(null);

const imageInputRef =
  useRef<HTMLInputElement>(null);

const fileInputRef =
  useRef<HTMLInputElement>(null);
  const [isSending, setIsSending] = useState(false);
  const isBusy = isSending || isProcessing;
  const [brainBalanceOpen, setBrainBalanceOpen] =
  useState(false);
  const [brainRechargeOpen, setBrainRechargeOpen] =
  useState(false);
  const attachmentMenuRef = useRef<HTMLFormElement>(null);


  useEffect(() => {
  if (!attachmentMenuOpen) return;

  function handleOutsideClick(event: PointerEvent) {
    const target = event.target;

    if (
      target instanceof Node &&
      attachmentMenuRef.current &&
      !attachmentMenuRef.current.contains(target)
    ) {
      setAttachmentMenuOpen(false);
    }
  }

  document.addEventListener(
    "pointerdown",
    handleOutsideClick
  );

  return () => {
    document.removeEventListener(
      "pointerdown",
      handleOutsideClick
    );
  };
}, [attachmentMenuOpen]);
  /*
   * Large pasted content is represented separately from the
   * normal message text. This keeps the composer state-driven
   * instead of making the textarea permanently large.
   */
  const [pastedContent, setPastedContent] =
    useState<PastedContent | null>(null);


  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

    const brainBalanceRef =
  useRef<HTMLDivElement>(null);

    const activeConversationIdRef =
  useRef<string | undefined>(
    conversationId
  );

useEffect(() => {
  activeConversationIdRef.current =
    conversationId;
}, [conversationId]);


  

  // =====================================================
  // AUTO FOCUS + KEYBOARD SHORTCUTS
  // =====================================================

  useEffect(() => {
    const focusInput = () => {
      if (!isSending) {
        textareaRef.current?.focus();
      }
    };

    const timer =
      window.setTimeout(focusInput, 100);

    function handleShortcut(
      event: KeyboardEvent
    ) {
      const isSlash =
        event.key === "/" &&
        !event.shiftKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey;

       const isCommandK =
  event.key?.toLowerCase() === "k" &&
  (event.ctrlKey || event.metaKey);

      if (isSlash || isCommandK) {
        const target =
          event.target as HTMLElement | null;

        if (
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.isContentEditable
        ) {
          return;
        }

        event.preventDefault();

        textareaRef.current?.focus();
      }
    }

    window.addEventListener(
      "keydown",
      handleShortcut
    );

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener(
        "keydown",
        handleShortcut
      );
    };
  }, [isSending]);




  useEffect(() => {
  if (!brainBalanceOpen) {
    return;
  }

  function handlePointerDown(
    event: PointerEvent
  ) {
    const target =
      event.target as Node;

    if (
      brainBalanceRef.current &&
      !brainBalanceRef.current.contains(target)
    ) {
      setBrainBalanceOpen(false);
    }
  }

  document.addEventListener(
    "pointerdown",
    handlePointerDown
  );

  return () => {
    document.removeEventListener(
      "pointerdown",
      handlePointerDown
    );
  };
}, [brainBalanceOpen]);

  // =====================================================
  // TEXTAREA RESIZE
  // =====================================================

 function resizeTextarea() {
  const textarea = textareaRef.current;

  if (!textarea) {
    return;
  }

  textarea.style.height = "0px";

  const maxHeight = 180;

  const height = Math.min(
    textarea.scrollHeight,
    maxHeight
  );

  textarea.style.height = `${height}px`;

  textarea.style.overflowY =
    textarea.scrollHeight > maxHeight
      ? "auto"
      : "hidden";
}

useEffect(() => {
  requestAnimationFrame(() => {
    resizeTextarea();
  });
}, [query]);

  // =====================================================
  // PASTE HANDLING
  // =====================================================

  function handlePaste(
  event: ClipboardEvent<HTMLTextAreaElement>
) {
  const pastedText =
    event.clipboardData.getData("text/plain");

  if (!pastedText) {
    return;
  }

  const LARGE_PASTE_THRESHOLD = 600;

  // Normal paste Ã¢â‚¬â€ let the browser handle it normally.
  if (pastedText.length < LARGE_PASTE_THRESHOLD) {
    return;
  }

  // Large paste Ã¢â‚¬â€ handle it as a separate pasted-content item.
  event.preventDefault();

  const textarea = event.currentTarget;

  const selectionStart =
    textarea.selectionStart ?? 0;

  const selectionEnd =
    textarea.selectionEnd ?? 0;

  const currentText = textarea.value;

  const textBefore =
    currentText.slice(0, selectionStart);

  const textAfter =
    currentText.slice(selectionEnd);

  setQuery(textBefore + textAfter);

  setPastedContent({
    id: createId(),
    content: pastedText,
    lineCount:
      pastedText.split(/\r?\n/).length,
    characterCount:
      pastedText.length,
  });

  requestAnimationFrame(() => {
    resizeTextarea();

    const currentTextarea =
      textareaRef.current;

    if (!currentTextarea) {
      return;
    }

    currentTextarea.focus();

    const cursorPosition =
      selectionStart;

    currentTextarea.setSelectionRange(
      cursorPosition,
      cursorPosition
    );
  });
}

  // =====================================================
  // FILE INPUT
  // =====================================================

  

  // =====================================================
  // REMOVE PASTE / ATTACHMENT
  // =====================================================

  function removePastedContent() {
    setPastedContent(null);

    requestAnimationFrame(() => {
      resizeTextarea();
      textareaRef.current?.focus();
    });
  }





  const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const DOCUMENT_EXTENSIONS = new Set([
  "pdf", "txt", "docx", "csv", "xlsx",
  "py", "js", "ts", "jsx", "tsx",
  "html", "css", "json", "sql", "md",
]);

function addAttachments(
  event: ChangeEvent<HTMLInputElement>
) {
  const selectedFiles = Array.from(
    event.target.files ?? []
  );

  event.target.value = "";
  setAttachmentError(null);

  const accepted: IRAAttachment[] = [];

  for (const file of selectedFiles) {
    const extension =
      file.name.split(".").pop()?.toLowerCase() ?? "";

    const isImage = IMAGE_TYPES.has(file.type);
    const isDocument =
      DOCUMENT_EXTENSIONS.has(extension);

    if (!isImage && !isDocument) {
      setAttachmentError(
        `${file.name}: unsupported file type.`
      );
      continue;
    }

    if (file.size > MAX_FILE_SIZE) {
      setAttachmentError(
        `${file.name}: maximum file size is 10 MB.`
      );
      continue;
    }

    accepted.push({
      id: createId(),
      file,
      previewUrl: isImage
        ? URL.createObjectURL(file)
        : undefined,
    });
  }

  setAttachments((current) => {
    const remaining = MAX_FILES - current.length;

    if (remaining <= 0) {
      accepted.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });

      setAttachmentError(
        "You can attach up to 5 files."
      );

      return current;
    }

    const additions = accepted.slice(0, remaining);

    accepted.slice(remaining).forEach((item) => {
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });

    return [...current, ...additions];
  });

  setAttachmentMenuOpen(false);
}

function removeAttachment(id: string) {
  setAttachments((current) => {
    const removed = current.find(
      (item) => item.id === id
    );

    if (removed?.previewUrl) {
      URL.revokeObjectURL(removed.previewUrl);
    }

    return current.filter(
      (item) => item.id !== id
    );
  });
}

async function prepareAttachments(): Promise<BrainAttachment[]> {
  const fileAttachments: BrainAttachment[] =
    await Promise.all(
      attachments.map(async ({ file }) => ({
        type: "file_upload",
        name: file.name,
        data: await fileToBase64(file),
        mime_type: file.type || null,
      }))
    );

  const pastedTextAttachment: BrainAttachment[] =
    pastedContent
      ? [
          {
            type: "pasted_text",
            name: null,
            content: pastedContent.content,
            data: null,
            mime_type: null,
          },
        ]
      : [];

  return [
    ...fileAttachments,
    ...pastedTextAttachment,
  ];
}

  // =====================================================
  // SUBMIT
  // =====================================================

 async function handleSubmit(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const trimmedQuery = query.trim();

  if (
  (!trimmedQuery &&
    attachments.length === 0 &&
    !pastedContent) ||
  (!token && !guestMode) ||
  isSending
) {
  return;
}

  // ---------------------------------------------------
  // HOME Ã¢â€ â€™ CREATE CONVERSATION
  // ---------------------------------------------------

  if (
    (pathname === "/" || pathname === "/home") &&
    trimmedQuery &&
    onStartConversation
  ) {
    setQuery("");
    setPastedContent(null);

    setIsSending(true);
    onSendingChange(true);
    onStateChange("thinking");

    onStartConversation(trimmedQuery);

    return;
  }

  // ---------------------------------------------------
  // CHAT Ã¢â€ â€™ CREATE CONVERSATION FOR FIRST MESSAGE
  // ---------------------------------------------------

  if (
    pathname === "/chat" &&
    !conversationId &&
    token &&
    !guestMode
  ) {
    try {
      const conversation =
        await createConversation(
          token,
          "New Conversation"
        );

      const newConversationId =
        conversation.conversation_id;

      const messageAttachments: NonNullable<Message["attachments"]> = [
  ...attachments.map(({ file, previewUrl }) => ({
    type: file.type.startsWith("image/")
      ? ("image" as const)
      : ("document" as const),
    name: file.name,
    mimeType: file.type || undefined,
    size: file.size,
    previewUrl,
  })),

  ...(pastedContent
    ? [
        {
          type: "pasted_text" as const,
          characterCount: pastedContent.characterCount,
          lineCount: pastedContent.lineCount,
        },
      ]
    : []),
];

const userMessage: Message = {
  id: createId(),
  role: "user",
  content: trimmedQuery,
  ...(messageAttachments.length > 0
    ? { attachments: messageAttachments }
    : {}),
};

      const preparedAttachments =
  await prepareAttachments();

setPendingConversation(
  newConversationId,
  userMessage,
  "thinking",
  preparedAttachments
);

      sessionStorage.setItem(
        "ira_pending_message",
        trimmedQuery
      );


      setQuery("");
      setPastedContent(null);

      setIsSending(true);
      onSendingChange(true);
      onStateChange("thinking");

      router.push(
        `/chat?conversation=${encodeURIComponent(
          newConversationId
        )}`
      );

      return;
    } catch (error) {
      console.error(
        "Failed to create conversation:",
        error
      );

      return;
    }
  }

  // ---------------------------------------------------
  // USER MESSAGE
  // ---------------------------------------------------

  const messageAttachments: NonNullable<Message["attachments"]> = [
  ...attachments.map(({ file, previewUrl }) => ({
    type: file.type.startsWith("image/")
      ? ("image" as const)
      : ("document" as const),
    name: file.name,
    mimeType: file.type || undefined,
    size: file.size,
    previewUrl,
  })),

  ...(pastedContent
    ? [
        {
          type: "pasted_text" as const,
          characterCount: pastedContent.characterCount,
          lineCount: pastedContent.lineCount,
        },
      ]
    : []),
];

const userMessage: Message = {
  id: createId(),
  role: "user",
  content: trimmedQuery,
  ...(messageAttachments.length > 0
    ? { attachments: messageAttachments }
    : {}),
};

  onMessage(userMessage);

  if (conversationId) {
    setPendingConversation(
      conversationId,
      userMessage,
      "thinking"
    );
  }

  setQuery("");

  requestAnimationFrame(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height =
        "auto";
      textareaRef.current.style.overflowY =
        "hidden";
    }
  });

  // ---------------------------------------------------
  // THINKING STATE
  // ---------------------------------------------------

  setIsSending(true);
  onSendingChange(true);
  onStateChange("thinking");

  if (conversationId) {
    updatePendingConversationState(
      conversationId,
      "thinking"
    );
  }

  const stateTimer1 =
    setTimeout(() => {
      onStateChange("reasoning");

      if (conversationId) {
        updatePendingConversationState(
          conversationId,
          "reasoning"
        );
      }
    }, 1200);

  const stateTimer2 =
    setTimeout(() => {
      onStateChange("brainstorming");

      if (conversationId) {
        updatePendingConversationState(
          conversationId,
          "brainstorming"
        );
      }
    }, 2600);

  const stateTimer3 =
    setTimeout(() => {
      onStateChange("retrieving");

      if (conversationId) {
        updatePendingConversationState(
          conversationId,
          "retrieving"
        );
      }
    }, 4000);

  const stateTimer4 =
    setTimeout(() => {
      onStateChange("connecting");

      if (conversationId) {
        updatePendingConversationState(
          conversationId,
          "connecting"
        );
      }
    }, 5400);

  const stateTimer5 =
    setTimeout(() => {
      onStateChange("preparing");

      if (conversationId) {
        updatePendingConversationState(
          conversationId,
          "preparing"
        );
      }
    }, 6800);

  // ---------------------------------------------------
  // SEND TO IRA
  // ---------------------------------------------------
  let streamingMessageId: string | null = null;
  let streamStarted = false;
  let response = "";
  try {
    const preparedAttachments =
  await prepareAttachments();
      
let response = "";

if (guestMode) {
  response = (
    await sendGuestMessageToIRA(
      trimmedQuery,
      getGuestSessionId(),
      getGuestDeviceId()
    )
  ).response;
} else {
  streamingMessageId = createId();

  response = await sendMessageToIRAStream(
  trimmedQuery,
  token!,
  conversationId,
  projectId,
  preparedAttachments,
  workspaceMode,
  sessionId,


  (chunk) => {
     streamStarted = true;
      response += chunk;
      if (!streamingMessageId) return;

      onMessage({
        id: streamingMessageId,
        role: "ira",
        content: response,
      });
    },
    (visual) => {
      if (!streamingMessageId) return;

      onMessage({
        id: streamingMessageId,
        role: "ira",
        content: response,
        visual,
      });
    }
);
}

await refreshBalance();

if (
  activeConversationIdRef.current !==
  conversationId
) {
  return;
}

if (guestMode) {
  const iraMessage: Message = {
    id: createId(),
    role: "ira",
    content: response,
  };

  onMessage(iraMessage);
}





window.dispatchEvent(
  new CustomEvent(
    "ira:conversation-updated"
  )
);

  } catch (error) {
  const status =
    error instanceof Error
      ? (
          error as Error & {
            status?: number;
          }
        ).status
      : undefined;

  if (guestMode && status === 403) {
    onGuestLimitReached?.();
    return;
  }

  console.error("IRA request failed:", error);

  const friendlyMessage =
    error instanceof Error && error.message.trim()
      ? error.message
      : "I'm having trouble processing your request right now. Please try again shortly.";

  if (
  activeConversationIdRef.current === conversationId
) {
  if (streamStarted && streamingMessageId) {
    // Preserve the partial response and explain the interruption.
    onMessage({
      id: streamingMessageId,
      role: "ira",
      content:
        `${response}\n\n---\n\n` +
        "The response was interrupted before it finished. " +
        "Please try again.",
    });
  } else {
    // No response arrived, so show one friendly error.
    onMessage({
      id: createId(),
      role: "ira",
      content: friendlyMessage,
    });
  }
}
} 
  
  finally {
    clearTimeout(stateTimer1);
    clearTimeout(stateTimer2);
    clearTimeout(stateTimer3);
    clearTimeout(stateTimer4);
    clearTimeout(stateTimer5);

    setPastedContent(null);
    
    // ATTACHMENT_CHIP_CLEANUP_V3: clear submitted files from composer.
    setAttachments([]);
    // ATTACHMENT_CHIP_CLEANUP_V2: clear composer attachments after submission.
    setAttachments((current) => {
      current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      return [];
    });

    if (conversationId) {
      clearPendingConversation(
        conversationId
      );
    }

    setIsSending(false);
    onSendingChange(false);
  }
}
  // =====================================================
  // UI
  // =====================================================


   return (
    <section
      id="ira-input"
      className={
  isChatPage
    ? "fixed inset-x-0 bottom-0 z-40 w-full bg-[var(--background)] px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 md:static md:px-6 md:pb-4 md:pt-3"
    : "fixed inset-x-0 bottom-0 z-40 w-full bg-[var(--background)] px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 md:static md:mx-auto md:px-10 md:pb-6 md:pt-3"
}
    >
        <form
        ref={attachmentMenuRef}
  onSubmit={handleSubmit}
  className={`
  relative
  mx-auto
  flex
  w-full
  flex-col
  rounded-2xl
  border
  border-[var(--border)]
  bg-[var(--surface)]
  px-4
  py-3
  transition-colors
  duration-200
  focus-within:border-[rgba(238,227,209,0.18)]
  ${
  isChatPage
    ? "max-w-3xl"
    : "max-w-[800px] min-h-[120px]"
}
  md:px-5
  md:py-4
`}
      >
        {isChatPage && pastedContent && !isSending && (
          <div
            className="
              mb-2.5
              flex
              items-center
              gap-2.5
              border-b
              border-[var(--border)]
              pb-2.5
            "
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-hover)] text-[var(--muted)]">
              <FileText size={16} strokeWidth={1.6} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-medium text-[var(--foreground)]/80">
                PASTED
              </div>

              <div className="text-[11px] text-[var(--muted)]">
                {pastedContent.characterCount.toLocaleString()}{" "}
                characters Ã‚Â·{" "}
                {pastedContent.lineCount.toLocaleString()} lines
              </div>
            </div>

            <button
              type="button"
              aria-label="Remove pasted content"
              onClick={removePastedContent}
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                text-[var(--muted)]
                transition
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--foreground)]
              "
            >
              <X size={15} strokeWidth={1.7} />
            </button>
          </div>
        )}

        {attachmentMenuOpen && (
  <div
    className="
  absolute
  bottom-full
  left-0
  z-[100]
  mb-3
  w-[280px]
  overflow-hidden
  rounded-2xl
  border
  border-[var(--border)]
  bg-[var(--surface)]
  p-2
  shadow-[0_16px_50px_rgba(0,0,0,0.55)]
"
  >
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="
        flex w-full items-center gap-3
        rounded-xl px-3 py-3
        text-left transition
        hover:bg-[var(--surface-hover)]
      "
    >
      <Paperclip size={21} strokeWidth={1.5} />

      <span>
        <span className="block text-sm text-[var(--foreground)]">
          Upload file
        </span>
        <span className="mt-1 block text-xs text-[var(--muted)]">
          PDF, image, text and more
        </span>
      </span>
    </button>

   
      

      

    <button
      type="button"
      onClick={() => {
        setAttachmentMenuOpen(false);
         router.push("/notes");
        // Note creation will be connected separately.
      }}
      className="
        flex w-full items-center gap-3
        rounded-xl px-3 py-3
        text-left transition
        hover:bg-[var(--surface-hover)]
      "
    >
      <FileText size={21} strokeWidth={1.5} />

      <span>
        <span className="block text-sm text-[var(--foreground)]">
          Add note
        </span>
        <span className="mt-1 block text-xs text-[var(--muted)]">
          Write a quick note
        </span>
      </span>
    </button>

    <button
      type="button"
      onClick={() => {
        setAttachmentMenuOpen(false);
        router.push("/projects");
      }}
      className="
        flex w-full items-center gap-3
        rounded-xl px-3 py-3
        text-left transition
        hover:bg-[var(--surface-hover)]
      "
    >
      <Folder size={21} strokeWidth={1.5} />

      <span>
        <span className="block text-sm text-[var(--foreground)]">
          Create project
        </span>
        <span className="mt-1 block text-xs text-[var(--muted)]">
          Organize your work
        </span>
      </span>
    </button>

    <div className="my-2 border-t border-[var(--border)]" />

    
  </div>
)}

{attachments.length > 0 && (
  <div className="mb-3 flex flex-wrap gap-2">
    {attachments.map((attachment) => (
      <div
        key={attachment.id}
        className="flex max-w-56 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-2"
      >
        {attachment.previewUrl ? (
          <img
            src={attachment.previewUrl}
            alt={attachment.file.name}
            className="h-10 w-10 rounded-lg object-cover"
          />
        ) : (
          <FileText
            size={20}
            className="shrink-0 text-[var(--muted)]"
          />
        )}

        <span className="min-w-0 flex-1 truncate text-xs text-[var(--foreground)]">
          {attachment.file.name}
        </span>

        <button
          type="button"
          aria-label={`Remove ${attachment.file.name}`}
          onClick={() => removeAttachment(attachment.id)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--surface-hover)]"
        >
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
)}

{attachmentError && (
  <p className="mb-2 text-xs text-[var(--accent)]">
    {attachmentError}
  </p>
)}

        <textarea
          ref={textareaRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            resizeTextarea();
          }}
          onPaste={handlePaste}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder={
            isBusy
              ? "IRA is thinking..."
              : "Ask IRA anything..."
          }
          rows={1}
          disabled={isBusy}
         className="
  min-h-[38px]
  w-full
  resize-none
  overflow-hidden
  bg-transparent
  px-1
  py-1.5
  text-[15px]
  leading-6
  tracking-[-0.01em]
  text-[var(--foreground)]
  outline-none
  placeholder:text-[var(--muted)]
  disabled:cursor-not-allowed
  disabled:opacity-50
  sm:text-[16px]
"

        />

        <div className="flex w-full items-center justify-between pt-1">
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Add"
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                text-[var(--muted)]
                transition
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--foreground)]
                active:scale-95
              "
              onClick={() => {
  setAttachmentMenuOpen((current) => !current);
  setAttachmentError(null);
}}
            >
              <Plus size={18} strokeWidth={1.6} />
            </button>



          {token && (
  <div
  ref={brainBalanceRef}
  className="relative ml-1"
>
    <div className="flex items-center gap-1.5">
  <button
    type="button"
    aria-label="Brain Balance"
    aria-expanded={brainBalanceOpen}
    title={
      brainBalanceLoading
        ? "Checking Brain Balance"
        : balance
          ? `${balance.total_balance} Brain Units`
          : "Brain Balance unavailable"
    }
    onClick={() =>
      setBrainBalanceOpen((current) => !current)
    }
    className="
      relative
      flex
      h-8
      w-8
      shrink-0
      items-center
      justify-center
      rounded-full
      text-[var(--muted)]
      transition
      hover:bg-[var(--surface-hover)]
      hover:text-[var(--foreground)]
      active:scale-95
    "
  >
    <Brain
      size={17}
      strokeWidth={1.5}
      className={brainIconClass}
    />
  </button>

  {user?.brain_tier && (
    <span
      className="brain-tier-premium"
      title={`Active Brain Tier: ${user.brain_tier.replaceAll("_", " ")}`}
    >
      {user.brain_tier.replaceAll("_", " ")}
    </span>
  )}
</div>

   {brainBalanceOpen && (
  <div
    className="
      absolute
      bottom-full
      left-0
      z-50
      mb-3
      w-64
      rounded-xl
      border
      border-[var(--border)]
      bg-[var(--surface)]
      p-4
      shadow-2xl
    "
  >
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[var(--foreground)]">
          Your IRA Brain
        </p>

        <p className="mt-0.5 text-xs text-[var(--muted)]">
          Brain Balance
         </p>
         <p className="mt-2 text-xs text-[var(--muted)]">
             Active Tier
      </p>
      <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
           {user?.brain_tier?.replaceAll("_", " ") ?? "FREE"}
     </p>
      </div>

     
    </div>

    {/* Brain Capacity */}
    <div className="mt-5 flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg
          viewBox="0 0 100 100"
          className="-rotate-90 h-full w-full"
          aria-hidden="true"
        >
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            className="text-[var(--border)]"
          />

          {/* Remaining brain */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            pathLength="100"
            className={brainIconClass}
            style={{
              strokeDasharray: "100",

              strokeDashoffset: String(
  100 -
    Math.min(
      Math.max(
        Number(balance?.total_balance ?? "0"),
        0
      ),
      100
    )
),
transition: "stroke-dashoffset 500ms ease",


            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Brain
            size={22}
            strokeWidth={1.4}
            className={brainIconClass}
          />

          <span className="mt-1 text-[9px] uppercase tracking-[0.14em] text-[var(--muted)]">
            IRA
          </span>
        </div>
      </div>
      {/* Brain Units */}
<p className="mt-3 text-x font-semibold text-[var(--foreground)]">
  {brainBalanceLoading
    ? "Loading..."
    : `${Number(balance?.total_balance ?? "0").toLocaleString()} BU`}
</p>

      {/* Status */}
      <p className="mt-3 text-sm font-medium text-[var(--foreground)]">
        {brainBalanceStatus === "high"
          ? "Brain optimized"
          : brainBalanceStatus === "medium"
            ? "Brain slowing down"
            : brainBalanceStatus === "low"
              ? "Brain running low"
              : "Brain needs recharge"}
      </p>

      <p className="mt-1 text-center text-xs leading-5 text-[var(--muted)]">
        {brainBalanceStatus === "high"
          ? "Your IRA Brain is ready for work."
          : brainBalanceStatus === "medium"
            ? "Your IRA Brain is starting to use more capacity."
            : brainBalanceStatus === "low"
              ? "Recharge when you're ready."
              : "Recharge your IRA Brain to continue."}
      </p>
    </div>

    {/* Recharge */}
    <button
      type="button"
      onClick={() => {
        setBrainBalanceOpen(false);
        setBrainRechargeOpen(true);
      }}
      className="
        mt-5
        flex
        w-full
        items-center
        justify-center
        rounded-lg
        border
        border-[var(--border)]
        px-3
        py-2.5
        text-sm
        font-medium
        text-[var(--foreground)]
        transition
        hover:bg-[var(--surface-hover)]
        active:scale-[0.98]
      "
    >
      Recharge your IRA Brain
    </button>
  </div>
)} 


  </div>
)}



            

            <input
  ref={imageInputRef}
  type="file"
  accept="image/png,image/jpeg,image/webp"
  multiple
  className="hidden"
  onChange={addAttachments}
/>

<input
  ref={fileInputRef}
  type="file"
  accept=".pdf,.txt,.docx,.csv,.json,.md,.png,.jpg,.jpeg,.webp"
  multiple
  className="hidden"
  onChange={addAttachments}
/>
          </div>

          <button
            type="submit"
            aria-label="Send message"

            disabled={
  (
    !query.trim() &&
    attachments.length === 0 &&
    !pastedContent
  ) ||
  (!token && !guestMode) ||
  isBusy
}
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[var(--foreground)]
              text-[var(--background)]
              transition
              hover:opacity-85
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-25
            "
          >
            {isBusy ? (
  <LoaderCircle
    size={17}
    strokeWidth={1.8}
    className="animate-spin"
  />
) : (
  <ArrowUp
    size={16}
    strokeWidth={2}
  />
)}
          </button>
        </div>
      </form>
      <BrainRechargeModal
  open={brainRechargeOpen}
  onClose={() => setBrainRechargeOpen(false)}
  onPaymentSuccess={async () => {
    // Refresh the Brain Units balance.
    await refreshBalance();

    // Refresh the authenticated user's latest tier.
    if (token) {
      try {
        const updatedUser = await fetchCurrentUser(token);

        updateUser(updatedUser);
      } catch (error) {
        console.error(
          "Failed to refresh Brain Tier:",
          error
        );
      }
    }
  }}
/>
    </section>
  );
}


