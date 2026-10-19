"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { updateGoal, type GoalItem } from "@/services/api/brainApi";

interface EditGoalModalProps {
  token: string;
  projectId: string;
  goal: GoalItem;
  onClose: () => void;
  onSaved: (goal: GoalItem) => void;
  onDelete: () => void;
}

const statuses = ["active", "completed", "paused", "archived"];

export default function EditGoalModal({
  token,
  projectId,
  goal,
  onClose,
  onSaved,
  onDelete,
}: EditGoalModalProps) {
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description ?? "");
  const [status, setStatus] = useState(goal.status);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Goal title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedGoal = await updateGoal(
        token,
        projectId,
        goal.id,
        title.trim(),
        description.trim() || null,
        status
      );

      onSaved(updatedGoal);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update goal."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
  className="
    fixed inset-0 z-50
    flex items-center justify-center
    bg-black/70
    px-3 py-4
    sm:px-4
  "
>
      <div
  className="
    w-full max-w-md
    max-h-[calc(100vh-2rem)]
    overflow-y-auto
    rounded-2xl
    border border-[var(--border)]
    bg-[var(--surface)]
    p-5
    shadow-2xl
    sm:p-6
  "
>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Edit goal
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Update this project goal.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-[var(--foreground)]">
              Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Goal title"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[var(--foreground)]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this goal..."
              rows={4}
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[var(--foreground)]">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm capitalize text-[var(--foreground)] outline-none"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="space-y-3 pt-2">
  <button
    type="button"
    onClick={onDelete}
    disabled={saving}
    className="
      w-full
      rounded-xl
      border border-[#8A0303]/40
      bg-[#8A0303]/10
      px-4 py-2.5
      text-sm
      text-[var(--foreground)]
      transition
      hover:bg-[#8A0303]/20
      disabled:opacity-50
    "
  >
    Delete goal
  </button>

  <div className="grid grid-cols-2 gap-3">
    <button
      type="button"
      onClick={onClose}
      disabled={saving}
      className="
        w-full
        rounded-xl
        border border-[var(--border)]
        px-4 py-2.5
        text-sm
        text-[var(--foreground)]
        transition
        hover:bg-[var(--surface-soft)]
        disabled:opacity-50
      "
    >
      Cancel
    </button>

    <button
      type="submit"
      disabled={saving}
      className="
        w-full
        rounded-xl
        bg-[var(--foreground)]
        px-4 py-2.5
        text-sm
        font-medium
        text-[var(--background)]
        transition
        hover:opacity-90
        disabled:opacity-50
      "
    >
      {saving ? "Saving..." : "Save changes"}
    </button>
  </div>
</div>
        </form>
      </div>
    </div>
  );
}