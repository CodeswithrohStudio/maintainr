'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Coffee, ExternalLink, Copy, QrCode, Code, Sparkles, Plus, Download } from 'lucide-react'
import Link from 'next/link'
import QRCode from 'react-qr-code'

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

export default function DashboardPage() {
  const router = useRouter()
  const { ready, authenticated, user } = usePrivy()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal states
  const [embedModalOpen, setEmbedModalOpen] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [copiedText, setCopiedText] = useState('')

  // Get wallet address helper
  const getWalletAddress = () => {
    if (!user) return null
    
    if (user.wallet?.address) {
      return user.wallet.address
    }
    
    if (user.linkedAccounts) {
      const walletAccount = user.linkedAccounts.find(
        (account) => account.type === 'wallet'
      )
      if (walletAccount && 'address' in walletAccount) {
        return (walletAccount as { address: string }).address
      }
    }
    
    return null
  }

  useEffect(() => {
    if (!ready) return

    if (!authenticated) {
      router.push('/')
      return
    }

    fetchProjects()
  }, [ready, authenticated, router])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const walletAddress = getWalletAddress()
      
      console.log('Dashboard: Wallet address:', walletAddress)
      
      if (!walletAddress) {
        setError('No wallet address found')
        return
      }

      // Fetch all projects and filter by wallet address
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const allProjects = await response.json()
      console.log('Dashboard: All projects:', allProjects)
      
      // Filter projects by wallet address
      const userProjects = allProjects.filter(
        (project: Project) => {
          console.log('Dashboard: Checking project:', project.walletAddress, 'against:', walletAddress)
          return project.walletAddress && walletAddress && 
            project.walletAddress.toLowerCase() === walletAddress.toLowerCase()
        }
      )
      
      console.log('Dashboard: User projects:', userProjects)
      setProjects(userProjects)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTimeout(() => setCopiedText(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getSupportUrl = (project: Project) => {
    return `${window.location.origin}/support/${project.walletAddress}`
  }

  const getEmbedCode = (project: Project) => {
    const supportUrl = getSupportUrl(project)
    return `<iframe 
  src="${supportUrl}/widget" 
  width="300" 
  height="200" 
  frameborder="0" 
  scrolling="no">
</iframe>`
  }

  const getButtonCode = (project: Project) => {
    const supportUrl = getSupportUrl(project)
    return `<a href="${supportUrl}" target="_blank">
  <button style="
    background: linear-gradient(135deg, #f97316, #fb923c);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  ">
    ☕ Support ${project.projectName}
  </button>
</a>`
  }

  const openEmbedModal = (project: Project) => {
    setSelectedProject(project)
    setEmbedModalOpen(true)
  }

  const openQrModal = (project: Project) => {
    setSelectedProject(project)
    setQrModalOpen(true)
  }

  if (!ready || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Coffee className="h-12 w-12 text-orange-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Your Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your developer profile and track support
              </p>
            </div>
            <Link href="/register">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create New Page
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Projects List */}
        {projects.length === 0 ? (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coffee className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                No projects yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Create your first developer profile to start receiving tips and support
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Your Page
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <Card key={project._id} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-gray-900 mb-2">
                        {project.projectName}
                      </CardTitle>
                      {project.bio && (
                        <p className="text-gray-600">{project.bio}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column - Info */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Wallet Address</h4>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-gray-100 px-3 py-2 rounded font-mono">
                            {project.walletAddress.slice(0, 10)}...{project.walletAddress.slice(-8)}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(project.walletAddress)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Social Links */}
                      {(project.githubUrl || project.twitterUrl || project.websiteUrl) && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Links</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-orange-600 hover:text-orange-700 flex items-center"
                              >
                                GitHub <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            )}
                            {project.twitterUrl && (
                              <a
                                href={project.twitterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-orange-600 hover:text-orange-700 flex items-center"
                              >
                                Twitter <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            )}
                            {project.websiteUrl && (
                              <a
                                href={project.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-orange-600 hover:text-orange-700 flex items-center"
                              >
                                Website <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Payment Recipients</h4>
                        {project.recipients.map((recipient, index) => (
                          <div key={index} className="flex items-center justify-between text-sm mb-1">
                            <code className="text-gray-600 font-mono">
                              {recipient.slice(0, 6)}...{recipient.slice(-4)}
                            </code>
                            <span className="text-orange-600 font-semibold">
                              {project.splits[index] / 100}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Share Your Page</h4>
                      
                      <Button
                        variant="outline"
                        className="w-full justify-start border-orange-200 hover:bg-orange-50"
                        onClick={() => openEmbedModal(project)}
                      >
                        <Code className="mr-2 h-4 w-4 text-orange-600" />
                        Get Embed Code
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start border-orange-200 hover:bg-orange-50"
                        onClick={() => openQrModal(project)}
                      >
                        <QrCode className="mr-2 h-4 w-4 text-orange-600" />
                        Generate QR Code
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start border-orange-200 hover:bg-orange-50"
                        onClick={() => copyToClipboard(getSupportUrl(project))}
                      >
                        <Copy className="mr-2 h-4 w-4 text-orange-600" />
                        Copy Support Link
                      </Button>

                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Your support page URL:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded block break-all">
                          {window.location.origin}/support/{project.walletAddress.slice(0, 8)}...
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Embed Code Modal */}
      <Modal
        isOpen={embedModalOpen}
        onClose={() => setEmbedModalOpen(false)}
        title="Embed Your Support Page"
      >
        {selectedProject && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Support Button</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                  {getButtonCode(selectedProject)}
                </pre>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => copyToClipboard(getButtonCode(selectedProject))}
              >
                {copiedText === getButtonCode(selectedProject) ? '✓ Copied!' : 'Copy Code'}
              </Button>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Embed Widget</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                  {getEmbedCode(selectedProject)}
                </pre>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => copyToClipboard(getEmbedCode(selectedProject))}
              >
                {copiedText === getEmbedCode(selectedProject) ? '✓ Copied!' : 'Copy Code'}
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>How to use:</strong> Copy the code above and paste it into your website, README, or blog. The button will link to your support page where people can send you tips!
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* QR Code Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="QR Code for Your Support Page"
      >
        {selectedProject && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <QRCode
                  value={getSupportUrl(selectedProject)}
                  size={256}
                  level="H"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code to visit {selectedProject.projectName}&apos;s support page
              </p>
              <Button
                onClick={() => {
                  const canvas = document.querySelector('canvas')
                  if (canvas) {
                    const url = canvas.toDataURL('image/png')
                    const link = document.createElement('a')
                    link.download = `${selectedProject.projectName.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`
                    link.href = url
                    link.click()
                  }
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>How to use:</strong> Save this QR code and add it to your presentations, business cards, or print materials. People can scan it to quickly access your support page!
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
