# Maintainr Event Indexer

Real-time event indexer for Maintainr smart contracts that syncs on-chain donations and Yellow sessions to MongoDB.

## 🚀 Quick Start

```bash
# Start the indexer
npm run indexer

# Or start via API (requires JWT)
POST /indexer/start
```

## 📋 Features

### **Event Monitoring**
- **Donation Events** - `Donated` events from MaintainrDonate contract
- **Yellow Sessions** - `SessionSettled` events from MaintainrYellowSettlement contract
- **Real-time Polling** - Checks for new events every 30 seconds
- **Historical Sync** - Indexes all past events from deployment

### **Data Processing**
- **USDC Amount Formatting** - Converts from wei to decimal (6 decimals)
- **Block Timestamps** - Converts block numbers to human-readable dates
- **Duplicate Prevention** - Skips already indexed transactions
- **ENS Resolution Ready** - Placeholder for ENS name resolution

### **Smart Contracts Monitored**
- **MaintainrDonate**: `0x513E82DE40C9d735398015747bB947ffBc2243eD`
- **MaintainrYellowSettlement**: `0x433C9F7bc9F7efEe6dfC884D33F05ECE12328737`

## 🗄️ Database Schema

### **Donation Collection**
```typescript
{
  projectId: number,          // Project ID from registry
  donorAddress: string,       // Donor wallet address
  donorENS: string,           // ENS name (resolved later)
  amount: string,             // USDC amount in decimal
  message: string,            // Donation message
  txHash: string,             // Transaction hash
  blockNumber: string,        // Block number
  timestamp: Date,            // Block timestamp
  source: "onchain" | "yellow" // Donation source
}
```

### **YellowSession Collection**
```typescript
{
  sessionId: string,          // Yellow session ID
  donorAddress: string,       // Donor wallet address
  recipientAddress: string,    // Recipient wallet address
  amount: string,             // USDC amount
  message: string,            // Session message
  txHash: string,             // Transaction hash
  blockNumber: string,        // Block number
  timestamp: Date,            // Block timestamp
  status: "open" | "settled"   // Session status
}
```

## 🔧 Configuration

```bash
# Required environment variables
BASE_SEPOLIA_RPC=https://sepolia.base.org
DONATE_ADDRESS=0x513E82DE40C9d735398015747bB947ffBc2243eD
YELLOW_SETTLEMENT_ADDRESS=0x433C9F7bc9F7efEe6dfC884D33F05ECE12328737
MONGODB_URI=mongodb://localhost:27017/maintainr
```

## 📊 API Endpoints

### **Indexer Control**
- `POST /indexer/start` - Start indexing (JWT protected)
- `GET /indexer/stats` - Get donation statistics
- `POST /indexer/resolve-ens` - Resolve ENS names (JWT protected)

### **Statistics Response**
```json
{
  "totalDonations": 150,
  "totalAmount": "12500.50",
  "yellowSessions": 45
}
```

## 🔄 Indexing Process

### **1. Historical Sync**
- Scans all blocks from contract deployment to current
- Processes all `Donated` and `SessionSettled` events
- Stores in MongoDB with full metadata

### **2. Real-time Polling**
- Every 30 seconds, checks last 10 blocks for new events
- Processes any new donations or Yellow sessions
- Updates database in real-time

### **3. ENS Resolution**
- Background process to resolve donor ENS names
- Updates donation records with ENS information
- Improves user experience in frontend

## 🛠️ Architecture

```
IndexerService
├── Event Polling (30s intervals)
├── Historical Event Sync
├── Event Processing
│   ├── Donation Events
│   └── Yellow Session Events
├── Database Operations
└── ENS Resolution (future)
```

## 📝 Logs

The indexer provides detailed logging:
- 🚀 Indexer startup
- 📊 Events found and processed
- ⚠️ Errors and retries
- ✅ Successful indexing operations

## 🧪 Testing

```bash
# Test indexer compilation
npm run build

# Test indexer startup (requires MongoDB)
npm run indexer
```

## 🚨 Error Handling

- **RPC Failures** - Automatic retry with exponential backoff
- **Database Errors** - Continue processing, log errors
- **Event Parsing** - Skip malformed events, continue processing
- **Duplicate Events** - Skip already indexed transactions

## 📈 Performance

- **Batch Processing** - Processes multiple events simultaneously
- **Efficient Polling** - Only checks recent blocks for new events
- **Database Indexing** - Optimized queries on txHash and blockNumber
- **Memory Efficient** - Streams events without loading all into memory

## 🔮 Future Enhancements

- **WebSocket Events** - Real-time event subscriptions
- **Multi-Chain Support** - Index events from other networks
- **Advanced Analytics** - Donation trends and insights
- **ENS Avatar Resolution** - Fetch ENS profile pictures
- **Event Filtering** - Filter by project, amount, or time range
