const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface NotificationItem {
  notification_id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

interface NotificationsResponse {
  notifications: NotificationItem[];
}

export async function getNotifications(
  token: string
): Promise<NotificationItem[]> {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Notifications request failed: ${response.status}`
    );
  }

  const data: NotificationsResponse = await response.json();

  return data.notifications;
}

export async function getUnreadNotificationCount(
  token: string
): Promise<number> {
  const response = await fetch(
    `${API_BASE_URL}/notifications/unread-count`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unread notifications request failed: ${response.status}`
    );
  }

  const data: { unread_count: number } =
    await response.json();

  return data.unread_count;
}

export async function markNotificationAsRead(
  token: string,
  notificationId: number
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Mark notification as read failed: ${response.status}`
    );
  }
}

export async function markAllNotificationsAsRead(
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/notifications/read-all`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Mark all notifications as read failed: ${response.status}`
    );
  }
}

export async function deleteNotification(
  token: string,
  notificationId: number
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Delete notification failed: ${response.status}`
    );
  }
}