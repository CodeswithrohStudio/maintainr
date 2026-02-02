# Maintainr Smart Contracts

Smart contracts for the Maintainr OSS funding platform on Base Sepolia.

## Deployed Addresses (Base Sepolia)

- **MaintainrRegistry**: `0xfAfcca14E7b0c68463E12f826EB2320F0bf72382`
- **MaintainrDonate**: `0x513E82DE40C9d735398015747bB947ffBc2243eD`
- **MaintainrTreasury**: `0x07964B4E077315b4BB87d0998A7713af5b054F75`
- **MaintainrYellowSettlement**: `0x433C9F7bc9F7efEe6dfC884D33F05ECE12328737`
- **USDC**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

## Contracts

- **MaintainrRegistry.sol**: Project registration with contributor splits
- **MaintainrDonate.sol**: Direct donation processing with automatic splits
- **MaintainrTreasury.sol**: Treasury vault for Arc/Circle payouts
- **MaintainrYellowSettlement.sol**: Yellow Network session settlement

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your keys
```

## Testing

```bash
npm test
```

## Deployment

### Local
```bash
npx hardhat node
npm run deploy:local
```

### Base Sepolia
```bash
npm run deploy
```

## Contract Addresses (Base Sepolia)

Will be populated after deployment.

## Usage

### Register a Project
```solidity
registry.registerProject(
  "github.com/user/repo",
  [recipient1, recipient2],
  [7000, 3000], // 70% / 30%
  "user.eth"
);
```

### Donate
```solidity
usdc.approve(donateAddress, amount);
donate.donate(projectId, amount, "Great work!", "donor.eth");
```

### Settle Yellow Session
```solidity
yellowSettlement.settleSession(projectId, sessionId, finalAmount);
```
