import React from "react";

interface EmptyStateProps {
  /** Title text */
  title: string;
  /** Description text */
  description: string;
  /** Optional CTA button */
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Icon variant */
  variant?: "streams" | "milestones" | "search" | "wallet" | "default";
  /** Unique id */
  id?: string;
}

export default function EmptyState({
  title,
  description,
  action,
  variant = "default",
  id,
}: EmptyStateProps) {
  return (
    <div
      id={id}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "64px 24px",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      {/* Abstract geometric illustration */}
      <div
        style={{
          width: 120,
          height: 120,
          marginBottom: 24,
          position: "relative",
          opacity: 0.85,
        }}
      >
        <GeometricIllustration variant={variant} />
      </div>

      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: 8,
          fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
          marginBottom: action ? 24 : 0,
          maxWidth: 340,
        }}
      >
        {description}
      </p>

      {action && (
        action.href ? (
          <a
            href={action.href}
            className="btn btn-primary"
            id={id ? `${id}-cta` : undefined}
          >
            {action.label}
          </a>
        ) : (
          <button
            className="btn btn-primary"
            onClick={action.onClick}
            id={id ? `${id}-cta` : undefined}
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

/* ── Abstract geometric illustrations ── */
function GeometricIllustration({ variant }: { variant: string }) {
  const primary = "var(--primary)";
  const primaryLight = "var(--primary-light)";
  const border = "var(--border)";
  const muted = "var(--text-muted)";

  switch (variant) {
    case "streams":
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          {/* Layered flowing lines */}
          <rect x="10" y="10" width="100" height="100" rx="20" fill={primaryLight} />
          <path d="M30 70C45 50 55 80 70 55C85 30 90 60 100 45" stroke={primary} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <path d="M20 80C35 60 50 85 65 65C80 45 90 70 105 55" stroke={primary} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <path d="M25 90C40 75 55 90 70 75C85 60 95 78 110 65" stroke={primary} strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
          <circle cx="70" cy="55" r="4" fill={primary} opacity="0.9" />
          <circle cx="45" cy="65" r="3" fill={primary} opacity="0.5" />
        </svg>
      );

    case "milestones":
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect x="10" y="10" width="100" height="100" rx="20" fill={primaryLight} />
          {/* Milestone checkpoints */}
          <line x1="35" y1="30" x2="35" y2="90" stroke={border} strokeWidth="2" />
          <circle cx="35" cy="40" r="6" fill={primary} opacity="0.9" />
          <circle cx="35" cy="60" r="6" fill={primary} opacity="0.5" />
          <circle cx="35" cy="80" r="6" stroke={border} strokeWidth="2" fill="white" />
          <rect x="50" y="35" width="40" height="10" rx="5" fill={primary} opacity="0.15" />
          <rect x="50" y="55" width="32" height="10" rx="5" fill={primary} opacity="0.1" />
          <rect x="50" y="75" width="36" height="10" rx="5" fill={border} opacity="0.5" />
        </svg>
      );

    case "search":
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect x="10" y="10" width="100" height="100" rx="20" fill={primaryLight} />
          <circle cx="52" cy="52" r="20" stroke={primary} strokeWidth="2.5" opacity="0.6" />
          <line x1="66" y1="66" x2="82" y2="82" stroke={primary} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <line x1="44" y1="52" x2="60" y2="52" stroke={primary} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          <line x1="52" y1="44" x2="52" y2="60" stroke={primary} strokeWidth="2" strokeLinecap="round" opacity="0.15" />
        </svg>
      );

    case "wallet":
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect x="10" y="10" width="100" height="100" rx="20" fill={primaryLight} />
          <rect x="25" y="38" width="60" height="44" rx="8" stroke={primary} strokeWidth="2" opacity="0.5" />
          <rect x="25" y="38" width="60" height="16" rx="8" fill={primary} opacity="0.1" />
          <circle cx="72" cy="64" r="5" fill={primary} opacity="0.6" />
          <path d="M40 38V32a8 8 0 0 1 8-8h24" stroke={primary} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        </svg>
      );

    default:
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect x="10" y="10" width="100" height="100" rx="20" fill={primaryLight} />
          {/* Abstract geometric shapes */}
          <rect x="35" y="35" width="24" height="24" rx="4" stroke={primary} strokeWidth="2" opacity="0.5" transform="rotate(15 47 47)" />
          <rect x="55" y="50" width="20" height="20" rx="4" stroke={primary} strokeWidth="2" opacity="0.3" transform="rotate(-10 65 60)" />
          <circle cx="48" cy="65" r="8" stroke={primary} strokeWidth="2" opacity="0.4" />
          <circle cx="70" cy="42" r="5" fill={primary} opacity="0.2" />
        </svg>
      );
  }
}
