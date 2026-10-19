"use client";

import { AlertTriangle, X } from "lucide-react";

interface DeleteNoteDialogProps {
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteNoteDialog({
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteNoteDialogProps) {
  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-[420px] rounded-2xl border border-[#EEE3D1]/10 bg-[#171716] p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EEE3D1]/10">
              <AlertTriangle
                size={18}
                strokeWidth={1.5}
                className="text-[#EEE3D1]/65"
              />
            </div>

            <div>
              <h2 className="text-[16px] font-medium text-[#EEE3D1]">
                Delete note?
              </h2>

              <p className="mt-1 text-xs text-[#EEE3D1]/40">
                This note will be permanently deleted.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#EEE3D1]/40 transition hover:bg-[#EEE3D1]/[0.05] hover:text-[#EEE3D1] disabled:opacity-40"
            aria-label="Close"
          >
            <X size={17} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-10 rounded-xl px-4 text-[13px] text-[#EEE3D1]/50 transition hover:bg-[#EEE3D1]/[0.04] hover:text-[#EEE3D1] disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-10 rounded-xl border border-[#EEE3D1]/10 px-4 text-[13px] text-[#EEE3D1] transition hover:bg-[#EEE3D1]/[0.05] disabled:opacity-40"
          >
            {isDeleting ? "Deleting..." : "Delete note"}
          </button>
        </div>
      </div>
    </div>
  );
}