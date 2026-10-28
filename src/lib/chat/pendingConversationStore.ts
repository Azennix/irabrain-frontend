import type {
  IRAState,
  Message,
} from "@/components/dashboard/types";

import type {
  BrainAttachment,
} from "@/services/api/brainApi";

export type PendingConversation = {
  message: Message;
  state: IRAState;
  startedAt: number;
  attachments: BrainAttachment[];
};

const pendingConversations =
  new Map<string, PendingConversation>();

const COMPLETED_STORAGE_KEY =
  "irabrain_completed_conversations";

function loadCompletedConversations(): Set<string> {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const stored = localStorage.getItem(
      COMPLETED_STORAGE_KEY
    );

    const parsed: unknown = JSON.parse(
      stored || "[]"
    );

    if (!Array.isArray(parsed)) {
      return new Set<string>();
    }

    return new Set<string>(
      parsed.filter(
        (value): value is string =>
          typeof value === "string"
      )
    );
  } catch {
    return new Set<string>();
  }
}

const completedConversations =
  loadCompletedConversations();

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => {
    listener();
  });
}

export function subscribePendingConversations(
  listener: () => void
) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function notifyConversationChange() {
  notify();
}

export function setPendingConversation(
  conversationId: string,
  message: Message,
  state: IRAState = "analyzing",
  attachments: BrainAttachment[] = []
) {
  completedConversations.delete(
    conversationId
  );

  pendingConversations.set(
    conversationId,
    {
      message,
      state,
      startedAt: Date.now(),
      attachments,
    }
  );

  notify();
}

export function updatePendingConversationState(
  conversationId: string,
  state: IRAState
) {
  const pending =
    pendingConversations.get(
      conversationId
    );

  if (!pending) {
    return;
  }

  pendingConversations.set(
    conversationId,
    {
      ...pending,
      state,
    }
  );

  notify();
}

export function getPendingConversation(
  conversationId: string
) {
  return pendingConversations.get(
    conversationId
  );
}

export function isConversationCompleted(
  conversationId: string
) {
  return completedConversations.has(
    conversationId
  );
}

export function clearCompletedConversation(
  conversationId: string
) {
  completedConversations.delete(
    conversationId
  );

  if (typeof window !== "undefined") {
    localStorage.setItem(
      COMPLETED_STORAGE_KEY,
      JSON.stringify(
        Array.from(completedConversations)
      )
    );
  }

  notify();
}

export function clearPendingConversation(
  conversationId: string
) {
  pendingConversations.delete(
    conversationId
  );

  completedConversations.add(
    conversationId
  );

  if (typeof window !== "undefined") {
    localStorage.setItem(
      COMPLETED_STORAGE_KEY,
      JSON.stringify(
        Array.from(completedConversations)
      )
    );
  }

  notify();
}