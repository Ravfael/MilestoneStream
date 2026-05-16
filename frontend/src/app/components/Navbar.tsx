"use client";
import { useState, useRef, useEffect } from "react";
import WalletConnectButton from "./WalletConnectButton";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      id="main-nav"
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm"
      style={{ borderBottom: "1px solid var(--border)", height: 64 }}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 no-underline" id="logo">
          {/* Geometric stream/flow icon */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg, var(--primary), #3B82F6)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              {/* Stream/flow geometric icon — layered chevrons */}
              <path d="M4 8L12 4L20 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12L12 8L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
              <path d="M4 16L12 12L20 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
              <path d="M12 12V20" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          <span
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-dm-sans)" }}
          >
            MilestoneStream
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          <a href="/explore" className="nav-link">Explore</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="/docs" className="nav-link">Docs</a>
        </div>

        {/* Right: Network badge + Wallet */}
        <div className="hidden items-center gap-3 md:flex">
          <NetworkBadge />
          <WalletConnectButton />
        </div>

        {/* Mobile toggle */}
        <button
          className="btn-ghost md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          id="btn-mobile-toggle"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            ) : (
              <><line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="16" x2="20" y2="16" /></>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="animate-fade-in border-t bg-white px-6 py-4 md:hidden"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex flex-col gap-2">
            <a href="/explore" className="nav-link" onClick={() => setMobileOpen(false)}>Explore</a>
            <a href="#how-it-works" className="nav-link" onClick={() => setMobileOpen(false)}>How It Works</a>
            <a href="/docs" className="nav-link" onClick={() => setMobileOpen(false)}>Docs</a>
            <hr style={{ borderColor: "var(--border)", margin: "4px 0" }} />
            <div className="flex items-center gap-2 py-2">
              <NetworkBadge />
            </div>
            <WalletConnectButton />
          </div>
        </div>
      )}
    </nav>
  );
}

/* ── Arbitrum network indicator ── */
function NetworkBadge() {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{
        background: "var(--primary-light)",
        border: "1px solid var(--border)",
        fontSize: "0.8125rem",
        fontWeight: 500,
        color: "var(--text-secondary)",
      }}
      id="network-badge"
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#2563EB",
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      Arbitrum
    </div>
  );
}
