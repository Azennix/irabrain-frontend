"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type TouchEvent } from "react";
import {
  ChevronDown,
  Menu,
  Plus,
  Settings,
  LogOut,
  X,
  MessageCircle,
  Brain,
  Folder,
  MoreHorizontal,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/AuthProvider";
import {
  getConversations,
  type ConversationSummary,
} from "@/services/api/brainApi";

export default function HomeHeader() {
  const router = useRouter();
  const { user, logout, token } = useAuth();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [drawerOpen, setDrawerOpen] =
    useState(false);
  
  const [touchStartX, setTouchStartX] =
  useState<number | null>(null);

  const [conversations, setConversations] =
    useState<ConversationSummary[]>([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const accessToken = token;

    async function loadConversations() {
      try {
        const data =
          await getConversations(accessToken);

        setConversations(data);
      } catch (error) {
        console.error(
          "Failed to load conversations:",
          error
        );
      }
    }

    loadConversations();
  }, [token]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  function handleNewConversation() {
    setDrawerOpen(false);
    router.push("/chat");
  }
  function handleTouchStart(
  event: TouchEvent
) {
  setTouchStartX(event.touches[0].clientX);
}

function handleTouchEnd(
  event: TouchEvent
) {
  if (touchStartX === null) return;

  const touchEndX = event.changedTouches[0].clientX;
  const distance = touchEndX - touchStartX;

  if (!drawerOpen && distance > 70) {
    setDrawerOpen(true);
  }

  if (drawerOpen && distance < -70) {
    setDrawerOpen(false);
  }

  setTouchStartX(null);
}

  function getGroup(
    updatedAt: string
  ) {
    const date = new Date(updatedAt);
    const now = new Date();

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(
      yesterday.getDate() - 1
    );

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(
      sevenDaysAgo.getDate() - 7
    );

    if (date >= today) {
      return "Today";
    }

    if (date >= yesterday) {
      return "Yesterday";
    }

    if (date >= sevenDaysAgo) {
      return "Last 7 days";
    }

    return "Older";
  }

  const grouped = {
    Today: conversations.filter(
      (conversation) =>
        getGroup(
          conversation.updated_at
        ) === "Today"
    ),

    Yesterday: conversations.filter(
      (conversation) =>
        getGroup(
          conversation.updated_at
        ) === "Yesterday"
    ),

    "Last 7 days": conversations.filter(
      (conversation) =>
        getGroup(
          conversation.updated_at
        ) === "Last 7 days"
    ),

    Older: conversations.filter(
      (conversation) =>
        getGroup(
          conversation.updated_at
        ) === "Older"
    ),
  };

  return (
    <div
  className="relative"
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="relative flex h-[72px] items-center justify-between border-b border-[#EEE3D1]/[0.06] px-5 sm:px-8 md:px-10">

        {/* MOBILE MENU */}

        <button
          type="button"
          aria-label="Open menu"
          onClick={() =>
            setDrawerOpen(true)
          }
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#EEE3D1]/75 transition hover:bg-[#EEE3D1]/[0.05] md:hidden"
        >
          <Menu
            size={21}
            strokeWidth={1.5}
          />
        </button>

        {/* MOBILE BRAND */}

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center md:hidden">

          <span className="text-[13px] font-medium tracking-[0.30em] text-[#EEE3D1]">
            IRABRAIN
          </span>

        </div>

        {/* DESKTOP PROFILE */}

        <div className="ml-auto flex items-center gap-3">

          <button
            type="button"
            aria-label="Profile"
            aria-expanded={profileOpen}
            onClick={() =>
              setProfileOpen(
                (open) => !open
              )
            }
            className="flex items-center gap-3 rounded-full px-1.5 py-1 transition hover:bg-[#EEE3D1]/[0.04]"
          >

            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEE3D1]/[0.12] text-sm text-[#EEE3D1]">
              {user?.email
                ?.charAt(0)
                .toUpperCase() || "A"}
            </span>

            <span className="hidden text-sm text-[#EEE3D1] md:block">
              {user?.full_name || "User"}
            </span>

            <ChevronDown
              size={16}
              strokeWidth={1.5}
              className="hidden text-[#EEE3D1]/60 md:block"
            />

          </button>

          {profileOpen && (
            <div className="absolute right-5 top-[62px] z-[70] w-64 rounded-xl border border-[#EEE3D1]/10 bg-[#0F0E0C] p-2 shadow-2xl">

              <div className="px-3 py-3">

                <p className="text-xs text-[#EEE3D1]/35">
                  Account
                </p>

                <p className="mt-1 truncate text-sm text-[#EEE3D1]">
                  {user?.email}
                </p>

              </div>

              <div className="border-t border-[#EEE3D1]/10 pt-1">

                <Link
                  href="/settings"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                  className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-[#EEE3D1]/65 hover:bg-[#EEE3D1]/[0.05] hover:text-[#EEE3D1]"
                >
                  <Settings
                    size={16}
                    strokeWidth={1.5}
                  />

                  Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-[#EEE3D1]/65 hover:bg-[#EEE3D1]/[0.05] hover:text-[#EEE3D1]"
                >
                  <LogOut
                    size={16}
                    strokeWidth={1.5}
                  />

                  Sign out
                </button>

              </div>

            </div>
          )}

        </div>

      </header>

      {/* =================================================
          MOBILE DRAWER
      ================================================= */}

      {drawerOpen && (
        <>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() =>
              setDrawerOpen(false)
            }
            className="fixed inset-0 z-[100] bg-black/55 md:hidden"
          />

          <aside className="fixed inset-y-0 left-0 z-[110] flex w-[88%] max-w-[360px] flex-col border-r border-[#EEE3D1]/10 bg-[#0F0E0C] md:hidden">

            {/* DRAWER HEADER */}

            <div className="shrink-0 border-b border-[#EEE3D1]/10 px-5 py-5">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEE3D1]/[0.12] text-sm text-[#EEE3D1]">
                    {user?.email
                      ?.charAt(0)
                      .toUpperCase() || "A"}
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-[#EEE3D1]">
                      
                        {user?.full_name || "User"}
                    </p>

                    <p className="truncate text-[10px] text-[#EEE3D1]/35">
                      {user?.email}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  aria-label="Close"
                  onClick={() =>
                    setDrawerOpen(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#EEE3D1]/55 hover:bg-[#EEE3D1]/[0.05] hover:text-[#EEE3D1]"
                >
                  <X
                    size={19}
                    strokeWidth={1.5}
                  />
                </button>

              </div>

            </div>

            {/* NEW CONVERSATION */}

            <div className="shrink-0 px-4 pt-4">

              <button
                type="button"
                onClick={
                  handleNewConversation
                }
                className="flex h-11 w-full items-center gap-3 rounded-lg border border-[#EEE3D1]/10 bg-[#EEE3D1]/[0.025] px-4 text-sm text-[#EEE3D1] transition hover:bg-[#EEE3D1]/[0.05]"
              >
                <Plus
                  size={18}
                  strokeWidth={1.5}
                />

                New Conversation
              </button>

            </div>

            <nav className="shrink-0 px-4 pt-4">
  {[
    {
      name: "Chat",
      href: "/",
      icon: MessageCircle,
    },
    {
      name: "Memory",
      href: "/memory",
      icon: Brain,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: Folder,
    },
    {
      name: "More",
      href: "/settings",
      icon: MoreHorizontal,
    },
  ].map((item) => {
    const Icon = item.icon;

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setDrawerOpen(false)}
        className="mb-1 flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-[#EEE3D1]/65 transition hover:bg-[#EEE3D1]/[0.04] hover:text-[#EEE3D1]"
      >
        <Icon
          size={19}
          strokeWidth={1.5}
        />

        {item.name}
      </Link>
    );
  })}
</nav>

            {/* CONVERSATIONS */}

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">

              {(
                [
                  "Today",
                  "Yesterday",
                  "Last 7 days",
                  "Older",
                ] as const
              ).map((group) => {

                const items = grouped[group];

                if (items.length === 0) {
                  return null;
                }

                return (
                  <section
                    key={group}
                    className="mb-6"
                  >

                    <p className="px-2 text-[10px] tracking-[0.15em] text-[#EEE3D1]/35">
                      {group}
                    </p>

                    <div className="mt-2">

                      {items.map(
                        (conversation) => (
                          <Link
                            key={
                              conversation.conversation_id
                            }
                            href={`/chat?conversation=${conversation.conversation_id}`}
                            onClick={() =>
                              setDrawerOpen(
                                false
                              )
                            }
                            className="block rounded-lg px-2.5 py-2.5 text-[13px] text-[#EEE3D1]/75 transition hover:bg-[#EEE3D1]/[0.04] hover:text-[#EEE3D1]"
                          >
                            {conversation.title}
                          </Link>
                        )
                      )}

                    </div>

                  </section>
                );
              })}

              {conversations.length === 0 && (
                <p className="px-2 py-4 text-xs text-[#EEE3D1]/30">
                  No conversations yet.
                </p>
              )}

            </div>

            {/* DRAWER FOOTER */}

            <div className="shrink-0 border-t border-[#EEE3D1]/10 px-4 py-4">

              <Link
                href="/settings"
                onClick={() =>
                  setDrawerOpen(false)
                }
                className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-[#EEE3D1]/65 hover:bg-[#EEE3D1]/[0.04] hover:text-[#EEE3D1]"
              >
                <Settings
                  size={18}
                  strokeWidth={1.5}
                />

                Settings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-[#EEE3D1]/65 hover:bg-[#EEE3D1]/[0.04] hover:text-[#EEE3D1]"
              >
                <LogOut
                  size={18}
                  strokeWidth={1.5}
                />

                Sign out
              </button>

            </div>

          </aside>

        </>
      )}
    </div>
  );
}