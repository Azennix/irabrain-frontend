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
  visual?: VisualPayload | VisualPayload[]; 
}

export type IRAState = 
  | "analyzing"
  | "retrieving"
  | "memorizing"
  | "tool_checking"
  | "tool_executing"
  | "routing"
  | "translating"
  | "reasoning"
  | "visualizing"
  | "composing";
export type VisualType =
  | "concept_map"
  | "flowchart"
  | "comparison"
  | "steps"
  | "system_architecture"
  | "connection_graph"
  | "hierarchy"
  | "decision_tree"
  | "cycle"
  | "timeline"
  | "data_chart";

export interface VisualNode {
  id: string;
  label: string;
  description?: string;
  parentId?: string;
  group?: string;
  layer?: string;
  color?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface VisualEdge {
  from: string;
  to: string;
  label?: string;
  type?: "directed" | "bidirectional" | "dependency" | "optional";
}

export interface VisualStep {
  title: string;
  description?: string;
}

export interface VisualComparisonItem {
  label: string;
  values: string[];
}

export interface VisualTimelineEvent {
  title: string;
  date?: string;
  description?: string;
}

export interface VisualChartSeries {
  name: string;
  values: number[];
}

export interface VisualChartData {
  labels: string[];
  series: VisualChartSeries[];
  unit?: string;
}

export interface VisualDecisionBranch {
  from: string;
  label: string;
  to: string;
}

export interface VisualPayload {
  timeline?: VisualTimelineEvent[];
  chart?: VisualChartData;
  branches?: VisualDecisionBranch[];
  centerNodeId?: string;

  metadata?: {
    complexity?: "simple" | "moderate" | "complex";
    layout?: "horizontal" | "vertical" | "radial" | "layered";
    source?: "answer";
  };
  type: VisualType;
  title: string;
  description?: string;
  nodes?: VisualNode[];
  edges?: VisualEdge[];
  steps?: VisualStep[];
  columns?: string[];
  comparisons?: VisualComparisonItem[];
}


