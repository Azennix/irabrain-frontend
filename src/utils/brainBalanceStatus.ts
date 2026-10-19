export type BrainBalanceStatus =
  | "high"
  | "medium"
  | "low"
  | "empty";

export function getBrainBalanceStatus(
  totalBalance: string
): BrainBalanceStatus {
  const balance = Number(totalBalance);

  if (!Number.isFinite(balance) || balance <= 0) {
    return "empty";
  }

  if (balance < 10) {
    return "low";
  }

  if (balance < 30) {
    return "medium";
  }

  return "high";
}