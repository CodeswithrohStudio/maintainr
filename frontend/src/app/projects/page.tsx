'use client'

import { useProjects } from '@/hooks/useProjects'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Heart, Users, AlertCircle, Coffee, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function ProjectsPage() {
  const { projects, loading, error } = useProjects()

  const getRepoName = (url: string) => {
    const parts = url.split('/')
    return parts[parts.length - 1]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Coffee className="h-16 w-16 text-orange-400 mx-auto mb-6 animate-pulse" />
            <p className="text-xl text-gray-600">Brewing some amazing projects for you...</p>
            <p className="text-sm text-gray-500 mt-2">Good things take time ☕</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Oh no, the coffee spilled! ☕
            </h3>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0"
            >
              Try Brewing Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-10 blur-2xl" />
      <div className="absolute bottom-40 left-20 w-40 h-40 bg-pink-200 rounded-full opacity-10 blur-2xl" />
      
      <div className="container mx-auto px-4 py-16 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200 mb-6">
            <Sparkles className="w-4 h-4 text-orange-500 mr-2" />
            <span className="text-sm font-medium text-orange-700">Discover amazing builders</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Coffee Shops
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Where open source dreams meet caffeine-fueled reality. 
            Buy a coffee for the builders shaping our digital world.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project._id} className="group hover:shadow-xl transition-all duration-300 border-orange-100 bg-white/80 backdrop-blur-sm overflow-hidden">
                {/* Header with gradient */}
                <div className="h-2 bg-gradient-to-r from-orange-400 to-pink-400" />
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-800 group-hover:text-orange-600 transition-colors">
                        {project.ensName || getRepoName(project.githubRepoUrl)}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2 text-gray-600">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        <a 
                          href={project.githubRepoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-orange-600 transition-colors"
                        >
                          {getRepoName(project.githubRepoUrl)}
                        </a>
                      </CardDescription>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <Coffee className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Heart className="h-4 w-4 mr-1 text-pink-500" />
                        <span>Shop #{project.projectIdOnchain}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1 text-purple-500" />
                        <span>{project.recipients.length} sippers</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700 flex items-center">
                      <Coffee className="h-4 w-4 mr-2 text-orange-500" />
                      Coffee Distribution
                    </p>
                    <div className="space-y-2">
                      {project.recipients.map((recipient, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-orange-50/50 rounded-lg">
                          <span className="text-sm text-gray-600 font-mono">
                            {recipient.slice(0, 6)}...{recipient.slice(-4)}
                          </span>
                          <span className="text-sm font-medium text-orange-600">
                            {project.splits[index] / 100}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Coffee className="mr-2 h-4 w-4" />
                    Buy a Coffee
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Coffee className="h-12 w-12 text-orange-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                No coffee shops yet ☕
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Be the first to open your coffee shop and share your creation with the world!
              </p>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Open Your Coffee Shop
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
