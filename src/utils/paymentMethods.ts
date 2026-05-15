/** Maps UI payment method ids to API `paymentMethod` values. */

export const PAYMENT_METHOD_API: Record<string, string> = {
  upi: "UPI",
  debit: "DEBIT_CARD",
  credit: "CREDIT_CARD",
  escrow: "ESCROW",
  crypto: "CRYPTO",
};

export function toApiPaymentMethod(methodId: string): string {
  return PAYMENT_METHOD_API[methodId] ?? methodId.toUpperCase();
}

export function formatInrAmount(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
