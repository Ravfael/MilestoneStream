export default function CTASection() {
  return (
    <section id="builders" className="py-24 md:py-32" style={{ background: "var(--surface)" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* For Funders */}
          <div className="card p-8 flex flex-col">
            <div className="badge badge-active mb-4 self-start">
              <span className="badge-dot" />
              For Funders
            </div>
            <h3 className="text-2xl font-bold mb-3">Fund with confidence</h3>
            <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "var(--text-secondary)" }}>
              Stop sending funds to multisigs and hoping for the best. Define clear milestones, lock USDC, and let the contract enforce delivery. Your money is released only when verified work is done.
            </p>
            <ul className="mb-8 space-y-3">
              {["Define granular milestones", "Lock funds in audited contracts", "Automatic release on verification", "Full refund if milestones expire"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-primary)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <button className="btn btn-primary self-start" id="btn-start-funding">
              Start Funding
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* For Builders */}
          <div className="card p-8 flex flex-col">
            <div className="badge badge-completed mb-4 self-start">
              <span className="badge-dot" />
              For Builders
            </div>
            <h3 className="text-2xl font-bold mb-3">Get paid on delivery</h3>
            <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "var(--text-secondary)" }}>
              No more chasing payments or trusting clients. When you complete a milestone and it&apos;s verified on-chain, your USDC is released instantly. Ship work, get paid — it&apos;s that simple.
            </p>
            <ul className="mb-8 space-y-3">
              {["Guaranteed payment on completion", "No invoicing or payment delays", "On-chain proof of delivery", "Build your verifiable track record"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-primary)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <button className="btn btn-secondary self-start" id="btn-start-building">
              Start Building
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
