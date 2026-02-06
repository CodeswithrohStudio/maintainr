'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Plus, Trash2, Coffee, Sparkles, Wallet, Check, ArrowRight } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'

export default function RegisterPage() {
  const router = useRouter()
  const { ready, authenticated, user, login } = usePrivy()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    projectName: '',
    bio: '',
    githubUrl: '',
    twitterUrl: '',
    websiteUrl: '',
    recipients: [''],
    splits: [10000],
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (ready && authenticated && user) {
      // Privy can have embedded wallets or linked wallets
      // Try to get the wallet address from various sources
      let walletAddress = ''
      
      // Check for embedded wallet
      if (user.wallet?.address) {
        walletAddress = user.wallet.address
      }
      // Check for linked wallets array
      else if (user.linkedAccounts) {
        const walletAccount = user.linkedAccounts.find(
          (account) => account.type === 'wallet'
        )
        if (walletAccount && 'address' in walletAccount) {
          walletAddress = (walletAccount as { address: string }).address
        }
      }

      if (walletAddress) {
        setFormData(prev => ({
          ...prev,
          recipients: [walletAddress],
        }))
      }
    }
  }, [ready, authenticated, user])

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
        setError('Revenue shares must add up to 100%')
        return
      }

      // Validate all recipients have addresses
      if (formData.recipients.some(r => !r.trim())) {
        setError('All payment recipients need a wallet address')
        return
      }

      // Validate project name
      if (!formData.projectName.trim()) {
        setError('Please enter your name or project name')
        return
      }

      // Get wallet address from Privy - check if user is authenticated
      if (!authenticated || !user) {
        setError('Please connect your wallet first')
        return
      }

      // Get the wallet address from the first recipient (which is pre-filled)
      const walletAddress = formData.recipients[0]
      if (!walletAddress || !walletAddress.trim()) {
        setError('Wallet address is required')
        return
      }

      // Call API to register project
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: walletAddress,
          projectName: formData.projectName,
          bio: formData.bio,
          githubUrl: formData.githubUrl,
          twitterUrl: formData.twitterUrl,
          websiteUrl: formData.websiteUrl,
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

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Coffee className="h-12 w-12 text-orange-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Create Your Support Page
            </h1>
            <p className="text-xl text-gray-600">
              Start receiving support for your open source work in minutes
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white">
            <CardContent className="p-12">
              <div className="text-center space-y-8">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <Wallet className="h-10 w-10 text-orange-600" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    Connect Your Wallet
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Connect your wallet to receive donations directly to your address
                  </p>
                </div>

                <Button 
                  onClick={login}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg font-semibold"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </Button>

                <p className="text-sm text-gray-500">
                  Supports MetaMask, WalletConnect, Coinbase Wallet, and more
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-orange-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="border-green-100 bg-white">
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
                className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <p className="text-sm text-gray-600">
              {currentStep === 1 && 'Profile Details'}
              {currentStep === 2 && 'Payment Setup'}
              {currentStep === 3 && 'Review & Launch'}
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Coffee className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {currentStep === 1 && 'Create your developer profile'}
              {currentStep === 2 && 'Set up payment details'}
              {currentStep === 3 && 'Review and launch'}
            </CardTitle>
            {formData.recipients[0] && (
              <p className="text-sm text-gray-500 mt-2">
                Creating page for <span className="font-semibold text-orange-600 font-mono">
                  {formData.recipients[0].slice(0, 6)}...{formData.recipients[0].slice(-4)}
                </span>
              </p>
            )}
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Profile Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="projectName" className="text-base font-semibold text-gray-900">
                      Your Name / Project Name
                    </Label>
                    <Input
                      id="projectName"
                      type="text"
                      placeholder="John Doe / My Awesome Project"
                      value={formData.projectName}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                      required
                      className="h-12 text-base"
                    />
                    <p className="text-sm text-gray-500">
                      What should supporters call you?
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="bio" className="text-base font-semibold text-gray-900">
                      Bio
                    </Label>
                    <textarea
                      id="bio"
                      placeholder="Tell supporters what you're working on..."
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500">
                      Share your story, what you build, and why you do it
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="githubUrl" className="text-base font-semibold text-gray-900">
                      GitHub Profile (Optional)
                    </Label>
                    <Input
                      id="githubUrl"
                      type="url"
                      placeholder="https://github.com/username"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="twitterUrl" className="text-base font-semibold text-gray-900">
                      Twitter / X (Optional)
                    </Label>
                    <Input
                      id="twitterUrl"
                      type="url"
                      placeholder="https://twitter.com/username"
                      value={formData.twitterUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="websiteUrl" className="text-base font-semibold text-gray-900">
                      Website (Optional)
                    </Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                      className="h-12 text-base"
                    />
                  </div>

                  <Button 
                    type="button"
                    onClick={() => {
                      if (formData.projectName.trim()) {
                        setCurrentStep(2)
                        setError('')
                      } else {
                        setError('Please enter your name or project name')
                      }
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-semibold"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* Step 2: Payment Setup */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold text-gray-900">
                      Payment Recipients
                    </Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addRecipient}
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Recipient
                    </Button>
                  </div>

                  {formData.recipients.map((recipient, index) => (
                    <div key={index} className="p-6 border-2 border-gray-200 rounded-xl space-y-4 hover:border-orange-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-orange-600" />
                          <span className="font-semibold text-gray-900">Recipient {index + 1}</span>
                        </div>
                        {formData.recipients.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRecipient(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`recipient-${index}`} className="text-sm font-medium text-gray-700">
                            Wallet Address
                          </Label>
                          <Input
                            id={`recipient-${index}`}
                            placeholder="0x..."
                            value={recipient}
                            onChange={(e) => updateRecipient(index, e.target.value)}
                            required
                            className="h-11 font-mono text-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`split-${index}`} className="text-sm font-medium text-gray-700">
                            Revenue Share (%)
                          </Label>
                          <Input
                            id={`split-${index}`}
                            type="number"
                            min="0"
                            max="100"
                            value={formData.splits[index] / 100}
                            onChange={(e) => updateSplit(index, Math.round(parseFloat(e.target.value) * 100))}
                            required
                            className="h-11"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 py-6 text-base"
                    >
                      Back
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => {
                        const totalSplits = formData.splits.reduce((sum, split) => sum + split, 0)
                        if (totalSplits !== 10000) {
                          setError('Revenue shares must add up to 100%')
                        } else if (formData.recipients.some(r => !r.trim())) {
                          setError('All wallet addresses are required')
                        } else {
                          setCurrentStep(3)
                          setError('')
                        }
                      }}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-6 text-base font-semibold"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Launch */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-orange-50 rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900">Review Your Details</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Name / Project</p>
                        <p className="font-medium text-gray-900">{formData.projectName}</p>
                      </div>

                      {formData.bio && (
                        <div>
                          <p className="text-sm text-gray-600">Bio</p>
                          <p className="font-medium text-gray-900">{formData.bio}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3">
                        {formData.githubUrl && (
                          <div>
                            <p className="text-sm text-gray-600">GitHub</p>
                            <p className="font-medium text-gray-900 text-sm break-all">{formData.githubUrl}</p>
                          </div>
                        )}
                        {formData.twitterUrl && (
                          <div>
                            <p className="text-sm text-gray-600">Twitter</p>
                            <p className="font-medium text-gray-900 text-sm break-all">{formData.twitterUrl}</p>
                          </div>
                        )}
                        {formData.websiteUrl && (
                          <div>
                            <p className="text-sm text-gray-600">Website</p>
                            <p className="font-medium text-gray-900 text-sm break-all">{formData.websiteUrl}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Payment Recipients</p>
                        {formData.recipients.map((recipient, index) => (
                          <div key={index} className="flex justify-between items-center py-2">
                            <span className="font-mono text-sm text-gray-700">
                              {recipient.slice(0, 6)}...{recipient.slice(-4)}
                            </span>
                            <span className="font-semibold text-orange-600">
                              {formData.splits[index] / 100}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 py-6 text-base"
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-6 text-base font-semibold"
                    >
                      {loading ? (
                        <>
                          <Coffee className="mr-2 h-5 w-5 animate-pulse" />
                          Creating Your Page...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Launch My Page
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
