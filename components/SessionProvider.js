'use client'

import { SessionProvider } from 'next-auth/react'

export default function SessionProviderWrapper({ children, session }) {
  return (
    <SessionProvider 
      session={session}
      // Refetch session every 30 seconds for testing (will change back later)
      refetchInterval={30}
      // Refetch session when window gains focus
      refetchOnWindowFocus={true}
      // Update session when page becomes visible
      refetchWhenOffline={false}
      // Base URL for session endpoint
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  )
}
