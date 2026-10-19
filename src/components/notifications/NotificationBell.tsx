"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/AuthProvider";
import { getUnreadNotificationCount } from "@/services/api/notificationApi";

export default function NotificationBell() {
  const router = useRouter();
  const { token } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
  if (!token) {
    setUnreadCount(0);
    return;
  }

  let cancelled = false;

  async function loadUnreadCount() {
    try {
      const count = await getUnreadNotificationCount(token!);

      if (!cancelled) {
        setUnreadCount(count);
      }
    } catch (error) {
      console.error(
        "Failed to load unread notifications:",
        error
      );
    }
  }

  loadUnreadCount();

  const interval = window.setInterval(
    loadUnreadCount,
    30000
  );

  function handleVisibilityChange() {
    if (document.visibilityState === "visible") {
      loadUnreadCount();
    }
  }

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  return () => {
    cancelled = true;
    window.clearInterval(interval);
    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
  };
}, [token]);






  if (unreadCount === 0) {
  return null;
}





  return (
    <button
      type="button"
      aria-label={
        unreadCount > 0
          ? `${unreadCount} unread notifications`
          : "Notifications"
      }
      onClick={() => router.push("/profile/notifications")}
      className="
        relative
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-lg
        text-[var(--muted)]
        transition
        hover:bg-[var(--surface-soft)]
        hover:text-[var(--foreground)]
      "
    >
      <Bell
        size={17}
        strokeWidth={1.5}
      />

      {unreadCount > 0 && (
        <span
          aria-hidden="true"
          className="
            absolute
            right-1.5
            top-1.5
            h-1.5
            w-1.5
            rounded-full
            bg-[var(--accent)]
          "
        />
      )}
    </button>
  );
}