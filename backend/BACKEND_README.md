# Maintainr Backend API

NestJS backend for Maintainr OSS funding platform with MongoDB integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run start:dev
```

## 📋 Available Endpoints

### Health Check
- `GET /` - API welcome message
- `GET /health` - Health status

### Authentication
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - GitHub OAuth callback
- `GET /auth/profile` - Get user profile (JWT protected)

### Projects
- `POST /projects/register` - Register new project (JWT protected)
- `GET /projects/:handle` - Get project by handle/ENS
- `GET /projects/user/my-projects` - Get user's projects (JWT protected)

## 🗄️ Database Schema

### User
- `githubId` - GitHub user ID
- `handle` - GitHub username
- `walletAddress` - Connected wallet
- `ensName` - ENS name if available

### Project
- `ownerId` - User ID reference
- `githubRepoUrl` - GitHub repository URL
- `projectIdOnchain` - Smart contract project ID
- `recipients` - Array of recipient addresses
- `splits` - Array of split percentages (basis points)
- `ensName` - Project ENS name

### Donation
- `projectId` - Project reference
- `donorAddress` - Donor wallet address
- `donorENS` - Donor ENS name
- `amount` - Donation amount
- `message` - Donation message
- `txHash` - Transaction hash
- `source` - "onchain" or "yellow"

## 🔧 Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/maintainr

# JWT
JWT_SECRET=maintainr-secret-key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# URLs
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# Smart Contracts (Base Sepolia)
REGISTRY_ADDRESS=0xfAfcca14E7b0c68463E12f826EB2320F0bf72382
DONATE_ADDRESS=0x513E82DE40C9d735398015747bB947ffBc2243eD
TREASURY_ADDRESS=0x07964B4E077315b4BB87d0998A7713af5b054F75
YELLOW_SETTLEMENT_ADDRESS=0x433C9F7bc9F7efEe6dfC884D33F05ECE12328737
USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + GitHub OAuth
- **Blockchain**: Viem for contract interactions
- **Validation**: TypeScript + ESLint

## 📦 Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # User management
├── projects/       # Project management
├── schemas/        # MongoDB schemas
├── database/       # Database configuration
└── app.module.ts   # Main application module
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

## 📝 Notes

- Backend compiles successfully with TypeScript
- MongoDB connection configured
- GitHub OAuth flow implemented
- Smart contract integration ready
- JWT authentication in place
