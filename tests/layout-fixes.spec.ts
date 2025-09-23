import { test, expect } from '@playwright/test';

test.describe('Layout Fixes and Text Formatting Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo-clean.html');
    await page.waitForLoadState('networkidle');
  });

  test('should display certificate content with proper formatting', async ({ page }) => {
    // Click on an existing certificate to view it
    await page.click('[data-cert-id="aws-ec2-internal"]');

    // Wait for the panel to open
    await expect(page.getByText('View Certificate Package')).toBeVisible();

    // Check that certificate content is displayed
    await expect(page.getByText('Certificate Content')).toBeVisible();

    // Verify certificate content formatting - should be readable and not have weird spacing
    const certContent = page.locator('#selected-bundle-info .font-mono');
    await expect(certContent).toBeVisible();

    // Check that line numbers are present and aligned properly
    const lineNumbers = certContent.locator('../div[1]');
    await expect(lineNumbers).toBeVisible();
  });

  test('should have proper text sizes throughout the application', async ({ page }) => {
    // Test main table text sizes
    await expect(page.locator('h1')).toContainText('Custom Packages');

    // Test create package panel text sizes
    await page.click('#createPackageBtn');
    await expect(page.getByText('Choose how to create your package')).toBeVisible();

    // Go to suggestions
    await page.getByText('Browse Chainguard Suggestions').click();
    await expect(page.getByText('Chainguard Suggestions')).toBeVisible();

    // Check that certificate options are visible with proper text sizes
    await expect(page.getByText('AWS Private CA Bundle')).toBeVisible();
    await expect(page.getByText('Google Cloud Certificate Authority Service')).toBeVisible();
  });

  test('should allow clicking and viewing all existing certificates', async ({ page }) => {
    const certificates = [
      'aws-ec2-internal',
      'aws-elb-cert',
      'aws-cloudfront',
      'gcp-compute',
      'gcp-storage',
      'azure-webapp',
      'azure-keyvault',
      'dod-pki',
      'internal-ca'
    ];

    for (const certId of certificates) {
      // Click on the certificate
      await page.click(`[data-cert-id="${certId}"]`);

      // Verify the panel opens
      await expect(page.getByText('View Certificate Package')).toBeVisible();

      // Verify certificate content is shown
      await expect(page.getByText('Certificate Content')).toBeVisible();

      // Verify delete button is present
      await expect(page.locator('#deleteBtn')).toBeVisible();

      // Close the panel for next iteration
      await page.click('[data-lucide="x"]');
      await page.waitForTimeout(100);
    }
  });

  test('should show enhanced delete dialog with affected images', async ({ page }) => {
    // Click on a certificate with affected images
    await page.click('[data-cert-id="aws-ec2-internal"]');

    // Wait for view panel
    await expect(page.getByText('View Certificate Package')).toBeVisible();

    // Click delete button
    await page.click('#deleteBtn');

    // Verify enhanced delete dialog appears
    await expect(page.getByText('Delete Certificate Package')).toBeVisible();
    await expect(page.getByText('Affected Container Images')).toBeVisible();

    // Verify affected images are shown
    await expect(page.getByText('cgr.dev/chainguard/')).toBeVisible();

    // Cancel the delete
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('should complete full workflow with improved layout', async ({ page }) => {
    // Test create new package workflow with improved layout
    await page.click('#createPackageBtn');
    await page.getByText('Browse Chainguard Suggestions').click();

    // Select AWS bundle
    await page.click('[data-bundle-id="aws-pca"]');
    await page.click('#nextBtn');

    // Verify configuration step shows improved layout
    await expect(page.getByText('Configure Package')).toBeVisible();

    // Verify package name input is present and properly sized
    const packageNameInput = page.locator('#packageNameInput');
    await expect(packageNameInput).toBeVisible();
    await expect(packageNameInput).toHaveValue('aws-private-ca-package');

    // Modify package name
    await packageNameInput.fill('test-layout-package');

    // Complete the workflow
    await page.click('#nextBtn');

    // Verify success notification
    await expect(page.getByText('Custom package created successfully!')).toBeVisible();

    // Verify package appears in table
    await expect(page.getByText('test-layout-package')).toBeVisible();
  });

  test('should test bundle certificates can be expanded and clicked', async ({ page }) => {
    // Test AWS bundle expansion
    const awsBundle = page.locator('.expandable-bundle').first();
    await awsBundle.locator('div').first().click();

    // Verify bundle expands
    await expect(page.getByText('*.microservices.acme-corp.com')).toBeVisible();

    // Click on a bundle certificate
    await page.click('[onclick*="aws-bundle-cert-1"]');

    // Verify certificate view opens
    await expect(page.getByText('View Certificate Package')).toBeVisible();
    await expect(page.getByText('acme-corp-microservices-cert')).toBeVisible();
  });
});