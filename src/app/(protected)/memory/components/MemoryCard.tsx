"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  MapPin,
  MoreHorizontal,
  Network,
  Pencil,
  Sparkles,
  Target,
  Trash2,
  UserRound,
} from "lucide-react";

import { useState } from "react";

import type { MemoryItem } from "@/services/api/brainApi";

interface MemoryCardProps {
  memory: MemoryItem;
  onEdit: (memory: MemoryItem) => void;
  onForget: (memory: MemoryItem) => void;
}

function CategoryIcon({
  category,
  size = 17,
}: {
  category: string;
  size?: number;
}) {
  const props = {
    size,
    strokeWidth: 1.45,
  };

  switch (category) {
    case "goal":
      return <Target {...props} />;

    case "project":
      return <BriefcaseBusiness {...props} />;

    case "skill":
    case "education":
      return <BookOpen {...props} />;

    case "location":
      return <MapPin {...props} />;

    case "relationship":
      return <Network {...props} />;

    case "preference":
    case "identity":
      return <UserRound {...props} />;

    default:
      return <Sparkles {...props} />;
  }
}

function formatCategory(category: string) {
  return category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default function MemoryCard({
  memory,
  onEdit,
  onForget,
}: MemoryCardProps) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  return (
    <article
      className="
        group relative overflow-hidden
        rounded-[22px]
        border border-[var(--border)]
        bg-[var(--surface-soft)]
        transition-all duration-300
        hover:-translate-y-[1px]
        hover:border-[var(--foreground)]/[0.16]
        hover:bg-[var(--surface)]
      "
    >
      <div
        className="
          pointer-events-none absolute inset-x-0 top-0
          h-px bg-gradient-to-r
          from-transparent
          via-[var(--foreground)]/[0.10]
          to-transparent
        "
      />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              border border-[var(--border)]
              bg-[var(--background)]
              text-[var(--foreground)]/70
            "
          >
            <CategoryIcon
              category={memory.category}
              size={18}
            />
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label="Memory options"
              onClick={() =>
                setMenuOpen((open) => !open)
              }
              className="
                flex h-8 w-8 items-center
                justify-center rounded-full
                text-[var(--muted)]
                transition
                hover:bg-[var(--background)]
                hover:text-[var(--foreground)]
              "
            >
              <MoreHorizontal
                size={18}
                strokeWidth={1.5}
              />
            </button>

            {menuOpen && (
              <div
                className="
                  absolute right-0 top-10 z-20
                  w-40 overflow-hidden
                  rounded-xl
                  border border-[var(--border)]
                  bg-[var(--surface)]
                  p-1
                  shadow-[0_18px_50px_rgba(0,0,0,0.28)]
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(memory);
                  }}
                  className="
                    flex w-full items-center gap-2
                    rounded-lg px-3 py-2
                    text-left text-xs
                    text-[var(--muted)]
                    transition
                    hover:bg-[var(--surface-soft)]
                    hover:text-[var(--foreground)]
                  "
                >
                  <Pencil size={14} />
                  Edit memory
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onForget(memory);
                  }}
                  className="
                    flex w-full items-center gap-2
                    rounded-lg px-3 py-2
                    text-left text-xs
                    text-[var(--muted)]
                    transition
                    hover:bg-[var(--surface-soft)]
                    hover:text-[var(--foreground)]
                  "
                >
                  <Trash2 size={14} />
                  Forget memory
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <p
            className="
              text-[10px] uppercase
              tracking-[0.16em]
              text-[var(--muted)]
            "
          >
            {formatCategory(memory.category)}
          </p>

          <h2
            className="
              mt-2
              break-words
              text-[16px]
              font-medium
              tracking-[-0.01em]
              text-[var(--foreground)]
            "
          >
            {memory.key}
          </h2>

          <p
            className="
              mt-3
              break-words
              text-[13px]
              leading-6
              text-[var(--muted)]
            "
          >
            {memory.value}
          </p>
        </div>

        <div
          className="
            mt-6 flex items-center
            justify-between gap-3
            border-t border-[var(--border)]
            pt-4
          "
        >
          <span
            className="
              inline-flex items-center gap-1.5
              text-[10px]
              uppercase
              tracking-[0.12em]
              text-[var(--muted)]
            "
          >
            <span
              className="
                h-1.5 w-1.5 rounded-full
                bg-[var(--foreground)]/35
              "
            />

            Remembered
          </span>

          {memory.confidence !== null && (
            <span
              className="
                text-[10px]
                tabular-nums
                text-[var(--muted)]
              "
            >
              {Math.round(
                memory.confidence * 100
              )}
              % confidence
            </span>
          )}
        </div>
      </div>
    </article>
  );
}