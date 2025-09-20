'use client'

import { useState } from 'react'
import { Plus, Shield, Calendar, Activity } from 'lucide-react'
import { CustomPackage } from '@/lib/types'
import { MOCK_PACKAGES } from '@/lib/mockData'

interface CustomPackagesTableProps {
  onCreatePackage: () => void
}

export default function CustomPackagesTable({ onCreatePackage }: CustomPackagesTableProps) {
  const [packages] = useState<CustomPackage[]>(MOCK_PACKAGES)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 rounded-full bg-green-400" />
      case 'building':
        return <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
      case 'failed':
        return <div className="w-2 h-2 rounded-full bg-red-400" />
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-400" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (packages.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bw-fusiona font-bold text-white mb-2">
              Custom Packages
            </h1>
            <p className="text-chainguard-text-secondary">
              Create and manage certificate packages for your container images
            </p>
          </div>
          <button
            onClick={onCreatePackage}
            className="bg-chainguard-teal hover:bg-chainguard-teal/90 text-black px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create New Custom Package
          </button>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-chainguard-teal/10 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-chainguard-teal" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            No custom packages yet
          </h2>
          <p className="text-chainguard-text-secondary mb-6 max-w-md">
            Create your first custom certificate package to get started. You can upload your own certificates or choose from our curated list.
          </p>
          <button
            onClick={onCreatePackage}
            className="bg-chainguard-teal hover:bg-chainguard-teal/90 text-black px-6 py-3 rounded-md font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Your First Package
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bw-fusiona font-bold text-white mb-2">
            Custom Packages
          </h1>
          <p className="text-chainguard-text-secondary">
            Manage your certificate packages and trusted certificate authorities
          </p>
        </div>
        <button
          onClick={onCreatePackage}
          className="bg-chainguard-teal hover:bg-chainguard-teal/90 text-black px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Custom Package
        </button>
      </div>

      {/* Table */}
      <div className="bg-chainguard-darker border border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-chainguard-dark border-b border-gray-700">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-semibold text-white">Package Name</th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-white">Certificate Bundle</th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-white">Version</th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-white">Certificates</th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-white">Created</th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg, index) => (
              <tr key={pkg.id} className={index !== packages.length - 1 ? 'border-b border-gray-700' : ''}>
                <td className="py-4 px-6">
                  <div>
                    <div className="text-white font-medium">{pkg.name}</div>
                    {pkg.description && (
                      <div className="text-sm text-chainguard-text-secondary">{pkg.description}</div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-white">
                    {pkg.certificateBundle?.name || 'Custom Upload'}
                  </div>
                  {pkg.certificateBundle?.provider && (
                    <div className="text-sm text-chainguard-text-secondary">
                      {pkg.certificateBundle.provider}
                    </div>
                  )}
                </td>
                <td className="py-4 px-6 text-white font-space-mono text-sm">
                  {pkg.version}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-chainguard-teal" />
                    <span className="text-white">{pkg.certificateCount}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-chainguard-text-secondary" />
                    <span className="text-white">{formatDate(pkg.created)}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(pkg.status)}
                    <span className="text-white capitalize">{pkg.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}