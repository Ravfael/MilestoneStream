"use client";
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
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

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [role, setRole] = useState<WalletRole>("funder");

  const isMounted = useIsMounted();
  const connected = isMounted ? isConnected : false;
  const clientAddress = isMounted ? (address || "") : "";

  const connect = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
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

