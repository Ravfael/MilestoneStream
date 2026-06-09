'use client';

import React, { useState } from 'react';

const steps = [
  {
    num: '01',
    title: 'Funder Creates Escrow',
    desc: 'Describe project, set milestones, lock USDC into smart contract',
  },
  {
    num: '02',
    title: 'Builder Hits Milestone',
    desc: 'On-chain activity triggers automatic verification',
  },
  {
    num: '03',
    title: 'Funds Auto-Release',
    desc: 'USDC released instantly to builder\'s wallet. No middleman.',
  }
];

export default function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleStepClick = (index: number) => {
    setActiveIndex(index);
  };

  const getVisualClasses = (index: number) => {
    return `absolute w-full transition-all duration-200 ease-out ${
      activeIndex === index 
        ? 'opacity-100 translate-y-0 z-10' 
        : 'opacity-0 translate-y-2 z-0 pointer-events-none'
    }`;
  };

  return (
    <section id="how-it-works" className="bg-white py-24 font-sans">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Simple. Trustless. Automatic.
          </h2>
          <p className="text-lg text-[#94A3B8]">
            Three steps from funding to delivery.
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Steps List */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6">
            {steps.map((step, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div 
                  key={idx}
                  onClick={() => handleStepClick(idx)}
                  className={`relative overflow-hidden cursor-pointer transition-all duration-300 border-l-[3px] p-6 rounded-r-xl ${
                    isActive 
                      ? 'border-[#1A56DB] bg-[#F8FAFC]' 
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  {/* Step Number Watermark */}
                  <div 
                    className="absolute -right-2 -bottom-6 text-8xl font-bold text-[#F1F5F9] pointer-events-none select-none z-0" 
                    style={{ fontFamily: '"Instrument Serif", serif' }}
                  >
                    {step.num}
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isActive ? 'text-[#1A56DB]' : 'text-[#0F172A]'}`}>
                      {step.title}
                    </h3>
                    <p className="text-[#94A3B8] text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Active Indicator Line */}
                  <div 
                    className="absolute bottom-0 left-0 h-[2px] bg-[#1A56DB] transition-all duration-300 ease-out" 
                    style={{ width: isActive ? '100%' : '0%' }} 
                  />
                </div>
              );
            })}
          </div>

          {/* Right Side: Preview Panel */}
          <div className="w-full lg:w-[60%] h-[500px] bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden flex items-center justify-center p-8 ">
            
            {/* Grid Pattern Background */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-50"
              style={{
                backgroundImage: 'linear-gradient(to right, #F1F5F9 1px, transparent 1px), linear-gradient(to bottom, #F1F5F9 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
            
            {/* Live Content Container */}
            <div className="relative w-full max-w-md h-full flex items-center justify-center">
              
              {/* Step 1 Visual: Mini Form Mockup */}
              <div className={getVisualClasses(0)}>
                <div className="w-full bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#1A56DB] rounded-t-xl"></div>
                  <div className="space-y-5 mt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">Project Title</label>
                      <div className="w-full h-11 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-4 flex items-center text-[#0F172A] text-sm font-medium">
                        DEX Aggregator Protocol
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">Builder Address</label>
                      <div className="w-full h-11 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-4 flex items-center text-[#0F172A] text-sm font-mono">
                        0x7a59...3f18
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">Total</label>
                      <div className="w-full h-11 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-4 flex items-center text-[#0F172A] font-medium">
                        5,000 USDC
                      </div>
                    </div>
                    <button className="w-full mt-2 bg-[#1A56DB] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                      Lock Funds <span>→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 Visual: Milestone Checklist */}
              <div className={getVisualClasses(1)}>
                <div className="w-full bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 relative">
                  <h4 className="text-lg font-semibold text-[#0F172A] mb-5">Milestone Verification</h4>
                  <div className="space-y-4">
                    {/* Row 1 (Completed) */}
                    <div className="flex items-center gap-3 p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="w-6 h-6 rounded-full bg-[#059669]/10 text-[#059669] flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-[#94A3B8] line-through">Deploy Contract</span>
                    </div>
                    
                    {/* Row 2 (Active/In Progress) */}
                    <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white border-2 border-[#1A56DB] shadow-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#1A56DB]/[0.03] animate-pulse"></div>
                      <div className="relative z-10 w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1A56DB] animate-ping absolute"></div>
                        <div className="w-2 h-2 rounded-full bg-[#1A56DB] relative"></div>
                      </div>
                      <span className="relative z-10 text-sm font-semibold text-[#0F172A]">Reach 1,000 Transactions...</span>
                    </div>

                    {/* Row 3 (Pending) */}
                    <div className="flex items-center gap-3 p-3.5 rounded-lg bg-[#F8FAFC]/50 border border-[#E2E8F0]/50 opacity-60">
                      <div className="w-6 h-6 rounded-full border-2 border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
                      </div>
                      <span className="text-sm font-medium text-[#94A3B8]">TVL Threshold</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 Visual: Transaction Receipt */}
              <div className={getVisualClasses(2)}>
                <div className="w-full bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col relative">
                  <div className="bg-[#059669]/5 p-8 flex flex-col items-center justify-center border-b border-[#059669]/10">
                    <div className="w-14 h-14 rounded-full bg-[#059669] text-white flex items-center justify-center mb-4 shadow-lg shadow-[#059669]/30">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[#059669] font-bold text-lg">Milestone Verified</span>
                  </div>
                  <div className="p-8 flex flex-col gap-6">
                    <div className="text-center">
                      <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Amount Released</div>
                      <div className="text-4xl font-mono font-bold text-[#0F172A]">1,500 <span className="text-2xl text-[#94A3B8]">USDC</span></div>
                    </div>
                    
                    <div className="relative h-px w-full my-1">
                      <div className="absolute inset-0 border-t-2 border-dashed border-[#E2E8F0]"></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#94A3B8]">To Wallet</span>
                      <span className="text-sm font-mono font-medium text-[#0F172A] bg-[#F8FAFC] px-2 py-1 rounded border border-[#E2E8F0]">0x1234...5678</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#94A3B8]">Status</span>
                      <span className="px-2.5 py-1 rounded-full bg-[#059669]/10 text-[#059669] text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                        Released
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
