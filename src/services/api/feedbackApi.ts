const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function submitFeedback(
  token: string,
  feedbackType: string,
  message: string
) {
  const response = await fetch(
    `${API_BASE_URL}/feedback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        feedback_type: feedbackType,
        message,
      }),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.detail || "Unable to submit feedback."
    );
  }

  return response.json();
}