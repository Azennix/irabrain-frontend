"use client";

import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationItem,
} from "@/services/api/notificationApi";

export default function NotificationsPage() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);


  useEffect(() => {
    if (!token || !user) return;

    async function loadNotifications() {
      try {
        setLoading(true);
        setError(null);

        const data = await getNotifications(token!);
        setNotifications(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load notifications."
        );
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [token, user]);

  async function handleMarkAsRead(
    notificationId: number
  ) {
    if (!token) return;

    try {
      await markNotificationAsRead(token, notificationId);

      setNotifications((current) =>
        current.map((notification) =>
          notification.notification_id === notificationId
            ? {
                ...notification,
                is_read: true,
                read_at: new Date().toISOString(),
              }
            : notification
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to mark notification as read."
      );
    }
  }

  async function handleMarkAllAsRead() {
    if (!token || markingAll) return;

    try {
      setMarkingAll(true);
      setError(null);

      await markAllNotificationsAsRead(token);

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
          read_at:
            notification.read_at ??
            new Date().toISOString(),
        }))
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to mark notifications as read."
      );
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleDelete(notificationId: number) {
    if (!token) return;

    try {
      await deleteNotification(token, notificationId);

      setNotifications((current) =>
        current.filter(
          (notification) =>
            notification.notification_id !== notificationId
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete notification."
      );
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <MainLayout>
      <main className="min-h-full px-5 pb-10 pt-28 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-3xl">

          {/* HEADER */}
          <div className="mb-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-lg
                text-[var(--muted)]
                transition
                hover:bg-[var(--surface-soft)]
                hover:text-[var(--foreground)]
              "
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-medium text-[var(--foreground)]">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Stay up to date with activity from IRABRAIN.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                className="
                  flex shrink-0 items-center gap-2
                  rounded-lg
                  px-3 py-2
                  text-xs
                  text-[var(--muted)]
                  transition
                  hover:bg-[var(--surface-soft)]
                  hover:text-[var(--foreground)]
                  disabled:opacity-50
                "
              >
                <CheckCheck
                  size={15}
                  strokeWidth={1.5}
                />
                <span className="hidden sm:inline">
                  Mark all read
                </span>
              </button>
            )}
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="
                mb-4 rounded-xl
                border border-[var(--border)]
                bg-[var(--surface)]
                px-4 py-3
                text-sm text-[var(--muted)]
              "
            >
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <section
              className="
                rounded-2xl
                border border-[var(--border)]
                bg-[var(--surface)]
                px-5 py-10
                text-center
              "
            >
              <p className="text-sm text-[var(--muted)]">
                Loading notifications...
              </p>
            </section>
          ) : notifications.length === 0 ? (
            /* EMPTY STATE */
            <section
              className="
                rounded-2xl
                border border-[var(--border)]
                bg-[var(--surface)]
                px-5 py-12
                text-center
              "
            >
              <div
                className="
                  mx-auto mb-4
                  flex h-10 w-10
                  items-center justify-center
                  rounded-lg
                  bg-[var(--surface-soft)]
                  text-[var(--muted)]
                "
              >
                <Bell size={18} strokeWidth={1.5} />
              </div>

              <p className="text-sm text-[var(--foreground)]">
                No notifications
              </p>

              <p className="mt-1 text-xs text-[var(--muted)]">
                You&apos;re all caught up.
              </p>
            </section>
          ) : (
            /* NOTIFICATIONS */
            <section
              className="
                overflow-hidden
                rounded-2xl
                border border-[var(--border)]
                bg-[var(--surface)]
              "
            >
              {notifications.map((notification, index) => (
                <div
                  key={notification.notification_id}
                  className={`
                    flex items-start gap-4 px-5 py-5
                    ${
                      index !== notifications.length - 1
                        ? "border-b border-[var(--border)]"
                        : ""
                    }
                  `}
                >
                  <div
                    className="
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-lg
                      bg-[var(--surface-soft)]
                      text-[var(--foreground)]
                    "
                  >
                    <Bell size={18} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p
                        className={`text-sm ${
                          notification.is_read
                            ? "text-[var(--foreground)]"
                            : "font-medium text-[var(--foreground)]"
                        }`}
                      >
                        {notification.title}
                      </p>

                      {!notification.is_read && (
                        <span
                          className="
                            mt-1.5 h-1.5 w-1.5
                            shrink-0 rounded-full
                            bg-[var(--accent)]
                          "
                        />
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-[var(--muted)]">
                      {new Date(
                        notification.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {!notification.is_read && (
                      <button
                        type="button"
                        onClick={() =>
                          handleMarkAsRead(
                            notification.notification_id
                          )
                        }
                        aria-label="Mark as read"
                        className="
                          flex h-8 w-8
                          items-center justify-center
                          rounded-lg
                          text-[var(--muted)]
                          transition
                          hover:bg-[var(--surface-soft)]
                          hover:text-[var(--foreground)]
                        "
                      >
                        <Check
                          size={16}
                          strokeWidth={1.5}
                        />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          notification.notification_id
                        )
                      }
                      aria-label="Delete notification"
                      className="
                        flex h-8 w-8
                        items-center justify-center
                        rounded-lg
                        text-[var(--muted)]
                        transition
                        hover:bg-[var(--surface-soft)]
                        hover:text-[var(--foreground)]
                      "
                    >
                      <Trash2
                        size={16}
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>
    </MainLayout>
  );
}