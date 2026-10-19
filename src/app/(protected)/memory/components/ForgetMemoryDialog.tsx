"use client";

import {
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";

import { useState } from "react";

import {
  forgetMemory,
  type MemoryItem,
} from "@/services/api/brainApi";

interface ForgetMemoryDialogProps {
  memory: MemoryItem;
  token: string;
  onClose: () => void;
  onDeleted: (memoryId: string) => void;
}

export default function ForgetMemoryDialog({
  memory,
  token,
  onClose,
  onDeleted,
}: ForgetMemoryDialogProps) {
  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleForget() {
    try {
      setIsDeleting(true);
      setError(null);

      await forgetMemory(
        token,
        memory.id
      );

      onDeleted(memory.id);
    } catch (err) {
      console.error(
        "Failed to forget memory:",
        err
      );

      setError(
        "Unable to forget this memory. Please try again."
      );

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
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          if (!isDeleting) {
            onClose();
          }
        }
      }}
    >
      <div
        className="
          w-full max-w-[430px]
          overflow-hidden
          rounded-[24px]
          border border-[var(--border)]
          bg-[var(--surface)]
          shadow-[0_30px_100px_rgba(0,0,0,0.45)]
        "
      >
        <div className="p-6">
          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              border border-[var(--border)]
              bg-[var(--background)]
              text-[var(--foreground)]/65
            "
          >
            <Trash2
              size={18}
              strokeWidth={1.4}
            />
          </div>

          <h2 className="mt-5 text-[17px] font-medium">
            Forget this memory?
          </h2>

          <p
            className="
              mt-2
              text-[13px]
              leading-6
              text-[var(--muted)]
            "
          >
            IRA will permanently remove this
            memory from your persistent context.
          </p>

          <div
            className="
              mt-5
              rounded-xl
              border border-[var(--border)]
              bg-[var(--background)]
              p-4
            "
          >
            <p
              className="
                text-xs
                font-medium
                text-[var(--foreground)]
              "
            >
              {memory.key}
            </p>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-[var(--muted)]
              "
            >
              {memory.value}
            </p>
          </div>

          {error && (
            <div
              className="
                mt-4
                flex items-start gap-2
                rounded-xl
                border border-[#8A0303]/25
                bg-[#8A0303]/[0.06]
                px-3.5 py-3
                text-xs
              "
            >
              <AlertTriangle
                size={15}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
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
              Keep memory
            </button>

            <button
              type="button"
              onClick={handleForget}
              disabled={isDeleting}
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
              {isDeleting ? (
                <>
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                  Forgetting
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  Forget memory
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}