"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";

interface CreateNoteModalProps {
  onClose: () => void;
  onCreated: (note: {
    note_id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
  }) => void;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";


export default function CreateNoteModal({
  onClose,
  onCreated,
}: CreateNoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { token } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Note title is required.");
      return;
    }


    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const params = new URLSearchParams({
        title: trimmedTitle,
        content,
      });

      const response = await fetch(
        `${API_BASE_URL}/notes?${params.toString()}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType = response.headers.get("content-type") || "";

if (!contentType.includes("application/json")) {
  const responseText = await response.text();

  console.error("Create note returned non-JSON:", {
    status: response.status,
    url: response.url,
    response: responseText.slice(0, 300),
  });

  throw new Error(
    "The server returned HTML instead of JSON. Check the backend API URL."
  );
}

const data = await response.json();

if (!response.ok) {
  throw new Error(data?.detail || "Failed to create note.");
}

      onCreated(data.note);
    } catch (error) {
      console.error("Failed to create note:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create note."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
      <div
        className="
          w-full max-w-[620px]
          rounded-2xl
          border border-[#EEE3D1]/10
          bg-[#171716]
          p-5
          shadow-2xl
          md:p-6
        "
      >
        {/* Header */}

        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-medium text-[#EEE3D1]">
            New note
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              text-[#EEE3D1]/40
              transition
              hover:bg-[#EEE3D1]/[0.05]
              hover:text-[#EEE3D1]
            "
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Title */}

        <div className="mt-6">
          <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-[#EEE3D1]/40">
            Title
          </label>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Note title"
            autoFocus
            className="
              h-11 w-full
              rounded-xl
              border border-[#EEE3D1]/10
              bg-[#11100E]
              px-3.5
              text-sm
              text-[#EEE3D1]
              outline-none
              placeholder:text-[#EEE3D1]/25
              focus:border-[#EEE3D1]/20
            "
          />
        </div>

        {/* Content */}

        <div className="mt-5">
          <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-[#EEE3D1]/40">
            Content
          </label>

          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder="Write your note..."
            rows={9}
            className="
              w-full
              resize-none
              rounded-xl
              border border-[#EEE3D1]/10
              bg-[#11100E]
              px-3.5 py-3
              text-sm
              leading-6
              text-[#EEE3D1]
              outline-none
              placeholder:text-[#EEE3D1]/25
              focus:border-[#EEE3D1]/20
            "
          />
        </div>

        {/* Error */}

        {error && (
          <p className="mt-3 text-xs text-[#EEE3D1]/60">
            {error}
          </p>
        )}

        {/* Actions */}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="
              h-10 rounded-xl
              px-4
              text-[13px]
              text-[#EEE3D1]/50
              transition
              hover:bg-[#EEE3D1]/[0.04]
              hover:text-[#EEE3D1]
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
              h-10 rounded-xl
              border border-[#EEE3D1]/10
              px-4
              text-[13px]
              text-[#EEE3D1]
              transition
              hover:bg-[#EEE3D1]/[0.05]
              disabled:opacity-40
            "
          >
            {isSaving ? "Saving..." : "Save note"}
          </button>
        </div>
      </div>
    </div>
  );
}