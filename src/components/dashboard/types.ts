export interface MessageFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  previewUrl?: string;
}

export interface MessageAttachment {
  type: "pasted_text" | "file_upload" | "image" | "document";
  name?: string;
  mimeType?: string;
  size?: number;
  previewUrl?: string;
  characterCount?: number;
  lineCount?: number;

  // Legacy support for existing messages
  files?: MessageFile[];
}

export interface Message {
  id: string;
  role: "user" | "ira";
  content: string;
  attachment?: MessageAttachment;
  attachments?: MessageAttachment[];
  visual?: VisualPayload;
}

export type IRAState =
  | "thinking"
  | "reasoning"
  | "brainstorming"
  | "retrieving"
  | "connecting"
  | "preparing";
export type VisualType = "concept_map" | "flowchart" | "comparison" | "steps";

export interface VisualNode {
  id: string;
  label: string;
  description?: string;
}

export interface VisualEdge {
  from: string;
  to: string;
  label?: string;
}

export interface VisualStep {
  title: string;
  description?: string;
}

export interface VisualComparisonItem {
  label: string;
  values: string[];
}

export interface VisualPayload {
  type: VisualType;
  title: string;
  description?: string;
  nodes?: VisualNode[];
  edges?: VisualEdge[];
  steps?: VisualStep[];
  columns?: string[];
  comparisons?: VisualComparisonItem[];
}
