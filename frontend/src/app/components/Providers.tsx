"use client";
import { WalletProvider } from "./WalletContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
