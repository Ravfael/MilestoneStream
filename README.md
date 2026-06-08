# MilestoneStream

MilestoneStream is a full-stack Ethereum escrow application for milestone-based payments between funders and builders. It lets a funder create an escrow, define one or more payable milestones, lock USDC-style funds, and release payment only when each milestone is verified, accepted, or resolved through the dispute flow.

The repository contains two connected applications:

- `contracts/`: Solidity smart contracts built with Foundry.
- `frontend/`: A Next.js web app for funders, builders, wallet connection, escrow creation, milestone claiming, and escrow exploration.

## What Problem It Solves

Traditional grant, freelance, and bounty payments often require trust before work is delivered. A funder may not want to pay everything up front, and a builder may not want to start work without proof that funds exist.

MilestoneStream solves this by moving the payment agreement on-chain:

1. The funder defines the builder, token, arbiter, and milestone list.
2. The funder locks the full milestone amount into an escrow contract.
3. The builder claims each milestone when the work is complete.
4. The contract verifies the milestone using a verifier contract.
5. Funds are released automatically, released after an optimistic challenge window, disputed, or cancelled according to the escrow state.

## High-Level Architecture

```text
MilestoneStream
+-- contracts
|   +-- EscrowFactory
|   |   +-- Deploys and indexes MilestoneEscrow contracts
|   +-- MilestoneEscrow
|   |   +-- Holds funds and manages milestone lifecycle
|   +-- Verifiers
|   |   +-- ContractDeployedVerifier
|   |   +-- TimestampVerifier
|   |   +-- TxCountVerifier
|   |   +-- TVLVerifier
|   +-- MockUSDC
|       +-- Test/development ERC-20 token
+-- frontend
    +-- Next.js app router pages
    +-- RainbowKit wallet connection
    +-- wagmi/viem contract reads and writes
    +-- dashboards for funders, builders, and escrow discovery
```

## Repository Structure

```text
.
+-- README.md
+-- contracts/
|   +-- foundry.toml
|   +-- remappings.txt
|   +-- script/
|   |   +-- Deploy.s.sol
|   |   +-- DeployTestnet.s.sol
|   +-- src/
|   |   +-- core/
|   |   |   +-- EscrowFactory.sol
|   |   |   +-- MilestoneEscrow.sol
|   |   +-- interfaces/
|   |   |   +-- IVerifier.sol
|   |   +-- mocks/
|   |   |   +-- MockUSDC.sol
|   |   +-- verifiers/
|   |       +-- ContractDeployedVerifier.sol
|   |       +-- TimestampVerifier.sol
|   |       +-- TVLVerifier.sol
|   |       +-- TxCountVerifier.sol
|   +-- test/
|       +-- EscrowFactory.t.sol
|       +-- MilestoneEscrow.t.sol
|       +-- verifiers/
|           +-- ContractDeployedVerifier.t.sol
|           +-- TVLVerifier.t.sol
+-- frontend/
    +-- package.json
    +-- next.config.ts
    +-- tsconfig.json
    +-- public/
    |   +-- logo.png
    |   +-- milestoneStream_logo.png
    +-- src/app/
        +-- page.tsx
        +-- builder/page.tsx
        +-- funder/page.tsx
        +-- explore/page.tsx
        +-- escrow/[id]/page.tsx
        +-- components/
```

## Smart Contract Overview

The contract system is centered around `EscrowFactory` and `MilestoneEscrow`.

### `EscrowFactory.sol`

`EscrowFactory` deploys new `MilestoneEscrow` contracts and keeps indexes that make them easy to discover from the frontend.

Main responsibilities:

- Stores the global list of all deployed escrows.
- Stores escrows grouped by funder.
- Stores escrows grouped by builder.
- Stores a `defaultArbiter` used by newly created escrows.
- Allows the factory owner to update the default arbiter.

Important functions:

| Function | Purpose |
| --- | --- |
| `createEscrow(builder, token, milestones)` | Deploys a new milestone escrow for the caller as funder. |
| `setDefaultArbiter(_newArbiter)` | Updates the arbiter used for future escrows. Owner only. |
| `getEscrowsByFunder(funder)` | Returns escrows created by a funder. |
| `getEscrowsByBuilder(builder)` | Returns escrows assigned to a builder. |
| `getAllEscrows()` | Returns every escrow created through the factory. |
| `getTotalEscrows()` | Returns the number of created escrows. |

### `MilestoneEscrow.sol`

`MilestoneEscrow` is the core escrow contract. It stores the funder, builder, ERC-20 token, arbiter, total amount, released amount, and milestone list.

Main responsibilities:

- Receives and holds ERC-20 funds from the funder.
- Stores milestone metadata and verification configuration.
- Allows the builder to claim milestones.
- Calls external verifier contracts to validate completion.
- Releases funds to the builder when conditions are satisfied.
- Gives the funder a dispute path for optimistic claims.
- Lets the arbiter resolve disputed milestones.
- Allows cancellation when both parties agree or all pending milestones have expired.

Escrow statuses:

| Status | Meaning |
| --- | --- |
| `Active` | Escrow is live and milestones can be claimed. |
| `Completed` | All funds have been released. |
| `Cancelled` | Escrow was cancelled and unreleased funds were returned. |
| `Disputed` | At least one milestone is under arbiter review. |

Milestone statuses:

| Status | Meaning |
| --- | --- |
| `Pending` | Milestone has not been claimed yet. |
| `Claimed` | Builder made an optimistic claim and the challenge window is active. |
| `Released` | Milestone funds were released to the builder. |
| `Disputed` | Funder disputed the milestone claim. |
| `Expired` | Milestone is considered expired by the app or workflow. |

Important functions:

| Function | Caller | Purpose |
| --- | --- | --- |
| `lockFunds(amount)` | Funder | Transfers the full escrow amount from funder into the contract. |
| `claimMilestone(milestoneIndex)` | Builder | Attempts verifier-based or optimistic milestone claim. |
| `releaseMilestone(milestoneIndex)` | Builder | Releases an optimistic milestone after the challenge window. |
| `disputeMilestone(milestoneIndex)` | Funder | Disputes an optimistic claim before the challenge window ends. |
| `resolveDispute(milestoneIndex, builderWins)` | Arbiter | Resolves a disputed milestone. |
| `cancelEscrow()` | Funder or builder | Cancels when mutually approved or when pending deadlines are expired. |

### Milestone Data Model

Each milestone contains:

| Field | Type | Description |
| --- | --- | --- |
| `title` | `string` | Milestone title shown in the UI. |
| `description` | `string` | Human-readable condition or explanation. |
| `amount` | `uint256` | Payment amount in token base units. For USDC, this uses 6 decimals. |
| `verifier` | `address` | Contract that validates the milestone. |
| `verifierParams` | `bytes` | ABI-encoded verifier-specific parameters. |
| `deadline` | `uint256` | Unix timestamp deadline. `0` means no deadline. |
| `status` | `MilestoneStatus` | Current milestone state. |
| `isOptimistic` | `bool` | Enables challenge-window release when verification does not immediately pass. |
| `claimedAt` | `uint256` | Timestamp when optimistic claim was created. |

### Challenge Window

The contract defines:

```solidity
uint256 public constant CHALLENGE_WINDOW = 48 hours;
```

For optimistic milestones:

1. Builder claims the milestone.
2. Milestone moves to `Claimed`.
3. Funder has 48 hours to call `disputeMilestone`.
4. If no dispute happens, builder can call `releaseMilestone`.
5. If disputed, the arbiter decides through `resolveDispute`.

## Verifier System

MilestoneStream uses pluggable verifier contracts. Every verifier implements `IVerifier`.

```solidity
interface IVerifier {
    function verify(bytes calldata params) external view returns (bool);
    function getVerifierType() external pure returns (string memory);
}
```

This lets the escrow contract stay generic while different milestone types define their own proof logic.

### Included Verifiers

| Verifier | Type | What It Checks | Expected Params |
| --- | --- | --- | --- |
| `ContractDeployedVerifier` | `CONTRACT_DEPLOYED` | A target address has deployed bytecode. | `address target` |
| `TimestampVerifier` | `TIMESTAMP` | Current block timestamp is greater than or equal to a target timestamp. | `uint256 target` |
| `TxCountVerifier` | `TX_COUNT` | A target contract function returns a count greater than or equal to a required value. | `address targetContract, uint256 requiredCount, bytes4 functionSelector` |
| `TVLVerifier` | `TVL_THRESHOLD` | A target contract holds enough token value using a Chainlink-style price feed. | `address targetContract, address token, address priceFeed, uint256 requiredUSDValue` |

### Custom Verifiers

To add a new verifier:

1. Create a contract in `contracts/src/verifiers/`.
2. Implement `IVerifier`.
3. Decode `params` using `abi.decode`.
4. Return `true` only when the milestone condition is satisfied.
5. Deploy the verifier.
6. Add the verifier address and parameter encoding logic to `frontend/src/app/components/contracts.ts`.

Example shape:

```solidity
contract MyVerifier is IVerifier {
    function verify(bytes calldata params) external view returns (bool) {
        // Decode and validate params here.
        return true;
    }

    function getVerifierType() external pure returns (string memory) {
        return "MY_VERIFIER";
    }
}
```

## Frontend Overview

The frontend is a Next.js application using:

- Next.js `16.2.6`
- React `19.2.4`
- TypeScript
- Tailwind CSS 4
- wagmi
- viem
- RainbowKit

Main routes:

| Route | Purpose |
| --- | --- |
| `/` | Marketing and product overview page. |
| `/funder` | Funder dashboard for creating and managing escrows. |
| `/builder` | Builder dashboard for viewing assigned escrows and claiming milestones. |
| `/explore` | Discovery/exploration page for escrow activity. |
| `/escrow/[id]` | Escrow detail page. |

### Funder Flow

The funder dashboard:

- Connects a wallet.
- Reads escrows using `getEscrowsByFunder`.
- Shows live escrow data when the factory exists on the connected network.
- Falls back to mock data when the configured factory is not deployed.
- Opens a multi-step `CreateEscrowDrawer`.
- Builds milestone objects for the factory contract.
- Encodes verifier parameters with `viem`.
- Creates escrows through `EscrowFactory.createEscrow`.

The create drawer collects:

- Escrow title
- Description
- Builder wallet
- Total USDC amount
- One or more milestones
- Milestone type
- Milestone description
- Verifier parameters
- Milestone amount
- Deadline

Supported milestone types in the UI:

- Contract deployed
- Transaction count threshold
- TVL threshold
- Deadline
- Holders, currently mapped to the timestamp/deadline fallback address in `contracts.ts`

### Builder Flow

The builder dashboard:

- Connects a wallet.
- Reads escrows using `getEscrowsByBuilder`.
- Shows assigned programs and milestone timelines.
- Shows total received and claimable milestones.
- Lets the builder claim a milestone by calling `claimMilestone`.
- Shows transaction/claim states in a modal.
- Falls back to mock data when no deployed factory is found on the active network.

### Contract Addresses

The frontend currently stores contract addresses in:

```text
frontend/src/app/components/contracts.ts
```

Configured constants include:

```ts
FACTORY_ADDRESS
MOCK_USDC_ADDRESS
VERIFIER_ADDRESSES
```

After redeploying contracts, update this file with the new addresses or replace the constants with environment-driven configuration.

## Prerequisites

Install the following before running the project:

- Node.js 20 or newer
- npm
- Foundry, including `forge`, `cast`, and `anvil`
- A wallet such as MetaMask
- An RPC URL for testnet deployment
- Optional: Etherscan API key for contract verification

Install Foundry:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Setup

Clone the repository:

```bash
git clone <repository-url>
cd milestonestream
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install contract dependencies if they are not already present:

```bash
cd ../contracts
forge install
```

## Running Locally

### 1. Start a Local Chain

In one terminal:

```bash
cd contracts
anvil
```

### 2. Deploy Contracts Locally

In another terminal:

```bash
cd contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url http://127.0.0.1:8545 --broadcast
```

The deploy script deploys:

- `ContractDeployedVerifier`
- `TimestampVerifier`
- `TxCountVerifier`
- `TVLVerifier`
- `EscrowFactory`
- `MockUSDC` on non-mainnet chains

It also writes deployment data to:

```text
contracts/deployments/<chain-id>.json
```

### 3. Update Frontend Addresses

Copy deployed addresses into:

```text
frontend/src/app/components/contracts.ts
```

Update:

- `FACTORY_ADDRESS`
- `MOCK_USDC_ADDRESS`
- `VERIFIER_ADDRESSES`

### 4. Run the Frontend

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:3000
```

## Contract Commands

From `contracts/`:

```bash
forge build
forge test
forge test -vvv
forge fmt
forge snapshot
```

Run one test file:

```bash
forge test --match-path test/MilestoneEscrow.t.sol
```

Run one test contract:

```bash
forge test --match-contract MilestoneEscrowTest
```

## Frontend Commands

From `frontend/`:

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

## Environment Variables

### Contracts

`contracts/foundry.toml` references:

```text
ETH_SEPOLIA_RPC_URL
ETHERSCAN_API_KEY
```

The deployment script also reads:

```text
PRIVATE_KEY
```

Example `contracts/.env`:

```bash
PRIVATE_KEY=your_private_key_without_0x
ETH_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

Load environment variables before deployment:

```bash
source .env
```

Never commit real private keys, RPC secrets, or API keys.

### Frontend

The current frontend uses hardcoded contract addresses in `contracts.ts`. If you prefer environment variables, move those values into `.env.local`, for example:

```bash
NEXT_PUBLIC_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_MOCK_USDC_ADDRESS=0x...
```

Then update `frontend/src/app/components/contracts.ts` to read from `process.env`.

## Testnet Deployment

The Foundry config includes a Sepolia RPC endpoint named `eth_sepolia`.

Deploy to Sepolia:

```bash
cd contracts
source .env
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url eth_sepolia \
  --broadcast \
  --verify
```

If verification is not needed:

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url eth_sepolia \
  --broadcast
```

After deployment:

1. Copy deployed addresses from the terminal output or `contracts/deployments/11155111.json`.
2. Update `frontend/src/app/components/contracts.ts`.
3. Restart the frontend.
4. Connect your wallet to the same network.

## Typical User Workflows

### Create an Escrow as a Funder

1. Connect wallet.
2. Open the funder dashboard.
3. Click the create escrow action.
4. Enter the project title, description, builder wallet, and total amount.
5. Add milestones with amounts that add up to the total.
6. Choose verifier types and enter verifier parameters.
7. Submit the transaction to call `createEscrow`.
8. Approve the escrow contract to spend the selected token.
9. Lock funds by calling `lockFunds`.

### Claim a Milestone as a Builder

1. Connect the builder wallet.
2. Open the builder dashboard.
3. Select a claimable milestone.
4. Call `claimMilestone`.
5. If the verifier returns `true`, funds are released immediately.
6. If the milestone is optimistic, wait for the 48-hour challenge window and call `releaseMilestone`.

### Dispute a Milestone as a Funder

1. Watch for a milestone in `Claimed` state.
2. Call `disputeMilestone` before the 48-hour challenge window ends.
3. The escrow enters `Disputed` state.
4. Arbiter reviews the dispute off-chain.
5. Arbiter calls `resolveDispute`.

### Cancel an Escrow

Cancellation is possible when:

- Both funder and builder approve cancellation, and no claims are active.
- Or all pending milestones with deadlines have expired.

Unreleased funds are returned to the funder.

## Security Notes

The contracts include several important protections:

- `ReentrancyGuard` on fund-moving functions.
- `SafeERC20` for token transfers.
- Role checks for funder, builder, and arbiter actions.
- Non-zero address validation for critical constructor inputs.
- Maximum of 20 milestones per escrow.
- Try/catch around verifier calls so faulty verifiers cannot unexpectedly break all claim logic.

Important considerations before production use:

- Complete a professional smart contract audit.
- Add more tests for dispute edge cases, cancellation edge cases, and frontend/contract integration.
- Decide whether the arbiter should be centralized, multisig-controlled, DAO-controlled, or replaced by another mechanism.
- Replace hardcoded frontend addresses with environment-based or deployment-artifact-based configuration.
- Review `TVLVerifier` assumptions around token decimals, price feed decimals, stale Chainlink data, and unsupported feeds.
- Review the optimistic milestone model for griefing or delayed-release scenarios.
- Add explicit token funding and approval UX if not already complete in the app flow.

## Current Limitations

- The frontend includes mock fallback data when configured contracts are not found on the current network.
- Contract addresses are hardcoded in `frontend/src/app/components/contracts.ts`.
- `DeployTestnet.s.sol` currently appears to be only a placeholder.
- The UI maps `holders` to a fallback verifier address rather than a dedicated holder-count verifier.
- Production-grade indexing would benefit from events, subgraphs, or a backend service instead of only direct RPC reads.

## Development Notes

- Solidity version is fixed to `0.8.28`.
- Foundry optimizer is enabled with `optimizer_runs = 200`.
- Foundry deployment output is allowed under `contracts/deployments`.
- The frontend assumes USDC-like 6-decimal amounts for display and transaction formatting.
- The contracts are generic ERC-20 escrows, but the current UI is oriented around USDC.

## Troubleshooting

### Frontend Shows Mock Data

This usually means the configured factory address is not deployed on the connected network.

Check:

- Wallet network
- `FACTORY_ADDRESS` in `frontend/src/app/components/contracts.ts`
- Local chain is running, if using Anvil
- Contracts were deployed to the same chain ID

### Contract Transaction Reverts on `lockFunds`

Possible causes:

- Funder did not approve enough token allowance.
- `amount` does not exactly equal `totalAmount`.
- Caller is not the funder.
- Escrow is not `Active`.

### Milestone Claim Reverts

Possible causes:

- Caller is not the builder.
- Milestone index is invalid.
- Milestone is not pending.
- Deadline has expired.
- Verifier returned `false`.
- Verifier parameters were encoded incorrectly.

### TVL Verification Fails

Possible causes:

- Target contract does not hold enough token balance.
- Price feed address is wrong.
- Price feed returns a non-positive price.
- Token decimals are not what the verifier expects.
- `requiredUSDValue` was encoded with the wrong scale.

## License

The Solidity contracts use the MIT SPDX identifier. Add a repository-level `LICENSE` file if this project will be published or distributed.
