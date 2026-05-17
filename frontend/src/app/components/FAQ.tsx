"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "What is MilestoneStream?",
    answer: "MilestoneStream is a trustless escrow protocol built on Arbitrum. Funders lock USDC into a smart contract, and funds are automatically released when builders hit verifiable on-chain milestones — no middleman, no manual approval required.",
  },
  {
    question: "Who can create an escrow?",
    answer: "Anyone with a connected wallet can create an escrow program. Whether you're a DAO distributing grants, a hackathon organizer automating prizes, or a VC doing milestone-based investments — MilestoneStream is fully permissionless.",
  },
  {
    question: "What happens if a milestone can't be verified automatically?",
    answer: "For milestones that can't be verified on-chain automatically, MilestoneStream uses an optimistic dispute system. The builder submits a claim, a 48-hour challenge window opens, and if no dispute is raised, funds release automatically. If disputed, an arbiter resolves the case.",
  },
  {
    question: "Is the smart contract audited?",
    answer: "MilestoneStream is currently unaudited. We recommend treating this as a beta protocol and not locking funds beyond what you're comfortable risking. A full audit is planned before mainnet launch.",
  },
  {
    question: "Which networks are supported?",
    answer: "MilestoneStream is deployed on Arbitrum Sepolia (testnet), Arbitrum One, and Robinhood Chain. More Arbitrum Orbit chains will be supported in future releases.",
  },
  {
    question: "Can I customize my own milestone verification logic?",
    answer: "Yes. MilestoneStream supports custom verifier contracts. Any address implementing the IVerifier interface can be used as a milestone verifier, giving you full flexibility over what conditions trigger a fund release.",
  },
  {
    question: "What token is used for escrow?",
    answer: "Currently USDC is the supported escrow token. Support for additional ERC-20 tokens is on the roadmap.",
  },
  {
    question: "Can I cancel an escrow after creating it?",
    answer: "Escrows can only be cancelled if no milestones have been claimed yet and both parties agree, or if all deadlines have expired with no activity. Once a milestone is claimed, that portion of funds is permanently released to the builder.",
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Sticky Header */}
          <div className="w-full md:w-[35%] md:shrink-0">
            <div className="md:sticky md:top-32">
              <span className="text-[#1A56DB] text-xs font-bold uppercase tracking-wide" style={{ fontFamily: "var(--font-dm-sans)" }}>
                FAQ
              </span>
              <h2 className="mt-4 text-4xl font-bold text-[#0F172A]" style={{ fontFamily: "var(--font-instrument-serif)" }}>
                Everything You Need to Know
              </h2>
              <p className="mt-6 text-sm text-[#64748B]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                Can&apos;t find what you&apos;re looking for? <br className="hidden lg:block" />
                Reach out on our Discord or read the Docs.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <Link href="#" className="text-sm font-medium text-[#1A56DB] hover:underline" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  Discord &rarr;
                </Link>
                <Link href="#" className="text-sm font-medium text-[#1A56DB] hover:underline" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  Docs &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="w-full md:w-[65%]">
            <div className="flex flex-col border-t border-[#E2E8F0]">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className="border-b border-[#E2E8F0]">
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                    >
                      <span
                        className={`text-base font-medium transition-colors duration-150 ${
                          isOpen ? "text-[#1A56DB]" : "text-[#0F172A] group-hover:text-[#1A56DB]"
                        }`}
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {faq.question}
                      </span>
                      <span className="ml-6 shrink-0 text-[20px] text-[#64748B] font-light leading-none">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    <div
                      className="overflow-hidden"
                      style={{ 
                        maxHeight: isOpen ? "500px" : "0px",
                        transition: "max-height 250ms ease"
                      }}
                    >
                      <div className="pb-6 text-sm text-[#64748B] leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
