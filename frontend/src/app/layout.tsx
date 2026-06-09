import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "MilestoneStream",
  description:
    "Lock USDC into smart contracts and release funds automatically when builders hit verifiable on-chain milestones. Trustless, transparent, and built on Arbitrum.",
  keywords: [
    "escrow",
    "milestones",
    "Arbitrum",
    "USDC",
    "smart contracts",
    "Web3",
    "funding",
    "grants",
  ],
  icons: {
    icon: '/logo2.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
