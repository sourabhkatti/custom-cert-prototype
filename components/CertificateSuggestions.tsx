'use client'

import { useState } from 'react'
import { Shield, CheckCircle, Building2, Globe, Cloud } from 'lucide-react'
import { CertificateBundle } from '@/lib/types'
import { CERTIFICATE_BUNDLES } from '@/lib/mockData'

interface CertificateSuggestionsProps {
  onSelectBundle: (bundle: CertificateBundle) => void
  selectedBundleId?: string
}

export default function CertificateSuggestions({ onSelectBundle, selectedBundleId }: CertificateSuggestionsProps) {
  const getProviderIcon = (provider: string) => {
    if (provider.includes('Department of Defense')) {
      return <Building2 className="h-6 w-6 text-blue-400" />
    } else if (provider.includes('Brazilian')) {
      return <Globe className="h-6 w-6 text-green-400" />
    } else if (provider.includes('Amazon') || provider.includes('Google')) {
      return <Cloud className="h-6 w-6 text-purple-400" />
    }
    return <Shield className="h-6 w-6 text-chainguard-teal" />
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Chainguard Suggestions
        </h3>
        <p className="text-sm text-chainguard-text-secondary">
          Popular certificate bundles maintained by Chainguard. These are automatically updated when upstream changes occur.
        </p>
      </div>

      <div className="grid gap-3">
        {CERTIFICATE_BUNDLES.map((bundle) => (
          <div
            key={bundle.id}
            className={`
              relative p-4 rounded-lg border transition-all cursor-pointer
              ${selectedBundleId === bundle.id
                ? 'border-chainguard-teal bg-chainguard-teal/5'
                : 'border-gray-600 hover:border-gray-500 bg-chainguard-darker/50'
              }
            `}
            onClick={() => onSelectBundle(bundle)}
          >
            {/* Selection indicator */}
            {selectedBundleId === bundle.id && (
              <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-chainguard-teal" />
            )}

            {/* Existing package indicator */}
            {bundle.hasExistingPackage && (
              <div className="absolute top-2 right-2 bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-medium">
                Package exists
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 rounded-lg bg-white/5">
                {getProviderIcon(bundle.provider || '')}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-white text-sm leading-5">
                      {bundle.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 mb-2">
                      <span className="text-xs text-chainguard-text-secondary">
                        v{bundle.version}
                      </span>
                      <span className="text-xs text-chainguard-text-secondary">
                        {bundle.certificateCount} certificates
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-chainguard-text-secondary leading-5 mt-2">
                  {bundle.description}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-chainguard-text-secondary">
                    {bundle.provider}
                  </div>
                  <div className="text-xs text-chainguard-text-secondary">
                    Updated {new Date(bundle.lastUpdated || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Existing package warning */}
            {bundle.hasExistingPackage && (
              <div className="mt-3 p-2 rounded bg-orange-500/10 border border-orange-500/20">
                <p className="text-xs text-orange-400">
                  You already have a package using this certificate bundle. You can create another package, but consider if this is necessary.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}