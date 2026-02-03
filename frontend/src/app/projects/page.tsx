'use client'

import { useProjects } from '@/hooks/useProjects'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Heart, Users, AlertCircle } from 'lucide-react'

export default function ProjectsPage() {
  const { projects, loading, error } = useProjects()

  const getRepoName = (url: string) => {
    const parts = url.split('/')
    return parts[parts.length - 1]
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Projects</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Projects</h1>
        <p className="text-gray-600">
          Discover and support open-source projects building the future.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {project.ensName || getRepoName(project.githubRepoUrl)}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    <a 
                      href={project.githubRepoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {getRepoName(project.githubRepoUrl)}
                    </a>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Heart className="h-4 w-4 mr-1 text-red-500" />
                    Project #{project.projectIdOnchain}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {project.recipients.length} recipients
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Revenue Split</p>
                  <div className="space-y-1">
                    {project.recipients.map((recipient, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-mono">
                          {recipient.slice(0, 6)}...{recipient.slice(-4)}
                        </span>
                        <span className="font-medium">
                          {project.splits[index] / 100}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Support Project
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-4">
            Be the first to register your project!
          </p>
          <Button>
            Register Your Project
          </Button>
        </div>
      )}
    </div>
  )
}
