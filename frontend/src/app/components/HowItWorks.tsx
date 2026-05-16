const steps = [
  {
    num: "01",
    title: "Create a Stream",
    desc: "Define milestones, set USDC amounts for each, and specify the builder's wallet address. Everything is configured on-chain.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Lock Funds",
    desc: "Deposit USDC into the escrow contract. Funds are locked and visible on-chain — fully transparent to all parties.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Build & Verify",
    desc: "Builders complete work and submit milestone proofs. On-chain oracles verify completion automatically — no manual approval needed.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Auto-Release",
    desc: "Once verified, USDC is released instantly to the builder's wallet. No intermediaries, no delays, no trust required.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32" style={{ background: "var(--background)" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="badge badge-active mb-4 inline-flex">
            <span className="badge-dot" />
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Four steps from funding to delivery. Every step is transparent, verifiable, and automated.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.num} className={`card animate-fade-in-up delay-${(i + 1) * 100} group relative`}>
              {/* Step number */}
              <div className="mono text-xs font-bold mb-4" style={{ color: "var(--text-muted)" }}>
                {step.num}
              </div>

              {/* Icon */}
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors group-hover:bg-primary-light"
                style={{ background: "var(--primary-light)" }}
              >
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text-primary)" }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {step.desc}
              </p>

              {/* Connector line (not on last) */}
              {i < 3 && (
                <div className="hidden lg:block absolute top-14 -right-3 w-6 border-t border-dashed" style={{ borderColor: "var(--border-strong)" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
