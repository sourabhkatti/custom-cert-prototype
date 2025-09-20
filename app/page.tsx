'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/custom-packages')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Chainguard Custom Packages</h1>
        <p className="text-chainguard-text-secondary">Redirecting to Custom Packages...</p>
      </div>
    </div>
  )
}