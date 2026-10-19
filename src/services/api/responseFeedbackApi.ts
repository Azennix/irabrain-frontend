const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000";
  

export async function submitResponseFeedback(
  token: string,
  conversationId: string | undefined,
  messageId: string,
  rating: "like" | "dislike"
) {
  const response = await fetch(
    `${API_BASE_URL}/response-feedback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        conversation_id: conversationId ?? null,
        message_id: messageId,
        rating,
      }),
    }
  );

  if (!response.ok) {
    const data =
      await response.json().catch(() => null);

    throw new Error(
      data?.detail ||
        "Unable to submit response feedback."
    );
  }

  return response.json();
}