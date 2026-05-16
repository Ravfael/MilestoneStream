import React from "react";

export type StatusType = "active" | "pending" | "completed" | "disputed" | "expired";

interface StatusBadgeProps {
  status: StatusType;
  /** Optional: override the label text */
  label?: string;
  /** Unique id for testing */
  id?: string;
}

const STATUS_CONFIG: Record<StatusType, { label: string; className: string }> = {
  active:    { label: "Active",    className: "badge-active" },
  pending:   { label: "Pending",   className: "badge-pending" },
  completed: { label: "Completed", className: "badge-completed" },
  disputed:  { label: "Disputed",  className: "badge-disputed" },
  expired:   { label: "Expired",   className: "badge-expired" },
};

export default function StatusBadge({ status, label, id }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span className={`badge ${config.className}`} id={id}>
      <span className="badge-dot" />
      {label ?? config.label}
    </span>
  );
}
