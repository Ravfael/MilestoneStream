"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

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
  const [connected, setConnected] = useState(false);
  const [address] = useState("0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12");
  const [role, setRole] = useState<WalletRole>("funder");

  const connect = useCallback(() => setConnected(true), []);
  const disconnect = useCallback(() => {
    setConnected(false);
  }, []);

  return (
    <WalletContext.Provider value={{ connected, address, role, connect, disconnect, setRole }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within a WalletProvider");
  return ctx;
}
