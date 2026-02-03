'use client'

import { Button } from './ui/button'
import { ArrowRight, Github, Heart } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Buy Me a Coffee for Open Source
            <br />
            <span className="text-3xl md:text-4xl">with Web3</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Enable open-source maintainers and indie builders to receive USDC funding 
            through a seamless, on-chain experience enhanced with ENS identities, 
            instant tipping, and automated treasury payouts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/projects" className="flex items-center">
                Explore Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg">
              <Link href="/register" className="flex items-center">
                <Github className="mr-2 h-4 w-4" />
                Register Your Project
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">USDC Donations</h3>
              <p className="text-gray-600 text-sm">
                Stable, low-fee donations that maintain value
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Github className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">GitHub Integration</h3>
              <p className="text-gray-600 text-sm">
                Seamless authentication and project management
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Instant Payouts</h3>
              <p className="text-gray-600 text-sm">
                Automated treasury distributions to contributors
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
