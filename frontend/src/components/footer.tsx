'use client'

import Link from 'next/link'
import { Github, Heart, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold">Maintainr</span>
            </div>
            <p className="text-gray-600 text-sm">
              OSS funding platform with Web3 superpowers.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/projects" className="text-gray-600 hover:text-gray-900">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Developers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/api" className="text-gray-600 hover:text-gray-900">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/sdk" className="text-gray-600 hover:text-gray-900">
                  SDK
                </Link>
              </li>
              <li>
                <Link href="/examples" className="text-gray-600 hover:text-gray-900">
                  Examples
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <Link href="https://github.com/CodeswithrohStudio/maintainr" className="text-gray-600 hover:text-gray-900">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com/maintainr" className="text-gray-600 hover:text-gray-900">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>
            Built with <Heart className="inline h-4 w-4 text-red-500" /> for the open-source community
          </p>
        </div>
      </div>
    </footer>
  )
}
