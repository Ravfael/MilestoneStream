export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Grid pattern background */}
      <div className="hero-grid-pattern hero-grid-fade absolute inset-0 pointer-events-none" />

      <div className="relative mx-auto max-w-[1200px] px-6 py-24 md:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow badge */}
          <div className="animate-fade-in-up badge badge-active mb-6">
            <span className="badge-dot" />
            Live on Arbitrum
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up delay-100 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl" style={{ lineHeight: 1.1 }}>
            Fund builders.{" "}
            <span style={{ color: "var(--primary)" }}>Release on milestones.</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-in-up delay-200 mt-6 text-lg md:text-xl max-w-2xl" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Lock USDC into trustless smart contracts. Funds release automatically when builders hit verifiable on-chain milestones. No middlemen. No disputes. Just delivery.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-300 mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="btn btn-primary btn-lg" id="btn-create-stream">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Create a Stream
            </button>
            <a href="#how-it-works" className="btn btn-secondary btn-lg" id="btn-learn-more">
              Learn How It Works
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          {/* Trust signals */}
          <div className="animate-fade-in-up delay-400 mt-12 flex flex-wrap items-center justify-center gap-8 text-sm" style={{ color: "var(--text-muted)" }}>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Audited Contracts
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Non-Custodial
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Open Source
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
