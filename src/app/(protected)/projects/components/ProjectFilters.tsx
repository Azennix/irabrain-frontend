"use client";

import type { ProjectStatus } from "../types";

interface ProjectFiltersProps {
  activeStatus: "all" | ProjectStatus;
  statusCounts: Record<string, number>;
  onStatusChange: (
    status: "all" | ProjectStatus
  ) => void;
}

const statuses: Array<{
  value: "all" | ProjectStatus;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "paused", label: "Paused" },
  { value: "archived", label: "Archived" },
];

export default function ProjectFilters({
  activeStatus,
  statusCounts,
  onStatusChange,
}: ProjectFiltersProps) {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {statuses.map((status) => {
        const isActive =
          activeStatus === status.value;

        const count =
          status.value === "all"
            ? Object.values(statusCounts).reduce(
                (total, value) => total + value,
                0
              )
            : statusCounts[status.value] ?? 0;

        return (
          <button
            key={status.value}
            type="button"
            onClick={() =>
              onStatusChange(status.value)
            }
            className={`
              inline-flex items-center gap-2
              rounded-full
              border
              px-3.5 py-2
              text-[11px]
              uppercase
              tracking-[0.12em]
              transition-colors
              ${
                isActive
                  ? "border-[var(--foreground)]/20 bg-[var(--foreground)]/8 text-[var(--foreground)]"
                  : "border-[var(--border)] bg-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
              }
            `}
          >
            <span>{status.label}</span>

            <span className="text-[10px] opacity-60">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}