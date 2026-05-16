import React from "react";

export type MilestoneType =
  | "contract-deploy"
  | "tx-count"
  | "tvl"
  | "holders"
  | "deadline";

interface MilestoneTypeChipProps {
  type: MilestoneType;
  id?: string;
}

const CHIP_CONFIG: Record<MilestoneType, { icon: string; label: string }> = {
  "contract-deploy": { icon: "🔷", label: "Contract Deploy" },
  "tx-count":        { icon: "📊", label: "TX Count" },
  "tvl":             { icon: "💰", label: "TVL" },
  "holders":         { icon: "👥", label: "Holders" },
  "deadline":        { icon: "⏰", label: "Deadline" },
};

export default function MilestoneTypeChip({ type, id }: MilestoneTypeChipProps) {
  const config = CHIP_CONFIG[type];

  return (
    <span
      id={id}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 999,
        border: "1px solid var(--border)",
        fontSize: "0.8125rem",
        fontWeight: 500,
        color: "var(--text-secondary)",
        background: "transparent",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
      }}
    >
      <span style={{ fontSize: "0.75rem", lineHeight: 1 }}>{config.icon}</span>
      {config.label}
    </span>
  );
}
