import type {
  GoalItem,
  ProjectItem,
} from "@/services/api/brainApi";

export type Project = ProjectItem;
export type Goal = GoalItem;

export type ProjectStatus =
  | "active"
  | "completed"
  | "paused"
  | "archived";

export type GoalStatus =
  | "active"
  | "completed"
  | "paused"
  | "archived";