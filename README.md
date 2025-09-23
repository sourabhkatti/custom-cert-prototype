# Chainguard Custom Packages - Certificate Management Demo

A functional prototype demonstrating Chainguard's Custom Assembly feature for managing certificate packages in container images. Customers can create custom certificate packages using either uploaded certificates or Chainguard's curated certificate bundles.

## 🎯 Project Goal

Enable enterprise customers to customize certificate authority (CA) roots in their containers without manually maintaining them. Instead of handling certificate updates themselves, customers can choose from managed certificate bundles that are automatically monitored and updated by Chainguard.

**Solution**: Custom Packages feature with Chainguard-managed certificate bundles that auto-update when upstream sources change.

## 📁 Project Structure

```
certs-prototype/
├── README.md                     # This file
├── demo-clean.html              # 🎯 Main functional demo
├── certificates_pkcs7_v5_12_eca/ # Real DoD certificate files
│   └── dod_pke_chain.pem        # DoD Root CA 6 certificate
├── app/                         # Next.js application
├── components/                  # React components
├── lib/                         # TypeScript types and mock data
├── package.json                 # Project dependencies
└── tailwind.config.js           # Styling configuration
```

## 🚀 Getting Started

### Running the Demo
1. **Clone the repository**:
   ```bash
   git clone https://github.com/sourabhkatti/custom-cert-prototype.git
   cd custom-cert-prototype
   ```

2. **Open the demo**:
   ```bash
   open demo-clean.html
   ```
   Or double-click the `demo-clean.html` file to open in your browser

### Testing the Workflow
1. Click **"Create New Custom Package"** (top right)
2. Choose **"Browse Chainguard Suggestions"**
3. Select any certificate bundle (DoD, AWS, GCP, etc.)
4. Review certificate details and edit package name
5. Click **"Create Package"**
6. Package appears in main table


## ✅ Workflow Validation Status

**All 5 certificate bundle workflows are fully functional:**

Recent updates have resolved issues with missing JavaScript handlers for DoD WCF and Brazilian PKI bundles. All certificate bundle workflows now work correctly from start to finish.

**Key Fixes Applied:**
- ✅ Fixed missing JavaScript handlers for DoD WCF bundle (`dod-wcf`)
- ✅ Fixed missing JavaScript handlers for Brazilian PKI bundle (`icp-brazil`)
- ✅ Added complete package creation logic for all 5 bundles
- ✅ Enhanced table insertion with proper certificate metadata

## 📜 Certificate Bundles

**Note**: All certificate bundles contain only public certificates and root CAs. No private keys are included in this repository - everything is publicly available certificate data safe for demonstration purposes.

### Available Options
1. **DoD PKCS#7 for ECA PKI Only** (v5.12)
   - 12 certificates
   - US Department of Defense Enterprise Certificate Authority
   - Source: [cyber.mil PKI Tools](https://www.cyber.mil/pki-pke/tools-configuration-files/)

2. **DoD PKI CA Certificate Bundles: PKCS#7 for WCF B&I PKI** (v5.17)
   - 8 certificates
   - DoD Web Communications Framework for business and intelligence operations
   - Source: [cyber.mil PKI Tools](https://www.cyber.mil/pki-pke/tools-configuration-files/)

3. **PKI ICP Brazil** (v2024.1)
   - 24 certificates
   - Brazilian Public Key Infrastructure for government and enterprise use
   - Source: [ICP-Brasil Official Site](https://www.iti.gov.br/icp-brasil)

4. **AWS Private CA Bundle** (Latest)
   - 6 certificates
   - Amazon Web Services Private Certificate Authority trusted roots
   - Source: [AWS Private CA Documentation](https://docs.aws.amazon.com/privateca/)

5. **Google Cloud Certificate Authority Service** (Latest)
   - 4 certificates
   - Google Cloud Platform managed certificate authorities
   - Source: [GCP Certificate Authority Service](https://cloud.google.com/security/products/certificate-authority-service)

### Certificate Data
- **DoD Certificates**: Authentic DoD Root CA 6 public certificate from official cyber.mil sources
- **Cloud Certificates**: Representative public certificate data for AWS and GCP bundles
- **Security**: All certificates are public root CAs - no sensitive or private key material included
