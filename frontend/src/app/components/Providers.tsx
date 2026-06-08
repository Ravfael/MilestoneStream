"use client";
import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http, fallback } from "wagmi";
import { mainnet, sepolia, arbitrum, arbitrumSepolia, anvil } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WalletProvider } from "./WalletContext";

const config = getDefaultConfig({
  appName: "MilestoneStream",
  projectId: "a58da5c185b9d608a1b60448201526d9", // 32-character hex placeholder
  chains: [sepolia],
  transports: {
    [sepolia.id]: fallback([
      http("https://ethereum-sepolia-rpc.publicnode.com"),
      http("https://sepolia.gateway.tenderly.co"),
      http("https://11155111.rpc.thirdweb.com")
    ]),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WalletProvider>{children}</WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

