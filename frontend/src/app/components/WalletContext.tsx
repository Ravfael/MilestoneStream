"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export type WalletRole = "funder" | "builder";

interface WalletContextType {
  connected: boolean;
  address: string;
  role: WalletRole;
  connect: () => void;
  disconnect: () => void;
  setRole: (role: WalletRole) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [role, setRole] = useState<WalletRole>("funder");

  // Prevent SSR hydration mismatch by storing connection state in a client-side hook
  const [isClientConnected, setIsClientConnected] = useState(false);
  const [clientAddress, setClientAddress] = useState("");

  useEffect(() => {
    setIsClientConnected(isConnected);
    setClientAddress(address || "");
  }, [isConnected, address]);

  const connect = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected: isClientConnected,
        address: clientAddress,
        role,
        connect,
        disconnect,
        setRole,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within a WalletProvider");
  return ctx;
}

