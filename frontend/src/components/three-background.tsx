'use client'

import { useEffect, useState } from 'react'

export function ThreeBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-orange-200 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute top-40 right-20 w-80 h-80 bg-pink-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-yellow-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
    </div>
  )
}
