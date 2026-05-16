export default function Footer() {
  return (
    <footer className="border-t py-16" style={{ borderColor: "var(--border)", background: "var(--background)" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "linear-gradient(135deg, var(--primary), #3B82F6)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 8L12 4L20 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 12L12 8L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
                  <path d="M4 16L12 12L20 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                  <path d="M12 12V20" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                </svg>
              </div>
              <span className="text-lg font-semibold" style={{ fontFamily: "var(--font-dm-sans)" }}>
                MilestoneStream
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--text-secondary)" }}>
              Trustless milestone-based escrow on Arbitrum. Fund builders, release on delivery. No middlemen.
            </p>
          </div>

          {/* Links: Protocol */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text-primary)" }}>
              Protocol
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Docs", href: "/docs" },
                { label: "GitHub", href: "https://github.com" },
                { label: "Arbitrum", href: "https://arbitrum.io" },
                { label: "Contract Addresses", href: "/docs/contracts" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm no-underline transition-colors hover:text-[var(--text-primary)]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Resources */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text-primary)" }}>
              Resources
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "How It Works", href: "#how-it-works" },
                { label: "Milestone Types", href: "#milestone-types" },
                { label: "Use Cases", href: "#use-cases" },
                { label: "Create Escrow", href: "/create" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm no-underline transition-colors hover:text-[var(--text-primary)]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 border-t flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Built on Arbitrum &bull; Open Source &bull; Not audited yet — use at your own risk
          </p>
          <div className="flex items-center gap-4">
            <span className="mono text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--success)" }}
              />
              Arbitrum One
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
