"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatusBadge from "../components/StatusBadge";
import AmountDisplay from "../components/AmountDisplay";
import EmptyState from "../components/EmptyState";
import TransactionPendingModal from "../components/TransactionPendingModal";
import CreateEscrowDrawer from "../components/CreateEscrowDrawer";
import { useWallet } from "../components/WalletContext";
import { useWriteContract, usePublicClient } from "wagmi";
import { parseEventLogs } from "viem";
import { FACTORY_ADDRESS, MOCK_USDC_ADDRESS, ESCROW_FACTORY_ABI, MILESTONE_ESCROW_ABI, ERC20_ABI, VERIFIER_ADDRESSES, encodeVerifierParams } from "../components/contracts";

// Mock Data
const MOCK_ESCROWS = [
  {
    id: "1",
    name: "Uniswap v4 Hooks",
    status: "active",
    totalAmount: 15000,
    released: 5000,
    milestonesTotal: 3,
    milestonesCompleted: 1,
    created: "2026-05-10",
  },
  {
    id: "2",
    name: "Lending Protocol Audits",
    status: "pending",
    totalAmount: 25000,
    released: 0,
    milestonesTotal: 4,
    milestonesCompleted: 0,
    created: "2026-05-14",
  },
  {
    id: "3",
    name: "Frontend Redesign",
    status: "disputed",
    totalAmount: 8000,
    released: 4000,
    milestonesTotal: 2,
    milestonesCompleted: 1,
    created: "2026-04-20",
  },
  {
    id: "4",
    name: "Initial Prototype",
    status: "completed",
    totalAmount: 5000,
    released: 5000,
    milestonesTotal: 1,
    milestonesCompleted: 1,
    created: "2026-03-15",
  }
];

export default function FunderDashboard() {
  const { connected, address, connect } = useWallet();
  const [copied, setCopied] = useState(false);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [txModalState, setTxModalState] = useState<{ isOpen: boolean; state: "pending" | "confirmed" | "error" }>({
    isOpen: false,
    state: "pending"
  });

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  useEffect(() => {
    async function fetchFunderEscrows() {
      if (!publicClient || !address) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Check if Factory contract is deployed
        const bytecode = await publicClient.getBytecode({
          address: FACTORY_ADDRESS as `0x${string}`,
        });

        if (!bytecode || bytecode === "0x") {
          console.warn("Factory contract not deployed on this network. Using mock data.");
          setEscrows([]);
          setLoading(false);
          return;
        }

        const addresses = (await publicClient.readContract({
          address: FACTORY_ADDRESS as `0x${string}`,
          abi: ESCROW_FACTORY_ABI,
          functionName: "getEscrowsByFunder",
          args: [address as `0x${string}`],
        })) as any[];

        if (!addresses || addresses.length === 0) {
          setEscrows([]);
          setLoading(false);
          return;
        }

        const escrowData = await Promise.all(
          addresses.map(async (addr) => {
            try {
              const builder = await publicClient.readContract({
                address: addr as `0x${string}`,
                abi: MILESTONE_ESCROW_ABI,
                functionName: "builder",
              });
              const totalAmountRaw = await publicClient.readContract({
                address: addr as `0x${string}`,
                abi: MILESTONE_ESCROW_ABI,
                functionName: "totalAmount",
              });
              const releasedRaw = await publicClient.readContract({
                address: addr as `0x${string}`,
                abi: MILESTONE_ESCROW_ABI,
                functionName: "releasedAmount",
              });
              const statusRaw = await publicClient.readContract({
                address: addr as `0x${string}`,
                abi: MILESTONE_ESCROW_ABI,
                functionName: "status",
              });

              // Try/catch loop to fetch milestones
              const milestones: any[] = [];
              let i = 0;
              while (true) {
                try {
                  const milestone = await publicClient.readContract({
                    address: addr as `0x${string}`,
                    abi: MILESTONE_ESCROW_ABI,
                    functionName: "milestones",
                    args: [BigInt(i)],
                  });
                  milestones.push(milestone);
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

              const completedCount = milestones.filter(
                (m) => m[6] === 2
              ).length;

              const firstTitle = milestones[0]?.[0] || "Untitled Escrow";
              const escrowTitle = milestones.length > 1 ? `${firstTitle} (Multi-Step)` : firstTitle;

              return {
                id: addr,
                name: escrowTitle,
                status: statusStr,
                totalAmount: Number(totalAmountRaw) / 1e6,
                released: Number(releasedRaw) / 1e6,
                milestonesTotal: milestones.length,
                milestonesCompleted: completedCount,
                created: "2026-06-01",
              };
            } catch (e) {
              console.error("Error fetching funder escrow", addr, e);
              return null;
            }
          })
        );

        setEscrows(escrowData.filter((e) => e !== null) as any[]);
      } catch (e) {
        console.error("Failed to fetch funder escrows", e);
      } finally {
        setLoading(false);
      }
    }

    fetchFunderEscrows();
  }, [publicClient, address]);

  const displayEscrows = escrows.length > 0 ? escrows : MOCK_ESCROWS;

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeployEscrow = async (data: any) => {
    setIsDrawerOpen(false);
    setTxModalState({ isOpen: true, state: "pending" });
    
    try {
      if (!publicClient) throw new Error("Public client not available");

      // 1. Format the milestones for the contract
      const formattedMilestones = data.milestones.map((m: any) => {
        const verifierAddr = VERIFIER_ADDRESSES[m.type] || VERIFIER_ADDRESSES["deadline"];
        const verifierParams = encodeVerifierParams(m.type, m.params, m.deadline);
        const amountRaw = BigInt(Math.floor(parseFloat(m.amount) * 1e6)); // USDC uses 6 decimals
        const deadlineTimestamp = m.deadline ? BigInt(Math.floor(new Date(m.deadline).getTime() / 1000)) : BigInt(0);

        return {
          title: m.description || "Milestone",
          description: m.description || "No description provided",
          amount: amountRaw,
          verifier: verifierAddr as `0x${string}`,
          verifierParams: verifierParams,
          deadline: deadlineTimestamp,
          status: 0, // Pending
          isOptimistic: m.type === "deadline",
          claimedAt: BigInt(0),
        };
      });

      const totalAmountRaw = BigInt(Math.floor(parseFloat(data.totalAmount) * 1e6));

      // 2. Call createEscrow on Factory
      const deployHash = await writeContractAsync({
        address: FACTORY_ADDRESS as `0x${string}`,
        abi: ESCROW_FACTORY_ABI,
        functionName: "createEscrow",
        args: [
          data.builderWallet as `0x${string}`,
          MOCK_USDC_ADDRESS as `0x${string}`,
          formattedMilestones,
        ],
      });

      const deployReceipt = await publicClient.waitForTransactionReceipt({ hash: deployHash });
      
      const logs = parseEventLogs({
        abi: ESCROW_FACTORY_ABI,
        eventName: "EscrowDeployed",
        logs: deployReceipt.logs,
      });

      const newEscrowAddress = (logs[0] as any)?.args?.escrow;
      if (!newEscrowAddress) throw new Error("Escrow address not found in event logs");

      // 3. Approve MockUSDC to transfer the total amount to the new escrow address
      const approveHash = await writeContractAsync({
        address: MOCK_USDC_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [newEscrowAddress, totalAmountRaw],
      });

      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // 4. Call lockFunds on the new escrow
      const lockHash = await writeContractAsync({
        address: newEscrowAddress,
        abi: MILESTONE_ESCROW_ABI,
        functionName: "lockFunds",
        args: [totalAmountRaw],
      });

      await publicClient.waitForTransactionReceipt({ hash: lockHash });

      setTxModalState({ isOpen: true, state: "confirmed" });
      
      // Refresh list
      const addresses = await publicClient.readContract({
        address: FACTORY_ADDRESS as `0x${string}`,
        abi: ESCROW_FACTORY_ABI,
        functionName: "getEscrowsByFunder",
        args: [address as `0x${string}`],
      });
      // Simple reload or wait for next trigger
    } catch (e) {
      console.error("Failed to deploy and fund escrow", e);
      setTxModalState({ isOpen: true, state: "error" });
    }
  };

  // Disconnected State
  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <EmptyState
            title="Connect Your Wallet"
            description="You need to connect your wallet to view and manage your escrows, create new ones, and track progress."
            variant="wallet"
            action={{
              label: "Connect Wallet",
              onClick: connect
            }}
          />
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)]">
      <Navbar />
      
      <main className="flex-1 max-w-[1200px] w-full mx-auto p-6 flex flex-col gap-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "2rem" }}>My Escrows</h1>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="mono bg-white border border-[var(--border)] px-2 py-1 rounded-md">
                {address.slice(0,6)}...{address.slice(-4)}
              </span>
              <button onClick={handleCopyAddress} className="btn-ghost p-1" title="Copy Address">
                {copied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                )}
              </button>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => setIsDrawerOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create New Escrow
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Locked" value="$48,000" subtitle="Across 4 escrows" />
          <StatCard title="Active Escrows" value="2" subtitle="Currently in progress" />
          <StatCard title="Milestones Released" value="14" subtitle="Total completed" />
          <StatCard title="Pending Disputes" value="1" subtitle="Requires attention" isAlert />
        </div>

        {/* ESCROWS LIST */}
        <div className="card overflow-hidden p-0">
          <div className="p-5 border-b border-[var(--border)] flex justify-between items-center bg-white">
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontFamily: "var(--font-dm-sans)", fontWeight: 600 }}>Active & Past Escrows</h2>
            <div className="flex gap-2">
              <select className="px-3 py-1.5 border border-[var(--border)] rounded-md text-sm outline-none bg-[var(--surface)]">
                <option>All Statuses</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Disputed</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[var(--surface)] text-[var(--text-muted)] text-sm border-b border-[var(--border)]">
                  <th className="font-medium p-4">Escrow Name</th>
                  <th className="font-medium p-4">Status</th>
                  <th className="font-medium p-4 text-right">Total Amount</th>
                  <th className="font-medium p-4">Progress</th>
                  <th className="font-medium p-4">Created</th>
                  <th className="font-medium p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {displayEscrows.map((escrow) => {
                  const progressPercent = (escrow.milestonesCompleted / escrow.milestonesTotal) * 100;
                  return (
                    <tr key={escrow.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                      <td className="p-4 font-medium text-[var(--text-primary)]">{escrow.name}</td>
                      <td className="p-4"><StatusBadge status={escrow.status as any} /></td>
                      <td className="p-4 text-right">
                        <AmountDisplay amount={escrow.totalAmount} token="USDC" />
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                          {escrow.released} USDC released
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5 w-32">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-[var(--text-secondary)]">{escrow.milestonesCompleted} / {escrow.milestonesTotal}</span>
                            <span className="text-[var(--text-muted)]">{Math.round(progressPercent)}%</span>
                          </div>
                          <div className="progress-bar w-full bg-[var(--border)] h-1.5 rounded-full overflow-hidden">
                            <div className="progress-bar-fill h-full bg-[var(--primary)]" style={{ width: `${progressPercent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[var(--text-secondary)]">{escrow.created}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button className="btn-secondary px-3 py-1.5 text-xs">View</button>
                          {escrow.status === 'active' && (
                            <button className="btn-ghost px-3 py-1.5 text-xs text-[var(--text-primary)] hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border)] rounded-md">
                              Manage
                            </button>
                          )}
                          {escrow.status === 'disputed' && (
                            <button className="btn-secondary px-3 py-1.5 text-xs text-[var(--danger)] border-[var(--danger-light)] hover:bg-[var(--danger-light)]">
                              Resolve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {displayEscrows.length === 0 && (
            <div className="py-12 bg-white">
              <EmptyState
                title="No Escrows Found"
                description="You haven't created any escrows yet. Get started by creating your first milestone-based escrow."
                variant="streams"
                action={{
                  label: "Create New Escrow",
                  onClick: () => setIsDrawerOpen(true)
                }}
              />
            </div>
          )}
        </div>

      </main>
      
      <Footer />

      {/* DRAWERS & MODALS */}
      <CreateEscrowDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onDeploy={handleDeployEscrow}
      />
      
      <TransactionPendingModal
        isOpen={txModalState.isOpen}
        onClose={() => setTxModalState({ ...txModalState, isOpen: false })}
        state={txModalState.state}
      />
    </div>
  );
}

function StatCard({ title, value, subtitle, isAlert = false }: { title: string; value: string; subtitle: string; isAlert?: boolean }) {
  return (
    <div className="card bg-white p-5 flex flex-col gap-2 relative overflow-hidden group">
      {isAlert && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--danger-light)] rounded-bl-full flex items-start justify-end p-3 opacity-50 group-hover:opacity-100 transition-opacity">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--danger)] animate-pulse" />
        </div>
      )}
      <div className="text-sm font-medium text-[var(--text-secondary)]">{title}</div>
      <div className="text-3xl font-semibold font-playfair tracking-tight text-[var(--text-primary)] stat-number">{value}</div>
      <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-1">
        {subtitle}
      </div>
    </div>
  );
}
