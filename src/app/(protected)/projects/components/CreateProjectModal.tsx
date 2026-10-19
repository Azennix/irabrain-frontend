"use client";

import { useState } from "react";
import { X } from "lucide-react";

import {
  createProject,
  type ProjectItem,
} from "@/services/api/brainApi";

interface CreateProjectModalProps {
  token: string;
  onClose: () => void;
  onCreated: (project: ProjectItem) => void;
}

export default function CreateProjectModal({
  token,
  onClose,
  onCreated,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
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

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const project = await createProject(
        token,
        name,
        description
      );

      onCreated(project);
    } catch (err) {
      console.error(
        "Failed to create project:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create project."
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
              New project
            </p>

            <h2 className="mt-2 text-xl font-medium">
              Create a project
            </h2>

            <p
              className="
                mt-2
                text-[13px]
                leading-6
                text-[var(--muted)]
              "
            >
              Give your project a clear name and
              purpose.
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
              htmlFor="project-name"
              className="
                mb-2 block
                text-[11px]
                uppercase
                tracking-[0.12em]
                text-[var(--muted)]
              "
            >
              Project name
            </label>

            <input
              id="project-name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. IRABRAIN V1"
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
              htmlFor="project-description"
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
              id="project-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="What are you building?"
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
                : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}