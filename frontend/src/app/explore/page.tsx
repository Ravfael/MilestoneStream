"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EscrowCard from "../components/EscrowCard";
import EmptyState from "../components/EmptyState";
import { MilestoneType } from "../components/MilestoneTypeChip";
import { usePublicClient } from "wagmi";
import { FACTORY_ADDRESS, ESCROW_FACTORY_ABI, MILESTONE_ESCROW_ABI } from "../components/contracts";

// Mock Data
const MOCK_ESCROWS = [
  {
    id: "1",
    status: "active" as const,
    title: "DeFi Analytics Dashboard Grant",
    creatorAddress: "0x1234000000000000000000000000000000005678",
    amount: 5000,
    completedMilestones: 2,
    totalMilestones: 4,
    milestoneTypes: ["contract-deploy", "tx-count"] as MilestoneType[],
    network: "Arbitrum One",
  },
  {
    id: "2",
    status: "completed" as const,
    title: "DEX Aggregator Integration",
    creatorAddress: "0xabcd00000000000000000000000000000000efgh",
    amount: 12000,
    completedMilestones: 3,
    totalMilestones: 3,
    milestoneTypes: ["contract-deploy", "tvl", "tx-count"] as MilestoneType[],
    network: "Robinhood Chain",
  },
  {
    id: "3",
    status: "active" as const,
    title: "NFT Marketplace Smart Contracts",
    creatorAddress: "0x9876000000000000000000000000000000005432",
    amount: 8500,
    completedMilestones: 0,
    totalMilestones: 5,
    milestoneTypes: ["contract-deploy", "deadline"] as MilestoneType[],
    network: "Arbitrum One",
  },
  {
    id: "4",
    status: "disputed" as const,
    title: "Cross-chain Bridge Audit",
    creatorAddress: "0xdead00000000000000000000000000000000beef",
    amount: 25000,
    completedMilestones: 1,
    totalMilestones: 2,
    milestoneTypes: ["deadline"] as MilestoneType[],
    network: "Arbitrum One",
  },
  {
    id: "5",
    status: "active" as const,
    title: "Yield Aggregator V2 Development",
    creatorAddress: "0x1111000000000000000000000000000000002222",
    amount: 15000,
    completedMilestones: 1,
    totalMilestones: 4,
    milestoneTypes: ["contract-deploy", "tvl"] as MilestoneType[],
    network: "Robinhood Chain",
  },
  {
    id: "6",
    status: "expired" as const,
    title: "Community Growth Campaign",
    creatorAddress: "0x3333000000000000000000000000000000004444",
    amount: 2000,
    completedMilestones: 0,
    totalMilestones: 2,
    milestoneTypes: ["holders", "deadline"] as MilestoneType[],
    network: "Arbitrum One",
  }
];

const TABS = ["All", "Active", "Completed", "Disputed", "Expired"];
const SORTS = ["Newest", "Most Funded", "Ending Soon"];
const NETWORKS = ["All Chains", "Arbitrum One", "Robinhood Chain", "Anvil Local"];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [activeSort, setActiveSort] = useState("Newest");
  const [activeNetwork, setActiveNetwork] = useState("All Chains");
  const [escrows, setEscrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const publicClient = usePublicClient();

  useEffect(() => {
    async function fetchEscrows() {
      if (!publicClient) {
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

        // 1. Get all escrow addresses
        const addresses = (await publicClient.readContract({
          address: FACTORY_ADDRESS as `0x${string}`,
          abi: ESCROW_FACTORY_ABI,
          functionName: "getAllEscrows",
        })) as any[];

        if (!addresses || addresses.length === 0) {
          setEscrows([]);
          setLoading(false);
          return;
        }

        // 2. Fetch details for each escrow in parallel
        const escrowData = await Promise.all(
          addresses.map(async (addr) => {
            try {
              const funder = await publicClient.readContract({
                address: addr as `0x${string}`,
                abi: MILESTONE_ESCROW_ABI,
                functionName: "funder",
              });
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
                  break; // out of bounds
                }
              }

              // Status mapping
              const statusMap: Record<number, string> = {
                0: "active",
                1: "completed",
                2: "cancelled",
                3: "disputed",
              };
              const statusStr = statusMap[statusRaw as number] || "active";

              // Count completed milestones
              const completedCount = milestones.filter(
                (m) => m[6] === 2 // Released is status 2
              ).length;

              // Verifier types mapping
              const getMilestoneType = (verifierAddr: string): string => {
                const lower = verifierAddr.toLowerCase();
                if (lower === "0x5fbdb2315678afecb367f032d93f642f64180aa3") return "contract-deploy";
                if (lower === "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512") return "deadline";
                if (lower === "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0") return "tx-count";
                if (lower === "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9") return "tvl";
                return "deadline"; // fallback
              };

              const milestoneTypes = milestones.map((m) => getMilestoneType(m[3]));
              const firstTitle = milestones[0]?.[0] || "Untitled Escrow";
              const escrowTitle = milestones.length > 1 ? `${firstTitle} (Multi-Step)` : firstTitle;

              return {
                id: addr,
                status: statusStr,
                title: escrowTitle,
                creatorAddress: funder,
                amount: Number(totalAmountRaw) / 1e6, // USDC uses 6 decimals
                completedMilestones: completedCount,
                totalMilestones: milestones.length,
                milestoneTypes: milestoneTypes,
                network: "Anvil Local",
              };
            } catch (e) {
              console.error("Error fetching details for escrow", addr, e);
              return null;
            }
          })
        );

        const activeEscrows = escrowData.filter((e) => e !== null) as any[];
        setEscrows(activeEscrows.reverse());
      } catch (e) {
        console.error("Failed to fetch escrows", e);
      } finally {
        setLoading(false);
      }
    }

    fetchEscrows();
  }, [publicClient]);

  // Merge with mock escrows if empty, to ensure the UI looks great for testing
  const allDisplayEscrows = escrows.length > 0 ? escrows : MOCK_ESCROWS;

  // Filtering Logic
  const filteredEscrows = allDisplayEscrows.filter((escrow) => {
    // Tab Filter
    if (activeTab !== "All" && escrow.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }
    // Network Filter
    if (activeNetwork !== "All Chains" && escrow.network !== activeNetwork) {
      return false;
    }
    // Search Filter
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        escrow.title.toLowerCase().includes(lowerQuery) ||
        escrow.creatorAddress.toLowerCase().includes(lowerQuery)
      );
    }
    return true;
  }).sort((a, b) => {
    // Basic sorting logic for demo
    if (activeSort === "Most Funded") {
      return b.amount - a.amount;
    }
    return 0; // Default or Newest (assuming ID order is newest)
  });

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[var(--background)]">
        {/* Page Header Area */}
        <section className="pt-16 pb-12 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              Explore Escrows
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl">
              Browse all milestone-based escrow programs on MilestoneStream. Support builders or discover interesting grants.
            </p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap gap-8 items-center text-[var(--text-primary)]">
              <div className="flex flex-col">
                <span className="text-2xl font-bold mono">156</span>
                <span className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wide">Active</span>
              </div>
              <div className="w-px h-10 bg-[var(--border)] hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold mono">89</span>
                <span className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wide">Completed</span>
              </div>
              <div className="w-px h-10 bg-[var(--border)] hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold mono text-[var(--primary)]">1.2M</span>
                <span className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wide">Total USDC Locked</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 sticky top-0 z-10 bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search by title, address, or creator..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-shadow shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Tabs & Dropdowns */}
            <div className="flex flex-wrap gap-3 items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="flex bg-[var(--surface-raised)] border border-[var(--border)] p-1 rounded-lg">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab 
                        ? "bg-[var(--primary)] text-white shadow-sm" 
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <select 
                className="py-2 pl-3 pr-8 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px top 50%", backgroundSize: "10px auto" }}
                value={activeNetwork}
                onChange={(e) => setActiveNetwork(e.target.value)}
              >
                {NETWORKS.map(net => <option key={net} value={net}>{net}</option>)}
              </select>

              <select 
                className="py-2 pl-3 pr-8 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px top 50%", backgroundSize: "10px auto" }}
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
              >
                {SORTS.map(sort => <option key={sort} value={sort}>{sort}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Escrow Cards Grid */}
        <section className="py-12 max-w-7xl mx-auto px-6 min-h-[500px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl p-6 h-[280px] animate-pulse flex flex-col shadow-sm">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-6 bg-[var(--border)] rounded-md w-1/3 opacity-40"></div>
                      <div className="h-6 bg-[var(--border)] rounded-full w-20 opacity-40"></div>
                    </div>
                    <div className="h-7 bg-[var(--border)] rounded-md w-3/4 mb-4 opacity-40"></div>
                    <div className="h-4 bg-[var(--border)] rounded-md w-full mb-2 opacity-40"></div>
                    <div className="h-4 bg-[var(--border)] rounded-md w-5/6 opacity-40"></div>
                  </div>
                  <div className="pt-4 mt-auto">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col gap-2">
                        <div className="h-4 bg-[var(--border)] rounded-md w-16 opacity-40"></div>
                        <div className="h-6 bg-[var(--border)] rounded-md w-24 opacity-40"></div>
                      </div>
                      <div className="h-10 bg-[var(--border)] rounded-lg w-28 opacity-40"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEscrows.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                {filteredEscrows.map((escrow) => (
                  <EscrowCard key={escrow.id} {...escrow} />
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-16 flex justify-center">
                <button className="btn btn-secondary btn-lg">
                  Load More Escrows
                </button>
              </div>
            </>
          ) : (
            <div className="animate-fade-in">
              <EmptyState 
                title="No escrows found" 
                description="Be the first to create one or adjust your filters to see existing escrows."
                variant="search"
                action={{
                  label: "Create Escrow",
                  href: "/create"
                }}
              />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
