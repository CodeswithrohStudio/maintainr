'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">Maintainr</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/projects" className="text-gray-600 hover:text-gray-900">
              Projects
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
              How it Works
            </Link>
            <Link href="/docs" className="text-gray-600 hover:text-gray-900">
              Docs
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
