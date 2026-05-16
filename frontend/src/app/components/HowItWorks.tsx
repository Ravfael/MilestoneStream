const steps = [
  {
    num: "01",
    title: "Funder Creates Escrow",
    desc: "Describe the project, set verifiable milestones with criteria, and lock USDC into the escrow smart contract.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Builder Hits Milestone",
    desc: "On-chain activity triggers automatic verification. Deploy a contract, hit a TVL target, or reach a transaction threshold.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Funds Auto-Release",
    desc: "No middleman, no approval needed. Once verified, USDC is released instantly to the builder's wallet. Immediate.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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
          <h2 className="text-3xl md:text-4xl font-bold">
            Simple. Trustless. Automatic.
          </h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Three steps from funding to delivery. Every step is transparent, verifiable, and fully automated.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Connector line between steps (desktop) */}
          <div
            className="hidden md:block absolute top-[72px] left-[16.67%] right-[16.67%] h-0 border-t-2 border-dashed"
            style={{ borderColor: "var(--border-strong)" }}
          />

          {steps.map((step, i) => (
            <div key={step.num} className={`animate-fade-in-up delay-${(i + 1) * 200} relative`}>
              <div className="card text-center p-8 relative z-10">
                {/* Step number badge */}
                <div
                  className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: "var(--primary)",
                    color: "var(--text-inverse)",
                    fontFamily: "var(--font-jetbrains), monospace",
                  }}
                >
                  {step.num}
                </div>

                {/* Icon */}
                <div
                  className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{ background: "var(--primary-light)" }}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text-primary)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
