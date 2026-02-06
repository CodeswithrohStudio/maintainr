'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { Coffee, Wallet, Heart } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'

export function Header() {
  const { ready, authenticated, user, login, logout } = usePrivy()

  // Get wallet address from Privy user
  const getWalletAddress = () => {
    if (!user) return null
    
    // Check embedded wallet
    if (user.wallet?.address) {
      return user.wallet.address
    }
    
    // Check linked accounts for wallet type
    if (user.linkedAccounts) {
      const walletAccount = user.linkedAccounts.find(
        (account) => account.type === 'wallet'
      )
      if (walletAccount && 'address' in walletAccount) {
        return (walletAccount as { address: string }).address
      }
    }
    
    return null
  }

  const walletAddress = getWalletAddress()

  return (
    <header className="sticky top-0 z-50 bg-orange-50 border-b border-orange-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Coffee className="h-6 w-6 text-orange-500 group-hover:rotate-12 transition-transform" />
              <Heart className="h-3 w-3 text-pink-500 absolute -top-1 -right-1" />
            </div>
            <span className="text-xl font-bold text-orange-600">
              Maintainr
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/projects" 
              className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
            >
              Discover Builders
            </Link>
            <Link 
              href="/how-it-works" 
              className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link 
              href="/docs" 
              className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
            >
              Story
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {!ready ? (
              <Button disabled className="bg-gray-300">
                Loading...
              </Button>
            ) : authenticated && user ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button 
                    variant="outline" 
                    className="border-orange-200 text-orange-700 hover:bg-orange-100"
                  >
                    Dashboard
                  </Button>
                </Link>
                {walletAddress && (
                  <Button 
                    variant="outline" 
                    className="border-orange-200 text-orange-700 hover:bg-orange-100 flex items-center space-x-2"
                  >
                    <Wallet className="h-4 w-4" />
                    <span className="hidden sm:inline font-mono text-sm">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </Button>
                )}
                <Button 
                  onClick={logout}
                  variant="ghost"
                  className="text-gray-600 hover:text-orange-600"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button 
                onClick={login}
                className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-md hover:shadow-lg transition-all"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
