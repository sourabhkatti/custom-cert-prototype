'use client'

import { Shield, Building2, Globe, Cloud, FileText, Calendar, User } from 'lucide-react'
import { CertificateBundle } from '@/lib/types'

interface PackageCreationFlowProps {
  step: 'configure' | 'review'
  selectedBundle?: CertificateBundle
  selectedFile?: File
  packageName: string
  onPackageNameChange: (name: string) => void
}

export default function PackageCreationFlow({
  step,
  selectedBundle,
  selectedFile,
  packageName,
  onPackageNameChange
}: PackageCreationFlowProps) {
  const getProviderIcon = (provider: string) => {
    if (provider.includes('Department of Defense')) {
      return <Building2 className="h-8 w-8 text-blue-400" />
    } else if (provider.includes('Brazilian')) {
      return <Globe className="h-8 w-8 text-green-400" />
    } else if (provider.includes('Amazon') || provider.includes('Google')) {
      return <Cloud className="h-8 w-8 text-purple-400" />
    }
    return <Shield className="h-8 w-8 text-chainguard-teal" />
  }

  if (step === 'configure') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Configure Package
          </h3>
          <p className="text-sm text-chainguard-text-secondary">
            Name your package and review the certificate details
          </p>
        </div>

        {/* Package Name */}
        <div>
          <label htmlFor="package-name" className="block text-sm font-medium text-white mb-2">
            Package Name
          </label>
          <input
            id="package-name"
            type="text"
            value={packageName}
            onChange={(e) => onPackageNameChange(e.target.value)}
            placeholder="Enter package name"
            className="w-full px-3 py-2 bg-chainguard-darker border border-gray-600 rounded-md text-white placeholder-chainguard-text-secondary focus:border-chainguard-teal focus:outline-none"
          />
          <p className="text-xs text-chainguard-text-secondary mt-1">
            This name will be used to identify your package in the registry
          </p>
        </div>

        {/* Certificate Details */}
        <div className="p-4 rounded-lg border border-gray-600 bg-chainguard-darker/50">
          <h4 className="text-white font-medium mb-4">Certificate Details</h4>

          {selectedBundle ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-lg bg-white/5">
                  {getProviderIcon(selectedBundle.provider || '')}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-white">{selectedBundle.name}</h5>
                  <p className="text-sm text-chainguard-text-secondary mt-1">
                    {selectedBundle.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-chainguard-text-secondary">Version:</span>
                      <div className="text-white font-space-mono">{selectedBundle.version}</div>
                    </div>
                    <div>
                      <span className="text-chainguard-text-secondary">Certificates:</span>
                      <div className="text-white">{selectedBundle.certificateCount}</div>
                    </div>
                    <div>
                      <span className="text-chainguard-text-secondary">Provider:</span>
                      <div className="text-white">{selectedBundle.provider}</div>
                    </div>
                    <div>
                      <span className="text-chainguard-text-secondary">Last Updated:</span>
                      <div className="text-white">
                        {new Date(selectedBundle.lastUpdated || '').toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {selectedBundle.hasExistingPackage && (
                    <div className="mt-4 p-3 rounded bg-orange-500/10 border border-orange-500/20">
                      <p className="text-sm text-orange-400">
                        ⚠️ You already have a package using this certificate bundle
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-lg bg-white/5">
                  <FileText className="h-8 w-8 text-chainguard-teal" />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-white">{selectedFile.name}</h5>
                  <p className="text-sm text-chainguard-text-secondary mt-1">
                    Uploaded certificate bundle
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-chainguard-text-secondary">File Size:</span>
                      <div className="text-white">{(selectedFile.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <div>
                      <span className="text-chainguard-text-secondary">Format:</span>
                      <div className="text-white font-space-mono">
                        {selectedFile.name.split('.').pop()?.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  // Review step
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Review & Create
        </h3>
        <p className="text-sm text-chainguard-text-secondary">
          Review your package configuration before creating
        </p>
      </div>

      {/* Package Summary */}
      <div className="p-6 rounded-lg border border-gray-600 bg-chainguard-darker/50 space-y-6">
        <div>
          <h4 className="text-white font-medium text-lg mb-1">{packageName}</h4>
          <p className="text-sm text-chainguard-text-secondary">Custom Certificate Package</p>
        </div>

        <div className="border-t border-gray-600 pt-4">
          {selectedBundle ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getProviderIcon(selectedBundle.provider || '')}
                <div>
                  <div className="text-white font-medium">{selectedBundle.name}</div>
                  <div className="text-sm text-chainguard-text-secondary">
                    {selectedBundle.provider} • v{selectedBundle.version}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 rounded-lg bg-white/5">
                  <Shield className="h-5 w-5 text-chainguard-teal mx-auto mb-1" />
                  <div className="text-white font-medium">{selectedBundle.certificateCount}</div>
                  <div className="text-chainguard-text-secondary text-xs">Certificates</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5">
                  <Calendar className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-white font-medium">Auto</div>
                  <div className="text-chainguard-text-secondary text-xs">Updates</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5">
                  <User className="h-5 w-5 text-green-400 mx-auto mb-1" />
                  <div className="text-white font-medium">Managed</div>
                  <div className="text-chainguard-text-secondary text-xs">By Chainguard</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-chainguard-teal/5 border border-chainguard-teal/20">
                <p className="text-sm text-chainguard-teal">
                  ✓ This certificate bundle will be automatically updated when the upstream source changes
                </p>
              </div>
            </div>
          ) : selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-chainguard-teal" />
                <div>
                  <div className="text-white font-medium">{selectedFile.name}</div>
                  <div className="text-sm text-chainguard-text-secondary">
                    Uploaded file • {(selectedFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-yellow-400">
                  ⚠️ This is a custom upload. You'll need to manually update this package when your certificates change.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* What happens next */}
      <div className="p-4 rounded-lg border border-gray-600 bg-chainguard-darker/30">
        <h5 className="text-white font-medium mb-2">What happens next?</h5>
        <ul className="space-y-2 text-sm text-chainguard-text-secondary">
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-chainguard-teal" />
            Package will be created and processed
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-chainguard-teal" />
            Certificates will be validated and added to the package
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-chainguard-teal" />
            Package will be available for use in your container builds
          </li>
        </ul>
      </div>
    </div>
  )
}