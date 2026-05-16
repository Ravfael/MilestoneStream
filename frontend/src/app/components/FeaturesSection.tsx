const features = [
  {
    title: "Trustless Escrow",
    desc: "Funds are locked in audited smart contracts — not a multisig, not a DAO treasury. Pure contract logic.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  },
  {
    title: "Milestone Verification",
    desc: "On-chain oracles verify milestone completion automatically. No subjective review, no human bottleneck.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  },
  {
    title: "USDC Native",
    desc: "All streams denominated in USDC. No volatile tokens, no price risk. Builders get exactly what was promised.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  },
  {
    title: "Dispute Resolution",
    desc: "Built-in dispute mechanism with configurable arbiters. Fair resolution without centralized authority.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>,
  },
  {
    title: "Arbitrum L2",
    desc: "Sub-cent transaction fees and near-instant finality. Create and manage streams without worrying about gas costs.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  },
  {
    title: "Full Transparency",
    desc: "Every deposit, milestone, and release is on-chain and publicly verifiable. Complete audit trail from day one.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32" style={{ background: "var(--surface)" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center mb-16">
          <div className="badge badge-completed mb-4 inline-flex">
            <span className="badge-dot" />
            Built for Trust
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Why MilestoneStream</h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Every feature is designed around one principle: money should only move when work is proven.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={f.title} className={`card animate-fade-in-up delay-${(i + 1) * 100}`}>
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg"
                style={{ background: "var(--primary-light)" }}
              >
                {f.icon}
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text-primary)" }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
