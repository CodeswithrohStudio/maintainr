'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Plus, Trash2, Coffee, Sparkles } from 'lucide-react'

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
        setError('Coffee shares should add up to 100% ☕')
        return
      }

      // Validate all recipients have addresses
      if (formData.recipients.some(r => !r.trim())) {
        setError('All coffee recipients need an address 💌')
        return
      }

      // Validate GitHub repo URL
      if (!formData.githubRepoUrl.trim()) {
        setError('Your GitHub home needs an address 🏠')
        return
      }

      // Get auth token
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setError('You need to login first to share your project 🤗')
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
        setError(errorData.message || 'Something went wrong while brewing ☕')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Something went wrong while brewing ☕')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Share Your Creation
            </h1>
            <p className="text-gray-600 text-lg">
              Every project deserves a little love and coffee ☕
            </p>
          </div>

          <Card className="border-orange-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <Coffee className="h-20 w-20 text-orange-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                First, Let&apos;s Get to Know You
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We believe in building with heart. Connect with GitHub to start sharing your open source journey with the world.
              </p>
              <Button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg"
              >
                <Coffee className="mr-2 h-5 w-5" />
                Start Brewing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                Your Coffee Shop is Open! 🎉
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Beautiful! Your project is now ready to receive coffee from the community. 
                The first cup is on us!
              </p>
              <Button 
                onClick={() => router.push('/projects')}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0 shadow-lg"
              >
                <Coffee className="mr-2 h-5 w-5" />
                Visit Other Builders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-10 blur-2xl" />
      <div className="absolute top-60 right-20 w-40 h-40 bg-pink-200 rounded-full opacity-10 blur-2xl" />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl relative">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Share Your Creation
          </h1>
          <p className="text-gray-600 text-lg">
            Let the world buy you a coffee for your amazing work ☕
          </p>
          {user && (
            <p className="text-sm text-orange-600 mt-2 font-medium">
              Brewing as <span className="font-bold">@{user.handle}</span>
            </p>
          )}
        </div>

        <Card className="border-orange-100 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Coffee className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl text-gray-800">Open Your Coffee Shop</CardTitle>
            <CardDescription className="text-gray-600">
              Tell us about your project and where to send the coffee money
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="githubRepoUrl" className="text-gray-700 font-medium">
                  Your GitHub Home 🏠
                </Label>
                <Input
                  id="githubRepoUrl"
                  type="url"
                  placeholder="https://github.com/username/your-awesome-project"
                  value={formData.githubRepoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubRepoUrl: e.target.value }))}
                  required
                  className="border-orange-200 focus:border-orange-400 focus:ring-orange-100"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 font-medium">Coffee Crew ☕</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addRecipient}
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Crew Member
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Who gets to enjoy the coffee? Add yourself and any collaborators.
                </p>
              </div>

              {formData.recipients.map((recipient, index) => (
                <div key={index} className="space-y-4 p-6 border border-orange-100 rounded-2xl bg-gradient-to-br from-orange-50/50 to-pink-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-gray-700 font-medium">Crew Member {index + 1}</Label>
                    {formData.recipients.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRecipient(index)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`recipient-${index}`} className="text-sm text-gray-600">
                        Wallet Address 💌
                      </Label>
                      <Input
                        id={`recipient-${index}`}
                        placeholder="0x..."
                        value={recipient}
                        onChange={(e) => updateRecipient(index, e.target.value)}
                        required
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`split-${index}`} className="text-sm text-gray-600">
                        Coffee Share % ☕
                      </Label>
                      <Input
                        id={`split-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        value={formData.splits[index] / 100}
                        onChange={(e) => updateSplit(index, Math.round(parseFloat(e.target.value) * 100))}
                        required
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-100"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 py-4 text-lg"
              >
                {loading ? (
                  <>
                    <Coffee className="mr-2 h-5 w-5 animate-pulse" />
                    Brewing Your Coffee Shop...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Open Coffee Shop
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
