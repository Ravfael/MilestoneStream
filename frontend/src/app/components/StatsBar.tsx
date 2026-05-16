export default function StatsBar() {
  const stats = [
    { label: "Total Value Locked", value: "$12.4M", sub: "USDC" },
    { label: "Active Streams", value: "847", sub: "streams" },
    { label: "Milestones Completed", value: "3,291", sub: "on-chain" },
    { label: "Builders Funded", value: "512", sub: "wallets" },
  ];

  return (
    <section className="border-y" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`animate-fade-in-up delay-${(i + 1) * 100} text-center`}>
              <div className="mono text-2xl md:text-3xl font-bold stat-number" style={{ color: "var(--text-primary)" }}>
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {stat.label}
              </div>
              <div className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
