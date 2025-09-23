import { test, expect } from '@playwright/test';

test.describe('Certificate Management Workflow - HTML Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo-clean.html');
    await page.waitForLoadState('networkidle');
  });

  test('should load the demo page with all main elements', async ({ page }) => {
    // Check main page elements are present
    await expect(page.locator('h1')).toContainText('Custom Packages');
    await expect(page.getByText('Create New Custom Package')).toBeVisible();

    // Verify table structure
    await expect(page.getByText('Package name')).toBeVisible();
    await expect(page.getByText('Common name')).toBeVisible();
    await expect(page.getByText('Issuer')).toBeVisible();
    await expect(page.getByText('Expires on')).toBeVisible();

    // Verify some existing packages are shown
    await expect(page.getByText('aws-ec2-internal-cert')).toBeVisible();
    await expect(page.getByText('gcp-compute-engine-cert')).toBeVisible();
  });

  test('should open create package panel when clicking the create button', async ({ page }) => {
    await page.click('#createPackageBtn');

    // Verify panel is open
    await expect(page.locator('#panelOverlay')).not.toHaveClass(/hidden/);
    await expect(page.getByText('Create Custom Package')).toBeVisible();

    // Verify both options are available
    await expect(page.getByText('Upload Certificate Bundle')).toBeVisible();
    await expect(page.getByText('Browse Chainguard Suggestions')).toBeVisible();
  });

  test('should navigate to suggestions and show all 5 certificate options', async ({ page }) => {
    // Open panel
    await page.click('#createPackageBtn');

    // Click suggestions option
    await page.getByText('Browse Chainguard Suggestions').click();

    // Verify we're on suggestions step
    await expect(page.getByText('Chainguard Suggestions')).toBeVisible();

    // Verify all 5 certificate bundles are displayed with correct names
    const expectedBundles = [
      'DoD PKCS#7 for ECA PKI Only',
      'DoD PKI CA Certificate Bundles: PKCS#7 for WCF B&I PKI',
      'PKI ICP Brazil',
      'AWS Private CA Bundle',
      'Google Cloud Certificate Authority Service'
    ];

    for (const bundle of expectedBundles) {
      await expect(page.getByText(bundle)).toBeVisible();
    }

    // Verify version and certificate counts are shown
    await expect(page.getByText('v5.12 • 12 certificates')).toBeVisible(); // DoD ECA
    await expect(page.getByText('v5.17 • 8 certificates')).toBeVisible(); // DoD WCF
    await expect(page.getByText('v2024.1 • 24 certificates')).toBeVisible(); // Brazil
    await expect(page.getByText('vLatest • 6 certificates')).toBeVisible(); // AWS
    await expect(page.getByText('vLatest • 4 certificates')).toBeVisible(); // GCP
  });

  test('should allow selecting AWS bundle and proceeding through workflow', async ({ page }) => {
    // Open panel and go to suggestions
    await page.click('#createPackageBtn');
    await page.getByText('Browse Chainguard Suggestions').click();

    // Select AWS Private CA Bundle
    await page.locator('[data-bundle-id="aws-pca"]').click();

    // Verify selection highlighting
    const awsBundle = page.locator('[data-bundle-id="aws-pca"]');
    await expect(awsBundle).toHaveClass(/border-chainguard-teal/);
    await expect(awsBundle).toHaveClass(/bg-chainguard-teal\/5/);

    // Verify Next button is shown
    await expect(page.locator('#nextBtn')).toBeVisible();

    // Click Next
    await page.locator('#nextBtn').click();

    // Verify we're on configure step
    await expect(page.getByText('Configure Package')).toBeVisible();

    // Verify AWS bundle information is displayed
    await expect(page.getByText('AWS Private CA Bundle')).toBeVisible();
    await expect(page.getByText('Amazon Web Services Private Certificate Authority')).toBeVisible();
    await expect(page.getByText('Latest')).toBeVisible(); // Version
    await expect(page.getByText('6')).toBeVisible(); // Certificate count

    // Verify package name is pre-filled
    const packageNameInput = page.locator('#packageNameInput');
    await expect(packageNameInput).toHaveValue('aws-private-ca-package');

    // Change package name
    await packageNameInput.fill('my-aws-certificates');

    // Click Next to create package
    await page.locator('#nextBtn').click();

    // Verify success notification
    await expect(page.locator('#notification')).toBeVisible();
    await expect(page.getByText('Custom package created successfully!')).toBeVisible();

    // Verify package appears in table
    await expect(page.getByText('my-aws-certificates')).toBeVisible();
  });

  test('should test DoD ECA bundle workflow', async ({ page }) => {
    // Open panel and go to suggestions
    await page.click('#createPackageBtn');
    await page.getByText('Browse Chainguard Suggestions').click();

    // Select DoD ECA bundle
    await page.locator('[data-bundle-id="dod-eca"]').click();
    await page.locator('#nextBtn').click();

    // Verify configure step shows correct details
    await expect(page.getByText('DoD PKCS#7 for ECA PKI Only')).toBeVisible();
    await expect(page.getByText('US Department of Defense Enterprise Certificate Authority')).toBeVisible();
    await expect(page.getByText('5.12')).toBeVisible(); // Version
    await expect(page.getByText('12')).toBeVisible(); // Certificate count

    // Verify pre-filled package name
    const packageNameInput = page.locator('#packageNameInput');
    await expect(packageNameInput).toHaveValue('dod-eca-pki-package');

    // Create package
    await page.locator('#nextBtn').click();

    // Verify success
    await expect(page.locator('#notification')).toBeVisible();
    await expect(page.getByText('dod-eca-pki-package')).toBeVisible();
  });

  test('should test DoD WCF bundle workflow', async ({ page }) => {
    // Open panel and go to suggestions
    await page.click('#createPackageBtn');
    await page.getByText('Browse Chainguard Suggestions').click();

    // Select DoD WCF bundle
    await page.locator('[data-bundle-id="dod-wcf"]').click();
    await page.locator('#nextBtn').click();

    // Verify configure step shows correct details
    await expect(page.getByText('DoD PKI CA Certificate Bundles: PKCS#7 for WCF B&I PKI')).toBeVisible();
    await expect(page.getByText('DoD Web Communications Framework')).toBeVisible();
    await expect(page.getByText('5.17')).toBeVisible(); // Version
    await expect(page.getByText('8')).toBeVisible(); // Certificate count

    // Create package
    await page.locator('#nextBtn').click();

    // Verify success
    await expect(page.locator('#notification')).toBeVisible();
  });

  test('should test Brazilian PKI bundle workflow', async ({ page }) => {
    // Open panel and go to suggestions
    await page.click('#createPackageBtn');
    await page.getByText('Browse Chainguard Suggestions').click();

    // Select Brazilian PKI bundle
    await page.locator('[data-bundle-id="icp-brazil"]').click();
    await page.locator('#nextBtn').click();

    // Verify configure step shows correct details
    await expect(page.getByText('PKI ICP Brazil')).toBeVisible();
    await expect(page.getByText('Brazilian Public Key Infrastructure')).toBeVisible();
    await expect(page.getByText('2024.1')).toBeVisible(); // Version
    await expect(page.getByText('24')).toBeVisible(); // Certificate count

    // Create package
    await page.locator('#nextBtn').click();

    // Verify success
    await expect(page.locator('#notification')).toBeVisible();
  });

  test('should test Google Cloud CA bundle workflow', async ({ page }) => {
    // Open panel and go to suggestions
    await page.click('#createPackageBtn');
    await page.getByText('Browse Chainguard Suggestions').click();

    // Select Google Cloud bundle
    await page.locator('[data-bundle-id="gcp-ca"]').click();
    await page.locator('#nextBtn').click();

    // Verify configure step shows correct details
    await expect(page.getByText('Google Cloud Certificate Authority Service')).toBeVisible();
    await expect(page.getByText('Google Cloud Platform managed certificate authorities')).toBeVisible();
    await expect(page.getByText('Latest')).toBeVisible(); // Version
    await expect(page.getByText('4')).toBeVisible(); // Certificate count

    // Verify pre-filled package name
    const packageNameInput = page.locator('#packageNameInput');
    await expect(packageNameInput).toHaveValue('gcp-ca-service-package');

    // Create package
    await page.locator('#nextBtn').click();

    // Verify success
    await expect(page.locator('#notification')).toBeVisible();
    await expect(page.getByText('gcp-ca-service-package')).toBeVisible();
  });

  test('should allow navigation back through workflow steps', async ({ page }) => {
    // Open panel and go to suggestions
    await page.click('#createPackageBtn');
    await page.getByText('Browse Chainguard Suggestions').click();

    // Select a bundle and proceed
    await page.locator('[data-bundle-id="aws-pca"]').click();
    await page.locator('#nextBtn').click();

    // Go back to suggestions
    await page.locator('#backBtn').click();
    await expect(page.getByText('Chainguard Suggestions')).toBeVisible();

    // Verify selection is still active
    const awsBundle = page.locator('[data-bundle-id="aws-pca"]');
    await expect(awsBundle).toHaveClass(/border-chainguard-teal/);
  });

  test('should disable Next button when no bundle is selected', async ({ page }) => {
    // Open panel and go to suggestions
    await page.click('#createPackageBtn');
    await page.getByText('Browse Chainguard Suggestions').click();

    // Verify Next button is not visible initially
    await expect(page.locator('#nextBtn')).toBeHidden();

    // Select a bundle
    await page.locator('[data-bundle-id="aws-pca"]').click();

    // Verify Next button becomes visible
    await expect(page.locator('#nextBtn')).toBeVisible();
  });

  test('should close panel when clicking X button', async ({ page }) => {
    // Open panel
    await page.click('#createPackageBtn');
    await expect(page.locator('#panelOverlay')).not.toHaveClass(/hidden/);

    // Close with X button
    await page.click('[data-lucide="x"]');

    // Wait a moment for the close animation/action
    await page.waitForTimeout(100);

    // Verify panel is closed
    await expect(page.locator('#panelOverlay')).toHaveClass(/hidden/);
  });

  test('should close panel when clicking overlay background', async ({ page }) => {
    // Open panel
    await page.click('#createPackageBtn');
    await expect(page.locator('#panelOverlay')).not.toHaveClass(/hidden/);

    // Click on overlay background (the black semi-transparent area)
    await page.locator('.absolute.inset-0.bg-black\\/50').click();

    // Wait a moment for the close animation/action
    await page.waitForTimeout(100);

    // Verify panel is closed
    await expect(page.locator('#panelOverlay')).toHaveClass(/hidden/);
  });

  test('should test upload workflow functionality', async ({ page }) => {
    // Open panel
    await page.click('#createPackageBtn');

    // Click upload option
    await page.getByText('Upload Certificate Bundle').click();

    // Verify we're on upload step
    await expect(page.getByText('Upload Certificate')).toBeVisible();
    await expect(page.getByText('Upload your own certificate bundle in PEM or PKCS#7 format')).toBeVisible();

    // Verify upload area is present
    await expect(page.locator('#upload-area')).toBeVisible();
    await expect(page.getByText('Drop certificate file here or click to browse')).toBeVisible();

    // Verify Next button is not shown initially (file required)
    await expect(page.locator('#nextBtn')).toBeHidden();
  });

  test('should show auto-updating indication for managed certificates', async ({ page }) => {
    // Open panel and go to suggestions
    await page.click('#createPackageBtn');
    await page.getByText('Browse Chainguard Suggestions').click();

    // Select AWS bundle and proceed to configure
    await page.locator('[data-bundle-id="aws-pca"]').click();
    await page.locator('#nextBtn').click();

    // Verify auto-updating message is shown
    await expect(page.getByText('✓ Auto-updating certificate bundle')).toBeVisible();
  });
});