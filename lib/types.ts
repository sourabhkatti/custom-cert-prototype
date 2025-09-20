export interface CertificateBundle {
  id: string
  name: string
  version: string
  description: string
  certificateCount: number
  hasExistingPackage: boolean
  provider?: string
  lastUpdated?: string
}

export interface CustomPackage {
  id: string
  name: string
  certificateBundle?: CertificateBundle
  version: string
  created: string
  status: 'active' | 'building' | 'failed'
  certificateCount: number
  description?: string
}

export interface CreatePackageStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<any>
}