"use client";

import { useCallback, useEffect, useState } from "react";

import { getBrainBalance } from "@/services/api/brainApi";
import { useAuth } from "@/lib/auth/AuthProvider";
export interface BrainBalanceState {
  included_balance: string;
  paid_balance: string;
  total_balance: string;
}

export function useBrainBalance() {
  const { token } = useAuth();

  const [balance, setBalance] =
    useState<BrainBalanceState | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const refreshBalance = useCallback(async () => {
    if (!token) {
      setBalance(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getBrainBalance(token);

      setBalance({
  included_balance: result.included_balance,
  paid_balance: result.paid_balance,
  total_balance: result.total_balance,
});

    } catch (err) {
      console.error(
        "Failed to load Brain Balance:",
        err
      );

      setError("Failed to load Brain Balance.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return {
    balance,
    loading,
    error,
    refreshBalance,
  };
}