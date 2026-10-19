import type {
  IRAState,
  Message,
} from "@/components/dashboard/types";

export type PendingConversation = {
  message: Message;
  state: IRAState;
  startedAt: number;
};

const pendingConversations =
  new Map<string, PendingConversation>();

export function setPendingConversation(
  conversationId: string,
  message: Message,
  state: IRAState = "thinking"
) {
  pendingConversations.set(
    conversationId,
    {
      message,
      state,
      startedAt: Date.now(),
    }
  );
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
}

export function getPendingConversation(
  conversationId: string
) {
  return pendingConversations.get(
    conversationId
  );
}

export function clearPendingConversation(
  conversationId: string
) {
  pendingConversations.delete(
    conversationId
  );
}