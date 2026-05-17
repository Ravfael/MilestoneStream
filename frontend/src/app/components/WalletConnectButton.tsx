"use client";
import { useState, useRef, useEffect } from "react";
import { useWallet } from "./WalletContext";

/* ── Deterministic blockie avatar ── */
function Blockie({ address, size = 24 }: { address: string; size?: number }) {
  const colors = ["#1A56DB", "#3B82F6", "#60A5FA", "#1E429F", "#93C5FD", "#2563EB"];
  const cells = 5;
  const cellSize = size / cells;

  // Simple deterministic hash from address
  const hash = address
    .toLowerCase()
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const grid: boolean[][] = [];
  for (let y = 0; y < cells; y++) {
    grid[y] = [];
    for (let x = 0; x < Math.ceil(cells / 2); x++) {
      grid[y][x] = ((hash * (y * cells + x + 1) * 7) % 13) > 5;
    }
    // Mirror horizontally for symmetry
    for (let x = Math.ceil(cells / 2); x < cells; x++) {
      grid[y][x] = grid[y][cells - 1 - x];
    }
  }

  const bgColor = colors[hash % colors.length];
  const fgColor = colors[(hash + 3) % colors.length];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: "50%", flexShrink: 0 }}>
      <rect width={size} height={size} fill={bgColor} />
      {grid.map((row, y) =>
        row.map((filled, x) =>
          filled ? (
            <rect
              key={`${x}-${y}`}
              x={x * cellSize}
              y={y * cellSize}
              width={cellSize}
              height={cellSize}
              fill={fgColor}
            />
          ) : null
        )
      )}
    </svg>
  );
}

/* ── Truncate address ── */
function truncateAddress(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

/* ── WalletConnectButton ── */
export default function WalletConnectButton() {
  const { connected, address, connect, disconnect } = useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* ── Disconnected state ── */
  if (!connected) {
    return (
      <button
        className="btn btn-primary"
        id="btn-connect-wallet"
        onClick={connect}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M16 12h.01" />
        </svg>
        Connect Wallet
      </button>
    );
  }

  /* ── Connected state ── */
  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        className="btn btn-secondary"
        id="btn-wallet-connected"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px 6px 8px",
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "0.8125rem",
        }}
      >
        <Blockie address={address} size={22} />
        <span className="mono">{truncateAddress(address)}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "transform 150ms ease",
            transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div
          className="animate-fade-in"
          id="wallet-dropdown"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: 220,
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-elevated)",
            overflow: "hidden",
            zIndex: 100,
          }}
        >
          <DropdownItem
            id="dropdown-copy-address"
            icon={
              copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )
            }
            label={copied ? "Copied!" : "Copy Address"}
            onClick={handleCopy}
          />
          <DropdownItem
            id="dropdown-disconnect"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            }
            label="Disconnect"
            onClick={() => {
              disconnect();
              setDropdownOpen(false);
            }}
            danger
          />
        </div>
      )}
    </div>
  );
}

/* ── Dropdown menu item ── */
function DropdownItem({
  id,
  icon,
  label,
  href,
  onClick,
  danger,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 16px",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: danger ? "var(--danger)" : "var(--text-primary)",
    background: "none",
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    transition: "background 150ms ease",
    textDecoration: "none",
    fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
  };

  const hoverHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.background = "var(--surface)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.background = "none";
    },
  };

  if (href) {
    return (
      <a href={href} style={style} id={id} {...hoverHandlers}>
        {icon}
        {label}
      </a>
    );
  }

  return (
    <button style={style} onClick={onClick} id={id} {...hoverHandlers}>
      {icon}
      {label}
    </button>
  );
}
