'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Plus, Trash2, User } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ handle: string; githubId: string; _id: string } | null>(null)
  const [formData, setFormData] = useState({
    githubRepoUrl: '',
    recipients: [''],
    splits: [10000],
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const addRecipient = () => {
    setFormData(prev => ({
      ...prev,
      recipients: [...prev.recipients, ''],
      splits: [...prev.splits, 0]
    }))
  }

  const removeRecipient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index),
      splits: prev.splits.filter((_, i) => i !== index)
    }))
  }

  const updateRecipient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.map((r, i) => i === index ? value : r)
    }))
  }

  const updateSplit = (index: number, value: number) => {
    setFormData(prev => ({
      ...prev,
      splits: prev.splits.map((s, i) => i === index ? value : s)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate splits sum to 10000 (100%)
      const totalSplits = formData.splits.reduce((sum, split) => sum + split, 0)
      if (totalSplits !== 10000) {
        setError('Revenue splits must sum to 100%')
        return
      }

      // Validate all recipients have addresses
      if (formData.recipients.some(r => !r.trim())) {
        setError('All recipient addresses are required')
        return
      }

      // Validate GitHub repo URL
      if (!formData.githubRepoUrl.trim()) {
        setError('GitHub repository URL is required')
        return
      }

      // Get auth token
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setError('You must be logged in to register a project')
        return
      }

      // Call API to register project
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          githubRepoUrl: formData.githubRepoUrl,
          recipients: formData.recipients,
          splits: formData.splits
        })
      })

      if (response.ok) {
        const project = await response.json()
        setSuccess(true)
        console.log('Project registered successfully:', project)
        
        // Redirect to projects page after 2 seconds
        setTimeout(() => {
          router.push('/projects')
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to register project')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to register project')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Register Your Project</h1>
          <p className="text-gray-600">
            Add your open-source project to start receiving USDC donations.
          </p>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-6">
              You need to be logged in with GitHub to register a project.
            </p>
            <Button onClick={() => router.push('/')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="text-center py-12">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Project Registered Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Your project has been registered and is now ready to receive donations.
            </p>
            <Button onClick={() => router.push('/projects')}>
              View Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Register Your Project</h1>
        <p className="text-gray-600">
          Add your open-source project to start receiving USDC donations.
        </p>
        {user && (
          <p className="text-sm text-gray-500 mt-2">
            Logged in as: <span className="font-medium">{user.handle}</span>
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Provide details about your project and revenue distribution.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="githubRepoUrl">GitHub Repository URL</Label>
              <Input
                id="githubRepoUrl"
                type="url"
                placeholder="https://github.com/username/repository"
                value={formData.githubRepoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, githubRepoUrl: e.target.value }))}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Revenue Recipients</Label>
                <Button type="button" variant="outline" onClick={addRecipient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recipient
                </Button>
              </div>
            </div>

            {formData.recipients.map((recipient, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label>Recipient {index + 1}</Label>
                  {formData.recipients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRecipient(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`recipient-${index}`}>Wallet Address</Label>
                    <Input
                      id={`recipient-${index}`}
                      placeholder="0x..."
                      value={recipient}
                      onChange={(e) => updateRecipient(index, e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`split-${index}`}>Revenue Split (%)</Label>
                    <Input
                      id={`split-${index}`}
                      type="number"
                      min="0"
                      max="100"
                      value={formData.splits[index] / 100}
                      onChange={(e) => updateSplit(index, Math.round(parseFloat(e.target.value) * 100))}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Registering...' : 'Register Project'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
