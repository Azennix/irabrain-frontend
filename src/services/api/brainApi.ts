import type { VisualPayload } from "@/components/dashboard/types";
type VisualPayloadCollection = VisualPayload | VisualPayload[];
import type { IRAState } from "@/components/dashboard/types";

const API_BASE_URL =

process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface BrainChatResponse {
  response: string;
}

interface GuestChatResponse {
  response: string;
  visual?: VisualPayloadCollection | null;
  turns_used: number;
  turns_remaining: number;
}

export async function sendGuestMessageToIRA(
  query: string,
  sessionId: string,
  deviceId: string
): Promise<GuestChatResponse> {
  const response = await fetch(
    `${API_BASE_URL}/brain/guest/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        session_id: sessionId,
        device_id: deviceId,
      }),
    }
  );

  if (!response.ok) {
  const error = new Error(
    `Guest IRA request failed: ${response.status}`
  );

  (
    error as Error & {
      status?: number;
    }
  ).status = response.status;

  throw error;
}

  return response.json();
}


export async function sendGuestMessageToIRAStream(
  query: string,
  sessionId: string,
  deviceId: string,
  onChunk?: (chunk: string) => void,
  onVisual?: (visual: VisualPayloadCollection) => void,
  onState?: (state: IRAState) => void,
  onTextComplete?: () => void
): Promise<GuestChatResponse> {
  const response = await fetch(
    `${API_BASE_URL}/brain/guest/chat/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        session_id: sessionId,
        device_id: deviceId,
      }),
    }
  );

  if (!response.ok) {
    let detail: unknown;

    try {
      const data = await response.json();
      detail = data?.detail;
    } catch {
      // Preserve the fallback error.
    }

    const error = new Error(
      typeof detail === "string"
        ? detail
        : getUserFriendlyError(response.status, detail)
    ) as Error & { status?: number };

    error.status = response.status;
    throw error;
  }

  if (!response.body) {
    throw new Error("IRA couldn't start the guest response stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let fullResponse = "";
  let visual: VisualPayloadCollection | null = null;
  let streamCompleted = false;
  let turnsUsed = 0;
  let turnsRemaining = 0;

  function handleEvent(block: string) {
    const lines = block.split(/\r?\n/);
    let eventName = "";
    const dataLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trimStart());
      }
    }

    if (!eventName || dataLines.length === 0) return;

    let data: any;

    try {
      data = JSON.parse(dataLines.join("\n"));
    } catch {
      throw new Error("IRA returned an invalid streaming event.");
    }

    switch (eventName) {
      case "chunk": {
        if (typeof data.text !== "string") {
          throw new Error("IRA returned an invalid response chunk.");
        }

        fullResponse += data.text;

        if (data.text) {
          onChunk?.(data.text);
        }
        break;
      }


case "visual": {
  const candidate = data.visual;

  const isVisual = (value: unknown): value is VisualPayload =>
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "type" in value &&
    "title" in value;

  // Accept one visual object only.
  // A single visual may still contain many nodes and edges.
  if (isVisual(candidate)) {
    visual = candidate;
    onVisual?.(candidate);
  } else if (
    Array.isArray(candidate) &&
    candidate.length === 1 &&
    isVisual(candidate[0])
  ) {
    // Backward compatibility for legacy one-item arrays.
    visual = candidate[0];
    onVisual?.(candidate[0]);
  } else if (
    candidate === null ||
    (Array.isArray(candidate) && candidate.length === 0)
  ) {
    // No visual was generated.
    break;
  } else {
    console.warn(
      "[IRA VISUAL] Ignoring invalid or multiple visual payloads."
    );
  }

  break;
}







      case "metadata": {
  if (
    Number.isInteger(data.turns_used) &&
    Number.isInteger(data.turns_remaining) &&
    data.turns_used >= 0 &&
    data.turns_remaining >= 0
  ) {
    turnsUsed = data.turns_used;
    turnsRemaining = data.turns_remaining;
  } else {
    throw new Error("IRA returned invalid guest usage metadata.");
  }
  break;
}



    }

  }


  try {
    while (!streamCompleted) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = blocks.pop() ?? "";

      for (const block of blocks) {
        if (block.trim()) handleEvent(block);
        if (streamCompleted) break;
      }
    }

    if (!streamCompleted) {
  buffer += decoder.decode();

  // Process any complete SSE events still buffered.
  const remainingBlocks = buffer.split(/\r?\n\r?\n/);

  for (const block of remainingBlocks) {
    if (block.trim()) {
      handleEvent(block);
    }

    if (streamCompleted) {
      break;
    }
  }
}

    if (!streamCompleted) {
      throw new Error(
        "The guest response stream ended unexpectedly."
      );
    }

    return {
  response: fullResponse,
  visual,
  turns_used: turnsUsed,
  turns_remaining: turnsRemaining,
};
  } finally {
    if (!streamCompleted) {
      try {
        await reader.cancel();
      } catch {
        // The connection may already be closed.
      }
    }

    reader.releaseLock();
  }
}

export interface BrainAttachment {
  type: string;
  name?: string | null;
  content?: string | null;
  data?: string | null;
  mime_type?: string | null;
}

// =====================================================
// CONVERSATION TYPES
// =====================================================

export interface ConversationMessage {
  id: number;
  role: "user" | "assistant";
  content: string;

  attachments?: Array<{
    type: string;
    name?: string | null;
    mime_type?: string | null;
    page_count?: number | null;
    status?: string | null;
  }> | null;
  visual_data?: VisualPayloadCollection | null;
}

export interface ConversationSummary {
  conversation_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ConversationHistoryResponse {
  messages: ConversationMessage[];
}
// =====================================================
// MEMORY TYPES
// =====================================================

export interface MemoryItem {
  id: string;
  category: string;
  key: string;
  value: string;
  confidence: number | null;
}

interface MemoriesResponse {
  memories: MemoryItem[];
}

// =====================================================
// BRAIN BALANCE
// =====================================================

export interface BrainBalance {
  user_id: number;
  included_balance: string;
  paid_balance: string;
  total_balance: string;
}

export async function getBrainBalance(
  token: string
): Promise<BrainBalance> {
  const response = await fetch(
    `${API_BASE_URL}/brain/balance`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Brain Balance request failed: ${response.status}`
    );
  }

  return response.json();
}


// =====================================================
// SEND MESSAGE
// =====================================================

export async function sendMessageToIRA(
  query: string,
  token: string,
  conversationId?: string,
  projectId?: string,
  attachments?: BrainAttachment[],
  workspaceMode: "personal" | "private" = "personal",
  sessionId?: string
): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/brain/chat`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        query,
        conversation_id: conversationId ?? null,
        project_id: projectId ?? null,
        attachments: attachments ?? [],
        workspace_mode: workspaceMode,
        session_id: sessionId,
      }),
    }
  );

 if (!response.ok) {
  let detail: unknown;

  try {
    const errorData: unknown = await response.json();

    if (
      typeof errorData === "object" &&
      errorData !== null &&
      "detail" in errorData
    ) {
      detail = errorData.detail;
    }
  } catch {
    // The response wasn't valid JSON.
    // Use the safe fallback message.
  }

  const apiError = new Error(
  getUserFriendlyError(response.status, detail)
) as Error & { status?: number; code?: string };

apiError.status = response.status;

if (
  typeof detail === "object" &&
  detail !== null &&
  "code" in detail &&
  typeof detail.code === "string"
) {
  apiError.code = detail.code;
}

throw apiError;
}

  const data: BrainChatResponse =
    await response.json();

  return data.response;
}



function getUserFriendlyError(
  status: number,
  detail?: unknown
): string {
  let code = "";
  let message = "";

  if (typeof detail === "string") {
    message = detail;
  } else if (typeof detail === "object" && detail !== null) {
    const data = detail as {
      code?: unknown;
      message?: unknown;
      required_tier?: unknown;
    };

    code = typeof data.code === "string" ? data.code : "";
    message = typeof data.message === "string" ? data.message : "";

    if (code === "CAPABILITY_NOT_INCLUDED") {
      const tier =
  typeof data.required_tier === "string"
    ? data.required_tier
    : null;

      if (tier) {
        return `Hey! 👋 Opening a application requires a capability that isn't included in your current Brain tier. ${tier} unlocks this capability. Explore your Brain Recharge options to learn more.`;
      }

      return "This task requires a capability that isn't included in your current Brain tier. Explore your Brain Recharge options to find the right capability.";
    }

    if (code === "CONTEXT_LIMIT_EXCEEDED") {
      return "This task requires more context capacity than your current Brain tier supports. Explore your Brain Recharge options to find a suitable tier.";
    }

    if (code === "COMPLEXITY_LIMIT_EXCEEDED") {
      return "This task requires more reasoning capability than your current Brain tier supports. Explore your Brain Recharge options to find a suitable tier.";
    }

    if (code === "INSUFFICIENT_BRAIN_UNITS") {
      return "Your Brain balance isn't sufficient to complete this task. Recharge your Brain Units to continue.";
    }

    if (code === "UNAUTHENTICATED") {
      return "Your session has expired. Please sign in again to continue.";
    }
  }

  if (status === 401) {
    return "Your session has expired. Please sign in again to continue.";
  }

  if (status === 403) {
    return "This task isn't permitted with your current access. Please review your Brain tier and permissions.";
  }

  if (status === 402) {
    return "Your current Brain balance may be insufficient to complete this task. Please check your Brain Recharge options.";
  }

  if (status === 429) {
    return "You've reached a temporary usage limit. Please wait a moment and try again.";
  }

  if (status >= 500) {
    return "I'm having trouble processing your request right now. Please try again shortly.";
  }

  if (message.toLowerCase().includes("unsupported")) {
    return "I couldn't process this request because the requested format or capability isn't supported.";
  }

  return "Something went wrong while processing your request. Please try again.";
}





export async function sendMessageToIRAStream(
  query: string,
  token: string,
  conversationId?: string,
  projectId?: string,
  attachments?: BrainAttachment[],
  workspaceMode: "personal" | "private" = "personal",
  sessionId?: string,
  onChunk?: (chunk: string) => void,
  onVisual?: (visual: VisualPayloadCollection) => void,
  onState?: (state: IRAState) => void,
  onTextComplete?: () => void
): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/brain/chat/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        conversation_id: conversationId ?? null,
        project_id: projectId ?? null,
        attachments: attachments ?? [],
        workspace_mode: workspaceMode,
        session_id: sessionId,
      }),
    }
  );

  if (!response.ok) {
    let detail: unknown;

    try {
      const errorData: unknown = await response.json();

      if (
        typeof errorData === "object" &&
        errorData !== null &&
        "detail" in errorData
      ) {
        detail = errorData.detail;
      }
    } catch {
      // Keep the safe fallback if the response isn't JSON.
    }

    const apiError = new Error(
      getUserFriendlyError(response.status, detail)
    ) as Error & {
      status?: number;
      code?: string;
    };

    apiError.status = response.status;

    if (
      typeof detail === "object" &&
      detail !== null &&
      "code" in detail &&
      typeof detail.code === "string"
    ) {
      apiError.code = detail.code;
    }

    throw apiError;
  }

  if (!response.body) {
    throw new Error(
      "IRA couldn't start the response stream. Please try again."
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let fullResponse = "";
  let buffer = "";
  let streamCompleted = false;

  function handleEvent(eventBlock: string): void {
    const lines = eventBlock.split(/\r?\n/);
    let eventName = "";
    const dataLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trimStart());
      }
    }

    if (!eventName || dataLines.length === 0) {
      return;
    }

    const dataText = dataLines.join("\n");

    let data: unknown;

    try {
      data = JSON.parse(dataText);
    } catch {
      throw new Error(
        "IRA returned an invalid streaming event. Please try again."
      );
    }

    if (
      typeof data !== "object" ||
      data === null
    ) {
      throw new Error(
        "IRA returned an invalid streaming event. Please try again."
      );
    }

    const payload = data as {
      text?: unknown;
      success?: unknown;
      message?: unknown;
      visual?: unknown;
    };


    if (eventName === "visual") {
      const candidate = payload.visual;

      const isVisual = (value: unknown): value is VisualPayload =>
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        "type" in value &&
        "title" in value;

      if (isVisual(candidate)) {
        onVisual?.(candidate);
      } else if (
        Array.isArray(candidate) &&
        candidate.length === 1 &&
        isVisual(candidate[0])
      ) {
        // Backward compatibility: accept a legacy one-item array.
        onVisual?.(candidate[0]);
      } else if (
        candidate === null ||
        (Array.isArray(candidate) && candidate.length === 0)
      ) {
        // No visual was generated.
      } else {
        console.warn(
          "[IRA VISUAL] Ignoring invalid or multiple visual payloads."
        );
      }

      return;
    }


if (eventName === "state") {
  const state = (payload as any).state;
  if (typeof state === "string" && onState) {
    onState(state as IRAState);
  }
  return;
}


    if (eventName === "chunk") {
      if (typeof payload.text !== "string") {
        throw new Error(
          "IRA returned an invalid response chunk. Please try again."
        );
      }

      fullResponse += payload.text;

      if (payload.text) {
        onChunk?.(payload.text);
      }

      return;
    }

    if (eventName === "text_complete") {
      onTextComplete?.();
      return;
    }
    if (eventName === "complete") {
      if (payload.success !== true) {
        throw new Error(
          "IRA couldn't confirm that the response completed. Please try again."
        );
      }

      streamCompleted = true;
      return;
    }

    if (eventName === "error") {
      throw new Error(
        typeof payload.message === "string" &&
          payload.message.trim()
          ? payload.message
          : "IRA couldn't finish the response. Please try again."
      );
    }
  }

  try {
    while (!streamCompleted) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = blocks.pop() ?? "";

      for (const block of blocks) {
        if (block.trim()) {
          handleEvent(block);
        }

        if (streamCompleted) {
          break;
        }
      }
    }

    if (!streamCompleted) {
      buffer += decoder.decode();

      if (buffer.trim()) {
        handleEvent(buffer);
      }
    }

    if (!streamCompleted) {
      throw new Error(
        fullResponse.trim()
          ? "The connection ended before IRA confirmed that its response was complete. Your partial response is preserved. Please try again."
          : "IRA's response ended unexpectedly. Please try again."
      );
    }

    return fullResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "IRA couldn't finish the response. Please try again."
    );
  } finally {
    if (!streamCompleted) {
      try {
        await reader.cancel();
      } catch {
        // The stream may already be closed.
      }
    }

    reader.releaseLock();
  }
}

// =====================================================
// CREATE CONVERSATION
// =====================================================

export async function createConversation(
  token: string,
  title: string = "New Conversation"
): Promise<ConversationSummary> {
  const response = await fetch(
    `${API_BASE_URL}/brain/conversations`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        title,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Create conversation failed: ${response.status}`
    );
  }

  return response.json();
}

// =====================================================
// LIST CONVERSATIONS
// =====================================================

export async function getConversations(
  token: string
): Promise<ConversationSummary[]> {
  const response = await fetch(
    `${API_BASE_URL}/brain/conversations`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Conversations request failed: ${response.status}`
    );
  }

  return response.json();
}

// =====================================================
// GET SINGLE CONVERSATION
// =====================================================

export async function getConversation(
  conversationId: string,
  token: string
): Promise<ConversationSummary> {
  const response = await fetch(
    `${API_BASE_URL}/brain/conversations/${conversationId}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Conversation request failed: ${response.status}`
    );
  }

  return response.json();
}

// =====================================================
// DELETE CONVERSATION
// =====================================================

export async function deleteConversation(
  token: string,
  conversationId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/brain/conversations/${encodeURIComponent(
      conversationId
    )}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Delete conversation failed: ${response.status}`
    );
  }
}

// =====================================================
// LOAD CONVERSATION HISTORY
// =====================================================

export async function getConversationHistory(
  token: string,
  conversationId?: string
): Promise<ConversationMessage[]> {
  const params = conversationId
    ? `?conversation_id=${encodeURIComponent(conversationId)}`
    : "";

  const response = await fetch(
    `${API_BASE_URL}/brain/conversation${params}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Conversation history failed: ${response.status}`
    );
  }

  const data: ConversationHistoryResponse =
    await response.json();

  return data.messages;
}
// =====================================================
// GET MEMORIES
// =====================================================

export async function getMemories(
  token: string
): Promise<MemoryItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/brain/memories`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Memories request failed: ${response.status}`
    );
  }

  const data: MemoriesResponse =
    await response.json();

  return data.memories;
}
// =====================================================
// UPDATE MEMORY
// =====================================================

export async function updateMemory(
  token: string,
  memoryId: string,
  category: string,
  key: string,
  value: string
): Promise<MemoryItem> {
  const response = await fetch(
    `${API_BASE_URL}/brain/memories/${encodeURIComponent(
      memoryId
    )}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        category,
        key,
        value,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Update memory failed: ${response.status}`
    );
  }

  const data: {
    memory: MemoryItem;
  } = await response.json();

  return data.memory;
}


// =====================================================
// FORGET MEMORY
// =====================================================

export async function forgetMemory(
  token: string,
  memoryId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/brain/memories/${encodeURIComponent(
      memoryId
    )}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Forget memory failed: ${response.status}`
    );
  }
}
// =====================================================
// PROJECT TYPES
// =====================================================

export interface ProjectItem {
  id: string;
  name: string;
  description: string | null;
  status: string;
}

interface ProjectsResponse {
  projects: ProjectItem[];
}

// =====================================================
// GOAL TYPES
// =====================================================

export interface GoalItem {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: string;
}

interface GoalsResponse {
  goals: GoalItem[];
}

// =====================================================
// TASK TYPES
// =====================================================

export interface TaskItem {
  id: string;
  project_id: string;
  goal_id: string | null;
  title: string;
  description: string | null;
  status: string;
}

interface TasksResponse {
  tasks: TaskItem[];
}

// =====================================================
// PROJECT API
// =====================================================
export async function getProject(
  token: string,
  projectId: string
): Promise<ProjectItem> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Project request failed: ${response.status}`
    );
  }

  const data: { project: ProjectItem } =
    await response.json();

  return data.project;
}

export async function getProjects(
  token: string
): Promise<ProjectItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/projects`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Projects request failed: ${response.status}`
    );
  }

  const data: ProjectsResponse = await response.json();

  return data.projects;
}

export async function createProject(
  token: string,
  name: string,
  description?: string
): Promise<ProjectItem> {
  const response = await fetch(
    `${API_BASE_URL}/projects`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description: description || null,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Create project failed: ${response.status}`
    );
  }

  const data: { project: ProjectItem } =
    await response.json();

  return data.project;
}

export async function updateProject(
  token: string,
  projectId: string,
  name: string,
  description: string | null,
  status: string
): Promise<ProjectItem> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Update project failed: ${response.status}`
    );
  }

  const data: { project: ProjectItem } =
    await response.json();

  return data.project;
}

export async function deleteProject(
  token: string,
  projectId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Delete project failed: ${response.status}`
    );
  }
}

// =====================================================
// GOAL API
// =====================================================

export async function getGoals(
  token: string,
  projectId: string
): Promise<GoalItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/goals`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Goals request failed: ${response.status}`
    );
  }

  const data: GoalsResponse = await response.json();

  return data.goals;
}

export async function getTasks(
  token: string,
  projectId: string
): Promise<TaskItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(
      projectId
    )}/tasks`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Tasks request failed: ${response.status}`
    );
  }

  const data = await response.json();

const rawTasks = Array.isArray(data)
  ? data
  : data.tasks ?? [];

return rawTasks.map((task: any) => ({
  id: task.id ?? task.task_id,
  project_id: task.project_id,
  goal_id: task.goal_id ?? null,
  title: task.title,
  description: task.description ?? null,
  status: task.status ?? "pending",
}));
}

export async function createTask(
  token: string,
  projectId: string,
  title: string,
  description?: string,
  goalId?: string
): Promise<TaskItem> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(
      projectId
    )}/tasks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description: description || null,
        goal_id: goalId ?? null,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Create task failed: ${response.status}`
    );
  }

  const data = await response.json();

  const rawTask =
  data?.task ??
  data?.project_task ??
  data?.data?.task ??
  data?.data ??
  data;

if (!rawTask) {
  throw new Error("Update task returned no task data.");
}

return {
  id: rawTask.id ?? rawTask.task_id,
  project_id: rawTask.project_id,
  goal_id: rawTask.goal_id ?? null,
  title: rawTask.title,
  description: rawTask.description ?? null,
  status: rawTask.status ?? "pending",
};
}

export async function updateTask(
  token: string,
  projectId: string,
  taskId: string,
  title: string,
  description?: string,
  status?: string,
  goalId?: string
): Promise<TaskItem> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(
      projectId
    )}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description: description || null,
        status: status || "pending",
        goal_id: goalId ?? null,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Update task failed: ${response.status}`
    );
  }

    const data = await response.json();

  return {
    id: data.id ?? data.task_id,
    project_id: data.project_id,
    goal_id: data.goal_id ?? null,
    title: data.title,
    description: data.description ?? null,
    status: data.status ?? "pending",
  };
}

export async function deleteTask(
  token: string,
  projectId: string,
  taskId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(
      projectId
    )}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Delete task failed: ${response.status}`
    );
  }
}

export async function createGoal(
  token: string,
  projectId: string,
  title: string,
  description?: string
): Promise<GoalItem> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/goals`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description: description || null,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Create goal failed: ${response.status}`
    );
  }

  const data: { goal: GoalItem } =
    await response.json();

  return data.goal;
}

export async function updateGoal(
  token: string,
  projectId: string,
  goalId: string,
  title: string,
  description: string | null,
  status: string
): Promise<GoalItem> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/goals/${encodeURIComponent(goalId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Update goal failed: ${response.status}`
    );
  }

  const data: { goal: GoalItem } =
    await response.json();

  return data.goal;
}

export async function deleteGoal(
  token: string,
  projectId: string,
  goalId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/goals/${encodeURIComponent(goalId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Delete goal failed: ${response.status}`
    );
  }
}
