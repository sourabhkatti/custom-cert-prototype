'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import CustomPackagesTable from '@/components/CustomPackagesTable'
import CreatePackagePanel from '@/components/CreatePackagePanel'
import { CustomPackage } from '@/lib/types'
import { MOCK_PACKAGES } from '@/lib/mockData'

export default function CustomPackagesPage() {
  const [packages, setPackages] = useState<CustomPackage[]>(MOCK_PACKAGES)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const handleCreatePackage = () => {
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
  }

  const handlePackageCreated = (packageData: any) => {
    // Create new package
    const newPackage: CustomPackage = {
      id: `pkg-${Date.now()}`,
      name: packageData.name,
      certificateBundle: packageData.certificateBundle,
      version: packageData.certificateBundle?.version || '1.0',
      created: new Date().toISOString().split('T')[0],
      status: 'building',
      certificateCount: packageData.certificateBundle?.certificateCount || 1,
      description: packageData.certificateBundle?.description
    }

    // Add to packages list
    setPackages(prev => [newPackage, ...prev])

    // Show success notification
    setNotification(`Package "${packageData.name}" created successfully!`)

    // Simulate build completion after 3 seconds
    setTimeout(() => {
      setPackages(prev =>
        prev.map(pkg =>
          pkg.id === newPackage.id
            ? { ...pkg, status: 'active' as const }
            : pkg
        )
      )
    }, 3000)

    // Clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-chainguard-dark to-chainguard-darker">
      <Navigation />

      <main className="flex-1 p-8">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 z-40 bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-3 rounded-lg">
            {notification}
          </div>
        )}

        <CustomPackagesTable
          onCreatePackage={handleCreatePackage}
        />
      </main>

      <CreatePackagePanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onPackageCreated={handlePackageCreated}
      />
    </div>
  )
}