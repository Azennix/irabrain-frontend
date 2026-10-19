const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export type BrainTier =
  | "FREE"
  | "STARTER"
  | "BRAIN_MINI"
  | "BRAIN_ORION"
  | "THALAMUS"
  | "HIPPOCAMPUS";

export interface PaymentOrder {
  payment_id: number;
  provider: string;
  provider_order_id: string;
  tier: BrainTier;
  amount: string;
  currency: string;
  status: string;
}

export interface PaymentVerificationRequest {
  payment_id: number;
  provider_payment_id: string;
  signature: string;
}

export interface PaymentVerificationResponse {
  payment_id: number;
  status: string;
  provider_payment_id: string;
}

export async function createPaymentOrder(
  token: string,
  tier: BrainTier
): Promise<PaymentOrder> {
  const response = await fetch(
    `${API_BASE_URL}/payment/orders?tier=${encodeURIComponent(tier)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Create payment order failed: ${response.status}`
    );
  }

  return response.json();
}

export async function verifyPayment(
  token: string,
  request: PaymentVerificationRequest
): Promise<PaymentVerificationResponse> {
  const response = await fetch(
    `${API_BASE_URL}/payment/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Payment verification failed: ${response.status}`
    );
  }

  return response.json();
}