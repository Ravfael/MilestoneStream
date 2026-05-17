"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface StatConfig {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  accentColor: string;
}

const STATS: StatConfig[] = [
  {
    label: "Total Locked",
    value: 12000000,
    prefix: "$",
    suffix: "USDC",
    accentColor: "var(--primary)",
  },
  {
    label: "Active Escrows",
    value: 340,
    accentColor: "var(--success)",
  },
  {
    label: "Milestones Verified",
    value: 1280,
    accentColor: "var(--primary)",
  },
  {
    label: "Builders Paid",
    value: 700,
    suffix: "+",
    accentColor: "var(--success)",
  },
];

function useCountUp(target: number, duration: number, start: boolean) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (target === 0) {
      setCurrent(0);
      return;
    }

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [target, duration, start]);

  return current;
}

function StatBlock({
  stat,
  index,
  isVisible,
}: {
  stat: StatConfig;
  index: number;
  isVisible: boolean;
}) {
  const count = useCountUp(stat.value, 800, isVisible);
  const displayValue = stat.prefix ? `${stat.prefix}${count.toLocaleString()}` : count.toLocaleString();
  const isInlineSuffix = stat.suffix === "+";

  return (
    <div
      className="stats-block"
      style={{
        /* staggered entrance */
        animationDelay: `${index * 120}ms`,
      }}
    >
      {/* Accent line */}
      <div
        className="stats-accent-line"
        style={{ backgroundColor: stat.accentColor }}
      />

      {/* Label — above the number */}
      <span className="stats-label">{stat.label}</span>

      {/* Number row */}
      <div className="stats-number-row">
        <span className="stats-number">
          {displayValue}
          {isInlineSuffix && stat.suffix}
        </span>
        {stat.suffix && !isInlineSuffix && <span className="stats-suffix">{stat.suffix}</span>}
      </div>
    </div>
  );
}

export default function StatsBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    },
    []
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.2,
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <section
      ref={sectionRef}
      id="stats-bar"
      className="stats-section"
    >
      <div className="stats-container">
        {STATS.map((stat, i) => (
          <StatBlock
            key={stat.label}
            stat={stat}
            index={i}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
}
