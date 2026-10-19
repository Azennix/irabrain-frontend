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
}

export type IRAState =
  | "thinking"
  | "reasoning"
  | "brainstorming"
  | "retrieving"
  | "connecting"
  | "preparing";