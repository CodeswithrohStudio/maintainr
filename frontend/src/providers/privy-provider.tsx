'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { ReactNode } from 'react'

export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['wallet', 'email'],
        appearance: {
          theme: 'light',
          accentColor: '#f97316',
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
