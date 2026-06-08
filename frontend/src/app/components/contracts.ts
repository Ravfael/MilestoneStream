import { encodeAbiParameters, parseAbiParameters } from "viem";

export const FACTORY_ADDRESS = "0x250ddBdd50c959d5b28a3191Ba8B9354E68F96bA";
export const MOCK_USDC_ADDRESS = "0xA3FdF9aAe49636F1a8cdf3e1c6Ca636911043847";

export const VERIFIER_ADDRESSES: Record<string, string> = {
  "contract-deploy": "0x05978bE7fC98a0D9Aa7973BF0f58c4E8B5E8105F",
  "deadline": "0x87F4DE4c3620FE04117c8623e7983C2BBBdD15c2",
  "tx-count": "0x8cCC7855Ec994e05e99ed3a7e2667263FA616d4B",
  "tvl": "0xB68025370fB44598B75A2D7008aB172eEe53fc7a",
  "holders": "0x87F4DE4c3620FE04117c8623e7983C2BBBdD15c2", // Fallback to Timestamp or similar
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
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "escrow", "type": "address" },
      { "indexed": true, "name": "funder", "type": "address" },
      { "indexed": true, "name": "builder", "type": "address" }
    ],
    "name": "EscrowDeployed",
    "type": "event"
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
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "milestoneIndex", "type": "uint256" }],
    "name": "claimMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "milestoneIndex", "type": "uint256" }],
    "name": "releaseMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "milestoneIndex", "type": "uint256" }],
    "name": "disputeMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "milestoneIndex", "type": "uint256" },
      { "name": "builderWins", "type": "bool" }
    ],
    "name": "resolveDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "cancelEscrow",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "stateMutability": "nonpayable",
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

/**
 * Validates whether a string is a valid Ethereum address (0x + 40 hex chars).
 */
function isValidAddress(value: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(value);
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function encodeVerifierParams(type: string, paramsStr: string, deadlineStr?: string): `0x${string}` {
  try {
    if (type === "contract-deploy") {
      const raw = paramsStr.trim();
      const addr = isValidAddress(raw) ? raw : ZERO_ADDRESS;
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
      const rawContract = parts[0]?.trim() || "";
      const targetContract = isValidAddress(rawContract) ? rawContract : ZERO_ADDRESS;
      const requiredCount = BigInt(parts[1]?.trim() || "10");
      const rawSelector = parts[2]?.trim() || "0x00000000";
      const selector = (rawSelector.startsWith("0x") ? rawSelector : "0x00000000") as `0x${string}`;
      return encodeAbiParameters(
        parseAbiParameters("address, uint256, bytes4"),
        [targetContract as `0x${string}`, requiredCount, selector]
      );
    } else if (type === "tvl") {
      const parts = paramsStr.split(",");
      const rawContract = parts[0]?.trim() || "";
      const targetContract = isValidAddress(rawContract) ? rawContract : ZERO_ADDRESS;
      const rawToken = parts[1]?.trim() || "";
      const token = isValidAddress(rawToken) ? rawToken : MOCK_USDC_ADDRESS;
      const rawFeed = parts[2]?.trim() || "";
      const priceFeed = isValidAddress(rawFeed) ? rawFeed : ZERO_ADDRESS;
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
