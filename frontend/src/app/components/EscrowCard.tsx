import React from "react";
import StatusBadge, { StatusType } from "./StatusBadge";
import AmountDisplay from "./AmountDisplay";
import MilestoneTypeChip, { MilestoneType } from "./MilestoneTypeChip";

interface EscrowCardProps {
  id: string;
  status: StatusType;
  title: string;
  creatorAddress: string;
  amount: number;
  token?: string;
  usdRate?: number;
  completedMilestones: number;
  totalMilestones: number;
  milestoneTypes: MilestoneType[];
  network: "Arbitrum One" | "Robinhood Chain" | string;
}

const formatAddress = (address: string) => {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getNetworkIcon = (network: string) => {
  if (network === "Arbitrum One") return "🔵";
  if (network === "Robinhood Chain") return "🏹";
  return "🌐";
};

export default function EscrowCard({
  id,
  status,
  title,
  creatorAddress,
  amount,
  token = "USDC",
  usdRate = 1,
  completedMilestones,
  totalMilestones,
  milestoneTypes,
  network,
}: EscrowCardProps) {
  const progressPercent = totalMilestones > 0 
    ? Math.min(100, Math.round((completedMilestones / totalMilestones) * 100)) 
    : 0;

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0, lineHeight: 1.3 }}>{title}</h3>
          <span 
            className="mono" 
            style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}
            title={creatorAddress}
          >
            By {formatAddress(creatorAddress)}
          </span>
        </div>
        <div style={{ flexShrink: 0 }}>
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Amount Block */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: 500 }}>
          Total Locked
        </div>
        <AmountDisplay amount={amount} token={token} usdRate={usdRate} size="lg" />
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginBottom: "8px", fontWeight: 500 }}>
          <span style={{ color: "var(--text-secondary)" }}>Milestones Progress</span>
          <span style={{ color: "var(--text-primary)" }}>{completedMilestones}/{totalMilestones}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${progressPercent}%`, 
              backgroundColor: "var(--success)" 
            }} 
          />
        </div>
      </div>

      {/* Milestone Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
        {milestoneTypes.map((type, index) => (
          <MilestoneTypeChip key={`${type}-${index}`} type={type} />
        ))}
      </div>

      <div style={{ flexGrow: 1 }} />

      {/* Bottom Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid var(--border)", marginTop: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500 }}>
          <span>{getNetworkIcon(network)}</span>
          {network}
        </div>
        <a 
          href={`/escrow/${id}`} 
          style={{ 
            fontSize: "0.875rem", 
            fontWeight: 600, 
            color: "var(--primary)", 
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
          className="hover:text-[var(--primary-hover)] transition-colors"
        >
          View Details <span style={{ fontSize: "1.1em" }}>→</span>
        </a>
      </div>
    </div>
  );
}
