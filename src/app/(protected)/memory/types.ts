export type MemoryCategory =
  | "all"
  | "identity"
  | "goal"
  | "project"
  | "preference"
  | "skill"
  | "relationship"
  | "education"
  | "career"
  | "location"
  | "fact"
  | "experience"
  | "context";

export interface CategoryDefinition {
  id: MemoryCategory;
  label: string;
}

export const categories: CategoryDefinition[] = [
  {
    id: "all",
    label: "All memories",
  },
  {
    id: "identity",
    label: "Identity",
  },
  {
    id: "goal",
    label: "Goals",
  },
  {
    id: "project",
    label: "Projects",
  },
  {
    id: "preference",
    label: "Preferences",
  },
  {
    id: "skill",
    label: "Skills",
  },
  {
    id: "education",
    label: "Education",
  },
  {
    id: "career",
    label: "Career",
  },
  {
    id: "relationship",
    label: "Relationships",
  },
  {
    id: "location",
    label: "Location",
  },
  {
    id: "fact",
    label: "Facts",
  },
  {
    id: "experience",
    label: "Experience",
  },
  {
    id: "context",
    label: "Context",
  },
];