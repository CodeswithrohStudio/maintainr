'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Coffee, ExternalLink, Copy, Share2 } from 'lucide-react'
import Link from 'next/link'

interface Project {
  _id: string
  walletAddress: string
  projectName: string
  bio?: string
  githubUrl?: string
  twitterUrl?: string
  websiteUrl?: string
  recipients: string[]
  splits: number[]
  projectIdOnchain: number
  createdAt: string
}

export default function SupportPage() {
  const params = useParams()
  const walletAddress = params.walletAddress as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copiedAddress, setCopiedAddress] = useState('')

  useEffect(() => {
    fetchProject()
  }, [walletAddress])

  const fetchProject = async () => {
    try {
      setLoading(true)
      
      // Fetch all projects and find the one matching the wallet address
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const allProjects = await response.json()
      
      // Find project by wallet address (case insensitive)
      const foundProject = allProjects.find(
        (p: Project) => p.walletAddress.toLowerCase() === walletAddress.toLowerCase()
      )
      
      if (!foundProject) {
        setError('Developer profile not found')
        return
      }
      
      setProject(foundProject)
    } catch (err) {
      console.error('Error fetching project:', err)
      setError('Failed to load developer profile')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(text)
      setTimeout(() => setCopiedAddress(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareProfile = async () => {
    if (navigator.share && project) {
      try {
        await navigator.share({
          title: `Support ${project.projectName}`,
          text: project.bio || `Support ${project.projectName} with crypto tips`,
          url: window.location.href
        })
      } catch (err) {
        console.error('Share failed:', err)
        // Fallback to copying URL
        copyToClipboard(window.location.href)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Coffee className="h-12 w-12 text-orange-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading developer profile...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Coffee className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Profile Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'This developer profile could not be found.'}
            </p>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Create Your Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coffee className="h-12 w-12 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {project.projectName}
          </h1>
          {project.bio && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              {project.bio}
            </p>
          )}
          
          {/* Social Links */}
          {(project.githubUrl || project.twitterUrl || project.websiteUrl) && (
            <div className="flex justify-center gap-4 mb-8">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
              {project.twitterUrl && (
                <a
                  href={project.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Support Card */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-900">
              Support {project.projectName}
            </CardTitle>
            <p className="text-gray-600">
              Send a tip to show your appreciation for their work
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Wallet Address */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Send crypto to:</h4>
                <div className="flex items-center justify-center space-x-3">
                  <code className="bg-gray-100 px-4 py-3 rounded-lg text-sm font-mono">
                    {project.walletAddress}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(project.walletAddress)}
                  >
                    {copiedAddress === project.walletAddress ? '✓ Copied!' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Support Options */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Quick Support Options:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-orange-200 hover:bg-orange-50"
                    onClick={() => window.open(`https://app.uniswap.org/swap?outputCurrency=ETH&recipient=${project.walletAddress}`, '_blank')}
                  >
                    <Coffee className="h-6 w-6 text-orange-600" />
                    <span className="text-sm">Send ETH</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-orange-200 hover:bg-orange-50"
                    onClick={() => window.open(`https://app.uniswap.org/swap?outputCurrency=USDC&recipient=${project.walletAddress}`, '_blank')}
                  >
                    <Coffee className="h-6 w-6 text-orange-600" />
                    <span className="text-sm">Send USDC</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-orange-200 hover:bg-orange-50"
                    onClick={() => window.open(`https://metamask.io/`, '_blank')}
                  >
                    <Coffee className="h-6 w-6 text-orange-600" />
                    <span className="text-sm">Other Crypto</span>
                  </Button>
                </div>
              </div>

              {/* Share Button */}
              <div className="border-t border-gray-200 pt-6">
                <Button
                  variant="outline"
                  className="border-orange-200 hover:bg-orange-50"
                  onClick={shareProfile}
                >
                  <Share2 className="mr-2 h-4 w-4 text-orange-600" />
                  Share Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Powered by{' '}
            <Link href="/" className="text-orange-600 hover:text-orange-700 font-semibold">
              Maintainr
            </Link>
            {' '}• Decentralized tipping for developers
          </p>
        </div>
      </div>
    </div>
  )
}
