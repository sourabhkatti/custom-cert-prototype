'use client'

import { useState } from 'react'
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { CertificateBundle } from '@/lib/types'
import CertificateUpload from './CertificateUpload'
import CertificateSuggestions from './CertificateSuggestions'
import PackageCreationFlow from './PackageCreationFlow'

interface CreatePackagePanelProps {
  isOpen: boolean
  onClose: () => void
  onPackageCreated: (packageData: any) => void
}

type CreationStep = 'selection' | 'upload' | 'suggestions' | 'configure' | 'review'

export default function CreatePackagePanel({ isOpen, onClose, onPackageCreated }: CreatePackagePanelProps) {
  const [currentStep, setCurrentStep] = useState<CreationStep>('selection')
  const [selectedFile, setSelectedFile] = useState<File | undefined>()
  const [selectedBundle, setSelectedBundle] = useState<CertificateBundle | undefined>()
  const [packageName, setPackageName] = useState('')

  const resetState = () => {
    setCurrentStep('selection')
    setSelectedFile(undefined)
    setSelectedBundle(undefined)
    setPackageName('')
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleUploadOption = () => {
    setCurrentStep('upload')
    setSelectedBundle(undefined)
  }

  const handleSuggestionsOption = () => {
    setCurrentStep('suggestions')
    setSelectedFile(undefined)
  }

  const handleBundleSelect = (bundle: CertificateBundle) => {
    setSelectedBundle(bundle)
    setPackageName(`${bundle.name} Package`)
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setPackageName(file.name.replace(/\.[^/.]+$/, '') + ' Package')
  }

  const handleNext = () => {
    if (currentStep === 'suggestions' && selectedBundle) {
      setCurrentStep('configure')
    } else if (currentStep === 'upload' && selectedFile) {
      setCurrentStep('configure')
    } else if (currentStep === 'configure') {
      setCurrentStep('review')
    }
  }

  const handleCreatePackage = () => {
    const packageData = {
      name: packageName,
      certificateBundle: selectedBundle,
      uploadedFile: selectedFile,
      status: 'building'
    }
    onPackageCreated(packageData)
    handleClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="absolute right-0 top-0 h-full w-[600px] bg-chainguard-dark border-l border-gray-700 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-bw-fusiona font-bold text-white">
                Create Custom Package
              </h2>
              <p className="text-sm text-chainguard-text-secondary mt-1">
                Add certificate bundles to your container images
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-md hover:bg-white/10 text-chainguard-text-secondary hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentStep === 'selection' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Choose how to create your package
                  </h3>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleUploadOption}
                    className="w-full p-6 text-left rounded-lg border border-gray-600 hover:border-chainguard-teal bg-chainguard-darker/50 hover:bg-chainguard-teal/5 transition-all group"
                  >
                    <h4 className="text-white font-medium mb-2 group-hover:text-chainguard-teal">
                      Upload Certificate Bundle
                    </h4>
                    <p className="text-sm text-chainguard-text-secondary">
                      Upload your own certificate files in PEM or PKCS#7 format
                    </p>
                  </button>

                  <button
                    onClick={handleSuggestionsOption}
                    className="w-full p-6 text-left rounded-lg border border-gray-600 hover:border-chainguard-teal bg-chainguard-darker/50 hover:bg-chainguard-teal/5 transition-all group"
                  >
                    <h4 className="text-white font-medium mb-2 group-hover:text-chainguard-teal">
                      Browse Chainguard Suggestions
                    </h4>
                    <p className="text-sm text-chainguard-text-secondary">
                      Choose from popular, auto-updating certificate bundles
                    </p>
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'upload' && (
              <CertificateUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            )}

            {currentStep === 'suggestions' && (
              <CertificateSuggestions
                onSelectBundle={handleBundleSelect}
                selectedBundleId={selectedBundle?.id}
              />
            )}

            {(currentStep === 'configure' || currentStep === 'review') && (
              <PackageCreationFlow
                step={currentStep}
                selectedBundle={selectedBundle}
                selectedFile={selectedFile}
                packageName={packageName}
                onPackageNameChange={setPackageName}
              />
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700">
            <div className="flex justify-between">
              <div>
                {currentStep !== 'selection' && (
                  <button
                    onClick={() => {
                      if (currentStep === 'upload' || currentStep === 'suggestions') {
                        setCurrentStep('selection')
                      } else if (currentStep === 'configure') {
                        setCurrentStep(selectedBundle ? 'suggestions' : 'upload')
                      } else if (currentStep === 'review') {
                        setCurrentStep('configure')
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-chainguard-text-secondary hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                {currentStep === 'review' ? (
                  <button
                    onClick={handleCreatePackage}
                    className="bg-chainguard-teal hover:bg-chainguard-teal/90 text-black px-6 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Create Package
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={
                      (currentStep === 'suggestions' && !selectedBundle) ||
                      (currentStep === 'upload' && !selectedFile) ||
                      (currentStep === 'configure' && !packageName.trim())
                    }
                    className="bg-chainguard-teal hover:bg-chainguard-teal/90 disabled:bg-gray-600 disabled:text-gray-400 text-black px-6 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}