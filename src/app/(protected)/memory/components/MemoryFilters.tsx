"use client";

import {
  ChevronDown,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  categories,
  type MemoryCategory,
} from "../types";

interface MemoryFiltersProps {
  activeCategory: MemoryCategory;
  categoryCounts: Record<string, number>;
  totalMemories: number;
  onCategoryChange: (
    category: MemoryCategory
  ) => void;
}

export default function MemoryFilters({
  activeCategory,
  categoryCounts,
  totalMemories,
  onCategoryChange,
}: MemoryFiltersProps) {
  const [mobileFilterOpen, setMobileFilterOpen] =
    useState(false);

  const desktopScrollRef =
    useRef<HTMLDivElement | null>(null);

  const activeCategoryLabel =
    categories.find(
      (category) =>
        category.id === activeCategory
    )?.label ?? "All memories";

  useEffect(() => {
    const container =
      desktopScrollRef.current;

    if (!container) {
      return;
    }

    const activeButton =
      container.querySelector<HTMLElement>(
        `[data-memory-category="${activeCategory}"]`
      );

    if (!activeButton) {
      return;
    }

    activeButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeCategory]);

  return (
    <section className="mt-10">
      {/* MOBILE */}
      <div className="relative md:hidden">
        <button
          type="button"
          onClick={() =>
            setMobileFilterOpen(
              (open) => !open
            )
          }
          className="
            flex w-full items-center
            justify-between
            rounded-xl
            border border-[var(--border)]
            bg-[var(--surface-soft)]
            px-4 py-3
            text-sm
          "
        >
          <span>
            {activeCategoryLabel}
          </span>

          <ChevronDown
            size={16}
            className={
              mobileFilterOpen
                ? "rotate-180 transition"
                : "transition"
            }
          />
        </button>

        {mobileFilterOpen && (
          <div
            className="
              absolute left-0 right-0 top-14 z-30
              max-h-[360px]
              overflow-y-auto
              rounded-xl
              border border-[var(--border)]
              bg-[var(--surface)]
              p-1
              shadow-[0_18px_50px_rgba(0,0,0,0.25)]
            "
          >
            {categories.map((category) => {
              const count =
                category.id === "all"
                  ? totalMemories
                  : categoryCounts[
                      category.id
                    ] ?? 0;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    onCategoryChange(
                      category.id
                    );
                    setMobileFilterOpen(false);
                  }}
                  className={`
                    flex w-full
                    items-center
                    justify-between
                    rounded-lg
                    px-3 py-2.5
                    text-left text-xs
                    transition
                    ${
                      activeCategory ===
                      category.id
                        ? "bg-[var(--foreground)] text-[var(--background)]"
                        : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
                    }
                  `}
                >
                  <span>
                    {category.label}
                  </span>

                  <span className="tabular-nums opacity-50">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div
        ref={desktopScrollRef}
        className="
          hidden
          items-center gap-1
          overflow-x-auto
          border-b border-[var(--border)]
          pb-1
          md:flex
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {categories.map((category) => {
          const count =
            category.id === "all"
              ? totalMemories
              : categoryCounts[
                  category.id
                ] ?? 0;

          const active =
            activeCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              data-memory-category={
                category.id
              }
              onClick={() =>
                onCategoryChange(
                  category.id
                )
              }
              className={`
                relative shrink-0
                px-3 py-3
                text-xs
                transition
                ${
                  active
                    ? "text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }
              `}
            >
              <span>
                {category.label}
              </span>

              <span
                className="
                  ml-1.5
                  text-[10px]
                  tabular-nums
                  opacity-45
                "
              >
                {count}
              </span>

              {active && (
                <span
                  className="
                    absolute
                    inset-x-2 -bottom-[1px]
                    h-px
                    bg-[var(--foreground)]/60
                  "
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}