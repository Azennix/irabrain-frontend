"use client";

import { useState } from "react";
import { X } from "lucide-react";

import {
  createGoal,
  type GoalItem,
} from "@/services/api/brainApi";

interface CreateGoalModalProps {
  token: string;
  projectId: string;
  onClose: () => void;
  onCreated: (goal: GoalItem) => void;
}

export default function CreateGoalModal({
  token,
  projectId,
  onClose,
  onCreated,
}: CreateGoalModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Goal title is required.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const goal = await createGoal(
        token,
        projectId,
        title,
        description
      );

      onCreated(goal);
    } catch (err) {
      console.error(
        "Failed to create goal:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create goal."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60
        px-4
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full max-w-[520px]
          rounded-[24px]
          border border-[var(--border)]
          bg-[var(--surface)]
          p-6
          shadow-2xl
        "
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.16em]
                text-[var(--muted)]
              "
            >
              Project goal
            </p>

            <h2 className="mt-2 text-xl font-medium">
              Add a goal
            </h2>

            <p
              className="
                mt-2
                text-[13px]
                leading-6
                text-[var(--muted)]
              "
            >
              Define a clear outcome for this project.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              text-[var(--muted)]
              transition-colors
              hover:bg-[var(--background)]
              hover:text-[var(--foreground)]
            "
          >
            <X size={17} strokeWidth={1.5} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >
          <div>
            <label
              htmlFor="goal-title"
              className="
                mb-2 block
                text-[11px]
                uppercase
                tracking-[0.12em]
                text-[var(--muted)]
              "
            >
              Goal
            </label>

            <input
              id="goal-title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="e.g. Launch IRABRAIN V1"
              autoFocus
              className="
                w-full
                rounded-xl
                border border-[var(--border)]
                bg-[var(--background)]
                px-4 py-3
                text-sm
                text-[var(--foreground)]
                outline-none
                placeholder:text-[var(--muted)]
                focus:border-[var(--foreground)]/25
              "
            />
          </div>

          <div>
            <label
              htmlFor="goal-description"
              className="
                mb-2 block
                text-[11px]
                uppercase
                tracking-[0.12em]
                text-[var(--muted)]
              "
            >
              Description
            </label>

            <textarea
              id="goal-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="What outcome should this goal achieve?"
              rows={4}
              className="
                w-full
                resize-none
                rounded-xl
                border border-[var(--border)]
                bg-[var(--background)]
                px-4 py-3
                text-sm
                leading-6
                text-[var(--foreground)]
                outline-none
                placeholder:text-[var(--muted)]
                focus:border-[var(--foreground)]/25
              "
            />
          </div>

          {error && (
            <div
              className="
                rounded-xl
                border border-[#8A0303]/30
                bg-[#8A0303]/10
                px-4 py-3
                text-xs
              "
            >
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="
                rounded-xl
                border border-[var(--border)]
                px-4 py-2.5
                text-xs
                text-[var(--muted)]
                transition-colors
                hover:text-[var(--foreground)]
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="
                rounded-xl
                bg-[var(--foreground)]
                px-5 py-2.5
                text-xs
                font-medium
                text-[var(--background)]
                transition-opacity
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isSaving
                ? "Creating..."
                : "Create goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}