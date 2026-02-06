'use client'

import { Button } from './ui/button'
import { ArrowRight, Heart, Coffee, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 opacity-60" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 blur-xl" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-xl" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-20 blur-xl" />
      
      <div className="relative container mx-auto text-center">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200 mb-8">
            <Sparkles className="w-4 h-4 text-orange-500 mr-2" />
            <span className="text-sm font-medium text-orange-700">Fueling the open source revolution, one coffee at a time</span>
          </div>
          
          {/* Main headline */}
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Where Code Meets
            </span>
            <br />
            <span className="text-4xl md:text-5xl text-gray-800 font-light">
              Kindness & Coffee
            </span>
          </h1>
          
          {/* Storytelling copy */}
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Every line of open source code is a love letter to the world. 
            <span className="text-orange-600 font-semibold"> Now, let the world buy you a coffee</span> — 
            in USDC, with the magic of Web3 and the warmth of community.
          </p>

          {/* Call-to-action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/projects" className="flex items-center">
                <Coffee className="mr-2 h-5 w-5" />
                Buy a Coffee for a Builder
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg">
              <Link href="/register" className="flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                Share Your Project
              </Link>
            </Button>
          </div>

          {/* Stats/social proof */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-100 to-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Coffee className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Instant USDC</h3>
              <p className="text-gray-600">
                No more waiting for payouts. Your coffee money arrives instantly, warm and ready.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Community First</h3>
              <p className="text-gray-600">
                Built by maintainers, for maintainers. We get the struggle because we live it too.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Web3 Magic</h3>
              <p className="text-gray-600">
                ENS names, smart contracts, and the future of funding — simplified for humans.
              </p>
            </div>
          </div>

          {/* Personal note */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-orange-100">
              <p className="text-gray-700 italic leading-relaxed">
                &quot;Behind every great open source project is a tired developer fueled by caffeine and community. 
                We&apos;re here to make sure both never run out.&quot;
              </p>
              <p className="text-sm text-orange-600 mt-4 font-medium">— The Maintainr Team</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
