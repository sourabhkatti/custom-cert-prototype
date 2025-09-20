'use client'

import { useState, useCallback } from 'react'
import { Upload, File, X } from 'lucide-react'

interface CertificateUploadProps {
  onFileSelect: (file: File) => void
  selectedFile?: File
}

export default function CertificateUpload({ onFileSelect, selectedFile }: CertificateUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }, [onFileSelect])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }, [onFileSelect])

  const clearFile = () => {
    // Reset file input
    const fileInput = document.getElementById('certificate-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Upload Certificate
        </h3>
        <p className="text-sm text-chainguard-text-secondary">
          Upload your own certificate bundle in PEM or PKCS#7 format
        </p>
      </div>

      {selectedFile ? (
        <div className="p-4 rounded-lg border border-chainguard-teal bg-chainguard-teal/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="h-5 w-5 text-chainguard-teal" />
              <div>
                <div className="text-white font-medium">{selectedFile.name}</div>
                <div className="text-sm text-chainguard-text-secondary">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-1 rounded hover:bg-white/10 text-chainguard-text-secondary hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`
            relative p-8 rounded-lg border-2 border-dashed transition-colors text-center cursor-pointer
            ${dragActive
              ? 'border-chainguard-teal bg-chainguard-teal/5'
              : 'border-gray-600 hover:border-gray-500 bg-chainguard-darker/30'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('certificate-upload')?.click()}
        >
          <input
            id="certificate-upload"
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pem,.crt,.cer,.p7b,.p7c"
            onChange={handleChange}
          />

          <Upload className="h-8 w-8 text-chainguard-text-secondary mx-auto mb-4" />
          <h4 className="text-white font-medium mb-2">
            Drop certificate file here or click to browse
          </h4>
          <p className="text-sm text-chainguard-text-secondary">
            Supports PEM, CRT, CER, PKCS#7 formats
          </p>
        </div>
      )}

      <div className="text-xs text-chainguard-text-secondary">
        <p className="mb-2">Supported formats:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>PEM (.pem, .crt, .cer) - Base64 encoded certificates</li>
          <li>PKCS#7 (.p7b, .p7c) - Certificate bundles</li>
        </ul>
      </div>
    </div>
  )
}