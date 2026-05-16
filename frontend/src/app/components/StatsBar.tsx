export default function StatsBar() {
  const stats = [
    { label: "Total Locked", value: "$0" },
    { label: "Active Escrows", value: "0" },
    { label: "Milestones Verified", value: "0" },
    { label: "Builders Paid", value: "0" },
  ];

  return (
    <section
      id="stats-bar"
      className="border-y"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`animate-fade-in-up delay-${(i + 1) * 100} text-center`}>
              <div
                className="mono text-2xl md:text-3xl font-bold stat-number"
                style={{ color: "var(--text-primary)" }}
              >
                {stat.value}
              </div>
              <div className="mt-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
