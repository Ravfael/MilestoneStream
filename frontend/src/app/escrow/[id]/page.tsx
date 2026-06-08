"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AmountDisplay from "../../components/AmountDisplay";
import StatusBadge, { StatusType } from "../../components/StatusBadge";
import MilestoneTypeChip, { MilestoneType } from "../../components/MilestoneTypeChip";
import { useWallet } from "../../components/WalletContext";
import { useWriteContract, usePublicClient } from "wagmi";
import { MILESTONE_ESCROW_ABI } from "../../components/contracts";

// Mock Data
const MOCK_ESCROW = {
  id: "arbitrum-defi-grant",
  title: "DeFi Analytics Dashboard Grant",
  description: "A comprehensive grant program to build an analytics dashboard for DeFi protocols on Arbitrum, tracking TVL, volume, and active users across top DEXes.",
  tags: ["Analytics", "DeFi", "Frontend"],
  network: "Arbitrum One",
  status: "active" as StatusType,
  totalLocked: 5000,
  releasedAmount: 1500,
  remainingAmount: 3500,
  token: "USDC",
  usdRate: 1,
  createdDate: "2026-05-10",
  deadline: "2026-08-10",
  funder: {
    address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    avatar: "🟣",
  },
  builder: {
    address: "0x1b438B1C8808A7C642B5b6bC1234567890aBcDeF",
    avatar: "🟢",
  },
  milestones: [
    {
      id: "m1",
      index: 0,
      title: "Initial Setup & Contract Deployment",
      type: "contract-deploy" as MilestoneType,
      description: "Deploy the core data aggregation contracts to Arbitrum mainnet. Must include proper event emission for indexing.",
      verifierDetails: "Must deploy contract at any address on Arbitrum One emitting AnalyticsInit event.",
      amount: 1500,
      status: "claimed",
      deadline: "2026-05-20",
    },
    {
      id: "m2",
      index: 1,
      title: "Frontend Dashboard MVP",
      type: "deadline" as MilestoneType,
      description: "Complete the frontend displaying top 5 DEXes TVL and 24h volume. Must connect to the deployed subgraph.",
      verifierDetails: "Manual verification by funder or verified via GitHub Actions CI pipeline.",
      amount: 2000,
      status: "disputed",
      deadline: "2026-06-15",
    },
    {
      id: "m3",
      index: 2,
      title: "Final Audit & Release",
      type: "tx-count" as MilestoneType,
      description: "Dashboard hits 1000 unique interactions and undergoes informal review.",
      verifierDetails: "Subgraphs indicating >1000 unique wallet connections.",
      amount: 1500,
      status: "pending",
      deadline: "2026-08-10",
    },
  ],
  activityLog: [
    { id: "al3", event: "Milestone 2 Disputed", time: "2 hours ago", txHash: "0xdispute123" },
    { id: "al2", event: "Milestone 1 Claimed", time: "1 day ago", txHash: "0x789ghi" },
    { id: "al1", event: "Milestone 1 Verified", time: "1 day ago", txHash: "0xdef456" },
    { id: "al0", event: "Escrow Created", time: "2 days ago", txHash: "0xabc123" },
  ],
  hasDispute: true,
  disputeDetails: {
    challenge: "Frontend MVP deployed but fails to connect to the subgraph properly. Shows 0 TVL on 2 DEXes.",
    deadline: "2026-06-22",
    arbiter: "Kleros Court",
  },
};

const formatAddress = (address: string) => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function EscrowDetailPage() {
  const params = useParams();
  const escrowAddress = params?.id as string;

  const { connected, address } = useWallet();
  const [demoUserRole, setDemoUserRole] = useState<"visitor" | "funder" | "builder">("visitor");
  const [escrowState, setEscrowState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    async function fetchEscrowDetails() {
      if (!publicClient || !escrowAddress || !escrowAddress.startsWith("0x")) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Check if Escrow contract is deployed
        const bytecode = await publicClient.getBytecode({
          address: escrowAddress as `0x${string}`,
        });

        if (!bytecode || bytecode === "0x") {
          console.warn("Escrow contract not deployed on this network. Using mock data.");
          setLoading(false);
          return;
        }

        const funder = await publicClient.readContract({
          address: escrowAddress as `0x${string}`,
          abi: MILESTONE_ESCROW_ABI,
          functionName: "funder",
        });
        const builder = await publicClient.readContract({
          address: escrowAddress as `0x${string}`,
          abi: MILESTONE_ESCROW_ABI,
          functionName: "builder",
        });
        const token = await publicClient.readContract({
          address: escrowAddress as `0x${string}`,
          abi: MILESTONE_ESCROW_ABI,
          functionName: "token",
        });
        const totalAmountRaw = await publicClient.readContract({
          address: escrowAddress as `0x${string}`,
          abi: MILESTONE_ESCROW_ABI,
          functionName: "totalAmount",
        });
        const releasedRaw = await publicClient.readContract({
          address: escrowAddress as `0x${string}`,
          abi: MILESTONE_ESCROW_ABI,
          functionName: "releasedAmount",
        });
        const statusRaw = await publicClient.readContract({
          address: escrowAddress as `0x${string}`,
          abi: MILESTONE_ESCROW_ABI,
          functionName: "status",
        });

        // Fetch milestones
        const milestonesList: any[] = [];
        let i = 0;
        while (true) {
          try {
            const m = await publicClient.readContract({
              address: escrowAddress as `0x${string}`,
              abi: MILESTONE_ESCROW_ABI,
              functionName: "milestones",
              args: [BigInt(i)],
            });
            milestonesList.push(m);
            i++;
          } catch (e) {
            break;
          }
        }

        const statusMap: Record<number, string> = {
          0: "active",
          1: "completed",
          2: "cancelled",
          3: "disputed",
        };
        const statusStr = statusMap[statusRaw as number] || "active";

        const getMilestoneType = (verifierAddr: string): string => {
          const lower = verifierAddr.toLowerCase();
          if (lower === "0x5fbdb2315678afecb367f032d93f642f64180aa3") return "contract-deploy";
          if (lower === "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512") return "deadline";
          if (lower === "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0") return "tx-count";
          if (lower === "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9") return "tvl";
          return "deadline";
        };

        const milestonesFormatted = milestonesList.map((m, idx) => {
          let milestoneStatusStr = "pending";
          if (m[6] === 1) milestoneStatusStr = "claimed";
          else if (m[6] === 2) milestoneStatusStr = "verified";
          else if (m[6] === 3) milestoneStatusStr = "disputed";
          else if (m[6] === 4) milestoneStatusStr = "expired";

          return {
            id: `m-${idx}`,
            index: idx,
            title: m[0] || `Milestone ${idx + 1}`,
            type: getMilestoneType(m[3]),
            description: m[1] || "Automated milestone verification.",
            verifierDetails: `Verifier address: ${m[3]}`,
            amount: Number(m[2]) / 1e6,
            status: milestoneStatusStr,
            deadline: m[5] > 0 ? new Date(Number(m[5]) * 1000).toLocaleDateString() : undefined,
          };
        });

        const activeDispute = milestonesFormatted.find((m) => m.status === "disputed");

        setEscrowState({
          id: escrowAddress,
          title: milestonesFormatted[0]?.title ? `${milestonesFormatted[0].title} Escrow` : "Escrow Protocol Contract",
          description: `Decentralized milestone escrow contract clone deployed on Arbitrum at address ${escrowAddress}.`,
          tags: ["Decentralized", "Secure", "Arbitrum"],
          network: "Arbitrum One",
          status: statusStr,
          totalLocked: Number(totalAmountRaw) / 1e6,
          releasedAmount: Number(releasedRaw) / 1e6,
          remainingAmount: (Number(totalAmountRaw) - Number(releasedRaw)) / 1e6,
          token: "USDC",
          usdRate: 1,
          createdDate: new Date().toISOString().slice(0, 10),
          deadline: milestonesFormatted[milestonesFormatted.length - 1]?.deadline || "2026-08-30",
          funder: { address: funder, avatar: "🟣" },
          builder: { address: builder, avatar: "🟢" },
          milestones: milestonesFormatted,
          activityLog: [{ id: "al0", event: "Escrow Created & Funded", time: "Just now", txHash: escrowAddress }],
          hasDispute: !!activeDispute,
          disputeDetails: activeDispute
            ? {
                challenge: `Milestone ${activeDispute.index + 1} has been disputed by the funder.`,
                deadline: "Within 48h",
                arbiter: "Default Arbiter",
              }
            : undefined,
        });
      } catch (e) {
        console.error("Failed to fetch live escrow details, using mock", e);
      } finally {
        setLoading(false);
      }
    }

    fetchEscrowDetails();
  }, [publicClient, escrowAddress]);

  const activeEscrow = escrowState || MOCK_ESCROW;

  const derivedRole = (() => {
    if (!connected || !address) return "visitor";
    if (activeEscrow.funder.address.toLowerCase() === address.toLowerCase()) return "funder";
    if (activeEscrow.builder.address.toLowerCase() === address.toLowerCase()) return "builder";
    return "visitor";
  })();

  const handleBuilderClaim = async (milestoneIndex: number) => {
    if (!publicClient) return;
    try {
      const hash = await writeContractAsync({
        address: activeEscrow.id as `0x${string}`,
        abi: MILESTONE_ESCROW_ABI,
        functionName: "claimMilestone",
        args: [BigInt(milestoneIndex)],
      });
      await publicClient.waitForTransactionReceipt({ hash });
      window.location.reload();
    } catch (e) {
      console.error("Claim failed", e);
    }
  };

  const handleBuilderRelease = async (milestoneIndex: number) => {
    if (!publicClient) return;
    try {
      const hash = await writeContractAsync({
        address: activeEscrow.id as `0x${string}`,
        abi: MILESTONE_ESCROW_ABI,
        functionName: "releaseMilestone",
        args: [BigInt(milestoneIndex)],
      });
      await publicClient.waitForTransactionReceipt({ hash });
      window.location.reload();
    } catch (e) {
      console.error("Release failed", e);
    }
  };

  const handleFunderDispute = async (milestoneIndex: number) => {
    if (!publicClient) return;
    try {
      const hash = await writeContractAsync({
        address: activeEscrow.id as `0x${string}`,
        abi: MILESTONE_ESCROW_ABI,
        functionName: "disputeMilestone",
        args: [BigInt(milestoneIndex)],
      });
      await publicClient.waitForTransactionReceipt({ hash });
      window.location.reload();
    } catch (e) {
      console.error("Dispute failed", e);
    }
  };

  const getNetworkIcon = (network: string) => {
    if (network === "Arbitrum One") return "🔵";
    if (network === "Robinhood Chain") return "🏹";
    return "🌐";
  };

  const escrow = activeEscrow;
  const userRole = escrowState ? derivedRole : demoUserRole;
  const setUserRole = setDemoUserRole;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)]">
      <Navbar />

      <main className="flex-1 max-w-[1100px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 animate-fade-in-up">
        {/* Role Switcher for Demo Purposes */}
        <div className="bg-white p-3 rounded-xl border border-[var(--border)] shadow-sm flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--text-secondary)]">Demo View As:</span>
          <div className="flex gap-2 bg-[var(--surface)] p-1 rounded-lg">
            {(["visitor", "funder", "builder"] as const).map((role) => (
              <button
                key={role}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${userRole === role ? "bg-white text-[var(--primary)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                onClick={() => setUserRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* 1. BREADCRUMB */}
        <div className="text-sm font-medium text-[var(--text-muted)] flex items-center gap-2 mt-2">
          <Link href="/explore" className="hover:text-[var(--primary)] transition-colors">
            Explore
          </Link>
          <span>→</span>
          <span className="text-[var(--text-primary)]">{escrow.title}</span>
        </div>

        {/* 6. DISPUTE PANEL (Conditional) */}
        {escrow.hasDispute && (
          <div className="bg-[var(--danger-light)] border border-[var(--danger)]/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start shadow-sm animate-slide-in-right">
            <div className="w-12 h-12 rounded-full bg-[var(--danger)]/10 text-[var(--danger)] flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <h4 className="font-semibold text-[var(--danger)] text-lg m-0">This escrow has an active dispute</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-3 leading-relaxed">
                <span className="font-medium text-[var(--text-primary)]">Challenge Details:</span> {escrow.disputeDetails.challenge}
              </p>
              <div className="flex flex-wrap gap-5 text-xs font-medium text-[var(--text-secondary)] bg-white/50 p-3 rounded-lg border border-[var(--danger)]/10 w-fit">
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Resolution Deadline: <span className="text-[var(--text-primary)]">{escrow.disputeDetails.deadline}</span>
                </span>
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Arbiter: <span className="text-[var(--text-primary)]">{escrow.disputeDetails.arbiter}</span>
                </span>
              </div>
            </div>
            {userRole === "funder" || userRole === "builder" ? (
              <button className="sm:ml-auto btn btn-secondary text-sm shrink-0 w-full sm:w-auto border-[var(--danger)]/30 text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white hover:border-[var(--danger)]">Manage Dispute</button>
            ) : null}
          </div>
        )}

        {/* 2. ESCROW HEADER */}
        <div className="card bg-white p-6 sm:p-8 flex flex-col md:flex-row gap-8 shadow-sm">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-[var(--border)] pb-6 md:pb-0 md:pr-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={escrow.status} />
                <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] bg-[var(--surface)] px-2.5 py-1 rounded-md border border-[var(--border)]">
                  {getNetworkIcon(escrow.network)} {escrow.network}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-playfair m-0 leading-tight">{escrow.title}</h1>
            </div>

            <p className="text-[var(--text-secondary)] leading-relaxed text-base">{escrow.description}</p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {escrow.tags.map((tag: any) => (
                <span key={tag} className="text-xs font-medium bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-[340px] flex flex-col gap-6 shrink-0 bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)]">
            <div>
              <div className="text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Total Locked</div>
              <AmountDisplay amount={escrow.totalLocked} token={escrow.token} usdRate={escrow.usdRate} size="lg" />
            </div>

            <div className="w-full h-px bg-[var(--border)]" />

            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-[var(--success)] flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Released: {escrow.releasedAmount.toLocaleString()} {escrow.token}
                </span>
                <span className="text-[var(--text-primary)]">
                  Remaining: {escrow.remainingAmount.toLocaleString()} {escrow.token}
                </span>
              </div>
              <div className="progress-bar !h-3 !bg-white border border-[var(--border)] shadow-inner">
                <div className="progress-bar-fill relative overflow-hidden" style={{ width: `${(escrow.releasedAmount / escrow.totalLocked) * 100}%`, backgroundColor: "var(--success)" }}>
                  <div className="absolute inset-0 bg-white/20" style={{ transform: "skewX(-45deg) translateX(-150%)", animation: "shimmer 2s infinite" }} />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-[var(--border)]" />

            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm items-center">
                <span className="text-[var(--text-secondary)] font-medium">Created Date</span>
                <span className="font-semibold">{escrow.createdDate}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-[var(--text-secondary)] font-medium">Deadline</span>
                <span className="font-semibold flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {escrow.deadline}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PARTIES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {/* Funder Card */}
          <div className="card p-5 sm:p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform border-[var(--border)] shadow-sm">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-[var(--border)] flex items-center justify-center text-3xl shrink-0 shadow-sm">{escrow.funder.avatar}</div>
            <div className="flex flex-col overflow-hidden gap-1">
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                Funder
              </div>
              <div className="font-semibold mono text-lg text-[var(--text-primary)] truncate" title={escrow.funder.address}>
                {formatAddress(escrow.funder.address)}
              </div>
            </div>
            <a
              href={`https://arbiscan.io/address/${escrow.funder.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto p-3 bg-[var(--surface)] rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-all"
              title="View on Arbiscan"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          {/* Builder Card */}
          <div className="card p-5 sm:p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform border-[var(--border)] shadow-sm">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-[var(--border)] flex items-center justify-center text-3xl shrink-0 shadow-sm">{escrow.builder.avatar}</div>
            <div className="flex flex-col overflow-hidden gap-1">
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--success)] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                Builder
              </div>
              <div className="font-semibold mono text-lg text-[var(--text-primary)] truncate" title={escrow.builder.address}>
                {formatAddress(escrow.builder.address)}
              </div>
            </div>
            <a
              href={`https://arbiscan.io/address/${escrow.builder.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto p-3 bg-[var(--surface)] rounded-lg text-[var(--text-muted)] hover:text-[var(--success)] hover:bg-[var(--success-light)] transition-all"
              title="View on Arbiscan"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Layout for Timeline and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 mt-4">
          {/* 4. MILESTONE TIMELINE */}
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-bold font-playfair flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Milestone Timeline
            </h3>

            <div className="flex flex-col relative before:absolute before:inset-y-0 before:left-[23px] before:w-0.5 before:bg-[var(--border)] ml-1 mt-2">
              {escrow.milestones.map((milestone: any, i: number) => {
                const isClaimed = milestone.status === "claimed";
                const isVerified = milestone.status === "verified";
                const isDisputed = milestone.status === "disputed";
                const isPending = milestone.status === "pending";

                return (
                  <div key={milestone.id} className="flex gap-6 relative mb-10 last:mb-0 group">
                    {/* Stepper Circle */}
                    <div
                      className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center relative z-10 shadow-md border-[3px] transition-transform group-hover:scale-110
                      ${
                        isClaimed
                          ? "bg-[var(--success)] border-white text-white"
                          : isVerified
                            ? "bg-white border-[var(--success)] text-[var(--success)]"
                            : isDisputed
                              ? "bg-[var(--danger)] border-white text-white"
                              : "bg-[var(--surface)] border-[var(--border-strong)] text-[var(--text-muted)]"
                      }`}
                    >
                      {isClaimed && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {isVerified && <div className="w-3.5 h-3.5 rounded-full bg-[var(--success)] animate-pulse" />}
                      {isDisputed && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      )}
                      {isPending && <span className="font-bold font-mono text-lg">{i + 1}</span>}
                    </div>

                    {/* Content Card */}
                    <div
                      className={`flex-1 card p-6 md:p-8 !transition-all shadow-sm hover:shadow-md 
                      ${isDisputed ? "border-[var(--danger)] shadow-[0_4px_12px_rgba(220,38,38,0.1)]" : isVerified ? "border-[var(--success)] shadow-[0_4px_12px_rgba(5,150,105,0.1)]" : ""}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 mb-5">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--surface)] px-2 py-0.5 rounded">M{i + 1}</span>
                            <h4 className="text-xl font-bold m-0 text-[var(--text-primary)]">{milestone.title}</h4>
                          </div>
                          <div className="flex items-center gap-3">
                            <MilestoneTypeChip type={milestone.type} />
                            {milestone.deadline && (
                              <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 bg-[var(--surface)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 14" />
                                </svg>
                                Due: {milestone.deadline}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-start md:items-end gap-2 bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]">
                          <div className="text-2xl font-bold mono text-[var(--text-primary)] leading-none">
                            {milestone.amount.toLocaleString()} <span className="text-sm text-[var(--text-secondary)]">USDC</span>
                          </div>
                          <div
                            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md w-full text-center mt-1
                            ${
                              isClaimed
                                ? "bg-[var(--success)] text-white"
                                : isVerified
                                  ? "bg-[var(--success-light)] text-[var(--success)] border border-[var(--success)]/20"
                                  : isDisputed
                                    ? "bg-[var(--danger)] text-white"
                                    : "bg-white text-[var(--text-muted)] border border-[var(--border)]"
                            }`}
                          >
                            {milestone.status}
                          </div>
                        </div>
                      </div>

                      <p className="text-[0.9375rem] text-[var(--text-secondary)] mb-6 leading-relaxed">{milestone.description}</p>

                      <div className="bg-[var(--primary-light)]/30 p-4 rounded-xl border border-[var(--primary)]/10 mb-6 flex gap-3 items-start">
                        <div className="mt-0.5 text-[var(--primary)]">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">Verifier Details</div>
                          <div className="text-sm font-medium text-[var(--text-primary)]">{milestone.verifierDetails}</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-[var(--border)]">
                        {/* Builder Actions */}
                        {userRole === "builder" && (
                          <>
                            {isClaimed && (
                              <button className="btn btn-primary shadow-md flex items-center gap-2" onClick={() => handleBuilderRelease(milestone.index)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                                Claim Funds (Withdraw)
                              </button>
                            )}
                            {isClaimed && <button className="btn btn-secondary bg-[var(--surface)] hover:bg-[var(--border)]">View Proof</button>}
                            {isDisputed && <button className="btn btn-secondary border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white">Submit Evidence</button>}
                            {isPending && (
                              <button className="btn btn-primary bg-[var(--text-primary)] hover:bg-black" onClick={() => handleBuilderClaim(milestone.index)}>
                                Submit for Verification
                              </button>
                            )}
                          </>
                        )}

                        {/* Funder Actions */}
                        {userRole === "funder" && (
                          <>
                            {isClaimed && (
                              <button className="btn !bg-white !text-[var(--danger)] border border-[var(--danger)] hover:!bg-[var(--danger)] hover:!text-white transition-colors" onClick={() => handleFunderDispute(milestone.index)}>
                                Dispute Claim
                              </button>
                            )}
                            {(isClaimed || isVerified) && <button className="btn btn-secondary bg-[var(--surface)] hover:bg-[var(--border)]">View Proof</button>}
                            {isPending && <button className="btn btn-secondary bg-white">Verify Manually</button>}
                          </>
                        )}

                        {/* Public / Anyone Actions */}
                        {(isClaimed || isVerified || isDisputed) && userRole === "visitor" && <button className="btn btn-secondary bg-[var(--surface)] hover:bg-[var(--border)] text-sm">View Proof</button>}

                        <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline ml-auto">
                          View on Arbiscan
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. ACTIVITY LOG */}
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-bold font-playfair flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Activity Log
            </h3>
            <div className="card p-0 overflow-hidden shadow-sm border-[var(--border)] sticky top-6">
              <div className="flex flex-col">
                {escrow.activityLog.map((log: any, index: number) => (
                  <div key={log.id} className="p-5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] transition-colors flex items-start gap-4">
                    <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-white border border-[var(--border)] flex items-center justify-center shadow-sm">
                      {log.event.includes("Disputed") && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      )}
                      {log.event.includes("Claimed") && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {log.event.includes("Verified") && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      )}
                      {log.event.includes("Created") && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{log.event}</div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {log.time}
                        </span>
                        <a
                          href={`https://arbiscan.io/tx/${log.txHash}`}
                          className="text-xs font-mono font-medium text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded hover:underline flex items-center gap-1 transition-colors"
                        >
                          {log.txHash.slice(0, 10)}...
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-[var(--surface)] border-t border-[var(--border)] text-center">
                <a href="#" className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  View Full History →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
