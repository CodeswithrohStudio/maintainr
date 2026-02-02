## Maintainr PRD (Updated Unified PRD)

Version: HackMoney MVP + 3 Partner Integrations
Partners: ENS + Yellow Network + Arc (Circle)
Database: MongoDB
Scope: OSS funding platform with on-chain receipts, instant tipping sessions, and USDC treasury payouts.

---

# 1. Product Overview

## Goal

Maintainr enables open-source maintainers and indie builders to receive USDC funding through a Buy Me a Coffee-style flow, enhanced with:

* ENS-based identity
* Yellow instant off-chain tipping sessions
* Arc/Circle-powered treasury + contributor payouts

## Core Value Proposition

**Open-source monetization without ads, with verifiable on-chain receipts and instant UX.**

---

# 2. Partner Narrative (Hackathon Fit)

## ENS → Identity Layer

Support maintainers via human-readable names (`rohit.eth`) instead of raw addresses.

## Yellow → Instant Micro-Donations

Enable session-based tipping (gasless, instant, settle once).

## Arc (Circle) → Global USDC Treasury + Payouts

Route donations into treasury vaults and distribute contributor splits automatically.

---

# 3. System Architecture (End-to-End)

## Components

1. Frontend (Next.js)
2. Backend (NestJS)
3. Smart Contracts (Solidity)
4. MongoDB (Project + Donation Metadata)
5. Indexer + Partner SDK Modules

---

## End-to-End Flow

README Button → Maintainr Page
→ ENS identity shown
→ User chooses donation amount
→ Yellow tipping session optional
→ Donation settles into Maintainr Treasury (Arc USDC)
→ Smart contract emits receipt event
→ Backend indexes into MongoDB
→ Dashboard updates

---

---

# 4. Smart Contract PRD (Maintainr Protocol)

## Objective

Provide the on-chain funding infrastructure for OSS:

* Donation receipts
* Contributor splits
* Treasury routing for Circle/Arc payouts
* Settlement hooks for Yellow sessions

---

## Chain

Base Sepolia (MVP)

## Token

USDC (6 decimals)

---

## Contract Suite

---

## 4.1 MaintainrRegistry.sol (Project Identity + Splits)

### Purpose

Registers OSS projects with payout recipients and split rules.

### Data Model

```solidity
struct Project {
  address owner;
  string githubRepo;
  address[] recipients;
  uint256[] splits; // basis points (sum = 10000)
  string ensName;   // optional rohit.eth
}
```

### Core Functions

* registerProject(repo, recipients, splits, ensName)
* updateSplits(projectId, recipients, splits)
* getProject(projectId)

### Events

* ProjectRegistered(projectId, owner, repo, ensName)

---

---

## 4.2 MaintainrDonate.sol (Donation + Receipt Engine)

### Purpose

Main donation primitive

* Accepts USDC
* Auto-splits funds
* Emits receipts

### Event

```solidity
event Donated(
  uint256 indexed projectId,
  address indexed donor,
  uint256 amount,
  string message,
  string donorENS
);
```

### Core Function

* donate(projectId, amount, message)

### Logic

1. transferFrom donor → contract
2. split across recipients
3. emit Donated

---

---

## 4.3 MaintainrTreasury.sol (Arc/Circle Treasury Vault)

### Purpose

Treasury contract for global payout logic.

Funds flow:

Donation → Treasury → Contributor payout

### Functions

* depositToTreasury(projectId, amount)
* distribute(projectId)

### Integration Requirement (Arc)

Treasury must support Circle Wallet payout execution.

---

---

## 4.4 MaintainrYellowSettlement.sol (Yellow Session Support)

### Purpose

Settle many off-chain tips into one on-chain checkpoint.

### Event

* SessionSettled(projectId, totalAmount)

### Flow

* Yellow session accumulates off-chain tips
* Final settlement calls:

```solidity
settleSession(projectId, finalAmount)
```

This emits receipt + moves USDC into Treasury.

---

---

# 5. Backend PRD (NestJS + MongoDB + Partner Glue)

## Objective

Backend handles:

* GitHub identity + repo verification
* Project metadata storage
* Donation indexing
* Yellow session coordination
* Arc payout execution
* Analytics dashboard

---

## Tech Stack

* NestJS
* MongoDB + Mongoose
* viem (contract calls + logs)
* GitHub OAuth
* Circle Wallet SDK (Arc)
* Yellow SDK

---

## MongoDB Collections

---

### User

```ts
{
  _id,
  githubId,
  handle,
  walletAddress,
  ensName,
  createdAt
}
```

---

### Project

```ts
{
  _id,
  ownerId,
  githubRepoUrl,
  projectIdOnchain,
  recipients: [],
  splits: [],
  ensName,
  treasuryAddress
}
```

---

### Donation

```ts
{
  _id,
  projectId,
  donorAddress,
  donorENS,
  amount,
  message,
  txHash,
  timestamp,
  source: "onchain" | "yellow"
}
```

---

### YellowSession

```ts
{
  _id,
  projectId,
  sessionId,
  donorAddress,
  totalAmount,
  status: "open" | "settled"
}
```

---

### TreasuryPayout

```ts
{
  _id,
  projectId,
  totalDistributed,
  recipients: [],
  circleBatchId,
  executedAt
}
```

---

---

## Core Backend Modules

---

## Auth Module (GitHub)

Endpoints

* POST /auth/github

---

## ENS Module

Purpose

* Resolve ENS names + avatars

Backend call:

* GET /ens/:address → returns ENS metadata

Requirement:
Must include real ENS resolution, no hardcoding.

---

## Project Module

Endpoints

* POST /project/register

  * Calls smart contract registerProject
  * Stores Mongo metadata

* GET /project/:handle

---

## Donation Indexer Module

Purpose
Sync Donated + SessionSettled events into MongoDB.

Behavior

* Poll events every 10s
* Insert Donation records

---

## Yellow Module (Instant Tip Sessions)

Endpoints

* POST /yellow/session/start
* POST /yellow/session/sendTip
* POST /yellow/session/settle

Required Demo

* Instant tipping actions off-chain
* Settlement checkpoint triggers contract call

---

## Arc Treasury Module (Circle)

Endpoints

* POST /treasury/payout

Logic

* Funds accumulate in MaintainrTreasury
* Backend triggers Circle Wallet payout batch

Requirement
Must show Circle tools usage (Arc + Wallets)

---

## Analytics Module

Endpoint

* GET /dashboard/:handle

Returns

```json
{
  "totalRaised": "420.00",
  "recentDonations": [],
  "topSupporters": [],
  "yellowTips": "35.00",
  "treasuryBalance": "250.00",
  "lastPayout": "2026-02-03"
}
```

---

---

# 6. Frontend PRD (Next.js + Partner UX)

## Objective

Deliver BMAC-style funding UX with:

* ENS identities
* Instant Yellow tipping
* Treasury payouts transparency

---

## Tech Stack

* Next.js 14 App Router
* TailwindCSS
* wagmi + viem
* RainbowKit
* ENS hooks
* Yellow SDK frontend session triggers

---

## Pages

---

## Landing `/`

* Product story
* CTA: Claim your OSS funding profile

---

## Claim `/claim`

Steps:

1. GitHub OAuth
2. Connect wallet
3. ENS auto-detected
4. Select repo + recipients split
5. Register project on-chain

---

## Funding Page `/:handle`

Left

* Maintainer bio
* ENS identity + avatar
* Recent supporters

Right

* Amount selector
* Message box
* Support Button (on-chain USDC)

Extra Partner UX:

### Yellow Instant Tip Mode

Toggle:

“Instant Tip Session (no gas per tip)”

User sends multiple small tips → settle once.

---

## Dashboard `/dashboard`

Metrics:

* Total raised
* Yellow micro-tips total
* Treasury balance
* Contributor payout history
* Top supporters

---

## README Badge

Markdown snippet:

```md
[![Support](https://maintainr.xyz/button/rohit)](https://maintainr.xyz/rohit)
```

Badge shows:

* ENS name
* Total USDC raised

---

# 7. MVP Execution Plan (3 Days)

---

## Day 1

* Registry + Donate contract
* ENS display working
* Donation page live

---

## Day 2

* MongoDB backend + indexer
* GitHub claim flow
* Donations appear in dashboard

---

## Day 3

* Yellow tipping session demo
* Arc treasury payout demo
* Badge + final polish

---

# 8. Hackathon Submission Checklist

✅ ENS integration: wagmi hooks + live resolution
✅ Yellow: session-based instant tipping + settlement
✅ Arc: Circle Wallet payout + treasury logic
✅ Functional MVP + architecture diagram
✅ Demo video (3 min)

---

# Final MVP Story (Perfect Pitch)

Maintainr is OSS funding infrastructure:

* Support `rohit.eth` with USDC
* Tip instantly via Yellow sessions
* Donations settle into Arc treasury
* Contributors get paid automatically
* All receipts are on-chain

---