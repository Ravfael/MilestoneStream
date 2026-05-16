"use client";
import { useState, useEffect } from "react";
import AmountDisplay from "./AmountDisplay";
import MilestoneTypeChip from "./MilestoneTypeChip";

interface CreateEscrowDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (data: any) => void;
}

export default function CreateEscrowDrawer({ isOpen, onClose, onDeploy }: CreateEscrowDrawerProps) {
  const [step, setStep] = useState(1);
  
  // Step 1 Data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [builderWallet, setBuilderWallet] = useState("");
  const [totalAmount, setTotalAmount] = useState<string>("");

  // Step 2 Data
  const [milestones, setMilestones] = useState([
    { type: "contract-deploy", description: "", params: "", amount: "", deadline: "" }
  ]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Running total calculation
  const totalMilestonesAmount = milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
  const targetAmount = parseFloat(totalAmount) || 0;
  const isMatching = Math.abs(totalMilestonesAmount - targetAmount) < 0.0001;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const addMilestone = () => {
    setMilestones([...milestones, { type: "tx-count", description: "", params: "", amount: "", deadline: "" }]);
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length === 1) return;
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        className="animate-fade-in"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(2px)",
        }}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className="animate-slide-in-right"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 580,
          background: "var(--background)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid var(--border)",
          boxShadow: "var(--shadow-modal)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontFamily: "var(--font-playfair)" }}>
            Create New Escrow
          </h2>
          <button className="btn-ghost" onClick={onClose} style={{ padding: 4 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Steps Progress */}
        <div style={{ display: "flex", padding: "16px 24px", background: "var(--surface)", gap: 8 }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                style={{
                  height: 4,
                  borderRadius: 2,
                  background: step >= s ? "var(--primary)" : "var(--border)",
                  transition: "background 300ms",
                }}
              />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: step >= s ? "var(--primary)" : "var(--text-muted)" }}>
                {s === 1 ? "Basic Info" : s === 2 ? "Milestones" : "Review"}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {step === 1 && (
            <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="form-group">
                <label style={labelStyle}>Escrow Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g., Uniswap v4 Hook Development"
                />
              </div>

              <div className="form-group">
                <label style={labelStyle}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                  placeholder="Describe the overall goal of this project..."
                />
              </div>

              <div className="form-group">
                <label style={labelStyle}>Builder Wallet Address</label>
                <input
                  value={builderWallet}
                  onChange={(e) => setBuilderWallet(e.target.value)}
                  style={inputStyle}
                  className="mono"
                  placeholder="0x... or ENS name"
                />
              </div>

              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={labelStyle}>Token</label>
                  <div style={{ ...inputStyle, display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", pointerEvents: "none" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#2775CA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>$</span>
                    </div>
                    <span style={{ fontWeight: 500 }}>USDC</span>
                  </div>
                </div>

                <div className="form-group" style={{ flex: 2 }}>
                  <label style={labelStyle}>Total Amount</label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    style={inputStyle}
                    className="mono"
                    placeholder="10000"
                  />
                  {totalAmount && (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                      ≈ ${(parseFloat(totalAmount) * 1).toLocaleString()} USD
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "1.125rem", color: "var(--text-primary)" }}>Define Milestones</h3>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Total: <span className="mono" style={{ color: isMatching ? "var(--success)" : "var(--danger)", fontWeight: "bold" }}>
                    {totalMilestonesAmount} / {targetAmount} USDC
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {milestones.map((m, i) => (
                  <div key={i} className="card" style={{ padding: 16, position: "relative" }}>
                    {milestones.length > 1 && (
                      <button
                        onClick={() => removeMilestone(i)}
                        className="btn-ghost"
                        style={{ position: "absolute", top: 8, right: 8, padding: 4, color: "var(--danger)" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    )}
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold" }}>
                        {i + 1}
                      </div>
                      <select
                        value={m.type}
                        onChange={(e) => updateMilestone(i, "type", e.target.value)}
                        style={{ ...inputStyle, padding: "6px 10px", width: "auto", flex: 1, height: "auto" }}
                      >
                        <option value="contract-deploy">Contract Deployed</option>
                        <option value="tx-count">TX Count Threshold</option>
                        <option value="tvl">TVL Threshold</option>
                        <option value="deadline">Deadline</option>
                        <option value="holders">Holders</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <input
                        value={m.description}
                        onChange={(e) => updateMilestone(i, "description", e.target.value)}
                        style={inputStyle}
                        placeholder="Milestone description"
                      />
                      <input
                        value={m.params}
                        onChange={(e) => updateMilestone(i, "params", e.target.value)}
                        style={{ ...inputStyle, fontFamily: "var(--font-jetbrains)" }}
                        placeholder="Verifier params (e.g. contract address)"
                      />
                      <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ flex: 1, position: "relative" }}>
                          <input
                            type="number"
                            value={m.amount}
                            onChange={(e) => updateMilestone(i, "amount", e.target.value)}
                            style={{ ...inputStyle, paddingRight: 40 }}
                            placeholder="Amount"
                          />
                          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", color: "var(--text-muted)" }}>USDC</span>
                        </div>
                        <input
                          type="date"
                          value={m.deadline}
                          onChange={(e) => updateMilestone(i, "deadline", e.target.value)}
                          style={{ ...inputStyle, flex: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-secondary"
                onClick={addMilestone}
                style={{ width: "100%", borderStyle: "dashed" }}
              >
                + Add Milestone
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "1.25rem" }}>Review & Lock Funds</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.875rem" }}>
                  Please review the details before deploying the smart contract.
                </p>
              </div>

              <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Escrow Name</div>
                  <div style={{ fontWeight: 500 }}>{title || "Untitled Escrow"}</div>
                </div>
                
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Builder Address</div>
                  <div className="mono" style={{ fontSize: "0.875rem", background: "var(--surface)", padding: "4px 8px", borderRadius: "var(--radius-sm)", display: "inline-block" }}>
                    {builderWallet || "0x..."}
                  </div>
                </div>

                <div style={{ height: 1, background: "var(--border)" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 500 }}>Total to Lock</span>
                  <AmountDisplay amount={parseFloat(totalAmount) || 0} currency="USDC" showUsd={true} size="lg" />
                </div>
              </div>

              <div>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "1rem" }}>Milestone Breakdown</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {milestones.map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Milestone {i + 1}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <MilestoneTypeChip type={m.type as any} />
                        </div>
                      </div>
                      <span className="mono" style={{ fontWeight: 600 }}>{m.amount} USDC</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "var(--warning-light)", border: "1px solid var(--warning)", padding: 16, borderRadius: "var(--radius-md)", display: "flex", gap: 12 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <div style={{ fontSize: "0.875rem", color: "var(--warning)" }}>
                  <strong style={{ display: "block", marginBottom: 4 }}>Action Irreversible</strong>
                  Funds will be locked in a smart contract. You cannot withdraw them unless a dispute is resolved in your favor or the builder rejects the escrow.
                </div>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Estimated Gas</span>
                <span className="mono" style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}>~0.0012 ETH ($3.40)</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", background: "var(--surface-raised)" }}>
          {step > 1 ? (
            <button className="btn btn-secondary" onClick={handleBack}>
              ← Back
            </button>
          ) : (
            <div /> // spacer
          )}
          
          {step < 3 ? (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={step === 1 ? !title || !totalAmount : !isMatching}
            >
              Next →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => onDeploy({ title, description, builderWallet, totalAmount, milestones })} style={{ padding: "10px 32px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Confirm & Lock Funds
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "var(--text-primary)",
  marginBottom: 8,
  fontFamily: "var(--font-dm-sans)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-strong)",
  background: "var(--surface-raised)",
  color: "var(--text-primary)",
  fontSize: "0.9375rem",
  outline: "none",
  fontFamily: "var(--font-dm-sans)",
};
