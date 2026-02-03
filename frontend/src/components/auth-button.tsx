'use client'

import { Button } from './ui/button'
import { Github } from 'lucide-react'

export function AuthButton() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3001/auth/github'
  }

  return (
    <Button onClick={handleLogin} variant="outline">
      <Github className="h-4 w-4 mr-2" />
      Login with GitHub
    </Button>
  )
}
