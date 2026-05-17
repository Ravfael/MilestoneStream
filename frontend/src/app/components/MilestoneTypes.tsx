import React from 'react';

export default function MilestoneTypes() {
  return (
    <section id="milestone-types" className="py-24 md:py-32 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1200px] px-6">
        
        {/* Section header */}
        <div className="mb-12 md:mb-16 text-left">
          <span className="block text-xs font-bold tracking-wide uppercase mb-3 text-[#1A56DB]">
            VERIFICATION TYPES
          </span>
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4 text-[#0F172A]" 
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            What Can Be Verified On-Chain?
          </h2>
          <p 
            className="text-lg md:text-xl text-[#64748B] max-w-2xl" 
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Six built-in milestone types or bring your own logic.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Row 1 */}
          {/* LARGE CARD 1 - Contract Deployed */}
          <div className="md:col-span-2 flex flex-col justify-between bg-[#FFFFFF] border border-[#E2E8F0] rounded-[16px] p-6 min-h-[240px] group">
            <div>
              <span className="text-xs font-bold tracking-wider mb-2 block text-[#1A56DB]">DEPLOY</span>
              <h3 className="text-lg font-semibold mb-2 text-[#0F172A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Contract Deployed
              </h3>
              <p className="text-sm text-[#64748B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Verify a smart contract exists at a specific address.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="bg-[#F8FAFC] rounded-lg p-3 text-xs flex flex-col gap-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Address:</span>
                  <span className="text-[#1A56DB]">0x1A2b...9F3c</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Status:</span>
                  <span className="flex items-center gap-1.5 text-[#0F172A]">
                    <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                    Contract Found
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Bytecode size:</span>
                  <span className="text-[#0F172A]">2,847 bytes</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARD 3 - Transaction Volume */}
          <div className="md:col-span-1 flex flex-col bg-[#FFFFFF] border border-[#E2E8F0] rounded-[16px] p-6 min-h-[200px] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center justify-center w-[32px] h-[32px] rounded-lg bg-[#EFF6FF]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#64748B]">ON-CHAIN</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-base font-semibold mb-2 text-[#0F172A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Transaction Volume
              </h3>
              <p className="text-sm leading-relaxed text-[#64748B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Verify X transactions processed through a contract.
              </p>
            </div>
            <div className="mt-4">
              <span className="inline-block px-2 py-1 rounded bg-gray-50 text-xs text-[#64748B]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                e.g. 1,000 txns
              </span>
            </div>
          </div>

          {/* SMALL CARD 4 - Token Holders */}
          <div className="md:col-span-1 flex flex-col bg-[#FFFFFF] border border-[#E2E8F0] rounded-[16px] p-6 min-h-[200px] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center justify-center w-[32px] h-[32px] rounded-lg bg-[#EFF6FF]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#64748B]">ERC-20</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-base font-semibold mb-2 text-[#0F172A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Token Holders
              </h3>
              <p className="text-sm leading-relaxed text-[#64748B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Verify holder count has reached a threshold.
              </p>
            </div>
            <div className="mt-4">
              <span className="inline-block px-2 py-1 rounded bg-gray-50 text-xs text-[#64748B]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                e.g. 500 holders
              </span>
            </div>
          </div>

          {/* Row 2 */}
          {/* SMALL CARD 5 - Deadline */}
          <div className="md:col-span-1 flex flex-col bg-[#FFFFFF] border border-[#E2E8F0] rounded-[16px] p-6 min-h-[200px] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center justify-center w-[32px] h-[32px] rounded-lg bg-[#EFF6FF]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#64748B]">TIMESTAMP</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-base font-semibold mb-2 text-[#0F172A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Deadline
              </h3>
              <p className="text-sm leading-relaxed text-[#64748B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Verify a block timestamp or number condition.
              </p>
            </div>
            <div className="mt-4">
              <span className="inline-block px-2 py-1 rounded bg-gray-50 text-xs text-[#64748B]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                e.g. block 21,400,000
              </span>
            </div>
          </div>

          {/* SMALL CARD 6 - Custom Logic */}
          <div className="md:col-span-1 flex flex-col bg-[#FFFFFF] border border-[#E2E8F0] border-dashed rounded-[16px] p-6 min-h-[200px] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center justify-center w-[32px] h-[32px] rounded-lg bg-[#EFF6FF]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#64748B]">CUSTOM</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-base font-semibold mb-2 text-[#0F172A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Custom Logic
              </h3>
              <p className="text-sm leading-relaxed text-[#64748B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Write your own verifier contract for any on-chain state.
              </p>
            </div>
            <div className="mt-4">
              <span className="inline-block px-2 py-1 rounded bg-[#EFF6FF] text-xs text-[#1A56DB]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                IVerifier.sol
              </span>
            </div>
          </div>

          {/* LARGE CARD 2 - TVL Threshold */}
          <div className="md:col-span-2 flex flex-col justify-between bg-[#FFFFFF] border border-[#E2E8F0] rounded-[16px] p-6 min-h-[240px] group">
            <div>
              <span className="text-xs font-bold tracking-wider mb-2 block text-[#1A56DB]">ORACLE</span>
              <h3 className="text-lg font-semibold mb-2 text-[#0F172A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                TVL Threshold
              </h3>
              <p className="text-sm text-[#64748B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Verify total value locked via Chainlink price feeds.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col justify-end flex-grow">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-medium text-[#0F172A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Target: $50,000 USDC
                </span>
              </div>
              
              <div className="w-full h-3 rounded-full overflow-hidden mb-2 bg-[#E2E8F0]">
                <div className="h-full rounded-full bg-[#1A56DB]" style={{ width: '73%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#64748B]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  $36,500 / $50,000
                </span>
                <span className="text-[10px] uppercase font-bold text-[#64748B]">Chainlink ◆</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
