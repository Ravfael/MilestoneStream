const milestoneTypes = [
  {
    title: "Contract Deployed",
    desc: "Verify a smart contract exists at a specific address on-chain.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: "Transaction Volume",
    desc: "Verify X transactions have been processed through a contract.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "TVL Threshold",
    desc: "Verify total value locked has reached a target via Chainlink oracles.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
  },
  {
    title: "Token Holders",
    desc: "Verify the holder count for a token has reached a specified threshold.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Deadline",
    desc: "Verify a timestamp or block number condition has been met.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Custom Logic",
    desc: "Any verifiable on-chain state — write your own verification contract.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    ),
  },
];

export default function MilestoneTypes() {
  return (
    <section id="milestone-types" className="py-24 md:py-32" style={{ background: "var(--surface)" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            What Can Be Verified On-Chain?
          </h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Six built-in milestone types cover most use cases — or bring your own verification logic.
          </p>
        </div>

        {/* 3x2 grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {milestoneTypes.map((mt, i) => (
            <div
              key={mt.title}
              className={`card animate-fade-in-up delay-${(i + 1) * 100}`}
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg"
                style={{ background: "var(--primary-light)" }}
              >
                {mt.icon}
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text-primary)" }}
              >
                {mt.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {mt.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
