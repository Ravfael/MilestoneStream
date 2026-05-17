"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import WalletConnectButton from "./WalletConnectButton";
import { useWallet } from "./WalletContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [mobileDashboardOpen, setMobileDashboardOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { connected, address, disconnect } = useWallet();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleCopyAddress = useCallback(() => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [address]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setDashboardOpen(false);
    setMobileOpen(false);
  }, [disconnect]);

  // Close desktop dashboard dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dashboardRef.current && !dashboardRef.current.contains(e.target as Node)) {
        setDashboardOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav
      id="main-nav"
      className="bg-white/95 backdrop-blur-sm"
      style={{ height: 64, position: "sticky", top: 0, zIndex: 50 }}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <a href="/" className="flex items-center no-underline" id="logo">
            <img src="/logo.png" alt="MilestoneStream" className="h-8 w-auto" />
          </a>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            <a href="/explore" className="nav-link">Explore</a>
            <a href="/#how-it-works" className="nav-link">How It Works</a>
            <a href="https://github.com/Ravfael/MilestoneStream" target="_blank" rel="noopener noreferrer" className="nav-link flex items-center gap-1">
              Docs
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>

            {/* Dashboard with premium dropdown */}
            {connected ? (
              <div ref={dashboardRef} style={{ position: "relative" }}>
                <button
                  className="nav-link flex items-center gap-1.5"
                  id="nav-dashboard"
                  onClick={() => setDashboardOpen(!dashboardOpen)}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  Dashboard
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transition: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: dashboardOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* ── Context Menu Dropdown ── */}
                <div
                  id="dashboard-dropdown"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    left: "50%",
                    transform: dashboardOpen
                      ? "translateX(-50%) translateY(0)"
                      : "translateX(-50%) translateY(-4px)",
                    minWidth: 220,
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)",
                    overflow: "hidden",
                    zIndex: 100,
                    opacity: dashboardOpen ? 1 : 0,
                    pointerEvents: dashboardOpen ? "auto" : "none",
                    transition: "opacity 180ms cubic-bezier(0.4,0,0.2,1), transform 180ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {/* Funder item */}
                  <a
                    href="/funder"
                    id="dropdown-goto-funder"
                    className="dd-menu-item"
                    onClick={() => setDashboardOpen(false)}
                  >
                    {/* Grid / dashboard icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                    </svg>
                    Funder Dashboard
                  </a>

                  {/* Builder item */}
                  <a
                    href="/builder"
                    id="dropdown-goto-builder"
                    className="dd-menu-item"
                    onClick={() => setDashboardOpen(false)}
                  >
                    {/* Code brackets icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                    </svg>
                    Builder Dashboard
                  </a>

                  {/* Divider */}
                  <div className="dd-menu-divider" />

                  {/* Copy Address */}
                  <button
                    id="dropdown-copy-address"
                    className="dd-menu-item"
                    onClick={handleCopyAddress}
                  >
                    {/* Copy icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    {copied ? "Copied!" : "Copy Address"}
                  </button>

                  {/* Disconnect */}
                  <button
                    id="dropdown-disconnect"
                    className="dd-menu-item dd-menu-item--danger"
                    onClick={handleDisconnect}
                  >
                    {/* Arrow-right-from-bracket / logout icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <span
                className="nav-link flex items-center gap-1.5"
                style={{ opacity: 0.4, cursor: "not-allowed", pointerEvents: "none" }}
                title="Connect wallet to access Dashboard"
                id="nav-dashboard-disabled"
              >
                Dashboard
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Right: Wallet */}
          <div className="hidden items-center gap-3 md:flex">
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
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="animate-fade-in border-t bg-white px-6 py-4 md:hidden"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex flex-col gap-2">
            <a href="/explore" className="nav-link" onClick={() => setMobileOpen(false)}>Explore</a>
            <a href="/#how-it-works" className="nav-link" onClick={() => setMobileOpen(false)}>How It Works</a>
            <a href="https://github.com/Ravfael/MilestoneStream" target="_blank" rel="noopener noreferrer" className="nav-link flex w-fit items-center gap-1" onClick={() => setMobileOpen(false)}>
              Docs
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>

            {/* Dashboard — mobile */}
            {connected ? (
              <>
                <button
                  className="nav-link flex w-fit items-center gap-1.5"
                  id="nav-dashboard-mobile"
                  onClick={() => setMobileDashboardOpen(!mobileDashboardOpen)}
                  style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  Dashboard
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transition: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: mobileDashboardOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Mobile sub-items — context menu style */}
                {mobileDashboardOpen && (
                  <div className="dd-mobile-panel animate-fade-in">
                    <a
                      href="/funder"
                      className="dd-menu-item"
                      onClick={() => setMobileOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                      </svg>
                      Funder Dashboard
                    </a>

                    <a
                      href="/builder"
                      className="dd-menu-item"
                      onClick={() => setMobileOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                      </svg>
                      Builder Dashboard
                    </a>

                    <div className="dd-menu-divider" />

                    <button
                      className="dd-menu-item"
                      onClick={handleCopyAddress}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      {copied ? "Copied!" : "Copy Address"}
                    </button>

                    <button
                      className="dd-menu-item dd-menu-item--danger"
                      onClick={handleDisconnect}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Disconnect
                    </button>
                  </div>
                )}
              </>
            ) : (
              <span
                className="nav-link flex w-fit items-center gap-1.5"
                style={{ opacity: 0.4, cursor: "not-allowed" }}
                title="Connect wallet to access Dashboard"
                id="nav-dashboard-mobile-disabled"
              >
                Dashboard
              </span>
            )}
            <hr style={{ borderColor: "var(--border)", margin: "4px 0" }} />
            <WalletConnectButton />
          </div>
        </div>
      )}
    </nav>
  );
}
