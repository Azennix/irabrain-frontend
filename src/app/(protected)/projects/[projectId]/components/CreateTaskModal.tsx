"use client";

import { useState } from "react";
import {
  createTask,
  type TaskItem,
  type GoalItem,
} from "@/services/api/brainApi";

interface CreateTaskModalProps {
  token: string;
  projectId: string;
  goals: GoalItem[];
  onClose: () => void;
  onCreated: (task: TaskItem) => void;
}

export default function CreateTaskModal({
  token,
  projectId,
  goals,
  onClose,
  onCreated,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalId, setGoalId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title is required.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const task = await createTask(
        token,
        projectId,
        trimmedTitle,
        description.trim() || undefined,
        goalId || undefined
      );

      onCreated(task);
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Unable to create this task.");
    } finally {
      setIsSaving(false);
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
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full max-w-[520px]
          rounded-[22px]
          border border-[var(--border)]
          bg-[var(--background)]
          p-6
          shadow-2xl
        "
      >
        <div className="mb-6">
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-[var(--muted)]
            "
          >
            New task
          </p>

          <h2
            className="
              mt-2
              text-xl
              font-normal
              tracking-[-0.02em]
            "
          >
            Add a task
          </h2>

          <p
            className="
              mt-2
              text-[13px]
              leading-6
              text-[var(--muted)]
            "
          >
            Define a concrete piece of work for this project.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="task-title"
              className="
                mb-2 block
                text-[11px]
                uppercase
                tracking-[0.12em]
                text-[var(--muted)]
              "
            >
              Title
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Build authentication flow"
              autoFocus
              className="
                w-full
                rounded-xl
                border border-[var(--border)]
                bg-[var(--surface-soft)]
                px-4 py-3
                text-sm
                outline-none
                placeholder:text-[var(--muted)]
                focus:border-[var(--foreground)]/25
              "
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
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
              id="task-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Optional task details"
              rows={4}
              className="
                w-full
                resize-none
                rounded-xl
                border border-[var(--border)]
                bg-[var(--surface-soft)]
                px-4 py-3
                text-sm
                leading-6
                outline-none
                placeholder:text-[var(--muted)]
                focus:border-[var(--foreground)]/25
              "
            />
          </div>
          <div>
  <label
    htmlFor="task-goal"
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

  <select
    id="task-goal"
    value={goalId}
    onChange={(event) => setGoalId(event.target.value)}
    className="
      w-full
      rounded-xl
      border border-[var(--border)]
      bg-[var(--surface-soft)]
      px-4 py-3
      text-sm
      outline-none
      focus:border-[var(--foreground)]/25
    "
  >
    <option value="">No goal</option>

    {goals.map((goal) => (
      <option key={goal.id} value={goal.id}>
        {goal.title}
      </option>
    ))}
  </select>
</div>

          {error && (
            <p className="text-xs text-[var(--foreground)]">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
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
              type="submit"
              disabled={isSaving}
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
              {isSaving ? "Creating..." : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}