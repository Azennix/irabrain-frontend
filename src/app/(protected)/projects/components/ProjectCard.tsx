"use client";

import {
  ArrowUpRight,
  FolderKanban,
} from "lucide-react";

import type { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  onAskIRA: (project: Project) => void;
}

export default function ProjectCard({
  project,
  onOpen,
  onAskIRA,
}: ProjectCardProps) {
  return (
    <article
      className="
        group
        flex
        min-h-[280px]
        w-full
        flex-col
        rounded-[22px]
        border border-[var(--border)]
        bg-[var(--surface-soft)]
        p-5
        transition-all
        duration-200
        hover:border-[var(--foreground)]/20
      "
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-4">
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border border-[var(--border)]
            bg-[var(--background)]
            text-[var(--foreground)]/65
          "
        >
          <FolderKanban
            size={18}
            strokeWidth={1.4}
          />
        </div>

        <span
          className="
            rounded-full
            border border-[var(--border)]
            px-2.5
            py-1
            text-[10px]
            uppercase
            tracking-[0.12em]
            text-[var(--muted)]
          "
        >
          {project.status}
        </span>
      </div>

      {/* PROJECT INFO */}
      <div className="mt-6">
        <h2
          className="
            text-[17px]
            font-medium
            tracking-[-0.015em]
          "
        >
          {project.name}
        </h2>

        <p
          className="
            mt-2
            min-h-[48px]
            text-[13px]
            leading-6
            text-[var(--muted)]
          "
        >
          {project.description ||
            "No description added yet."}
        </p>
      </div>

      {/* ACTIONS */}
      <div
        className="
          mt-auto
          flex
          items-center
          justify-between
          gap-3
          border-t
          border-[var(--border)]
          pt-5
        "
      >
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="
            inline-flex
            items-center
            gap-2
            text-[10px]
            font-medium
            uppercase
            tracking-[0.14em]
            text-[var(--muted)]
            transition-colors
            hover:text-[var(--foreground)]
          "
        >
          Open project
          <ArrowUpRight
            size={14}
            strokeWidth={1.5}
          />
        </button>

        <button
          type="button"
          onClick={() => onAskIRA(project)}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border border-[var(--border)]
            bg-[var(--background)]
            px-3.5
            py-2.5
            text-[11px]
            font-medium
            tracking-wide
            text-[var(--foreground)]
            transition-all
            duration-200
            hover:border-[var(--foreground)]/20
            hover:bg-[var(--surface-soft)]
            active:scale-[0.98]
          "
        >
          Ask IRA
          <ArrowUpRight
            size={14}
            strokeWidth={1.5}
          />
        </button>
      </div>
    </article>
  );
}