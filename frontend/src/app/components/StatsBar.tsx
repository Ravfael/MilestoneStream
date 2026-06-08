"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface StatConfig {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  accentColor: string;
}

const STATS: StatConfig[] = [
  {
    label: "Total Locked",
    value: 12000000,
    prefix: "$",
    suffix: "USDC",
    accentColor: "var(--primary)",
  },
  {
    label: "Active Escrows",
    value: 340,
    accentColor: "var(--success)",
  },
  {
    label: "Milestones Verified",
    value: 1280,
    accentColor: "var(--primary)",
  },
  {
    label: "Builders Paid",
    value: 700,
    suffix: "+",
    accentColor: "var(--success)",
  },
];

// Live animations removed: stats show static final values.

function StatBlock({ stat, index }: { stat: StatConfig; index: number }) {
  const displayValue = stat.prefix ? `${stat.prefix}${stat.value.toLocaleString()}` : stat.value.toLocaleString();
  const isInlineSuffix = stat.suffix === "+";

  return (
    <div className="stats-block">
      {/* Accent line */}
      <div className="stats-accent-line" style={{ backgroundColor: stat.accentColor }} />

      {/* Label — above the number */}
      <span className="stats-label">{stat.label}</span>

      {/* Number row */}
      <div className="stats-number-row">
        <span className="stats-number">
          {displayValue}
          {isInlineSuffix && stat.suffix}
        </span>
        {stat.suffix && !isInlineSuffix && <span className="stats-suffix">{stat.suffix}</span>}
      </div>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section id="stats-bar" className="stats-section">
      <div className="stats-container">
        {STATS.map((stat, i) => (
          <StatBlock key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </section>
  );
}
