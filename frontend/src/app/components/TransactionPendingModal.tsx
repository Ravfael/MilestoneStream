"use client";
import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";

type TxModalState = "pending" | "confirmed" | "error";

interface TransactionPendingModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Transaction hash */
  txHash?: string;
  /** Current state */
  state?: TxModalState;
  /** Optional error message */
  errorMessage?: string;
}

function truncateHash(hash: string) {
  if (!hash) return "";
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export default function TransactionPendingModal({
  isOpen,
  onClose,
  txHash = "0x1234abcd5678ef901234abcd5678ef901234abcd5678ef901234abcd5678ef90",
  state = "pending",
  errorMessage,
}: TransactionPendingModalProps) {
  const [copied, setCopied] = useState(false);

  // Reset copied state when modal reopens
  useEffect(() => {
    if (isOpen) setCopied(false);
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!txHash) return;
    await navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const publicClient = usePublicClient();
  const explorerUrl = publicClient?.chain?.blockExplorers?.default?.url || "https://sepolia.etherscan.io";
  const explorerName = publicClient?.chain?.blockExplorers?.default?.name || "Etherscan";
  const explorerTxUrl = `${explorerUrl}/tx/${txHash}`;

  return (
    <div
      id="tx-modal-overlay"
      className="animate-fade-in"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && state !== "pending") onClose();
      }}
    >
      <div
        id="tx-modal"
        className="animate-fade-in-up"
        style={{
          background: "var(--surface-raised)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-modal)",
          border: "1px solid var(--border)",
          width: "100%",
          maxWidth: 420,
          padding: "40px 32px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 20,
        }}
      >
        {/* Spinner / Success / Error indicator */}
        {state === "pending" && <Spinner />}
        {state === "confirmed" && <SuccessCheck />}
        {state === "error" && <ErrorIcon />}

        {/* Title */}
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: 0,
            fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
            lineHeight: 1.3,
          }}
        >
          {state === "pending" && "Transaction Submitted"}
          {state === "confirmed" && "Transaction Confirmed"}
          {state === "error" && "Transaction Failed"}
        </h3>

        {/* TX Hash display */}
        {txHash && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--surface)",
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <span
              className="mono"
              style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}
            >
              {truncateHash(txHash)}
            </span>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              id="tx-copy-hash"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                color: copied ? "var(--success)" : "var(--text-muted)",
                transition: "color 150ms ease",
              }}
              title="Copy hash"
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>

            {/* Explorer link */}
            <a
              href={explorerTxUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="tx-explorer-link"
              style={{
                color: "var(--text-muted)",
                display: "flex",
                padding: 4,
                transition: "color 150ms ease",
              }}
              title={`View on ${explorerName}`}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        )}

        {/* Status message */}
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {state === "pending" && "Waiting for confirmation..."}
          {state === "confirmed" && `Your transaction has been confirmed on the ${publicClient?.chain?.name || "active"} network.`}
          {state === "error" && (errorMessage || "Something went wrong. Please try again.")}
        </p>

        {/* Actions */}
        {state !== "pending" && (
          <button
            className="btn btn-primary"
            onClick={onClose}
            id="tx-modal-close"
            style={{ width: "100%", marginTop: 4 }}
          >
            {state === "confirmed" ? "Done" : "Close"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Animated spinner ── */
function Spinner() {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        position: "relative",
      }}
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        style={{ animation: "spin 1.2s linear infinite" }}
      >
        <circle
          cx="28"
          cy="28"
          r="24"
          stroke="var(--border)"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="28"
          cy="28"
          r="24"
          stroke="var(--primary)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="120"
          strokeDashoffset="80"
        />
      </svg>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ── Success checkmark ── */
function SuccessCheck() {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "var(--success-light)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--success)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: "fadeIn 0.3s ease-out" }}
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

/* ── Error icon ── */
function ErrorIcon() {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "var(--danger-light)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--danger)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </div>
  );
}
