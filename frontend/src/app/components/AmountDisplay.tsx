import React from "react";

interface AmountDisplayProps {
  /** Amount value (e.g. 25000) */
  amount: number;
  /** Token symbol (default: "USDC") */
  token?: string;
  /** USD rate for conversion (default: 1 for stablecoins) */
  usdRate?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Unique id */
  id?: string;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AmountDisplay({
  amount,
  token = "USDC",
  usdRate = 1,
  size = "md",
  id,
}: AmountDisplayProps) {
  const usdValue = amount * usdRate;

  const amountFontSize =
    size === "lg" ? "1.5rem" : size === "md" ? "1.125rem" : "0.9375rem";

  const usdFontSize =
    size === "lg" ? "0.875rem" : size === "md" ? "0.8125rem" : "0.75rem";

  return (
    <div
      id={id}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: size === "lg" ? 4 : 2,
      }}
    >
      <span
        className="mono"
        style={{
          fontSize: amountFontSize,
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}
      >
        {formatNumber(amount)}{" "}
        <span
          style={{
            fontSize: size === "lg" ? "0.875rem" : "0.75rem",
            fontWeight: 500,
            color: "var(--text-muted)",
          }}
        >
          {token}
        </span>
      </span>
      <span
        style={{
          fontSize: usdFontSize,
          color: "var(--text-muted)",
          lineHeight: 1.2,
          fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        }}
      >
        ≈ ${formatNumber(usdValue)} USD
      </span>
    </div>
  );
}
