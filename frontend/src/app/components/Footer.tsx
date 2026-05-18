export default function Footer() {
  return (
    <footer className="border-t py-16" style={{ borderColor: "var(--border)", background: "var(--background)" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="/" className="inline-flex items-center no-underline mb-4" id="footer-logo">
              <img src="/logo.png" alt="MilestoneStream" className="h-8 w-auto" />
            </a>
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
                { label: "Docs", href: "https://github.com/Ravfael/MilestoneStream", external: true },
                { label: "GitHub", href: "https://github.com/Ravfael/MilestoneStream", external: true },
                { label: "Arbitrum", href: "https://arbitrum.io", external: true },
                { label: "Contract Addresses", href: "/docs/contracts", external: false },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Milestone Types", href: "/#milestone-types" },
                { label: "Use Cases", href: "/#use-cases" },
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
        </div>
      </div>
    </footer>
  );
}
