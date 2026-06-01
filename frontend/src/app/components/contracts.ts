import { encodeAbiParameters, parseAbiParameters } from "viem";

export const FACTORY_ADDRESS = "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9";
export const MOCK_USDC_ADDRESS = "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707";

export const VERIFIER_ADDRESSES: Record<string, string> = {
  "contract-deploy": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  "deadline": "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  "tx-count": "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
  "tvl": "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9",
  "holders": "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512", // Fallback to Timestamp or similar
};

export const ESCROW_FACTORY_ABI = [
  {
    "inputs": [
      { "name": "builder", "type": "address" },
      { "name": "token", "type": "address" },
      {
        "name": "milestones",
        "type": "tuple[]",
        "components": [
          { "name": "title", "type": "string" },
          { "name": "description", "type": "string" },
          { "name": "amount", "type": "uint256" },
          { "name": "verifier", "type": "address" },
          { "name": "verifierParams", "type": "bytes" },
          { "name": "deadline", "type": "uint256" },
          { "name": "status", "type": "uint8" },
          { "name": "isOptimistic", "type": "bool" },
          { "name": "claimedAt", "type": "uint256" }
        ]
      }
    ],
    "name": "createEscrow",
    "outputs": [{ "name": "escrowAddress", "type": "address" }],
    "stateMutability": "external",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllEscrows",
    "outputs": [{ "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "funder", "type": "address" }],
    "name": "getEscrowsByFunder",
    "outputs": [{ "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "builder", "type": "address" }],
    "name": "getEscrowsByBuilder",
    "outputs": [{ "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const MILESTONE_ESCROW_ABI = [
  {
    "inputs": [],
    "name": "funder",
    "outputs": [{ "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "builder",
    "outputs": [{ "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [{ "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "arbiter",
    "outputs": [{ "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalAmount",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "releasedAmount",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "cancelled",
    "outputs": [{ "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "status",
    "outputs": [{ "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "", "type": "uint256" }],
    "name": "milestones",
    "outputs": [
      { "name": "title", "type": "string" },
      { "name": "description", "type": "string" },
      { "name": "amount", "type": "uint256" },
      { "name": "verifier", "type": "address" },
      { "name": "verifierParams", "type": "bytes" },
      { "name": "deadline", "type": "uint256" },
      { "name": "status", "type": "uint8" },
      { "name": "isOptimistic", "type": "bool" },
      { "name": "claimedAt", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "milestonesLength",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "amount", "type": "uint256" }],
    "name": "lockFunds",
    "outputs": [],
    "stateMutability": "external",
    "type": "function"
  },
  {
    "inputs": [{ "name": "milestoneIndex", "type": "uint256" }],
    "name": "claimMilestone",
    "outputs": [],
    "stateMutability": "external",
    "type": "function"
  },
  {
    "inputs": [{ "name": "milestoneIndex", "type": "uint256" }],
    "name": "releaseMilestone",
    "outputs": [],
    "stateMutability": "external",
    "type": "function"
  },
  {
    "inputs": [{ "name": "milestoneIndex", "type": "uint256" }],
    "name": "disputeMilestone",
    "outputs": [],
    "stateMutability": "external",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "milestoneIndex", "type": "uint256" },
      { "name": "builderWins", "type": "bool" }
    ],
    "name": "resolveDispute",
    "outputs": [],
    "stateMutability": "external",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "cancelEscrow",
    "outputs": [],
    "stateMutability": "external",
    "type": "function"
  }
] as const;

export const ERC20_ABI = [
  {
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "type": "bool" }],
    "stateMutability": "external",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export function encodeVerifierParams(type: string, paramsStr: string, deadlineStr?: string): `0x${string}` {
  try {
    if (type === "contract-deploy") {
      const addr = paramsStr.trim() || "0x0000000000000000000000000000000000000000";
      return encodeAbiParameters(
        parseAbiParameters("address"),
        [addr as `0x${string}`]
      );
    } else if (type === "deadline") {
      const date = deadlineStr ? new Date(deadlineStr) : new Date();
      const timestamp = BigInt(Math.floor(date.getTime() / 1000));
      return encodeAbiParameters(
        parseAbiParameters("uint256"),
        [timestamp]
      );
    } else if (type === "tx-count") {
      const parts = paramsStr.split(",");
      const targetContract = parts[0]?.trim() || "0x0000000000000000000000000000000000000000";
      const requiredCount = BigInt(parts[1]?.trim() || "10");
      const selector = (parts[2]?.trim() || "0x00000000") as `0x${string}`;
      return encodeAbiParameters(
        parseAbiParameters("address, uint256, bytes4"),
        [targetContract as `0x${string}`, requiredCount, selector]
      );
    } else if (type === "tvl") {
      const parts = paramsStr.split(",");
      const targetContract = parts[0]?.trim() || "0x0000000000000000000000000000000000000000";
      const token = parts[1]?.trim() || MOCK_USDC_ADDRESS;
      const priceFeed = parts[2]?.trim() || "0x0000000000000000000000000000000000000000";
      const requiredUSD = BigInt(parts[3]?.trim() || "1000");
      return encodeAbiParameters(
        parseAbiParameters("address, address, address, uint256"),
        [targetContract as `0x${string}`, token as `0x${string}`, priceFeed as `0x${string}`, requiredUSD]
      );
    }
  } catch (e) {
    console.error("Encoding verifier params failed", e);
  }
  // Default empty bytes
  return "0x";
}
