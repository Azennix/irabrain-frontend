"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { deleteGoal, type GoalItem } from "@/services/api/brainApi";

interface DeleteGoalDialogProps {
  token: string;
  projectId: string;
  goal: GoalItem;
  onClose: () => void;
  onDeleted: (goalId: string) => void;
}

export default function DeleteGoalDialog({
  token,
  projectId,
  goal,
  onClose,
  onDeleted,
}: DeleteGoalDialogProps) {
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      setError("");

      await deleteGoal(
        token,
        projectId,
        goal.id
      );

      onDeleted(goal.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete goal."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Delete goal?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              This will permanently remove this goal from the project.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <p className="text-sm font-medium text-[var(--foreground)]">
            {goal.title}
          </p>

          {goal.description && (
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              {goal.description}
            </p>
          )}
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--foreground)] transition hover:bg-[var(--surface-soft)] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl border border-[#8A0303]/40 bg-[#8A0303]/10 px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[#8A0303]/20 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete goal"}
          </button>
        </div>
      </div>
    </div>
  );
}