export default function Footer() {
  return (
    <footer className="border-t py-16" style={{ borderColor: "var(--border)", background: "var(--background)" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--primary)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="text-lg font-semibold" style={{ fontFamily: "var(--font-dm-sans)" }}>MilestoneStream</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Trustless milestone-based escrow on Arbitrum. Fund builders, release on delivery.
            </p>
          </div>

          {/* Protocol */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text-primary)" }}>Protocol</h4>
            <ul className="space-y-2.5">
              {["Create Stream", "Browse Streams", "Documentation", "Smart Contracts"].map((l) => (
                <li key={l}><a href="#" className="text-sm no-underline transition-colors hover:text-[var(--text-primary)]" style={{ color: "var(--text-secondary)" }}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text-primary)" }}>Resources</h4>
            <ul className="space-y-2.5">
              {["Audit Report", "GitHub", "Bug Bounty", "Brand Kit"].map((l) => (
                <li key={l}><a href="#" className="text-sm no-underline transition-colors hover:text-[var(--text-primary)]" style={{ color: "var(--text-secondary)" }}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text-primary)" }}>Community</h4>
            <ul className="space-y-2.5">
              {["Discord", "Twitter / X", "Forum", "Governance"].map((l) => (
                <li key={l}><a href="#" className="text-sm no-underline transition-colors hover:text-[var(--text-primary)]" style={{ color: "var(--text-secondary)" }}>{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t flex flex-col gap-4 md:flex-row md:items-center md:justify-between" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © 2026 MilestoneStream. Open source under MIT License.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs no-underline transition-colors hover:text-[var(--text-primary)]" style={{ color: "var(--text-muted)" }}>
              Privacy Policy
            </a>
            <a href="#" className="text-xs no-underline transition-colors hover:text-[var(--text-primary)]" style={{ color: "var(--text-muted)" }}>
              Terms of Use
            </a>
            <span className="mono text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--success)" }} />
              Arbitrum One
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
