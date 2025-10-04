'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

export default function AuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page immediately
    router.replace('/auth/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="text-center">
        <Spinner className="h-8 w-8 text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  )
}