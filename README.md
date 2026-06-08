# MilestoneStream

MilestoneStream is a full-stack Ethereum escrow platform built to manage milestone-based payments between funders and builders. It combines:

- A Solidity smart contract suite for on-chain milestone escrow, verification, disputes, and cancellation.
- A Next.js frontend for connecting wallets, creating escrows, and tracking milestone progress.

---

## Repository structure

- `contracts/`
  - Solidity smart contracts and Foundry configuration.
  - `src/core/`
    - `EscrowFactory.sol` — deploys and tracks milestone escrow contracts.
    - `MilestoneEscrow.sol` — manages fund locking, milestone claims, verification, release, disputes, and cancellation.
  - `src/interfaces/IVerifier.sol` — verifier interface for milestone checks.
  - `src/verifiers/` — verifier contracts such as `ContractDeployedVerifier`, `TimestampVerifier`, `TVLVerifier`, and `TxCountVerifier`.
  - `test/` — Foundry tests for escrow flows and verifiers.
  - `script/` — deployment scripts for Forge.

- `frontend/`
  - Next.js application using React, TypeScript, Tailwind, `wagmi`, `viem`, and `@rainbow-me/rainbowkit`.
  - `src/app/` — app routes and UI integration.
  - `src/app/escrow/`, `builder/`, `funder/`, `explore/` — likely feature pages for escrow workflows.

---

## Key features

- Milestone escrow creation with multiple milestones.
- Support for optimistic milestone claims and delayed release windows.
- On-chain milestone verification via pluggable verifier contracts.
- Dispute resolution through a trusted arbiter.
- Escrow cancellation with mutual consent or expiration handling.
- Escrow factory indexing by funder, builder, and global list.

---

## Smart contract design

### `EscrowFactory.sol`

- Deploys new `MilestoneEscrow` instances.
- Stores a default arbiter used for dispute resolution.
- Tracks escrows by funder, by builder, and globally.
- Allows owner updates for the default arbiter.

### `MilestoneEscrow.sol`

- Holds funds in an ERC-20 token escrow.
- Requires milestones to be supplied at deployment.
- Supports milestone states: `Pending`, `Claimed`, `Released`, `Disputed`, `Expired`.
- Verifies milestone completion using external verifier contracts.
- Releases funds automatically when verification passes.
- Allows builders to claim optimistic milestones with a challenge window.
- Enables funders to dispute claims before the window expires.
- Lets an arbiter resolve disputes.
- Supports cancellation with mutual consent or automatic expiry.

---

## Frontend stack

- `Next.js` 16
- `React` 19
- `TypeScript`
- `Tailwind CSS` 4
- `wagmi` + `viem` for wallet and Ethereum interactions
- `@rainbow-me/rainbowkit` for wallet connection UI

The frontend is designed to interact with deployed escrow contracts and expose builder/funder workflows.

---

## Getting started

### Prerequisites

- Node.js 20+ and npm
- Foundry (`forge`, `cast`, `anvil`)
- An Ethereum RPC endpoint for deployment or testing if needed

### Run contract tests

```bash
cd contracts
forge test
```

### Build contracts

```bash
cd contracts
forge build
```

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000`.

---

## Deployment notes

- The contract suite is configured for Foundry.
- Deployment scripts are located in `contracts/script/`.
- You can use `forge script` with an RPC URL and private key to deploy contracts.

Example:

```bash
cd contracts
forge script script/Deploy.s.sol:CounterScript --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>
```

> Update the script target if your deployment contract differs from the example.

---

## Useful commands

From the repository root:

```bash
cd contracts
forge test
forge build
forge fmt
```

From the frontend directory:

```bash
cd frontend
npm install
npm run dev
npm run build
npm run start
npm run lint
```

---

## Notes

- `contracts/README.md` includes Foundry usage and tooling references.
- The frontend currently uses Next.js app routing and modern React features.
- If you add additional verifier logic, keep the `IVerifier` interface and `verify(bytes)` pattern consistent.

---

## License

This repository uses open-source tooling and a Solidity MIT license pattern in contract headers. Adjust license details as needed for your project.
