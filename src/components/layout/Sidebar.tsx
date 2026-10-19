"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import {
  MessageCircle,
  Database,
  Folder,
  Network,
  Settings,
  LogOut,
  PanelLeftClose,
  User,
  ChevronDown,
  Trash2,
  MoreHorizontal,
  UserRound,
  CircleHelp,
  Bug,
  Info,

} from "lucide-react";


import { useAuth } from "@/lib/auth/AuthProvider";
import {
  getConversations,
  getConversation,
  deleteConversation,
  type ConversationSummary,
} from "@/services/api/brainApi";
import { submitFeedback } from "@/services/api/feedbackApi";

import { useWorkspace } from "@/lib/workspace/WorkspaceContext";
import NotificationBell from "@/components/notifications/NotificationBell";
import {
  getPendingConversation,
  isConversationCompleted,
  subscribePendingConversations,
  clearCompletedConversation,
} from "@/lib/chat/pendingConversationStore";
import { useAuthModal } from "@/lib/auth/AuthModalContext";

const navigation = [
  {
    name: "New Chat",
    href: "/chat",
    icon: MessageCircle,
  },
  {
    name: "Memory",
    href: "/memory",
    icon: Database,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: Folder,
  },
   { name: "Capabilities", href: "/capabilities", icon: Network },
];

function parseConversationDate(
  updatedAt: string
) {
  const value = updatedAt.trim();

  if (!value) {
    return new Date(NaN);
  }

  const hasTimezone =
    /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);

  return new Date(
    hasTimezone
      ? value
      : `${value}Z`
  );
}

function formatConversationTime(updatedAt: string) {
  const date = parseConversationDate(updatedAt);
  const now = new Date();

  const sameDay =
    date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function getConversationGroup(updatedAt: string) {
  const date =
    parseConversationDate(updatedAt);

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(
    startOfYesterday.getDate() - 1
  );

  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(
    sevenDaysAgo.getDate() - 7
  );

  if (date >= startOfToday) {
    return "Today";
  }

  if (date >= startOfYesterday) {
    return "Yesterday";
  }

  if (date >= sevenDaysAgo) {
    return "Last 7 days";
  }

  return "Older";
}

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
  onWorkspaceClick?: () => void;
}

export default function Sidebar({
  onClose,
  isMobile = false,
  onWorkspaceClick,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
  token,
  logout,
  isAuthenticated,
  user,
} = useAuth();






const {
  openAuthModal,
} = useAuthModal();
  const { workspaceMode } = useWorkspace();

  const displayName =
  user?.full_name?.trim() ||
  user?.email?.split("@")[0] ||
  "Account";

const displayInitial =
  displayName.charAt(0).toUpperCase();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!profileOpen) return;

  function handleOutsideClick(event: PointerEvent) {
    const target = event.target as Node;

    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(target)
    ) {
      setProfileOpen(false);
    }
  }

  document.addEventListener(
    "pointerdown",
    handleOutsideClick
  );

  return () => {
    document.removeEventListener(
      "pointerdown",
      handleOutsideClick
    );
  };
}, [profileOpen]);

  const [signOutDialogOpen, setSignOutDialogOpen] =
  useState(false);

  const [signOutReason, setSignOutReason] =
  useState("");

  const [conversationMenuId, setConversationMenuId] =
    useState<string | null>(null);

  const longPressTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const longPressTriggered =
    useRef(false);

  const [conversations, setConversations] =
    useState<ConversationSummary[]>([]);

  const [deletingConversationId, setDeletingConversationId] =
    useState<string | null>(null);

  const activeConversationId =
    searchParams.get("conversation");
 
  const [, setPendingVersion] =
  useState(0);


 async function handleLogout() {
  const reason = signOutReason.trim();

  if (token && reason) {
    try {
      await submitFeedback(
        token,
        "sign_out",
        reason
      );
    } catch (error) {
      console.error(
        "Failed to submit sign-out feedback:",
        error
      );
    }
  }

  logout();
window.location.href = "/";

 }

function openSignOutDialog() {
  setProfileOpen(false);
  setSignOutReason("");
  setSignOutDialogOpen(true);
}

function cancelSignOut() {
  setSignOutDialogOpen(false);
  setSignOutReason("");
}


  
  async function handleDeleteConversation(
  conversationId: string
) {
  if (!token) {
    return;
  }

  try {
    setDeletingConversationId(conversationId);

    await deleteConversation(
      token,
      conversationId
    );

    setConversations((current) =>
      current.filter(
        (conversation) =>
          conversation.conversation_id !==
          conversationId
      )
    );

    setConversationMenuId(null);

    // If the deleted conversation is currently open,
    // leave it immediately instead of waiting for refresh.
    if (
      pathname === "/chat" &&
      activeConversationId === conversationId
    ) {
      router.push("/chat");
      onClose?.();
    }
  } catch (error) {
    console.error(
      "Failed to delete conversation:",
      error
    );
  } finally {
    setDeletingConversationId(null);
  }
}

  const workspaceLabel =
    workspaceMode === "private"
      ? "Private"
      : "Personal";

    function handleSettingsClick() {
  setProfileOpen(false);
  onClose?.();
}

  function handleConversationTouchStart(
    conversationId: string
  ) {
    if (!isMobile) {
      return;
    }

    longPressTriggered.current = false;

    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      setConversationMenuId(conversationId);
      longPressTimer.current = null;
    }, 500);
  }

  function handleConversationTouchEnd() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function handleConversationTouchMove() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

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


useEffect(() => {
  if (!token) return;

  async function refreshConversations() {
    try {
      const data = await getConversations(token!);
      setConversations(data);
    } catch (error) {
      console.error(
        "Failed to refresh conversations:",
        error
      );
    }
  }

  window.addEventListener(
    "ira:conversation-updated",
    refreshConversations
  );

  return () => {
    window.removeEventListener(
      "ira:conversation-updated",
      refreshConversations
    );
  };
}, [token]);


  useEffect(() => {
  return subscribePendingConversations(() => {
    if (!token) {
      return;
    }

    const accessToken = token;

    async function refreshConversations() {
      try {
        const data =
          await getConversations(accessToken);

        setConversations(data);
      } catch (error) {
        console.error(
          "Failed to refresh conversations:",
          error
        );
      }
    }

    refreshConversations();
  });
}, [token]);

  const visibleConversations =
  conversations;

const grouped = {
  Today: visibleConversations.filter(
    (conversation) =>
      getConversationGroup(
        conversation.updated_at
      ) === "Today"
  ),

    Yesterday: visibleConversations.filter(
      (conversation) =>
        getConversationGroup(
          conversation.updated_at
        ) === "Yesterday"
    ),

    "Last 7 days": visibleConversations.filter(
      (conversation) =>
        getConversationGroup(
          conversation.updated_at
        ) === "Last 7 days"
    ),

    Older: visibleConversations.filter(
      (conversation) =>
        getConversationGroup(
          conversation.updated_at
        ) === "Older"
    ),
  };

  function closeMenus() {
  setProfileOpen(false);
  setConversationMenuId(null);
}

  function handleNavigationClose() {
    closeMenus();
    onClose?.();
  }

  return (
    <aside
      className="
        flex
        h-[100dvh]
        w-full
        flex-col
        overflow-visible
        border-r
        border-[var(--border)]
        bg-[var(--background)]
        text-[var(--foreground)]
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="shrink-0 px-5 pt-5">
        {isMobile ? (
          /* MOBILE DRAWER HEADER */
          <div className="flex items-center justify-between">
            <div
              className="
                text-[15px]
                font-medium
                tracking-[0.22em]
                text-[var(--foreground)]
              "
            >
              IRABRAIN
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close sidebar"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-md
                  text-[var(--muted)]
                  transition
                  hover:bg-[var(--surface)]
                  hover:text-[var(--foreground)]
                "
              >
                <PanelLeftClose
                  size={19}
                  strokeWidth={1.5}
                />
              </button>
            )}
          </div>
        ) : (
          /* DESKTOP HEADER */
          <div
            className="
              flex
              h-11
              items-center
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
            "
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Collapse sidebar"
              className="
                flex
                h-full
                w-11
                shrink-0
                items-center
                justify-center
                rounded-l-xl
                text-[var(--muted)]
                transition
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--foreground)]
              "
            >
              <PanelLeftClose
                size={19}
                strokeWidth={1.5}
              />
            </button>

           <div
  className="
    flex
    h-full
    min-w-0
    flex-1
    items-center
  "
>
  <button
    type="button"
    onClick={onWorkspaceClick}
    aria-label="Open workspace menu"
    className="
      flex
      h-full
      min-w-0
      flex-1
      items-center
      gap-2
      px-2
      text-left
      text-[var(--foreground)]
    "
  >
    <span
      className="
        min-w-0
        flex-1
        truncate
        text-[14px]
        font-medium
      "
    >
      {workspaceLabel} workspace
    </span>

    <ChevronDown
      size={15}
      strokeWidth={1.5}
      className="
        shrink-0
        text-[var(--muted)]
      "
    />
  </button>

  <NotificationBell />
</div>



          </div>
        )}
      </div>

      {/* =====================================================
          MAIN NAVIGATION
      ===================================================== */}

      <nav className="mt-7 shrink-0 px-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const activeHref =
  item.name === "New Chat" && isAuthenticated
    ? "/chat"
    : item.href;

const active =
  pathname === activeHref ||
  (activeHref !== "/" &&
    pathname.startsWith(activeHref));
          

          return (
            <Link
              key={item.name}
              href={
    item.name === "Chat" && isAuthenticated
      ? "/chat"
      : item.href
  }
             onClick={(event) => {
  if (
    !isAuthenticated &&
    item.name !== "Chat"
  ) {
    event.preventDefault();
    openAuthModal();
    handleNavigationClose();
    return;
  }

  handleNavigationClose();
}}
              className={`
                relative
                mb-1
                flex
                h-11
                items-center
                gap-4
                rounded-md
                px-4
                text-[14px]
                transition


                ${
                  active
                    ? "bg-[var(--surface)] text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
                }
              `}
            >
              {active && (
                <span
                  className="
                    absolute
                    left-0
                    h-7
                    w-[2px]
                    rounded-full
                    bg-[var(--accent)]
                  "
                />
              )}

              <Icon
                size={19}
                strokeWidth={1.5}
              />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* =====================================================
          CONVERSATIONS
      ===================================================== */}

      <div
        className="
          mt-5
          flex
          min-h-0
          flex-1
          flex-col
          border-t
          border-[var(--border)]
          px-4
          pt-5
        "
      >
        <div
          className="
            shrink-0
            px-2
            text-[10px]
            tracking-[0.24em]
            text-[var(--muted)]
          "
        >
          CONVERSATIONS
        </div>

        <div
          className="
            mt-4
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            pr-1
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
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
              <div
                key={group}
                className="mb-5"
              >
                <div
                  className="
                    px-2
                    text-[11px]
                    text-[var(--muted)]
                  "
                >
                  {group}
                </div>

                <div className="mt-2 space-y-0.5">
                  {items.map(
                    (conversation) => {
                      const active =
                        pathname === "/chat" &&
                        activeConversationId ===
                          conversation.conversation_id;

                      return (





                        <div
                          key={conversation.conversation_id}
                          onTouchStart={() =>
                            handleConversationTouchStart(
                              conversation.conversation_id
                            )
                          }
                          onTouchEnd={handleConversationTouchEnd}
                          onTouchMove={handleConversationTouchMove}
                          onContextMenu={(event) => {
                            if (isMobile) {
                              event.preventDefault();
                            }
                          }}

                          className={`
                            group
                            relative
                            flex
                            items-center
                            rounded-md
                            px-2
                            py-2
                            text-[14px]
                            transition
                            ${
                              active
                                ? "bg-[var(--surface-soft)] text-[var(--foreground)]"
                                : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
                            }
                          `}
                        >
                          <Link
                            href={`/chat?conversation=${conversation.conversation_id}`}
                            onClick={async (event) => {
                      if (longPressTriggered.current) {
                      event.preventDefault();
                  event.stopPropagation();
                   longPressTriggered.current = false;
                      return;
  }


  if (token) {
  try {
    const updatedConversation = await getConversation(
      conversation.conversation_id,
      token
    );

    setConversations((current) => [
      updatedConversation,
      ...current.filter(
        (item) =>
          item.conversation_id !==
          updatedConversation.conversation_id
      ),
    ]);
  } catch (error) {
    console.error(
      "Failed to update conversation activity:",
      error
    );
  }
}
clearCompletedConversation(
  conversation.conversation_id
);

  handleNavigationClose();
}}


                            className="
                              flex
                              min-w-0
                              flex-1
                              items-center
                              gap-2
                            "
                          >
                            {getPendingConversation(
  conversation.conversation_id
) ? (
  <span
    className="
      flex
      h-5
      w-5
      shrink-0
      items-center
      justify-center
      rounded-full
      border
      border-[var(--border)]
    "
    aria-label="IRA is working"
  >
    <span className="flex items-center gap-[2px]">
      <span className="h-[3px] w-[3px] rounded-full bg-[var(--muted)] animate-pulse" />
      <span className="h-[3px] w-[3px] rounded-full bg-[var(--muted)] animate-pulse [animation-delay:150ms]" />
      <span className="h-[3px] w-[3px] rounded-full bg-[var(--muted)] animate-pulse [animation-delay:300ms]" />
    </span>
  </span>

) : isConversationCompleted(
    conversation.conversation_id
) ? (
  <span
    className="
      h-1.5
      w-1.5
      shrink-0
      rounded-full
      bg-[#8A0303]
    "
    aria-label="New IRA response"
  />
) : active ? (
  <span
    className="
      h-1.5
      w-1.5
      shrink-0
      rounded-full
      bg-[var(--accent)]
    "
  />
) : null}

                            <span className="truncate">
                              {conversation.title}
                            </span>
                          </Link>

                          <div className="ml-2 flex shrink-0 items-center">
                            <span
                              className="
                                mr-1
                                text-[10px]
                                text-[var(--muted)]
                                group-hover:hidden
                              "
                            >
                              {formatConversationTime(
                                conversation.updated_at
                              )}
                            </span>

                            <button
  type="button"
  aria-label={`Conversation options for ${conversation.title}`}
  onClick={(event) => {
    event.preventDefault();
    event.stopPropagation();

    setConversationMenuId((current) =>
      current === conversation.conversation_id
        ? null
        : conversation.conversation_id
    );
  }}
  className="
    flex
    h-7
    w-7
    shrink-0
    items-center
    justify-center
    rounded-md
    text-[var(--muted)]
    transition
    hover:bg-[var(--surface-hover)]
    hover:text-[var(--foreground)]
    md:group-hover:flex
    
  "
>
  <MoreHorizontal
    size={16}
    strokeWidth={1.5}
  />
</button>

                            {conversationMenuId ===
                              conversation.conversation_id && (
                              <div
                                className="
                                  absolute
                                  right-2
                                  top-full
                                  z-[100]
                                  mt-1
                                  w-32
                                  overflow-hidden
                                  rounded-lg
                                  border
                                  border-[var(--border)]
                                  bg-[var(--surface)]
                                  shadow-[0_16px_40px_rgba(0,0,0,0.45)]
                                "
                              >
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();

                                    setConversationMenuId(null);
                                    handleDeleteConversation(
                                      conversation.conversation_id
                                    );
                                  }}
                                  disabled={
                                    deletingConversationId ===
                                    conversation.conversation_id
                                  }
                                  className="
                                    flex
                                    h-9
                                    w-full
                                    items-center
                                    gap-2
                                    px-3
                                    text-left
                                    text-[12px]
                                    text-[var(--muted)]
                                    transition
                                    hover:bg-[var(--surface-hover)]
                                    hover:text-[var(--foreground)]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                  "
                                >
                                  <Trash2
                                    size={14}
                                    strokeWidth={1.5}
                                  />

                                  {deletingConversationId ===
                                  conversation.conversation_id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}

          {conversations.length === 0 && (
            <p
              className="
                px-2
                py-3
                text-xs
                text-[var(--muted)]
              "
            >
              No conversations yet.
            </p>
          )}
        </div>
      </div>

      

      {/* =====================================================
    ACCOUNT
===================================================== */}

<div
  ref={profileMenuRef}
  className="
    absolute
    bottom-0
    left-0
    right-0
    z-20
    px-4
    pb-5
"
>
  {/* ===================================================
      ACCOUNT DROPDOWN
  =================================================== */}

  {profileOpen && (
    <div
      className="
        absolute
        bottom-[calc(100%+8px)]
        left-0
        right-0
        z-[10000]
        overflow-hidden
        rounded-xl
        border
        border-[var(--border)]
        bg-[var(--surface)]
        shadow-[0_24px_70px_rgba(0,0,0,0.65)]
      "
    >
      <div
        className="
          border-b
          border-[var(--border)]
          px-4
          py-4
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[var(--border)]
              bg-[var(--background)]
              text-sm
              font-medium
            "
          >
            A
          </div>

          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium">
              {displayName}
            </p>

            <p className="mt-0.5 text-[12px] text-[var(--muted)]">
              {workspaceLabel}
            </p>
          </div>
        </div>
      </div>

     <div className="bg-[var(--surface)] p-2">
  
  
  
  
  <button
  type="button"
  onClick={() => {
    setProfileOpen(false);
    router.push("/profile");
    onClose?.();
  }}
  className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[14px] text-[#EEE3D1]/80 transition hover:bg-[#EEE3D1]/[0.07] hover:text-[#EEE3D1]"
>
  <UserRound
    size={17}
    strokeWidth={1.5}
    className="shrink-0 text-[#EEE3D1]/50"
  />

  Profile
</button>

<Link
  href="/settings"
  onClick={handleSettingsClick}
  className="flex h-11 items-center gap-3 rounded-xl px-3 text-[14px] text-[#EEE3D1]/80 transition hover:bg-[#EEE3D1]/[0.07] hover:text-[#EEE3D1]"
>
  <Settings
    size={17}
    strokeWidth={1.5}
    className="shrink-0 text-[#EEE3D1]/50"
  />

  Settings
</Link>

<Link
  href="/help"
  onClick={() => {
    setProfileOpen(false);
    onClose?.();
  }}
  className="flex h-11 items-center gap-3 rounded-xl px-3 text-[14px] text-[#EEE3D1]/80 transition hover:bg-[#EEE3D1]/[0.07] hover:text-[#EEE3D1]"
>
  <CircleHelp
    size={17}
    strokeWidth={1.5}
    className="shrink-0 text-[#EEE3D1]/50"
  />

  Help & Support
</Link>

<Link
  href="/bug-report"
  onClick={() => {
    setProfileOpen(false);
    onClose?.();
  }}
  className="flex h-11 items-center gap-3 rounded-xl px-3 text-[14px] text-[#EEE3D1]/80 transition hover:bg-[#EEE3D1]/[0.07] hover:text-[#EEE3D1]"
>
  <Bug
    size={17}
    strokeWidth={1.5}
    className="shrink-0 text-[#EEE3D1]/50"
  />

  Bug Report
</Link>

<Link
  href="/about"
  onClick={() => {
    setProfileOpen(false);
    onClose?.();
  }}
  className="flex h-11 items-center gap-3 rounded-xl px-3 text-[14px] text-[#EEE3D1]/80 transition hover:bg-[#EEE3D1]/[0.07] hover:text-[#EEE3D1]"
>
  <Info
    size={17}
    strokeWidth={1.5}
    className="shrink-0 text-[#EEE3D1]/50"
  />

  About IRABRAIN
</Link>

<div className="my-1 border-t border-[#EEE3D1]/10" />

<button
  type="button"
  onClick={openSignOutDialog}
  className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[14px] text-[#EEE3D1]/60 transition hover:bg-[#EEE3D1]/[0.07] hover:text-[#EEE3D1]"
>
  <LogOut
    size={17}
    strokeWidth={1.5}
    className="shrink-0 text-[#EEE3D1]/45"
  />

  Sign out
</button>



</div>
     
    </div>
  )}

  {/* ===================================================
      PROFILE BUTTON
  =================================================== */}

  <button
    type="button"


   onClick={() => {
  if (!isAuthenticated) {
    setProfileOpen(false);
    openAuthModal();
    onClose?.();
    return;
  }

  setProfileOpen((open) => !open);
}}


    aria-label="Open account menu"
    aria-expanded={profileOpen}
    className="
      flex
      w-full
      items-center
      gap-3
      rounded-xl
      border
      border-[var(--border)]
      bg-[var(--surface)]
      px-4
      py-3
      text-left
      transition
      hover:bg-[var(--surface-hover)]
    "
  >
    {/* AVATAR */}

    <div
      className="
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        border-[var(--border)]
        bg-[var(--background)]
        text-xs
        font-medium
      "
    >
      {displayInitial}
    </div>

    {/* IDENTITY */}

    <div className="min-w-0 flex-1">
      <p
        className="
          truncate
          text-[13px]
          font-medium
          text-[var(--foreground)]
        "
      >
        {displayName}
      </p>

      <p
        className="
          mt-0.5
          text-[11px]
          text-[var(--muted)]
        "
      >
        {workspaceLabel}
      </p>
    </div>
  </button>
</div>

{signOutDialogOpen &&
  typeof document !== "undefined" &&
  createPortal(
  <div
    className="
      fixed
      inset-0
      z-[500]
      flex
      items-center
      justify-center
      bg-black/60
      px-5
      backdrop-blur-sm
    "
  >
    <div
      className="
        w-full
        max-w-md
        overflow-hidden
        rounded-2xl
        border
        border-[var(--border)]
        bg-[var(--surface)]
        shadow-[0_24px_80px_rgba(0,0,0,0.65)]
      "
    >
      <div className="px-6 pt-6">
        <h2
          className="
            text-lg
            font-medium
            text-[var(--foreground)]
          "
        >
          Before you go
        </h2>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-[var(--muted)]
          "
        >
          What made you want to sign out of
          your IRABRAIN?
        </p>
      </div>

      <div className="px-6 pt-5">
        <textarea
          value={signOutReason}
          onChange={(event) =>
            setSignOutReason(event.target.value)
          }
          placeholder="Tell us what you think..."
          rows={4}
          className="
            w-full
            resize-none
            rounded-xl
            border
            border-[var(--border)]
            bg-[var(--background)]
            px-4
            py-3
            text-sm
            text-[var(--foreground)]
            outline-none
            placeholder:text-[var(--muted)]
            focus:border-[var(--accent)]
          "
        />
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-5">
        <button
          type="button"
          onClick={cancelSignOut}
          className="
            rounded-lg
            px-4
            py-2.5
            text-sm
            text-[var(--muted)]
            transition
            hover:bg-[var(--surface-soft)]
            hover:text-[var(--foreground)]
          "
        >
          Cancel
        </button>

        {signOutReason.trim().length > 0 && (
          <button
            type="button"
            onClick={handleLogout}
            className="
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--surface-soft)]
              px-4
              py-2.5
              text-sm
              text-[var(--foreground)]
              transition
              hover:bg-[var(--surface-hover)]
            "
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  </div>,
  document.body
)}

    </aside>
  );
}