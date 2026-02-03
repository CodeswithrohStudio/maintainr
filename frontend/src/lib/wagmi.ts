import { http, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { rainbowWallet } from '@rainbow-me/rainbowkit/wallets'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [rainbowWallet],
  },
], {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  appName: 'Maintainr',
})

export const config = createConfig({
  chains: [baseSepolia],
  connectors,
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC),
  },
})
