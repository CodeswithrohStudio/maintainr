# Maintainr - OSS Funding Platform

**Buy Me a Coffee for Open Source with Web3**

Maintainr enables open-source maintainers and indie builders to receive USDC funding through a seamless, on-chain experience enhanced with ENS identities, instant tipping via Yellow Network, and automated treasury payouts through Arc/Circle.

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository>
cd maintainr

# Smart Contracts
cd contracts
npm install
npm test
npm run deploy  # Deploy to Base Sepolia
npm run verify  # Verify on BaseScan

# Backend (coming soon)
cd ../backend
npm install
npm run start

# Frontend (coming soon)  
cd ../frontend
npm install
npm run dev
```

## 🏗️ Architecture

### Smart Contracts (Base Sepolia)
- **MaintainrRegistry** (`0xfAfcca14E7b0c68463E12f826EB2320F0bf72382`) - Project registration with ENS names and contributor splits
- **MaintainrDonate** (`0x513E82DE40C9d735398015747bB947ffBc2243eD`) - Direct USDC donations with automatic fund splitting
- **MaintainrTreasury** (`0x07964B4E077315b4BB87d0998A7713af5b054F75`) - Treasury vault for Arc/Circle payout integration
- **MaintainrYellowSettlement** (`0x433C9F7bc9F7efEe6dfC884D33F05ECE12328737`) - Yellow Network session settlement

### Backend (NestJS + MongoDB)
- GitHub OAuth authentication
- Project metadata management
- Donation event indexing
- ENS resolution service
- Yellow session coordination
- Arc/Circle treasury payouts

### Frontend (Next.js 14)
- Landing page with project discovery
- GitHub OAuth claim flow
- BMAC-style funding pages
- Real-time donation dashboard
- README badge generation

## 🤝 Partner Integrations

### **ENS** - Identity Layer
- Human-readable names (`rohit.eth`) instead of raw addresses
- ENS avatar integration
- Real-time resolution

### **Yellow Network** - Instant Micro-Donations
- Session-based tipping (gasless, instant)
- Off-chain accumulation with on-chain settlement
- Zero gas fees per tip

### **Arc (Circle)** - Global Treasury & Payouts
- USDC treasury vaults
- Automated contributor payouts
- Circle Wallet SDK integration

## 📊 Key Features

- **🔗 On-chain Receipts**: Every donation creates a verifiable on-chain record
- **⚡ Instant UX**: Yellow Network enables gasless micro-tipping
- **👥 Team Splits**: Automatic fund distribution to multiple contributors
- **🏷️ ENS Integration**: Support maintainers via human-readable names
- **💰 USDC Native**: Stable currency for predictable funding
- **📈 Analytics Dashboard**: Real-time funding metrics and supporter insights

## 🧪 Testing

```bash
cd contracts
npm test  # All 9 tests passing
```

Test coverage includes:
- Project registration and split validation
- Donation processing and fund distribution
- Treasury deposit and distribution logic
- Yellow session settlement with duplicate protection

## 📋 Contract Verification

Contracts deployed on Base Sepolia:
- [MaintainrRegistry](https://sepolia.basescan.org/address/0xfAfcca14E7b0c68463E12f826EB2320F0bf72382)
- [MaintainrDonate](https://sepolia.basescan.org/address/0x513E82DE40C9d735398015747bB947ffBc2243eD)
- [MaintainrTreasury](https://sepolia.basescan.org/address/0x07964B4E077315b4BB87d0998A7713af5b054F75)
- [MaintainrYellowSettlement](https://sepolia.basescan.org/address/0x433C9F7bc9F7efEe6dfC884D33F05ECE12328737)

*Manual verification required due to API v2 migration. Source code available in `contracts/` directory.*

## 🎯 Use Cases

### For Maintainers
1. **Claim your profile** via GitHub OAuth
2. **Set up contributor splits** (70/30, 50/25/25, etc.)
3. **Add README badge** to your project
4. **Receive instant tips** via Yellow sessions
5. **Track analytics** in your dashboard

### For Supporters
1. **Discover projects** on maintainr.xyz
2. **Support via ENS name** (`maintainer.eth`)
3. **Send instant tips** with zero gas per tip
4. **Leave messages** with donations
5. **Verify on-chain receipts**

## 🚀 Deployment

### Smart Contracts
```bash
cd contracts
npm run deploy    # Deploy to Base Sepolia
npm run verify    # Verify on BaseScan
```

### Environment Variables
```bash
BASE_SEPOLIA_RPC=https://sepolia.base.org
PRIVATE_KEY=your_private_key
USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

## 📖 Documentation

- [PRD](./PRD.md) - Complete product requirements

## 🛠️ Tech Stack

- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **Backend**: NestJS, MongoDB, viem, GitHub OAuth
- **Frontend**: Next.js 14, TailwindCSS, wagmi, RainbowKit
- **Infrastructure**: Base Sepolia, Circle Wallet SDK, Yellow SDK

## 🏆 Hackathon Submission

Built for **HackMoney MVP + 3 Partner Integrations** featuring:
✅ ENS integration with live resolution  
✅ Yellow instant tipping sessions  
✅ Arc Circle treasury payouts  
✅ Functional MVP with end-to-end flow

## 📄 License

MIT License - see LICENSE file for details

---

**Support open-source development with on-chain transparency and instant UX.** 🚀
