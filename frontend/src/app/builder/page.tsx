"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AmountDisplay from "../components/AmountDisplay";
import StatusBadge, { StatusType } from "../components/StatusBadge";
import MilestoneTypeChip, { MilestoneType } from "../components/MilestoneTypeChip";

// --- Mock Data ---
const MOCK_BUILDER_ESCROWS = [
  {
    id: "e1",
    title: "Uniswap v4 Hooks",
    funderAddress: "0x1234000000000000000000000000000000005678",
    totalAmount: 15000,
    receivedAmount: 5000,
    status: "active" as StatusType,
    milestones: [
      { id: "m1", title: "Architecture Design", type: "deadline" as MilestoneType, condition: "Submit PDF by May 1st", amount: 5000, status: "claimed" },
      { id: "m2", title: "Smart Contract Implementation", type: "contract-deploy" as MilestoneType, condition: "Deploy to 0x... on Arbitrum", amount: 5000, status: "claimable" },
      { id: "m3", title: "Audit & Mainnet", type: "tx-count" as MilestoneType, condition: "100+ interactions on testnet", amount: 5000, status: "upcoming" }
    ]
  },
  {
    id: "e2",
    title: "DeFi Analytics Dashboard Grant",
    funderAddress: "0xabcd00000000000000000000000000000000efgh",
    totalAmount: 5000,
    receivedAmount: 2500,
    status: "active" as StatusType,
    milestones: [
      { id: "m4", title: "Frontend Scaffold", type: "deadline" as MilestoneType, condition: "Next.js repo initialized", amount: 2500, status: "claimed" },
      { id: "m5", title: "Data Integration", type: "contract-deploy" as MilestoneType, condition: "Integrate Subgraph", amount: 2500, status: "pending" }
    ]
  },
  {
    id: "e3",
    title: "NFT Marketplace Smart Contracts",
    funderAddress: "0x9876000000000000000000000000000000005432",
    totalAmount: 8500,
    receivedAmount: 4000,
    status: "disputed" as StatusType,
    milestones: [
      { id: "m6", title: "Core Contracts", type: "contract-deploy" as MilestoneType, condition: "ERC721 implementation", amount: 4000, status: "claimed" },
      { id: "m7", title: "Royalty Engine", type: "tvl" as MilestoneType, condition: "$1k TVL on testnet", amount: 4500, status: "disputed" }
    ]
  }
];

const MOCK_PAYMENT_HISTORY = [
  { id: "tx1", date: "2026-05-15", escrow: "Uniswap v4 Hooks", milestone: "Architecture Design", amount: 5000, txHash: "0xabc...def", fullHash: "0xabc123def456" },
  { id: "tx2", date: "2026-04-20", escrow: "DeFi Analytics Dashboard", milestone: "Frontend Scaffold", amount: 2500, txHash: "0x123...456", fullHash: "0x123abc456def" },
  { id: "tx3", date: "2026-04-10", escrow: "NFT Marketplace", milestone: "Core Contracts", amount: 4000, txHash: "0x987...654", fullHash: "0x987def654abc" }
];

// --- Subcomponents ---
function StatCard({ title, value, subtitle, isAlert = false, valueColor }: { title: string; value: string | React.ReactNode; subtitle?: string; isAlert?: boolean; valueColor?: string }) {
  return (
    <div className="card bg-white p-5 flex flex-col gap-2 relative overflow-hidden group">
      {isAlert && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--danger-light)] rounded-bl-full flex items-start justify-end p-3 opacity-50 group-hover:opacity-100 transition-opacity">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--danger)] animate-pulse" />
        </div>
      )}
      <div className="text-sm font-medium text-[var(--text-secondary)]">{title}</div>
      <div className="text-3xl font-semibold font-playfair tracking-tight stat-number" style={{ color: valueColor || "var(--text-primary)" }}>{value}</div>
      {subtitle && (
        <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );
}

function ClaimModal({ 
  isOpen, 
  onClose, 
  milestone, 
  escrow 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  milestone: any; 
  escrow: any 
}) {
  const [claimState, setClaimState] = useState<"idle" | "verifying" | "verified" | "claiming" | "success">("idle");

  useEffect(() => {
    if (isOpen) {
      setClaimState("idle");
    }
  }, [isOpen]);

  if (!isOpen || !milestone) return null;

  const handleClaim = () => {
    setClaimState("verifying");
    setTimeout(() => {
      setClaimState("verified");
      setTimeout(() => {
        setClaimState("claiming");
        setTimeout(() => {
          setClaimState("success");
        }, 2000);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => claimState !== 'success' && claimState !== 'claiming' && onClose()} />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden flex flex-col animate-fade-in-up">
        {claimState === "success" && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="w-full h-full relative">
              {[...Array(30)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#22c55e', '#3b82f6', '#eab308', '#ec4899'][Math.floor(Math.random() * 4)],
                    left: '50%',
                    top: '50%',
                    animation: `confetti 1s ease-out forwards`,
                    transformOrigin: 'center',
                    '--tx': `${(Math.random() - 0.5) * 300}px`,
                    '--ty': `${(Math.random() - 0.5) * 300}px`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
        )}

        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface)]">
          <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-dm-sans)" }}>Claim Milestone</h3>
          <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" onClick={onClose} disabled={claimState === 'claiming'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2 p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
            <div className="text-sm text-[var(--text-secondary)]">Program</div>
            <div className="font-medium">{escrow.title}</div>
            <div className="w-full h-px bg-[var(--border)] my-2" />
            <div className="text-sm text-[var(--text-secondary)]">Milestone</div>
            <div className="font-medium">{milestone.title}</div>
            <div className="w-full h-px bg-[var(--border)] my-2" />
            <div className="text-sm text-[var(--text-secondary)]">Claim Amount</div>
            <div className="font-semibold text-[var(--success)] text-lg">
              <AmountDisplay amount={milestone.amount} currency="USDC" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {claimState === "idle" && (
              <button className="btn btn-primary w-full py-3" onClick={handleClaim}>
                Verify & Claim
              </button>
            )}

            {claimState !== "idle" && claimState !== "success" && (
              <div className="flex flex-col items-center justify-center py-6 gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-[var(--border)] border-t-[var(--primary)] animate-spin" />
                <div className="font-medium text-[var(--primary)]">
                  {claimState === "verifying" && "Verifying on-chain condition..."}
                  {claimState === "verified" && "Condition verified ✓"}
                  {claimState === "claiming" && "Claiming funds..."}
                </div>
              </div>
            )}

            {claimState === "success" && (
              <div className="flex flex-col items-center justify-center py-4 gap-4 animate-fade-in text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--success-light)] flex items-center justify-center text-[var(--success)] mb-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h4 className="text-xl font-bold font-playfair text-[var(--success)]">Claim Successful!</h4>
                <p className="text-[var(--text-secondary)]">
                  {milestone.amount} USDC has been sent to your wallet.
                </p>
                <button className="btn btn-secondary w-full mt-4" onClick={onClose}>
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function BuilderDashboard() {
  const [address] = useState("0x2b3C4D5e6F7890AbCdEf1234567890aBcDeF1234");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"escrows" | "history">("escrows");
  const [escrows, setEscrows] = useState(MOCK_BUILDER_ESCROWS);
  const [claimModalData, setClaimModalData] = useState<{ isOpen: boolean; milestone: any; escrow: any }>({
    isOpen: false,
    milestone: null,
    escrow: null
  });

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openClaimModal = (milestone: any, escrow: any) => {
    setClaimModalData({ isOpen: true, milestone, escrow });
  };

  // derived stats
  const totalReceived = escrows.reduce((sum, e) => sum + e.receivedAmount, 0);
  const activePrograms = escrows.filter(e => e.status === "active").length;
  
  let claimableCount = 0;
  let upcomingDeadlines = 0;
  
  escrows.forEach(e => {
    e.milestones.forEach(m => {
      if (m.status === "claimable") claimableCount++;
      if (m.type === "deadline" && m.status === "upcoming") upcomingDeadlines++;
    });
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)]">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes confetti {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}} />
      <Navbar />
      
      <main className="flex-1 max-w-[1200px] w-full mx-auto p-6 flex flex-col gap-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold font-playfair mb-3">My Grants & Bounties</h1>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="mono bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-lg font-medium">
                {address.slice(0,6)}...{address.slice(-4)}
              </span>
              <button onClick={handleCopyAddress} className="p-1.5 rounded-md hover:bg-[var(--surface-hover)] transition-colors" title="Copy Address">
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                )}
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-[var(--text-secondary)] mb-1">Total Earned</div>
            <div className="text-3xl font-bold text-[var(--success)] tracking-tight">
              {totalReceived.toLocaleString()} USDC Received
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Programs" value={activePrograms.toString()} subtitle="Currently working on" />
          <StatCard title="Pending Milestones" value={claimableCount.toString()} subtitle="Actionable claims" isAlert={claimableCount > 0} valueColor={claimableCount > 0 ? "var(--primary)" : undefined} />
          <StatCard title="Total Received" value={`${totalReceived.toLocaleString()} USDC`} subtitle="Lifetime earnings" />
          <StatCard title="Upcoming Deadlines" value={upcomingDeadlines.toString()} subtitle="Within 7 days" isAlert={upcomingDeadlines > 0} />
        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b border-[var(--border)]">
          <button 
            className={`pb-4 font-medium text-lg transition-colors border-b-2 ${activeTab === 'escrows' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            onClick={() => setActiveTab('escrows')}
          >
            Active Escrows
          </button>
          <button 
            className={`pb-4 font-medium text-lg transition-colors border-b-2 ${activeTab === 'history' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            onClick={() => setActiveTab('history')}
          >
            Payment History
          </button>
        </div>

        {/* TAB CONTENT */}
        {activeTab === 'escrows' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold font-dm-sans m-0">Your Escrows</h2>
              {claimableCount > 0 && (
                <button className="btn btn-primary">
                  Claim All Eligible ({claimableCount})
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6">
              {escrows.map((escrow) => (
                <div key={escrow.id} className="card bg-white p-6 md:p-8 flex flex-col md:flex-row gap-8">
                  {/* Left Side: Summary */}
                  <div className="w-full md:w-1/3 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-[var(--border)] pb-6 md:pb-0 md:pr-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{escrow.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mono mb-4">
                        Funded by: {escrow.funderAddress.slice(0,6)}...{escrow.funderAddress.slice(-4)}
                      </div>
                      <StatusBadge status={escrow.status} />
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)]">
                        <div className="text-sm text-[var(--text-secondary)] mb-1">Total Program Value</div>
                        <div className="text-xl font-semibold">{escrow.totalAmount.toLocaleString()} USDC</div>
                      </div>
                      <div className="bg-[var(--success-light)]/20 p-4 rounded-xl border border-[var(--success-light)]">
                        <div className="text-sm text-[var(--success)] mb-1">Total Received</div>
                        <div className="text-xl font-semibold text-[var(--success)]">{escrow.receivedAmount.toLocaleString()} USDC</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Timeline */}
                  <div className="w-full md:w-2/3 flex flex-col">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-6">Milestone Timeline</h4>
                    <div className="flex flex-col relative before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-[var(--border)]">
                      {escrow.milestones.map((milestone, i) => {
                        const isClaimed = milestone.status === 'claimed';
                        const isClaimable = milestone.status === 'claimable';
                        const isDisputed = milestone.status === 'disputed';
                        const isUpcoming = milestone.status === 'upcoming';
                        const isPending = milestone.status === 'pending';
                        
                        return (
                          <div key={milestone.id} className="flex gap-4 relative mb-6 last:mb-0">
                            {/* Icon column */}
                            <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center relative z-10 
                              ${isClaimed ? 'bg-[var(--success)] text-white' : 
                                isClaimable ? 'bg-white border-2 border-[var(--success)] text-[var(--success)]' : 
                                isDisputed ? 'bg-[var(--danger)] text-white' :
                                'bg-white border-2 border-[var(--border)] text-[var(--text-muted)]'
                              }`}
                            >
                              {isClaimed && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                              {isClaimable && <div className="w-2.5 h-2.5 rounded-full bg-[var(--success)]" />}
                              {isDisputed && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
                              {isUpcoming && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                              {isPending && <div className="w-2.5 h-2.5 rounded-full bg-[var(--text-muted)]" />}
                            </div>

                            {/* Content */}
                            <div className={`flex-1 p-4 rounded-xl border ${isClaimable ? 'border-[var(--primary)] bg-[var(--primary-light)]/5' : 'border-[var(--border)] bg-white'}`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">M{i+1}</span>
                                    <h5 className="font-semibold text-[var(--text-primary)] m-0">{milestone.title}</h5>
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] mb-3">
                                    <MilestoneTypeChip type={milestone.type} />
                                    <span>•</span>
                                    <span className="truncate max-w-[200px]">{milestone.condition}</span>
                                  </div>
                                  <div className="font-medium text-[var(--text-primary)]">
                                    {milestone.amount.toLocaleString()} USDC
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center sm:justify-end shrink-0">
                                  {isClaimed && (
                                    <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--success)] bg-[var(--success-light)]/30 px-3 py-1.5 rounded-full">
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                      Claimed
                                    </span>
                                  )}
                                  {isClaimable && (
                                    <button 
                                      className="btn btn-primary py-2 px-4 shadow-md shadow-[var(--primary)]/20"
                                      onClick={() => openClaimModal(milestone, escrow)}
                                    >
                                      Claim Now
                                    </button>
                                  )}
                                  {isPending && (
                                    <span className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] bg-[var(--surface)] px-3 py-1.5 rounded-full border border-[var(--border)]">
                                      <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-pulse" />
                                      Pending
                                    </span>
                                  )}
                                  {isDisputed && (
                                    <a href="#" className="text-sm font-medium text-[var(--danger)] hover:underline flex items-center gap-1">
                                      View Dispute <span aria-hidden="true">&rarr;</span>
                                    </a>
                                  )}
                                  {isUpcoming && (
                                    <span className="text-sm font-medium text-[var(--text-muted)]">
                                      Upcoming
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {escrows.length === 0 && (
              <EmptyState 
                title="No Active Escrows" 
                description="You don't have any active grants or bounties yet."
                variant="streams"
                action={{
                  label: "Explore Grants",
                  href: "/explore"
                }}
              />
            )}
          </div>
        )}

        {/* PAYMENT HISTORY */}
        {activeTab === 'history' && (
          <div className="card p-0 overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[var(--surface)] text-[var(--text-muted)] text-sm border-b border-[var(--border)]">
                    <th className="font-medium p-4">Date</th>
                    <th className="font-medium p-4">Program</th>
                    <th className="font-medium p-4">Milestone</th>
                    <th className="font-medium p-4 text-right">Amount</th>
                    <th className="font-medium p-4">TX Hash</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {MOCK_PAYMENT_HISTORY.map((tx) => (
                    <tr key={tx.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                      <td className="p-4 text-sm text-[var(--text-secondary)]">{tx.date}</td>
                      <td className="p-4 font-medium text-[var(--text-primary)]">{tx.escrow}</td>
                      <td className="p-4 text-sm text-[var(--text-secondary)]">{tx.milestone}</td>
                      <td className="p-4 text-right font-medium text-[var(--success)]">
                        +{tx.amount.toLocaleString()} USDC
                      </td>
                      <td className="p-4">
                        <a 
                          href={`https://arbiscan.io/tx/${tx.fullHash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm mono text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline"
                        >
                          {tx.txHash}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                  {MOCK_PAYMENT_HISTORY.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">
                        No payment history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
      
      <Footer />

      {/* MODALS */}
      <ClaimModal 
        isOpen={claimModalData.isOpen} 
        onClose={() => setClaimModalData({ ...claimModalData, isOpen: false })}
        milestone={claimModalData.milestone}
        escrow={claimModalData.escrow}
      />
    </div>
  );
}
