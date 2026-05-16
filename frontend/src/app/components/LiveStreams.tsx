const streams = [
  {
    title: "DeFi Dashboard Redesign",
    builder: "0x1a2B...7c9D",
    funder: "0xf4E8...2a1B",
    total: "25,000",
    released: "15,000",
    progress: 60,
    milestones: { done: 3, total: 5 },
    status: "active" as const,
  },
  {
    title: "Cross-Chain Bridge Audit",
    builder: "0x8cD3...4e5F",
    funder: "0xa1B2...8f3C",
    total: "40,000",
    released: "40,000",
    progress: 100,
    milestones: { done: 4, total: 4 },
    status: "completed" as const,
  },
  {
    title: "NFT Marketplace MVP",
    builder: "0x3e7A...1b2C",
    funder: "0xd5F6...9a4E",
    total: "18,500",
    released: "0",
    progress: 0,
    milestones: { done: 0, total: 6 },
    status: "pending" as const,
  },
];

const statusConfig = {
  active: { badge: "badge-active", label: "Active" },
  completed: { badge: "badge-completed", label: "Completed" },
  pending: { badge: "badge-pending", label: "Pending" },
  disputed: { badge: "badge-disputed", label: "Disputed" },
};

export default function LiveStreams() {
  return (
    <section id="live-streams" className="py-24 md:py-32" style={{ background: "var(--background)" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center mb-16">
          <div className="badge badge-pending mb-4 inline-flex">
            <span className="badge-dot" />
            Real-Time
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Live Streams</h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Real escrow streams running on Arbitrum right now. Every number is verifiable on-chain.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {streams.map((s, i) => {
            const cfg = statusConfig[s.status];
            return (
              <div key={s.title} className={`card animate-fade-in-up delay-${(i + 1) * 200} flex flex-col`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-semibold" style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text-primary)" }}>
                    {s.title}
                  </h3>
                  <span className={`badge ${cfg.badge}`}>
                    <span className="badge-dot" />
                    {cfg.label}
                  </span>
                </div>

                {/* Addresses */}
                <div className="flex gap-6 mb-5 text-xs" style={{ color: "var(--text-muted)" }}>
                  <div>
                    <span className="block mb-0.5 font-medium" style={{ color: "var(--text-secondary)" }}>Builder</span>
                    <span className="mono">{s.builder}</span>
                  </div>
                  <div>
                    <span className="block mb-0.5 font-medium" style={{ color: "var(--text-secondary)" }}>Funder</span>
                    <span className="mono">{s.funder}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="mono text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                    ${s.released}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    / ${s.total} USDC
                  </span>
                </div>

                {/* Progress */}
                <div className="progress-bar mb-3">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${s.progress}%`,
                      background: s.status === "completed" ? "var(--success)" : "var(--primary)",
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>{s.milestones.done} of {s.milestones.total} milestones</span>
                  <span className="mono">{s.progress}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a href="#" className="btn btn-secondary" id="btn-view-all">
            View All Streams
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
