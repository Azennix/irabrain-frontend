"use client";

import {
  AlertTriangle,
  Check,
  Loader2,
  X,
} from "lucide-react";

import { useState } from "react";

import {
  updateMemory,
  type MemoryItem,
} from "@/services/api/brainApi";

import { categories } from "../types";

interface EditMemoryModalProps {
  memory: MemoryItem;
  token: string;
  onClose: () => void;
  onSaved: (memory: MemoryItem) => void;
}

export default function EditMemoryModal({
  memory,
  token,
  onClose,
  onSaved,
}: EditMemoryModalProps) {
  const [category, setCategory] =
    useState(memory.category);

  const [key, setKey] =
    useState(memory.key);

  const [value, setValue] =
    useState(memory.value);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSave() {
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();

    if (!trimmedKey || !trimmedValue) {
      setError(
        "Memory name and value cannot be empty."
      );
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const updated =
        await updateMemory(
          token,
          memory.id,
          category,
          trimmedKey,
          trimmedValue
        );

      onSaved(updated);
    } catch (err) {
      console.error(
        "Failed to update memory:",
        err
      );

      setError(
        "Unable to update this memory. Please try again."
      );
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
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          if (!isSaving) {
            onClose();
          }
        }
      }}
    >
      <div
        className="
          w-full max-w-[520px]
          overflow-hidden
          rounded-[24px]
          border border-[var(--border)]
          bg-[var(--surface)]
          shadow-[0_30px_100px_rgba(0,0,0,0.45)]
        "
      >
        <div
          className="
            flex items-center justify-between
            border-b border-[var(--border)]
            px-5 py-4
            sm:px-6
          "
        >
          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.16em]
                text-[var(--muted)]
              "
            >
              Memory
            </p>

            <h2 className="mt-1 text-[16px] font-medium">
              Edit memory
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-full
              text-[var(--muted)]
              transition
              hover:bg-[var(--surface-soft)]
              hover:text-[var(--foreground)]
              disabled:opacity-40
            "
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <label
              htmlFor="memory-category"
              className="
                mb-2 block
                text-[10px]
                uppercase
                tracking-[0.14em]
                text-[var(--muted)]
              "
            >
              Category
            </label>

            <select
              id="memory-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              disabled={isSaving}
              className="
                w-full
                rounded-xl
                border border-[var(--border)]
                bg-[var(--background)]
                px-3.5 py-3
                text-sm
                text-[var(--foreground)]
                outline-none
                transition
                focus:border-[var(--foreground)]/25
              "
            >
              {categories
                .filter(
                  (item) =>
                    item.id !== "all"
                )
                .map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.label}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="memory-key"
              className="
                mb-2 block
                text-[10px]
                uppercase
                tracking-[0.14em]
                text-[var(--muted)]
              "
            >
              Memory
            </label>

            <input
              id="memory-key"
              value={key}
              onChange={(event) =>
                setKey(event.target.value)
              }
              disabled={isSaving}
              className="
                w-full
                rounded-xl
                border border-[var(--border)]
                bg-[var(--background)]
                px-3.5 py-3
                text-sm
                text-[var(--foreground)]
                outline-none
                transition
                placeholder:text-[var(--muted)]
                focus:border-[var(--foreground)]/25
              "
              placeholder="What should IRA remember?"
            />
          </div>

          <div>
            <label
              htmlFor="memory-value"
              className="
                mb-2 block
                text-[10px]
                uppercase
                tracking-[0.14em]
                text-[var(--muted)]
              "
            >
              Value
            </label>

            <textarea
              id="memory-value"
              value={value}
              onChange={(event) =>
                setValue(event.target.value)
              }
              disabled={isSaving}
              rows={4}
              className="
                w-full resize-none
                rounded-xl
                border border-[var(--border)]
                bg-[var(--background)]
                px-3.5 py-3
                text-sm leading-6
                text-[var(--foreground)]
                outline-none
                transition
                placeholder:text-[var(--muted)]
                focus:border-[var(--foreground)]/25
              "
              placeholder="Describe what IRA should remember."
            />
          </div>

          {error && (
            <div
              className="
                flex items-start gap-2
                rounded-xl
                border border-[#8A0303]/25
                bg-[#8A0303]/[0.06]
                px-3.5 py-3
                text-xs
                text-[var(--foreground)]
              "
            >
              <AlertTriangle
                size={15}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="
                flex-1
                rounded-xl
                border border-[var(--border)]
                px-4 py-3
                text-xs
                text-[var(--muted)]
                transition
                hover:text-[var(--foreground)]
                disabled:opacity-40
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="
                flex flex-1
                items-center justify-center
                gap-2
                rounded-xl
                bg-[var(--foreground)]
                px-4 py-3
                text-xs
                font-medium
                text-[var(--background)]
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isSaving ? (
                <>
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                  Saving
                </>
              ) : (
                <>
                  <Check size={14} />
                  Save changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}