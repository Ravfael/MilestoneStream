export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Grid pattern background */}
      <div className="hero-grid-pattern hero-grid-fade absolute inset-0 pointer-events-none" />

      <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left content */}
          <div className="flex flex-col items-start">

            {/* Headline */}
            <h1
              className="animate-fade-in-up delay-400 text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight"
              style={{ lineHeight: 1.08 }}
            >
              Fund What Gets Built.{" "}
              <span style={{ color: "var(--primary)" }}>Not What Gets Promised.</span>
            </h1>

            {/* Subheadline */}
            <p
              className="animate-fade-in-up delay-200 mt-6 text-lg md:text-xl max-w-xl"
              style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
            >
              MilestoneStream locks funds in smart contracts and releases them automatically when
              builders hit verifiable on-chain milestones. No trust required.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-300 mt-10 flex flex-col gap-4 sm:flex-row">
              <button className="btn btn-primary btn-lg" id="btn-create-escrow">
                Create Escrow
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <a href="/explore" className="btn btn-secondary btn-lg" id="btn-explore-escrows">
                Explore Escrows
              </a>
            </div>

            {/* Trust signals */}
            <div
              className="animate-fade-in-up delay-400 mt-10 flex flex-wrap items-center gap-6 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Built on Arbitrum
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Audited Contracts
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Open Source
              </div>
            </div>
          </div>

          {/* Right: Flow diagram visual */}
          <div className="animate-fade-in-up delay-400 hidden lg:flex justify-center">
            <FlowDiagram />
          </div>
        </div>

        {/* Mobile flow diagram */}
        <div className="animate-fade-in-up delay-500 mt-16 lg:hidden">
          <FlowDiagram />
        </div>
      </div>
    </section>
  );
}

/* ── Abstract flow diagram showing escrow journey ── */
function FlowDiagram() {
  const nodes = [
    {
      label: "Funder Locks Funds",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      done: false,
      isStart: true,
    },
    {
      label: "Milestone 1",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      done: true,
    },
    {
      label: "Milestone 2",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      done: true,
    },
    {
      label: "Milestone 3",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      done: true,
    },
    {
      label: "Builder Receives Payment",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      done: false,
      isEnd: true,
    },
  ];

  return (
    <div className="flow-diagram-container">
      {/* Vertical connector line behind nodes */}
      <div className="flow-connector-line" />

      {nodes.map((node, i) => (
        <div key={node.label} className={`flow-node animate-fade-in-up delay-${(i + 2) * 100}`}>
          {/* Dot on the timeline */}
          <div
            className="flow-timeline-dot"
            style={{
              background: node.done ? "var(--success)" : "var(--primary)",
              boxShadow: node.done
                ? "0 0 0 4px var(--success-light)"
                : "0 0 0 4px var(--primary-light)",
            }}
          />

          {/* Card */}
          <div
            className="flow-card"
            style={{
              borderColor: node.done ? "var(--success)" : "var(--border)",
              borderLeftWidth: 3,
              borderLeftColor: node.done ? "var(--success)" : "var(--primary)",
            }}
          >
            <div
              className="flow-card-icon"
              style={{
                background: node.done ? "var(--success-light)" : "var(--primary-light)",
              }}
            >
              {node.icon}
            </div>
            <span className="flow-card-label">{node.label}</span>
            {node.done && (
              <span className="flow-verified-tag">Verified</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
