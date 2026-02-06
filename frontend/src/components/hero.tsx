'use client'

import { Button } from './ui/button'
import { Coffee, Heart, Zap, Shield } from 'lucide-react'
import Link from 'next/link'
import { ThreeBackground } from './three-background'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-orange-50 via-white to-orange-50">
      <ThreeBackground />
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Main Content - Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full">
                <Coffee className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-orange-800">Decentralized Tipping for Developers</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900">Build your portfolio,</span>
                <br />
                <span className="text-orange-600">get tipped in crypto</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Create your developer profile, share your work, and receive tips directly to your wallet. 
                No middleman, instant payouts in USDC.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                    <Coffee className="mr-2 h-5 w-5" />
                    Start Your Page
                  </Button>
                </Link>
                
                <Link href="/projects">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg font-semibold">
                    Explore Projects
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Secure & Decentralized</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-gray-600">Instant Payouts</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual/Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-orange-100">
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                      <Coffee className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">Your Project Name</h3>
                      <p className="text-gray-500">Building amazing things</p>
                    </div>
                  </div>

                  {/* Support Section */}
                  <div className="bg-orange-50 rounded-2xl p-6 space-y-4">
                    <p className="text-gray-700 font-medium">Support my work</p>
                    
                    {/* Amount Options */}
                    <div className="grid grid-cols-3 gap-3">
                      {[5, 10, 25].map((amount) => (
                        <button
                          key={amount}
                          className="bg-white border-2 border-orange-200 hover:border-orange-400 rounded-xl py-3 px-4 font-semibold text-gray-900 transition-all hover:shadow-md"
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>

                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-semibold">
                      <Heart className="mr-2 h-5 w-5" />
                      Support with USDC
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">$1,234</p>
                      <p className="text-sm text-gray-500">Total Raised</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">89</p>
                      <p className="text-sm text-gray-500">Supporters</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-200 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Instant Payments</h3>
              <p className="text-gray-600">Receive USDC directly to your wallet. No waiting, no delays.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Secure & Transparent</h3>
              <p className="text-gray-600">Built on blockchain. Every transaction is verifiable and secure.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Community Driven</h3>
              <p className="text-gray-600">Built by developers, for developers. Join the movement.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
