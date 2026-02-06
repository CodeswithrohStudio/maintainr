'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, User, LogOut, Coffee } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ handle: string; githubId: string; _id: string } | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setIsAuthenticated(false)
    setUser(null)
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Coffee className="h-6 w-6 text-orange-500 group-hover:rotate-12 transition-transform" />
              <Heart className="h-3 w-3 text-pink-500 absolute -top-1 -right-1" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
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
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-orange-200 text-orange-700 hover:bg-orange-50 flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">@{user.handle}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-orange-100">
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="flex items-center space-x-2">
                      <Coffee className="h-4 w-4" />
                      <span>Create Page</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center space-x-2">
                      <Heart className="h-4 w-4" />
                      <span>My Coffee Fund</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-orange-100" />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-red-600">
                    <LogOut className="h-4 w-4" />
                    <span>Take a Break</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-md hover:shadow-lg transition-all"
              >
                <Coffee className="mr-2 h-4 w-4" />
                Start Brewing
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
