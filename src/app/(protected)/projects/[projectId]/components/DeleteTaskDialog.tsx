"use client";

import { useState } from "react";
import {
  deleteTask,
  type TaskItem,
} from "@/services/api/brainApi";

interface DeleteTaskDialogProps {
  token: string;
  projectId: string;
  task: TaskItem;
  onClose: () => void;
  onDeleted: (taskId: string) => void;
}

export default function DeleteTaskDialog({
  token,
  projectId,
  task,
  onClose,
  onDeleted,
}: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      setError(null);

      await deleteTask(token, projectId, task.id);

      onDeleted(task.id);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Unable to delete this task.");
      setIsDeleting(false);
    }
  }

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/60
        px-4
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full max-w-[440px]
          rounded-[22px]
          border border-[var(--border)]
          bg-[var(--background)]
          p-6
          shadow-2xl
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.18em]
            text-[var(--muted)]
          "
        >
          Delete task
        </p>

        <h2
          className="
            mt-2
            text-xl
            font-normal
            tracking-[-0.02em]
          "
        >
          Remove this task?
        </h2>

        <p
          className="
            mt-3
            text-[13px]
            leading-6
            text-[var(--muted)]
          "
        >
          This will permanently remove{" "}
          <span className="text-[var(--foreground)]">
            {task.title}
          </span>{" "}
          from this project.
        </p>

        {error && (
          <p className="mt-4 text-xs text-[var(--foreground)]">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="
              rounded-xl
              border border-[var(--border)]
              px-4 py-2.5
              text-xs
              transition-colors
              hover:border-[var(--foreground)]/20
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="
              rounded-xl
              bg-[var(--foreground)]
              px-4 py-2.5
              text-xs
              font-medium
              text-[var(--background)]
              transition-opacity
              hover:opacity-90
              disabled:opacity-50
            "
          >
            {isDeleting ? "Deleting..." : "Delete task"}
          </button>
        </div>
      </div>
    </div>
  );
}