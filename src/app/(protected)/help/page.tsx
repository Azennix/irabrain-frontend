"use client";

import {
  ArrowLeft,
  ChevronRight,
  CircleHelp,
  MessageCircle,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import MainLayout from "@/components/layout/MainLayout";

export default function HelpPage() {
  const router = useRouter();
  const [openQuestion, setOpenQuestion] =
  useState<string | null>(null);

  const [searchQuery, setSearchQuery] =
  useState("");

const helpArticles = [
  {
    question: "How does IRABRAIN memory work?",
    answer:
      "IRABRAIN can use information from your Personal Space to provide more relevant conversations over time. You can review and manage your saved memories from the Memory section. Private Space is separate and does not save conversations to your personal memory.",
  },
  {
    question: "What is Private Space?",
    answer:
      "Private Space is designed for conversations you don't want added to your normal conversation history or personal memory. It uses the same IRA chat experience while keeping the session separate from Personal Space.",
  },
  {
    question: "How do I manage my conversations?",
    answer:
      "Your Personal Space conversations appear in the sidebar. Select a conversation to continue it. On supported devices, you can delete a conversation from its conversation menu. Private Space conversations are not added to your normal conversation history.",
  },
  {
    question: "How do I report a problem?",
    answer:
      "If something isn't working correctly, use Bug Report to describe the problem and submit it to IRABRAIN.",
  },
];

const filteredArticles =
  helpArticles.filter((article) => {
    const query =
      searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      article.question
        .toLowerCase()
        .includes(query) ||
      article.answer
        .toLowerCase()
        .includes(query)
    );
  });

  return (
    <MainLayout>
      <main className="min-h-full px-5 pb-10 pt-28 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-3xl">
          {/* HEADER */}

          <div className="mb-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="
                mb-6
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                text-[var(--muted)]
                transition
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--foreground)]
              "
              aria-label="Go back"
            >
              <ArrowLeft
                size={18}
                strokeWidth={1.5}
              />
            </button>

            <div className="flex items-center gap-3">
              <CircleHelp
                size={22}
                strokeWidth={1.5}
                className="text-[var(--muted)]"
              />

              <h1
                className="
                  text-2xl
                  font-medium
                  tracking-tight
                  text-[var(--foreground)]
                  md:text-3xl
                "
              >
                Help & Support
              </h1>
            </div>

            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Find answers or get help with IRABRAIN.
            </p>
          </div>

          {/* SEARCH */}

          <div
            className="
              mb-10
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-4
              py-3
            "
          >
            <Search
              size={17}
              strokeWidth={1.5}
              className="shrink-0 text-[var(--muted)]"
            />

            <input
              type="text"
              placeholder="Search help..."
              value={searchQuery}
             onChange={(event) =>
             setSearchQuery(event.target.value)
}
              className="
                w-full
                bg-transparent
                text-sm
                text-[var(--foreground)]
                outline-none
                placeholder:text-[var(--muted)]
              "
            />
          </div>

          {/* COMMON QUESTIONS */}

          <section>
            <p
              className="
                mb-3
                px-1
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-[var(--muted)]
              "
            >
              Common questions
            </p>

            <div
              className="
                overflow-hidden
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
              "
            >
              
              
              {filteredArticles.map((article, index) => {
  const isOpen =
    openQuestion === article.question;

  return (
    <div
      key={article.question}
      className={
        index !== 0
          ? "border-t border-[var(--border)]"
          : ""
      }
    >
      <button
        type="button"
        onClick={() =>
          setOpenQuestion(
            isOpen
              ? null
              : article.question
          )
        }
        className="
          flex
          min-h-14
          w-full
          items-center
          justify-between
          gap-4
          px-4
          py-3
          text-left
          text-sm
          text-[var(--foreground)]
          transition
          hover:bg-[var(--surface-hover)]
        "
      >
        <span>{article.question}</span>

        <ChevronRight
          size={17}
          strokeWidth={1.5}
          className={`shrink-0 text-[var(--muted)] transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-sm leading-6 text-[var(--muted)]">
            {article.answer}
          </p>

          {article.question ===
            "How do I report a problem?" && (
            <button
              type="button"
              onClick={() => router.push("/bug-report")}
              className="
                mt-4
                text-sm
                text-[var(--foreground)]
                underline
                underline-offset-4
                decoration-[var(--border)]
                hover:decoration-[var(--foreground)]
              "
            >
              Open Bug Report
            </button>
          )}
        </div>
      )}
    </div>
  );
})}


            </div>
          </section>

          {/* CONTACT SUPPORT */}

          <section className="mt-10">
            <p
              className="
                mb-3
                px-1
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-[var(--muted)]
              "
            >
              Contact support
            </p>

            <button
              type="button"
              onClick={() => router.push("/help/contact")}
              className="
                flex
                w-full
                items-center
                gap-4
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-4
                py-4
                text-left
                transition
                hover:bg-[var(--surface-hover)]
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[var(--surface-soft)]
                  text-[var(--muted)]
                "
              >
                <MessageCircle
                  size={17}
                  strokeWidth={1.5}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-[var(--foreground)]">
                  Get help with your IRABRAIN account
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Contact the IRABRAIN support team.
                </p>
              </div>

              <ChevronRight
                size={17}
                strokeWidth={1.5}
                className="shrink-0 text-[var(--muted)]"
              />
            </button>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}