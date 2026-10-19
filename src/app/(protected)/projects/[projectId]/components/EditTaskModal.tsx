"use client";

import { useState } from "react";
import {
  updateTask,
  type TaskItem,
  type GoalItem,
} from "@/services/api/brainApi";

interface EditTaskModalProps {
  token: string;
  projectId: string;
  task: TaskItem;
  goals: GoalItem[];
  onClose: () => void;
  onSaved: (task: TaskItem) => void;
  onDelete: () => void;
}

export default function EditTaskModal({
  token,
  projectId,
  task,
  goals,
  onClose,
  onSaved,
  onDelete,
}: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description ?? ""
  );
  const [status, setStatus] = useState(task.status);
  const [goalId, setGoalId] = useState(
  task.goal_id ?? ""
);
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

      const updatedTask = await updateTask(
        token,
        projectId,
        task.id,
        trimmedTitle,
        description.trim() || undefined,
        status,
        goalId || undefined
      );

      onSaved(updatedTask);
    } catch (err) {
      console.error("Failed to update task:", err);
      setError("Unable to update this task.");
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
            Task
          </p>

          <h2
            className="
              mt-2
              text-xl
              font-normal
              tracking-[-0.02em]
            "
          >
            Edit task
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="edit-task-title"
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
              id="edit-task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
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
            />
          </div>

          <div>
            <label
              htmlFor="edit-task-description"
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
              id="edit-task-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
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
                focus:border-[var(--foreground)]/25
              "
            />
          </div>
          <div>
  <label
    htmlFor="edit-task-goal"
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
    id="edit-task-goal"
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

          <div>
            <label
              htmlFor="edit-task-status"
              className="
                mb-2 block
                text-[11px]
                uppercase
                tracking-[0.12em]
                text-[var(--muted)]
              "
            >
              Status
            </label>

            <select
              id="edit-task-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
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
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {error && (
            <p className="text-xs text-[var(--foreground)]">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onDelete}
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
              Delete
            </button>

            <div className="flex items-center gap-3">
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
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}