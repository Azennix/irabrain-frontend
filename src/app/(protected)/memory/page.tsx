"use client";

import {
  Check,
  Sparkles,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ProtectedPageLayout from "@/components/layout/ProtectedPageLayout";

import { useAuth } from "@/lib/auth/AuthProvider";

import {
  getMemories,
  type MemoryItem,
} from "@/services/api/brainApi";

import MemoryCard from "./components/MemoryCard";
import MemoryFilters from "./components/MemoryFilters";
import EditMemoryModal from "./components/EditMemoryModal";
import ForgetMemoryDialog from "./components/ForgetMemoryDialog";

import type {
  MemoryCategory,
} from "./types";

export default function MemoryPage() {
  const { token } = useAuth();

  const [memories, setMemories] =
    useState<MemoryItem[]>([]);

  const [activeCategory, setActiveCategory] =
    useState<MemoryCategory>("all");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [editingMemory, setEditingMemory] =
    useState<MemoryItem | null>(null);

  const [forgettingMemory, setForgettingMemory] =
    useState<MemoryItem | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadMemories() {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await getMemories(token!);

        if (!cancelled) {
          setMemories(data);
        }
      } catch (err) {
        console.error(
          "Failed to load memories:",
          err
        );

        if (!cancelled) {
          setError(
            "Unable to load your memories."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadMemories();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const filteredMemories = useMemo(() => {
    if (activeCategory === "all") {
      return memories;
    }

    return memories.filter(
      (memory) =>
        memory.category ===
        activeCategory
    );
  }, [memories, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<
      string,
      number
    > = {};

    for (const memory of memories) {
      counts[memory.category] =
        (counts[memory.category] ?? 0) + 1;
    }

    return counts;
  }, [memories]);

  function handleMemorySaved(
    updatedMemory: MemoryItem
  ) {
    setMemories((current) =>
      current.map((memory) =>
        memory.id === updatedMemory.id
          ? updatedMemory
          : memory
      )
    );

    setEditingMemory(null);
  }

  function handleMemoryDeleted(
    memoryId: string
  ) {
    setMemories((current) =>
      current.filter(
        (memory) =>
          memory.id !== memoryId
      )
    );

    setForgettingMemory(null);
  }

  return (
  <ProtectedPageLayout>
    <main
      className="
        mx-auto w-full max-w-[1180px]
        px-4 pb-28 pt-[76px]
        sm:px-6
        md:px-8 md:pb-16 md:pt-12
      "
    >

          {/* HEADER */}
          <section>
            <div
              className="
                flex flex-col gap-6
                md:flex-row
                md:items-end
                md:justify-between
              "
            >
              <div>
                <div
                  className="
                    inline-flex items-center gap-2
                    text-[10px]
                    uppercase
                    tracking-[0.18em]
                    text-[var(--muted)]
                  "
                >
                  <span
                    className="
                      h-1.5 w-1.5 rounded-full
                      bg-[var(--foreground)]/45
                    "
                  />

                  Personal context
                </div>

                <h1
                  className="
                    mt-3
                    text-[32px]
                    font-normal
                    tracking-[-0.035em]
                    sm:text-[40px]
                  "
                >
                  Memory
                </h1>

                <p
                  className="
                    mt-3 max-w-[560px]
                    text-sm leading-6
                    text-[var(--muted)]
                    sm:text-[15px]
                  "
                >
                  The things IRA has learned,
                  understood, and retained
                  from your interactions.
                </p>
              </div>

              <div
                className="
                  flex items-center gap-3
                  rounded-2xl
                  border border-[var(--border)]
                  bg-[var(--surface-soft)]
                  px-4 py-3
                "
              >
                <div
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded-lg
                    bg-[var(--background)]
                    text-[var(--foreground)]/65
                  "
                >
                  <Sparkles
                    size={15}
                    strokeWidth={1.5}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.12em]
                      text-[var(--muted)]
                    "
                  >
                    Stored memories
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      font-medium
                    "
                  >
                    {isLoading
                      ? "—"
                      : memories.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FILTERS */}
          <MemoryFilters
            activeCategory={activeCategory}
            categoryCounts={categoryCounts}
            totalMemories={memories.length}
            onCategoryChange={
              setActiveCategory
            }
          />

          {/* MEMORY CONTENT */}
          <section className="mt-8">
            {isLoading ? (
              <div
                className="
                  grid grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="
                      h-[245px]
                      animate-pulse
                      rounded-[22px]
                      border border-[var(--border)]
                      bg-[var(--surface-soft)]
                    "
                  />
                ))}
              </div>
            ) : error ? (
              <div
                className="
                  rounded-[22px]
                  border border-[var(--border)]
                  bg-[var(--surface-soft)]
                  px-6 py-16
                  text-center
                "
              >
                <p className="text-sm">
                  {error}
                </p>

                <p
                  className="
                    mt-2 text-xs
                    text-[var(--muted)]
                  "
                >
                  Please refresh the page
                  and try again.
                </p>
              </div>
            ) : filteredMemories.length === 0 ? (
              <div
                className="
                  relative overflow-hidden
                  rounded-[24px]
                  border border-[var(--border)]
                  bg-[var(--surface-soft)]
                  px-6 py-20
                  text-center
                "
              >
                <div
                  className="
                    mx-auto flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    border border-[var(--border)]
                    bg-[var(--background)]
                    text-[var(--foreground)]/55
                  "
                >
                  <Sparkles
                    size={19}
                    strokeWidth={1.4}
                  />
                </div>

                <h2
                  className="
                    mt-5
                    text-[15px]
                    font-medium
                  "
                >
                  {activeCategory === "all"
                    ? "Your memory is still forming."
                    : `No ${activeCategory
                        .toString()
                        .replace(
                          /^\w/,
                          (letter) =>
                            letter.toUpperCase()
                        )
                        .replace(
                          /_/g,
                          " "
                        )
                        .toLowerCase()} memories yet.`}
                </h2>

                <p
                  className="
                    mx-auto mt-2
                    max-w-[420px]
                    text-[13px]
                    leading-6
                    text-[var(--muted)]
                  "
                >
                  {activeCategory === "all"
                    ? "As you use IRA, relevant information can become part of your persistent context."
                    : "This category will appear here when IRA has relevant information to remember."}
                </p>
              </div>
            ) : (
              <div
                className="
                  grid grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {filteredMemories.map(
                  (memory) => (
                    <MemoryCard
                      key={memory.id}
                      memory={memory}
                      onEdit={
                        setEditingMemory
                      }
                      onForget={
                        setForgettingMemory
                      }
                    />
                  )
                )}
              </div>
            )}
          </section>

          {/* PERSISTENCE INDICATOR */}
          {!isLoading &&
            !error &&
            memories.length > 0 && (
              <div
                className="
                  mt-8 flex items-center
                  justify-center gap-2
                  text-[10px]
                  uppercase
                  tracking-[0.14em]
                  text-[var(--muted)]
                "
              >
                <Check
                  size={12}
                  strokeWidth={1.5}
                />

                Persistent context
              </div>
            )}
        </main>

        {/* EDIT */}
        {editingMemory && token && (
          <EditMemoryModal
            memory={editingMemory}
            token={token}
            onClose={() =>
              setEditingMemory(null)
            }
            onSaved={handleMemorySaved}
          />
        )}

                {/* FORGET */}
        {forgettingMemory && token && (
          <ForgetMemoryDialog
            memory={forgettingMemory}
            token={token}
            onClose={() =>
              setForgettingMemory(null)
            }
            onDeleted={
              handleMemoryDeleted
            }
          />
        )}
    </ProtectedPageLayout>
  );
}