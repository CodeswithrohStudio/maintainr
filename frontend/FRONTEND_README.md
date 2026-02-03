# Maintainr Frontend

Next.js 14 frontend for Maintainr OSS funding platform with modern UI and Web3 integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 Features Implemented

### **Core Pages**
- **Landing Page** - Hero section with value proposition
- **Projects Page** - Browse and discover OSS projects
- **Navigation** - Responsive header and footer

### **UI Components**
- **Modern Design** - TailwindCSS with custom theme
- **Responsive Layout** - Mobile-first approach
- **Interactive Elements** - Hover states and transitions
- **Component Library** - Reusable UI components

### **Web3 Integration**
- **Wallet Connection** - RainbowKit integration (ready)
- **Base Sepolia** - Configured for testnet
- **ENS Support** - Identity resolution ready

## 🛠️ Tech Stack

### **Framework & Libraries**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### **Web3 Stack**
- **RainbowKit** - Wallet connection UI
- **Wagmi** - Ethereum React hooks
- **Viem** - TypeScript Ethereum library
- **TanStack Query** - Data fetching and caching

### **UI Components**
- **Radix UI** - Accessible component primitives
- **Class Variance Authority** - Component variants
- **Tailwind Merge** - Utility class merging

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── projects/
│       └── page.tsx        # Projects page
├── components/             # Reusable components
│   ├── ui/                 # Base UI components
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── header.tsx          # Site header
│   ├── footer.tsx          # Site footer
│   ├── hero.tsx            # Hero section
│   ├── wallet-connect.tsx  # Wallet connection
│   └── providers.tsx       # App providers
├── lib/                    # Utilities
│   ├── utils.ts            # Helper functions
│   └── wagmi.ts            # Web3 configuration
└── .env.example            # Environment variables
```

## 🎨 Design System

### **Colors**
- **Primary** - Blue gradient for CTAs
- **Secondary** - Gray tones for UI elements
- **Accent** - Red for brand elements (heart icon)
- **Neutral** - White and gray backgrounds

### **Typography**
- **Geist Sans** - Modern sans-serif font
- **Responsive** - Scales properly on all devices
- **Hierarchy** - Clear heading and text sizes

### **Components**
- **Button** - Multiple variants and sizes
- **Card** - Consistent content containers
- **Layout** - Responsive grid system

## 🔧 Configuration

### **Environment Variables**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
```

### **TailwindCSS Config**
- Extended color palette with CSS variables
- Custom border radius and spacing
- Dark mode support ready

### **Web3 Configuration**
- **Base Sepolia** - Primary testnet
- **RainbowKit** - Wallet connection UI
- **Wagmi** - React hooks for Ethereum

## 📱 Responsive Design

### **Mobile First**
- **320px+** - Mobile phones
- **768px+** - Tablets
- **1024px+** - Desktop
- **1280px+** - Large screens

### **Breakpoints**
- **sm** - 640px and up
- **md** - 768px and up
- **lg** - 1024px and up
- **xl** - 1280px and up

## 🚀 Performance

### **Optimization**
- **Static Generation** - Pre-rendered pages
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Automatic route-based splitting
- **Bundle Analysis** - Optimized dependencies

### **Build Output**
```
Route (app)                              Size     First Load JS
├ ○ /                                    1.67 kB         108 kB
├ ○ /_not-found                          873 B          88.1 kB
└ ○ /projects                            2.26 kB        99.4 kB
```

## 🔮 Future Enhancements

### **Wallet Integration**
- **Multiple Wallets** - MetaMask, WalletConnect, etc.
- **Network Switching** - Base mainnet support
- **Transaction Handling** - Donation flow

### **Advanced Features**
- **Real-time Updates** - WebSocket integration
- **ENS Integration** - Profile pictures and names
- **Analytics** - User behavior tracking
- **A/B Testing** - Feature flags

### **Pages & Features**
- **Project Detail** - Individual project pages
- **Donation Flow** - Complete donation process
- **User Dashboard** - Personal project management
- **Claim Flow** - ENS and wallet claiming

## 🧪 Development

### **Local Development**
```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test
```

### **Component Development**
```bash
# Storybook (if added)
npm run storybook

# Component testing
npm run test:components
```

## 📦 Deployment

### **Production Build**
```bash
# Build optimized version
npm run build

# Start production server
npm run start
```

### **Environment Setup**
- **Vercel** - Recommended for Next.js apps
- **Netlify** - Static hosting option
- **AWS Amplify** - Full-stack hosting
- **Docker** - Containerized deployment

## 🔗 Integration Points

### **Backend API**
- **Base URL**: `NEXT_PUBLIC_API_URL`
- **Authentication**: JWT tokens
- **Data Fetching**: TanStack Query
- **Error Handling**: Global error boundaries

### **Smart Contracts**
- **Network**: Base Sepolia (testnet)
- **Contracts**: Maintainr suite
- **ABI Integration**: Type-safe contract calls
- **Event Listening**: Real-time updates

## 📝 Notes

### **Current Status**
- ✅ **Core Layout** - Header, footer, navigation
- ✅ **Landing Page** - Hero and features
- ✅ **Projects Page** - Project listing
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Modern UI** - TailwindCSS styling
- 🔄 **Wallet Connection** - RainbowKit ready
- 🔄 **Donation Flow** - UI components ready

### **Next Steps**
- Complete wallet integration
- Implement donation flow
- Add real API integration
- Build user dashboard
- Add ENS integration
