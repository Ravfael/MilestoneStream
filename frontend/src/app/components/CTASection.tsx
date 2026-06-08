"use client";

export default function CTABanner() {
  return (
    <section
      id="cta-banner"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1A56DB 0%, #1E429F 50%, #1A56DB 100%)",
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:py-24 text-center">
        <h2
          className="animate-fade-in-up text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          style={{ color: "#FFFFFF" }}
        >
          Ready to Build Without Trust Issues?
        </h2>
        <p
          className="animate-fade-in-up delay-100 text-lg md:text-xl mb-10 max-w-lg mx-auto"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          Create your first escrow in under 2 minutes.
        </p>
        <a
          href="/funder?create=true"
          className="animate-fade-in-up delay-200 btn btn-lg"
          id="btn-cta-create-escrow"
          style={{
            background: "#FFFFFF",
            color: "#1A56DB",
            fontWeight: 600,
            border: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F0F4FF";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#FFFFFF";
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.transform = "";
          }}
        >
          Create Escrow
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </section>
  );
}
