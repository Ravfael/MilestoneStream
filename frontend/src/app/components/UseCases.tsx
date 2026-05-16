const useCases = [
  {
    title: "DAOs & Protocols",
    desc: "Distribute contributor rewards based on delivery, not promises. Set on-chain milestones for each workstream and let the contract enforce accountability.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Hackathon Organizers",
    desc: "Automate prize distribution with verifiable criteria. Participants deploy contracts, hit targets, and prizes release — no manual judging needed.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "VCs & Grant Programs",
    desc: "Milestone-based investment tranches, fully on-chain. Release funding as teams prove traction — TVL, users, revenue — all verifiable.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 md:py-32" style={{ background: "var(--background)" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Built For</h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Whether you&apos;re funding contributors, running a hackathon, or deploying capital — MilestoneStream fits your workflow.
          </p>
        </div>

        {/* Use case cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {useCases.map((uc, i) => (
            <div
              key={uc.title}
              className={`animate-fade-in-up delay-${(i + 1) * 200} use-case-card`}
            >
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "var(--primary-light)" }}
              >
                {uc.icon}
              </div>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text-primary)" }}
              >
                {uc.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {uc.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
