"use client";

import { useEffect, useState } from "react";
import { Plus, FileText, Trash2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth/AuthProvider";
import CreateNoteModal from "./components/CreateNoteModal";
import EditNoteModal from "./components/EditNoteModal";
import DeleteNoteDialog from "./components/DeleteNoteDialog";

interface Note {
  note_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


export default function NotesPage() {
  const { token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  async function loadNotes() {
  try {
    if (!token) {
      setLoading(false);
      return;
    }

    
      const response = await fetch(`${API_BASE_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
  const responseText = await response.text();

  throw new Error(
    `Failed to load notes (${response.status}): ${responseText.slice(0, 200)}`
  );
}

const contentType = response.headers.get("content-type");

if (!contentType?.includes("application/json")) {
  throw new Error(
    `Expected JSON from the Notes API, but received: ${
      contentType || "unknown content type"
    }. Check NEXT_PUBLIC_API_BASE_URL.`
  );
}

const data = await response.json();
setNotes(data.notes ?? []);

      setNotes(data.notes ?? []);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
  loadNotes();
}, [token]);




  function handleNoteSaved(updatedNote: Note) {
  setNotes((current) =>
    current.map((note) =>
      note.note_id === updatedNote.note_id
        ? updatedNote
        : note
    )
  );

  setEditingNote(null);
}







  async function deleteNote(noteId: string) {
  if (!token) {
    return;
  }

  try {
    setIsDeleting(true);

    const response = await fetch(
      `${API_BASE_URL}/notes/${encodeURIComponent(noteId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete note.");
    }

    setNotes((current) =>
      current.filter((note) => note.note_id !== noteId)
    );

    setDeletingNote(null);
  } catch (error) {
    console.error("Failed to delete note:", error);
  } finally {
    setIsDeleting(false);
  }
}



  function handleNoteCreated(note: Note) {
  setNotes((current) => [note, ...current]);
  setIsCreateOpen(false);
}


const filteredNotes = notes.filter((note) => {
  const query = searchQuery.trim().toLowerCase();

  if (!query) {
    return true;
  }

  return (
    note.title.toLowerCase().includes(query) ||
    note.content.toLowerCase().includes(query)
  );
});

  return (
    <MainLayout>
          <main className="min-h-full px-5 pb-8 pt-28 md:px-10 md:pb-8 md:pt-10">
               <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-medium text-[#EEE3D1]">
                Notes
              </h1>

              <p className="mt-2 max-w-xs text-sm leading-6 text-[#EEE3D1]/45">
                Capture and organize your thoughts.
              </p>
            </div>

            
             <button
  type="button"
  onClick={() => setIsCreateOpen(true)}
  className="flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-[#EEE3D1]/10 px-3.5 text-[13px] text-[#EEE3D1]/75 transition hover:bg-[#EEE3D1]/[0.04] hover:text-[#EEE3D1]"
>
  <Plus size={16} strokeWidth={1.5} />
  <span>New note</span>
</button>
              
          </div>

          {/* Notes */}
          {/* Search */}

<div className="mb-5">
  <input
    type="text"
    value={searchQuery}
    onChange={(event) =>
      setSearchQuery(event.target.value)
    }
    placeholder="Search notes..."
    className="
      h-11
      w-full
      rounded-xl
      border border-[#EEE3D1]/10
      bg-[#171716]
      px-4
      text-sm
      text-[#EEE3D1]
      outline-none
      placeholder:text-[#EEE3D1]/25
      focus:border-[#EEE3D1]/20
    "
  />
</div>

{/* Notes */}

{loading ? (
        
            <div className="text-sm text-[#EEE3D1]/40">
              Loading notes...
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex min-h-[225px] items-center justify-center rounded-2xl border border-[#EEE3D1]/10 bg-[] px-6">
              <div className="text-center">
                <FileText
                  size={28}
                  strokeWidth={1.4}
                  className="mx-auto text-[#EEE3D1]/30"
                />

                <p className="mt-4 text-sm text-[#EEE3D1]/50">
                 {notes.length === 0
                   ? "No notes yet."
                    : "No matching notes."}
                </p>

                <p className="mt-1 text-xs text-[#EEE3D1]/30">
                  Create your first note to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredNotes.map((note) => (
                <div
                 key={note.note_id}
                    onClick={() => setEditingNote(note)}
                 className="group cursor-pointer rounded-2xl border border-[#EEE3D1]/10 bg-[#171716] p-5 transition hover:border-[#EEE3D1]/15"
                    >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-[15px] font-medium text-[#EEE3D1]">
                        {note.title}
                      </h2>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#EEE3D1]/45">
                        {note.content}
                      </p>
                    </div>

                    <button
                 type="button"

                  onClick={(event) => {
                    event.stopPropagation();
                       setDeletingNote(note);
                      }}


                      className="shrink-0 text-[#EEE3D1]/25 transition hover:text-[#EEE3D1]/70"
                       aria-label="Delete note"
                      >
                   <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {isCreateOpen && (
  <CreateNoteModal
    onClose={() => setIsCreateOpen(false)}
    onCreated={handleNoteCreated}
  />
)}
{editingNote && (
  <EditNoteModal
    note={editingNote}
    onClose={() => setEditingNote(null)}
    onSaved={handleNoteSaved}
  />
)}

{deletingNote && (
  <DeleteNoteDialog
    onClose={() => setDeletingNote(null)}
    onConfirm={() => deleteNote(deletingNote.note_id)}
    isDeleting={isDeleting}
  />
)}
    </MainLayout>
  );
}