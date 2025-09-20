import { CertificateBundle, CustomPackage } from './types'

export const CERTIFICATE_BUNDLES: CertificateBundle[] = [
  {
    id: 'dod-eca',
    name: 'DoD PKCS#7 for ECA PKI Only',
    version: '5.12',
    description: 'US Department of Defense Enterprise Certificate Authority for internal systems and secure communications',
    certificateCount: 12,
    hasExistingPackage: false,
    provider: 'US Department of Defense',
    lastUpdated: '2024-08-15'
  },
  {
    id: 'dod-wcf',
    name: 'DoD PKI CA Certificate Bundles: PKCS#7 for WCF B&I PKI',
    version: '5.17',
    description: 'DoD Web Communications Framework for business and intelligence operations with enhanced security',
    certificateCount: 8,
    hasExistingPackage: true,
    provider: 'US Department of Defense',
    lastUpdated: '2024-09-01'
  },
  {
    id: 'icp-brazil',
    name: 'PKI ICP Brazil',
    version: '2024.1',
    description: 'Brazilian Public Key Infrastructure for government and enterprise use, mandated for official transactions',
    certificateCount: 24,
    hasExistingPackage: false,
    provider: 'Brazilian Government',
    lastUpdated: '2024-07-20'
  },
  {
    id: 'aws-pca',
    name: 'AWS Private CA Bundle',
    version: 'Latest',
    description: 'Amazon Web Services Private Certificate Authority trusted roots for cloud-native applications',
    certificateCount: 6,
    hasExistingPackage: false,
    provider: 'Amazon Web Services',
    lastUpdated: '2024-09-10'
  },
  {
    id: 'gcp-ca',
    name: 'Google Cloud Certificate Authority Service',
    version: 'Latest',
    description: 'Google Cloud Platform managed certificate authorities for enterprise workloads and microservices',
    certificateCount: 4,
    hasExistingPackage: false,
    provider: 'Google Cloud',
    lastUpdated: '2024-09-05'
  }
]

export const MOCK_PACKAGES: CustomPackage[] = [
  {
    id: 'pkg-1',
    name: 'DoD WCF Enterprise Bundle',
    certificateBundle: CERTIFICATE_BUNDLES.find(b => b.id === 'dod-wcf'),
    version: '5.17',
    created: '2024-09-15',
    status: 'active',
    certificateCount: 8,
    description: 'Custom package for DoD Web Communications Framework'
  },
  {
    id: 'pkg-2',
    name: 'Custom Internal CA',
    version: '1.0',
    created: '2024-09-10',
    status: 'active',
    certificateCount: 3,
    description: 'Uploaded custom certificate bundle for internal services'
  }
]