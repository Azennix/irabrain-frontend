"use client";

import {  useEffect,useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  Check,
  ChevronDown,
  Menu,
  PanelLeftOpen,
  Plus,
  UserRound,
  X,
} from "lucide-react";

import Sidebar from "./Sidebar";

import { useAuth } from "@/lib/auth/AuthProvider";

import {
  createConversation,
  
} from "@/services/api/brainApi";

import OverlayBackdrop from "@/components/ui/OverlayBackdrop";

import {
  useWorkspace,
} from "@/lib/workspace/WorkspaceContext";

import NotificationBell from "@/components/notifications/NotificationBell";
import IRAAuth from "@/components/auth/IRAAuth";
import { useAuthModal } from "@/lib/auth/AuthModalContext";



function IncognitoIcon({
  size = 19,
  strokeWidth = 1.5,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Hat */}
      <path
        d="M6 10.5L8.2 6H15.8L18 10.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Hat brim */}
      <path
        d="M4 10.5H20"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Left lens */}
      <circle
        cx="8.5"
        cy="14"
        r="2.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />

      {/* Right lens */}
      <circle
        cx="15.5"
        cy="14"
        r="2.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />

      {/* Bridge */}
      <path
        d="M11 14H13"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [mobileDrawerX, setMobileDrawerX] =
    useState(-336);

  const [
    isMobileDrawerDragging,
    setIsMobileDrawerDragging,
  ] = useState(false);

  const [workspaceMenuOpen, setWorkspaceMenuOpen] =
    useState(false);

  const touchStartX =
    useRef<number | null>(null);

  const touchStartY =
    useRef<number | null>(null);

  const router = useRouter();

  const pathname = usePathname();

  const showWorkspaceText =
  pathname === "/" || pathname === "/chat";

  const {
  token,
  logout,
  isAuthenticated,
} = useAuth();



const {
  openAuthModal,
} = useAuthModal();
  const {
  authModalOpen,
  closeAuthModal,
} = useAuthModal();

  const {
    workspaceMode,
    setWorkspaceMode,
  } = useWorkspace();

  const MIN_SIDEBAR_WIDTH = 220;
const DEFAULT_SIDEBAR_WIDTH = 336;
const MAX_SIDEBAR_WIDTH = 480;

const [sidebarWidth, setSidebarWidth] = useState<number>(
  DEFAULT_SIDEBAR_WIDTH
);

const [sidebarWidthLoaded, setSidebarWidthLoaded] = useState(false);

const resizingRef = useRef(false);

useEffect(() => {
  try {
    const savedWidth = window.localStorage.getItem(
      "irabrain-sidebar-width"
    );

    if (savedWidth !== null) {
      const parsedWidth = Number(savedWidth);

      if (Number.isFinite(parsedWidth)) {
        const clampedWidth = Math.min(
          MAX_SIDEBAR_WIDTH,
          Math.max(MIN_SIDEBAR_WIDTH, parsedWidth)
        );

        setSidebarWidth(clampedWidth);
      }
    }
  } catch (error) {
    console.error("Failed to restore sidebar width:", error);
  } finally {
    setSidebarWidthLoaded(true);
  }
}, []);

useEffect(() => {
  if (!sidebarWidthLoaded) {
    return;
  }

  try {
    window.localStorage.setItem(
      "irabrain-sidebar-width",
      String(sidebarWidth)
    );
  } catch (error) {
    console.error("Failed to save sidebar width:", error);
  }
}, [sidebarWidth, sidebarWidthLoaded]);

  /* =====================================================
     MOBILE DRAWER — TOUCH START
  ===================================================== */

  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    if (window.innerWidth >= 768) {
      return;
    }

    if (workspaceMenuOpen) {
      return;
    }

    const touch = event.touches[0];

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;

    setIsMobileDrawerDragging(true);
  }
  



  /* =====================================================
     MOBILE DRAWER — TOUCH MOVE
  ===================================================== */

  function handleTouchMove(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    if (
      window.innerWidth >= 768 ||
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const touch = event.touches[0];

    const deltaX =
      touch.clientX - touchStartX.current;

    const deltaY =
      touch.clientY - touchStartY.current;

    if (
      Math.abs(deltaY) >
      Math.abs(deltaX)
    ) {
      return;
    }

    const drawerWidth = Math.min(
      336,
      window.innerWidth * 0.88
    );

    if (!mobileSidebarOpen) {
      const nextX = Math.min(
        drawerWidth,
        Math.max(0, deltaX)
      );

      setMobileDrawerX(
        -drawerWidth + nextX
      );

      return;
    }

    const nextX = Math.max(
      -drawerWidth,
      Math.min(0, deltaX)
    );

    setMobileDrawerX(nextX);
  }


  function handleSidebarResizeStart(
  event: React.PointerEvent<HTMLDivElement>
) {
  if (window.innerWidth < 768) return;

  event.preventDefault();

  resizingRef.current = true;
  event.currentTarget.setPointerCapture(event.pointerId);

  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
}

function handleSidebarResizeMove(
  event: React.PointerEvent<HTMLDivElement>
) {
  if (!resizingRef.current) return;

  const nextWidth = Math.min(
    MAX_SIDEBAR_WIDTH,
    Math.max(MIN_SIDEBAR_WIDTH, event.clientX)
  );

  setSidebarWidth(nextWidth);
}

function handleSidebarResizeEnd(
  event: React.PointerEvent<HTMLDivElement>
) {
  if (!resizingRef.current) return;

  resizingRef.current = false;

  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  document.body.style.cursor = "";
  document.body.style.userSelect = "";
}

  /* =====================================================
     MOBILE DRAWER — TOUCH END
  ===================================================== */

  function handleTouchEnd(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    if (
      window.innerWidth >= 768 ||
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const touch = event.changedTouches[0];

    const deltaX =
      touch.clientX - touchStartX.current;

    const deltaY =
      touch.clientY - touchStartY.current;

    const drawerWidth = Math.min(
      336,
      window.innerWidth * 0.88
    );

    touchStartX.current = null;
    touchStartY.current = null;

    setIsMobileDrawerDragging(false);

    if (
      Math.abs(deltaY) >
      Math.abs(deltaX)
    ) {
      setMobileDrawerX(
        mobileSidebarOpen
          ? 0
          : -drawerWidth
      );

      return;
    }

    const SWIPE_THRESHOLD = 60;

    if (!mobileSidebarOpen) {
      if (deltaX > SWIPE_THRESHOLD) {
        setMobileSidebarOpen(true);
        setMobileDrawerX(0);
      } else {
        setMobileDrawerX(-drawerWidth);
      }

      return;
    }

    if (deltaX < -SWIPE_THRESHOLD) {
      setMobileSidebarOpen(false);
      setMobileDrawerX(-drawerWidth);
    } else {
      setMobileDrawerX(0);
    }
  }

  /* =====================================================
     NEW CONVERSATION
  ===================================================== */

  async function handleNewConversation() {
    if (isPrivate) {
  window.location.href = "/chat/private";
  return;
}
    if (!token) {
      return;
    }

    try {
      const conversation =
        await createConversation(
          token,
          "New Conversation"
        );

      router.push(
        `/chat?conversation=${encodeURIComponent(
          conversation.conversation_id
        )}`
      );
    } catch (error) {
      console.error(
        "Failed to create conversation:",
        error
      );
    }
  }

  /* =====================================================
     CLOSE MOBILE SIDEBAR
  ===================================================== */

  function closeMobileSidebar() {
    const drawerWidth = Math.min(
      336,
      window.innerWidth * 0.88
    );

    setMobileSidebarOpen(false);
    setMobileDrawerX(-drawerWidth);
  }

  /* =====================================================
     WORKSPACE HELPERS
  ===================================================== */

  const isPersonal =
    workspaceMode === "personal";

  const isPrivate =
    workspaceMode === "private";

  function handleWorkspaceClick() {
  if (!isAuthenticated) {
    setWorkspaceMenuOpen(false);
    openAuthModal();
    return;
  }

  setWorkspaceMenuOpen(
    (open) => !open
  );
}

  function selectPersonalWorkspace() {
  setWorkspaceMode("personal");
  setWorkspaceMenuOpen(false);

  if (pathname !== "/chat") {
    router.push("/chat");
  }
}

  function selectPrivateWorkspace() {
  setWorkspaceMode("private");
  setWorkspaceMenuOpen(false);

  if (pathname !== "/chat/private") {
    router.push("/chat/private");
  }
}

  return (
    <div
      className="
        min-h-screen
        overflow-x-hidden
        bg-[var(--background)]
        text-[var(--foreground)]
      "
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >

      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      {sidebarOpen && (
  <aside
    className="
      fixed inset-y-0 left-0 z-50
      hidden md:block
    "
    style={{ width: `${sidebarWidth}px` }}
  >
    <Suspense fallback={<div className="h-full w-full bg-[var(--background)]" />}>
  <Sidebar
    isMobile={false}
    onClose={() => setSidebarOpen(false)}
    onWorkspaceClick={handleWorkspaceClick}
  />
</Suspense>

    <div
      role="separator"
      aria-label="Resize sidebar"
      aria-orientation="vertical"
      aria-valuemin={MIN_SIDEBAR_WIDTH}
      aria-valuemax={MAX_SIDEBAR_WIDTH}
      aria-valuenow={sidebarWidth}
      tabIndex={0}
      onPointerDown={handleSidebarResizeStart}
      onPointerMove={handleSidebarResizeMove}
      onPointerUp={handleSidebarResizeEnd}
      onPointerCancel={handleSidebarResizeEnd}
      onDoubleClick={() =>
        setSidebarWidth(DEFAULT_SIDEBAR_WIDTH)
      }
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          setSidebarWidth((width) =>
            Math.max(MIN_SIDEBAR_WIDTH, width - 16)
          );
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          setSidebarWidth((width) =>
            Math.min(MAX_SIDEBAR_WIDTH, width + 16)
          );
        }
      }}
      className="
        absolute right-0 top-0 z-[60]
        h-full w-2 -translate-x-1/2
        cursor-col-resize touch-none
        flex items-center justify-center
        outline-none
      "
    >
      <span
        className="
          h-full w-px
          bg-transparent
          transition-colors duration-200
          hover:bg-[var(--border)]
          focus-visible:bg-[var(--border)]
        "
      />
    </div>
  </aside>
)}

      {/* =====================================================
          DESKTOP SIDEBAR OPEN BUTTON
      ===================================================== */}

      {!sidebarOpen && (
        <button
          type="button"
          onClick={() =>
            setSidebarOpen(true)
          }
          aria-label="Open sidebar"
          className="
            fixed
            left-4
            top-4
            z-50
            hidden
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            border
            border-[var(--border)]
            bg-[var(--surface)]
            text-[var(--muted)]
            transition
            hover:bg-[var(--surface-soft)]
            hover:text-[var(--foreground)]
            md:flex
          "
        >
          <PanelLeftOpen
            size={20}
            strokeWidth={1.5}
          />
        </button>
      )}

      {/* =====================================================
          DESKTOP WORKSPACE OVERLAY
      ===================================================== */}

      {workspaceMenuOpen && (
        <div
          className="
            fixed
            inset-0
            z-[90]
            hidden
            bg-black/55
            md:block
          "
          onClick={() =>
            setWorkspaceMenuOpen(false)
          }
        />
      )}

      {/* =====================================================
          DESKTOP WORKSPACE MENU
      ===================================================== */}

      {workspaceMenuOpen && (
        <div
          className="
            fixed
            left-5
            top-[68px]
            z-[100]
            hidden
            w-[300px]
            overflow-hidden
            rounded-xl
            border
            border-[var(--border)]
            bg-[var(--surface)]
            shadow-[0_24px_70px_rgba(0,0,0,0.65)]
            md:block
          "
        >
          {/* HEADER */}

          <div
            className="
              border-b
              border-[var(--border)]
              px-4
              py-3
            "
          >
            <div
              className="
                text-[10px]
                tracking-[0.18em]
                text-[var(--muted)]
              "
            >
              CHOOSE WORKSPACE
            </div>
          </div>

          <div className="p-2">

            {/* PERSONAL SPACE */}

            <button
              type="button"
              onClick={selectPersonalWorkspace}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-left
                transition
                hover:bg-[var(--surface-soft)]
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[var(--border)]
                  text-[var(--foreground)]
                "
              >
                <UserRound
                  size={19}
                  strokeWidth={1.5}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className="
                    text-[13px]
                    font-medium
                    text-[var(--foreground)]
                  "
                >
                  Personal Space
                </div>

                <div
                  className="
                    mt-0.5
                    text-[11px]
                    leading-4
                    text-[var(--muted)]
                  "
                >
                  Saved to your memory.
                </div>
              </div>

              {isPersonal && (
                <Check
                  size={17}
                  strokeWidth={1.6}
                  className="shrink-0"
                />
              )}
            </button>

            {/* PRIVATE SPACE */}

            <button
              type="button"
              onClick={selectPrivateWorkspace}
              className="
                mt-1
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-left
                transition
                hover:bg-[var(--surface-soft)]
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[var(--border)]
                  text-[var(--foreground)]
                "
              >
                <IncognitoIcon
                  size={19}
                  strokeWidth={1.5}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className="
                    text-[13px]
                    font-medium
                    text-[var(--foreground)]
                  "
                >
                  Private Space
                </div>

                <div
                  className="
                    mt-0.5
                    text-[11px]
                    leading-4
                    text-[var(--muted)]
                  "
                >
                  Temporary chat. Not stored
                  in memory.
                </div>
              </div>

              {isPrivate && (
                <Check
                  size={17}
                  strokeWidth={1.6}
                  className="shrink-0"
                />
              )}
            </button>

          </div>
        </div>
      )}

      {/* =====================================================
          MOBILE FLOATING HEADER
      ===================================================== */}

      <div
        className="
          fixed
          left-0
          right-0
          top-3
          z-[100]
          flex
          items-center
          justify-between
          px-3
          md:hidden
        "
      >
        {/* WORKSPACE CONTROL */}

        <div className="relative">
  <div
    className="
      flex
      h-11
      items-center
      rounded-xl
      border
      border-[var(--border)]
      bg-[var(--surface)]
      text-[var(--foreground)]
    "
  >
    <button
      type="button"
      onClick={() => {
        setMobileSidebarOpen(true);
        setMobileDrawerX(0);
      }}
      aria-label="Open sidebar"
      className="
        flex
        h-full
        w-11
        shrink-0
        items-center
        justify-center
        rounded-l-xl
        transition
        hover:bg-[var(--surface-soft)]
      "
    >
      <Menu
        size={21}
        strokeWidth={1.7}
      />
    </button>

    <button
      type="button"

      onClick={handleWorkspaceClick}
      aria-label="Open workspace menu"
      className={`
        flex
        h-full
        items-center
        ${showWorkspaceText
          ? "min-w-0 flex-1 gap-2 pr-2"
          : "w-10 shrink-0 justify-center"
        }
      `}
    >
      {showWorkspaceText ? (
        <>
          <span
            className="
              min-w-0
              max-w-[180px]
              truncate
              text-[14px]
              font-medium
            "
          >
            {isPrivate
              ? "Private Space"
              : "Personal workspace"}
          </span>

          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className="shrink-0 text-[var(--muted)]"
          />
        </>
      ) : (
        <>
          {isPrivate ? (
  <IncognitoIcon
    size={19}
    strokeWidth={1.5}
  />
) : (
  <UserRound
    size={19}
    strokeWidth={1.5}
  />
)}

          <ChevronDown
            size={15}
            strokeWidth={1.5}
            className="text-[var(--muted)]"
          />
        </>
      )}
    </button>

    <NotificationBell />
  </div>
</div>

        {/* NEW CONVERSATION */}

        <button
          type="button"
          aria-label="New conversation"
          onClick={handleNewConversation}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-[var(--border)]
            bg-[var(--surface)]
            text-[var(--foreground)]
            transition
            hover:bg-[var(--surface-soft)]
          "
        >
          <Plus
            size={21}
            strokeWidth={1.7}
          />
        </button>
      </div>

      {/* =====================================================
          MOBILE WORKSPACE BACKDROP
      ===================================================== */}

      {workspaceMenuOpen && (
        <OverlayBackdrop
          onClick={() =>
            setWorkspaceMenuOpen(false)
          }
          zIndex={200}
          className="md:hidden"
        />
      )}

      {/* =====================================================
          MOBILE WORKSPACE MENU
      ===================================================== */}

      {workspaceMenuOpen && (
        <div
          className="
            fixed
            left-3
            right-3
            top-[68px]
            z-[220]
            md:hidden
          "
        >
          <div
            className="
              w-full
              overflow-hidden
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--foreground)]
              shadow-[0_24px_70px_rgba(0,0,0,0.65)]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[var(--border)]
                px-4
                py-3
              "
            >
              <div
                className="
                  text-[10px]
                  tracking-[0.16em]
                  text-[var(--muted)]
                "
              >
                CHOOSE WORKSPACE
              </div>

              <button
                type="button"
                aria-label="Close workspace menu"
                onClick={() =>
                  setWorkspaceMenuOpen(false)
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-md
                  text-[var(--muted)]
                  transition
                  hover:bg-[var(--surface-soft)]
                  hover:text-[var(--foreground)]
                "
              >
                <X
                  size={17}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {/* OPTIONS */}

            <div className="p-2">

              {/* PRIVATE SPACE */}

              <button
                type="button"
                onClick={selectPrivateWorkspace}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-left
                  transition
                  hover:bg-[var(--surface-soft)]
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-[var(--border)]
                  "
                >
                  <IncognitoIcon
                    size={19}
                    strokeWidth={1.5}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className="
                      text-[13px]
                      font-medium
                    "
                  >
                    Private Space
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[11px]
                      leading-4
                      text-[var(--muted)]
                    "
                  >
                    Temporary chat. Not stored
                    in memory.
                  </div>
                </div>

                {isPrivate && (
                  <Check
                    size={17}
                    strokeWidth={1.6}
                    className="shrink-0"
                  />
                )}
              </button>

              {/* PERSONAL SPACE */}

              <button
                type="button"
                onClick={selectPersonalWorkspace}
                className="
                  mt-1
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-left
                  transition
                  hover:bg-[var(--surface-soft)]
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-[var(--border)]
                  "
                >
                  <UserRound
                    size={19}
                    strokeWidth={1.5}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className="
                      text-[13px]
                      font-medium
                    "
                  >
                    Personal Space
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[11px]
                      leading-4
                      text-[var(--muted)]
                    "
                  >
                    Saved to your memory.
                  </div>
                </div>

                {isPersonal && (
                  <Check
                    size={17}
                    strokeWidth={1.6}
                    className="shrink-0"
                  />
                )}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MOBILE SIDEBAR DRAWER
      ===================================================== */}

      <div
        className="
          fixed
          inset-y-0
          left-0
          z-[110]
          md:hidden
        "
        style={{
          width: "min(336px, 88vw)",
          transform: `translateX(${mobileDrawerX}px)`,
          transition:
            isMobileDrawerDragging
              ? "none"
              : "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
          touchAction: "pan-y",
        }}
      >
        <Suspense fallback={<div className="h-full w-full bg-[var(--background)]" />}>
  <Sidebar
    isMobile={true}
    onClose={closeMobileSidebar}
  />
</Suspense>
      </div>

      {mobileSidebarOpen && (
        <OverlayBackdrop
          onClick={closeMobileSidebar}
          zIndex={105}
          className="md:hidden"
        />
      )}

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      {!isAuthenticated && (
  <button
    type="button"
    onClick={openAuthModal}
    className="
  fixed
  right-5
  top-5
  z-[120]
  rounded-lg
  bg-[#EEE3D1]
  px-4
  py-2
  text-[13px]
  font-medium
  text-black
  transition
  hover:bg-[#EEE3D1]/90
"
  >
    Log in
  </button>
)}
    
      <main
        className="
          min-h-0
          min-w-0
          overflow-x-hidden
          transition-[margin]
          duration-150
          md:ml-[var(--irabrain-sidebar-width)]
        "
        style={{
          "--irabrain-sidebar-width": sidebarOpen
            ? `${sidebarWidth}px`
            : "0px",
        } as React.CSSProperties}
      >
  <div className="w-full min-w-0">
    {children}
  </div>
</main>
      {authModalOpen && (
  <div className="fixed inset-0 z-[500] flex items-center justify-center px-4">
    <button
      type="button"
      aria-label="Close authentication"
      onClick={closeAuthModal}
      className="absolute inset-0 bg-black/55 backdrop-blur-md"
    />

    <div className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-2xl border border-[#EEE3D1]/10 bg-[#171716] px-7 py-8 shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
      <IRAAuth />
    </div>
  </div>
)}

    </div>
  );
}