"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import { useRazorpay } from "react-razorpay";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  createPaymentOrder,
  verifyPayment,
} from "@/services/api/paymentApi";

interface BrainRechargeModalProps {
  open: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void | Promise<void>;
}

type BrainTier =
  | "FREE"
  | "STARTER"
  | "BRAIN_MINI"
  | "BRAIN_ORION"
  | "THALAMUS"
  | "HIPPOCAMPUS";

interface BrainPlan {
  name: BrainTier;
  label: string;
  description: string;
  price: number;
  brainUnits: number;
  features: string[];
  popular?: boolean;
  current?: boolean;
}

const brains: BrainPlan[] = [
  {
    name: "FREE",
    label: "Everyday AI",
    description:
      "A personal AI foundation for everyday questions, learning, and planning.",
    price: 0,
    brainUnits: 100,
    features: [
      "Basic AI conversations",
      "Everyday questions and answers",
      "Writing and rewriting",
      "Personal memory",
    ],
    current: true,
  },
  {
    name: "STARTER",
    label: "Think Further",
    description:
      "More room for everyday work, learning, and structured thinking.",
    price: 49,
    brainUnits: 500,
    features: [
      "Everything in Free",
      "Reasoning capabilities",
      "Structured problem solving",
      "Learning and planning",
    ],
  },
  {
    name: "BRAIN_MINI",
    label: "Understand More",
    description:
      "Explore information, documents, and larger amounts of context.",
    price: 99,
    brainUnits: 1200,
    features: [
      "Everything in Starter",
      "Analysis capabilities",
      "Document analysis",
      "Large-context tasks",
    ],
  },
  {
    name: "BRAIN_ORION",
    label: "Reason Deeper",
    description:
      "For demanding problems, deeper reasoning, and coding tasks.",
    price: 199,
    brainUnits: 3000,
    features: [
      "Everything in Brain Mini",
      "Deep reasoning",
      "Coding capabilities",
      "Complex problem solving",
    ],
  },
  {
    name: "THALAMUS",
    label: "Build More",
    description:
      "More capacity for advanced coding and tool-assisted work.",
    price: 499,
    brainUnits: 9000,
    features: [
      "Everything in Brain Orion",
      "Advanced coding",
      "Tool-assisted tasks",
      "More demanding workflows",
    ],
  },
  {
    name: "HIPPOCAMPUS",
    label: "Explore Further",
    description:
      "For intensive analysis, research, and vision-based tasks.",
    price: 999,
    brainUnits: 22000,
    features: [
      "Everything in Thalamus",
      "Deep analysis",
      "Research capabilities",
      "Vision capabilities",
    ],
    popular: true,
  },
];

export default function BrainRechargeModal({
  open,
  onClose,
  onPaymentSuccess,
}: BrainRechargeModalProps) {
  const [selectedBrain, setSelectedBrain] =
    useState<BrainTier | null>(null);

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(
    null
  );

  const { token } = useAuth();
  const { Razorpay } = useRazorpay();

  const selectedPlan = brains.find(
    (brain) => brain.name === selectedBrain
  );

  const selectedTierColor =
  selectedPlan?.price === 199
    ? "#4285F4"
    : selectedPlan?.price === 999
      ? "#C6A15B"
      : null;

  const handleClose = () => {
    if (paymentLoading) return;

    setSelectedBrain(null);
    setPaymentError(null);
    onClose();
  };

  const handleContinue = async () => {
    if (!selectedPlan || selectedPlan.name === "FREE") {
      return;
    }

    if (paymentLoading) return;

    if (!token) {
      setPaymentError("Please sign in to continue.");
      return;
    }

    if (!Razorpay) {
      setPaymentError("Payment system is not ready yet.");
      return;
    }

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      setPaymentError("Payment configuration is unavailable.");
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentError(null);

      const order = await createPaymentOrder(
        token,
        selectedPlan.name
      );
      

      const razorpay = new Razorpay({
        key: razorpayKey,
        amount: Number(order.amount) * 100,
        currency: "INR",
        name: "IRABRAIN",
        description: `${selectedPlan.label} Brain Tier`,
        order_id: order.provider_order_id,

        handler: async (response) => {
          try {
            await verifyPayment(token, {
              payment_id: order.payment_id,
              provider_payment_id:
                response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            await onPaymentSuccess?.();

            setSelectedBrain(null);
            setPaymentError(null);
            onClose();
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error
            );

            setPaymentError(
              "We couldn't confirm your payment. Please contact support before trying again."
            );
          } finally {
            setPaymentLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      });

      razorpay.open();
    } catch (error) {
      console.error(
        "Failed to start Razorpay Checkout:",
        error
      );

      setPaymentError(
        "Unable to start payment. Please try again."
      );

      setPaymentLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/75
        px-3 py-4
        backdrop-blur-md
        sm:px-5 sm:py-6
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="
          relative flex w-full max-w-7xl flex-col
          overflow-hidden
          rounded-2xl
          border border-[var(--border)]
          bg-[var(--surface)]
          shadow-2xl
          max-h-[94vh]
        "
      >
        {/* Close */}
        <button
          type="button"
          aria-label="Close recharge window"
          onClick={handleClose}
          disabled={paymentLoading}
          className="
            absolute right-4 top-4 z-20
            flex h-8 w-8 items-center justify-center
            rounded-full
            text-[var(--muted)]
            transition
            hover:bg-[var(--surface-hover)]
            hover:text-[var(--foreground)]
            disabled:opacity-40
          "
        >
          <X size={17} strokeWidth={1.5} />
        </button>

        <div className="min-h-0 overflow-y-auto">
          {/* Header */}
          <header className="px-5 pb-6 pt-7 text-center sm:px-8 sm:pt-9">
            <p
              className="
                text-[10px] font-medium uppercase
                tracking-[0.22em]
                text-[var(--muted)]
              "
            >
              IRABRAIN
            </p>

            <h2
              className="
                mt-2 text-2xl font-medium
                tracking-tight text-[var(--foreground)]
                sm:text-3xl
              "
            >
              Choose your brain capacity.
            </h2>

            <p
              className="
                mx-auto mt-2 max-w-xl
                text-sm leading-5
                text-[var(--muted)]
              "
            >
              One AI. Six tiers. Choose the capacity that
              fits the way you think and work.
            </p>
          </header>

          {/* Brain tier cards */}
          <section
            aria-label="Available Brain tiers"
            className="
              grid grid-cols-1 gap-3
              px-4 pb-5
              sm:grid-cols-2 sm:px-6
              lg:grid-cols-3
            "
          >
            {brains.map((brain) => {
              const selected = selectedBrain === brain.name;
              const tierColor =
  brain.price === 199
    ? "#4285F4"
    : brain.price === 999
      ? "#C6A15B"
      : null;
              return (
                <button
                  key={brain.name}
                  type="button"
                  data-tier={brain.name}
                  aria-pressed={selected}
                  onClick={() => {
                    if (paymentLoading) return;

                    setSelectedBrain(brain.name);
                    setPaymentError(null);
                  }}
                  className={`
  brain-tier-card
  group relative flex min-w-0
  flex-col rounded-xl border
  p-5 text-left
  sm:p-6
  ${
    selected
      ? "bg-[var(--surface-hover)]"
      : "border-[var(--border)] hover:bg-[var(--surface-hover)]"
  }
  ${
    paymentLoading
      ? "cursor-not-allowed opacity-70"
      : ""
  }
`}



style={{
  borderColor: tierColor
    ? selected
      ? tierColor
      : `${tierColor}55`
    : undefined,

  background: tierColor
    ? selected
      ? `linear-gradient(145deg, ${tierColor}20, #171716 75%)`
      : `linear-gradient(145deg, ${tierColor}0D, #171716 85%)`
    : undefined,

  boxShadow: tierColor
    ? selected
      ? `inset 0 0 0 1px ${tierColor}55, 0 0 24px ${tierColor}12`
      : `inset 0 0 0 1px ${tierColor}15`
    : undefined,

  transition: "all 250ms ease",
}}
                  disabled={paymentLoading}
                >
                  {/* Tier status */}
                  {/* Tier status */}
{brain.price === 199 && (
  <span
    className="
      absolute right-4 top-4
      rounded-full
      border border-[#4285F4]/50
      bg-[#4285F4]/10
      px-2.5 py-1
      text-[8px] font-medium
      uppercase tracking-[0.14em]
      text-[#4285F4]
    "
  >
    Recommended
  </span>
)}

{brain.popular && brain.price !== 199 && (
  <span
    className="
      absolute right-4 top-4
      rounded-full
      border border-[#C6A15B]/40
      bg-[#C6A15B]/10
      px-2.5 py-1
      text-[8px] font-medium
      uppercase tracking-[0.14em]
      text-[#C6A15B]
    "
  >
    Popular
  </span>
)}

{brain.current && (
  <span
    className="
      absolute right-4 top-4
      rounded-full
      border border-[var(--border)]
      px-2.5 py-1
      text-[8px] font-medium
      uppercase tracking-[0.14em]
      text-[var(--muted)]
    "
  >
    Free
  </span>
)}

                  {brain.current && (
                    <span
                      className="
                        absolute right-4 top-4
                        rounded-full
                        border border-[var(--border)]
                        px-2.5 py-1
                        text-[8px] font-medium
                        uppercase tracking-[0.14em]
                        text-[var(--muted)]
                      "
                    >
                      Free
                    </span>
                  )}

                  {/* Tier identity */}
                  <div className="pr-16">
                    <p
                      className="
                        text-[10px] font-semibold
                        tracking-[0.16em]
                        text-[var(--muted)]
                      "
                    >
                      {brain.name.replaceAll("_", " ")}
                    </p>

                    <h3
                      className="
                        mt-2 text-lg font-medium
                        tracking-tight
                        text-[var(--foreground)]
                      "
                    >
                      {brain.label}
                    </h3>

                    <p
                      className="
                        mt-2 min-h-[60px]
                        text-sm leading-5
                        text-[var(--muted)]
                      "
                    >
                      {brain.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mt-5">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="text-3xl font-medium tracking-tight"
                      style={{
                        color: tierColor ?? "var(--foreground)",
                       }}
                      >
                        ₹{brain.price}
                      </span>

                      <span className="text-xs text-[var(--muted)]">
                        {brain.price === 0 ? "forever" : "/ tier period"}
                      </span>
                    </div>

                    <div
                      className="
                        mt-3 flex items-center justify-between
                        border-y border-[var(--border)]
                        py-3
                      "
                    >
                      <span className="text-xs text-[var(--muted)]">
                        Included Brain Units
                      </span>

                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {brain.brainUnits}
                      </span>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="mt-5 flex-1">
                    <p
                      className="
                        mb-4 text-[10px] font-medium
                        uppercase tracking-[0.16em]
                        text-[var(--muted)]
                      "
                    >
                      Capabilities
                    </p>

                    <div className="space-y-3">
                      {brain.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-3"
                        >
                          <span
                            className="
                              mt-0.5 flex h-4 w-4 shrink-0
                              items-center justify-center
                              rounded-full
                              border border-[var(--border)]
                            "
                          >
                            <Check
                              size={9}
                              strokeWidth={1.8}
                            />
                          </span>

                          <span
                            className="
                              text-sm leading-4
                              text-[var(--foreground)]
                            "
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selection footer */}
                  <div
                    className="
                      mt-7 flex items-center justify-between
                      border-t border-[var(--border)]
                      pt-4
                    "
                  >
                    <span className="text-xs text-[var(--muted)]">
                      {selected
                        ? "Selected"
                        : "View tier"}
                    </span>

                    <span
                      className="
                        text-sm text-[var(--foreground)]
                        transition-transform
                        group-hover:translate-x-1
                      "
                    >
                      {selected ? (
                        <Check size={16} strokeWidth={1.5} />
                      ) : (
                        "→"
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </section>

          {/* Selected tier action */}
          {selectedPlan && (
            <section className="px-4 pb-4 sm:px-6 sm:pb-5">
              <div
                className="
                  flex flex-col gap-4 rounded-xl
                  border border-[var(--border)]
                  px-4 py-4
                  sm:flex-row sm:items-center
                  sm:justify-between sm:px-5
                "
              >
                <div>
                  <p
                    className="
                      text-[9px] uppercase
                      tracking-[0.16em]
                      text-[var(--muted)]
                    "
                  >
                    Selected tier
                  </p>

                  <p
                    className="
                      mt-1 text-sm font-medium
                      text-[var(--foreground)]
                    "
                  >
                    {selectedPlan.label}
                  </p>

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {selectedPlan.price === 0
                      ? `${selectedPlan.brainUnits} included Brain Units`
                      : `₹${selectedPlan.price} · ${selectedPlan.brainUnits} included Brain Units`}
                  </p>
                </div>

                {selectedPlan.name === "FREE" ? (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="
                      shrink-0 rounded-lg
                      border border-[var(--foreground)]
                      px-5 py-2.5
                      text-sm font-medium
                      text-[var(--foreground)]
                      transition
                      hover:bg-[var(--surface-hover)]
                    "
                  >
                    Continue with Free →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={paymentLoading}
                    className="
                    shrink-0 rounded-lg
                 border px-5 py-2.5
              text-sm font-medium
                 transition
                hover:opacity-90
                     active:scale-[0.98]
                 disabled:cursor-not-allowed
                   disabled:opacity-50
                     "
                style={{
  borderColor: selectedTierColor ?? "var(--foreground)",
  color: selectedTierColor ?? "var(--foreground)",
}}
                  >
                    {paymentLoading
                      ? "Processing..."
                      : `Continue · ₹${selectedPlan.price} →`}
                  </button>
                )}
              </div>

              {paymentError && (
                <p
                  role="alert"
                  className="
                    mt-3 text-sm
                    text-[var(--foreground)]
                  "
                >
                  {paymentError}
                </p>
              )}
            </section>
          )}

          {/* Footer */}
          <footer className="px-5 pb-5 pt-1 text-center sm:pb-6">
            <p className="text-[10px] leading-5 text-[var(--muted)]">
              Your tier determines the capabilities available to IRA.
              Brain Unit consumption depends on the task.
            </p>

            <button
              type="button"
              onClick={handleClose}
              disabled={paymentLoading}
              className="
                mt-3 text-xs text-[var(--muted)]
                transition hover:text-[var(--foreground)]
                disabled:opacity-40
              "
            >
              ← Go back
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}