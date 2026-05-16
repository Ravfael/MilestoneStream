"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatusBadge from "../components/StatusBadge";
import AmountDisplay from "../components/AmountDisplay";
import EmptyState from "../components/EmptyState";
import TransactionPendingModal from "../components/TransactionPendingModal";
import CreateEscrowDrawer from "../components/CreateEscrowDrawer";

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
  const [isConnected, setIsConnected] = useState(true);
  const [address] = useState("0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12");
  const [copied, setCopied] = useState(false);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [txModalState, setTxModalState] = useState<{ isOpen: boolean; state: "pending" | "confirmed" | "error" }>({
    isOpen: false,
    state: "pending"
  });

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeployEscrow = (data: any) => {
    setIsDrawerOpen(false);
    setTxModalState({ isOpen: true, state: "pending" });
    
    // Simulate transaction
    setTimeout(() => {
      setTxModalState({ isOpen: true, state: "confirmed" });
    }, 3000);
  };

  // Disconnected State
  if (!isConnected) {
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
              onClick: () => setIsConnected(true)
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
                {MOCK_ESCROWS.map((escrow) => {
                  const progressPercent = (escrow.milestonesCompleted / escrow.milestonesTotal) * 100;
                  return (
                    <tr key={escrow.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                      <td className="p-4 font-medium text-[var(--text-primary)]">{escrow.name}</td>
                      <td className="p-4"><StatusBadge status={escrow.status as any} /></td>
                      <td className="p-4 text-right">
                        <AmountDisplay amount={escrow.totalAmount} currency="USDC" />
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
          
          {MOCK_ESCROWS.length === 0 && (
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
      
      {/* Dev Toggle for state */}
      <button 
        onClick={() => setIsConnected(!isConnected)}
        style={{ position: "fixed", bottom: 16, right: 16, padding: "8px 12px", background: "black", color: "white", borderRadius: 8, fontSize: 12, zIndex: 9999, opacity: 0.5 }}
      >
        Toggle Connection
      </button>
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
