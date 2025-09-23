import { test, expect } from '@playwright/test';

test.describe('Certificate Suggestions Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for redirect to custom-packages page
    await page.waitForURL('/custom-packages');
  });

  test('should display the custom packages page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Custom Packages');
    await expect(page.getByRole('button', { name: /create custom package/i })).toBeVisible();
  });

  test('should open create package panel and show selection options', async ({ page }) => {
    // Click the create package button
    await page.getByRole('button', { name: /create custom package/i }).click();

    // Verify the panel is open
    await expect(page.locator('h2')).toContainText('Create Custom Package');

    // Verify both options are visible
    await expect(page.getByText('Upload Certificate Bundle')).toBeVisible();
    await expect(page.getByText('Browse Chainguard Suggestions')).toBeVisible();
  });

  test('should navigate to suggestions page and display all 5 certificate bundles', async ({ page }) => {
    // Open create package panel
    await page.getByRole('button', { name: /create custom package/i }).click();

    // Click on suggestions option
    await page.getByRole('button', { name: /Browse Chainguard Suggestions/i }).click();

    // Verify we're on the suggestions step
    await expect(page.getByText('Chainguard Suggestions')).toBeVisible();

    // Verify all 5 certificate bundles are displayed
    const bundles = [
      'DoD PKCS#7 for ECA PKI Only',
      'DoD PKI CA Certificate Bundles: PKCS#7 for WCF B&I PKI',
      'PKI ICP Brazil',
      'AWS Private CA Bundle',
      'Google Cloud Certificate Authority Service'
    ];

    for (const bundle of bundles) {
      await expect(page.getByText(bundle)).toBeVisible();
    }
  });

  test('should show correct provider icons for each certificate bundle', async ({ page }) => {
    // Open create package panel and go to suggestions
    await page.getByRole('button', { name: /create custom package/i }).click();
    await page.getByRole('button', { name: /Browse Chainguard Suggestions/i }).click();

    // Check that provider information is displayed for each bundle
    await expect(page.getByText('US Department of Defense')).toHaveCount(2); // DoD bundles
    await expect(page.getByText('Brazilian Government')).toBeVisible();
    await expect(page.getByText('Amazon Web Services')).toBeVisible();
    await expect(page.getByText('Google Cloud')).toBeVisible();
  });

  test('should select AWS bundle and proceed to configure step', async ({ page }) => {
    // Open create package panel and go to suggestions
    await page.getByRole('button', { name: /create custom package/i }).click();
    await page.getByRole('button', { name: /Browse Chainguard Suggestions/i }).click();

    // Select AWS bundle
    const awsBundle = page.locator('div').filter({ hasText: /AWS Private CA Bundle/ }).first();
    await awsBundle.click();

    // Verify selection indicator appears
    await expect(awsBundle.locator('svg[data-lucide="check-circle"]')).toBeVisible();

    // Click Next button
    await page.getByRole('button', { name: 'Next' }).click();

    // Verify we're on configure step
    await expect(page.getByText('Configure Package')).toBeVisible();
    await expect(page.getByLabelText('Package Name')).toHaveValue('AWS Private CA Bundle Package');

    // Verify certificate details are shown
    await expect(page.getByText('AWS Private CA Bundle')).toBeVisible();
    await expect(page.getByText('Amazon Web Services')).toBeVisible();
    await expect(page.getByText('6')).toBeVisible(); // Certificate count
  });

  test('should complete AWS package creation workflow', async ({ page }) => {
    // Open create package panel and go to suggestions
    await page.getByRole('button', { name: /create custom package/i }).click();
    await page.getByRole('button', { name: /Browse Chainguard Suggestions/i }).click();

    // Select AWS bundle
    await page.locator('div').filter({ hasText: /AWS Private CA Bundle/ }).first().click();

    // Proceed to configure
    await page.getByRole('button', { name: 'Next' }).click();

    // Modify package name
    await page.getByLabelText('Package Name').fill('My AWS CA Package');

    // Proceed to review
    await page.getByRole('button', { name: 'Next' }).click();

    // Verify review step
    await expect(page.getByText('Review & Create')).toBeVisible();
    await expect(page.getByText('My AWS CA Package')).toBeVisible();
    await expect(page.getByText('AWS Private CA Bundle')).toBeVisible();

    // Create the package
    await page.getByRole('button', { name: 'Create Package' }).click();

    // Verify success notification
    await expect(page.getByText('Package "My AWS CA Package" created successfully!')).toBeVisible();

    // Verify package appears in the table with building status
    await expect(page.getByText('My AWS CA Package')).toBeVisible();
    await expect(page.getByText('building')).toBeVisible();
  });

  test('should test DoD ECA bundle workflow', async ({ page }) => {
    await page.getByRole('button', { name: /create custom package/i }).click();
    await page.getByRole('button', { name: /Browse Chainguard Suggestions/i }).click();

    // Select DoD ECA bundle
    await page.locator('div').filter({ hasText: /DoD PKCS#7 for ECA PKI Only/ }).first().click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Verify configuration step shows correct details
    await expect(page.getByText('DoD PKCS#7 for ECA PKI Only')).toBeVisible();
    await expect(page.getByText('US Department of Defense')).toBeVisible();
    await expect(page.getByText('12')).toBeVisible(); // Certificate count

    // Complete workflow
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Create Package' }).click();

    await expect(page.getByText(/Package.*created successfully!/)).toBeVisible();
  });

  test('should test DoD WCF bundle workflow with existing package warning', async ({ page }) => {
    await page.getByRole('button', { name: /create custom package/i }).click();
    await page.getByRole('button', { name: /Browse Chainguard Suggestions/i }).click();

    // Select DoD WCF bundle (this one has hasExistingPackage: true)
    const wcfBundle = page.locator('div').filter({ hasText: /DoD PKI CA Certificate Bundles: PKCS#7 for WCF B&I PKI/ }).first();
    await wcfBundle.click();

    // Verify existing package warning is shown
    await expect(page.getByText('Package exists')).toBeVisible();
    await expect(page.getByText(/You already have a package using this certificate bundle/)).toBeVisible();

    await page.getByRole('button', { name: 'Next' }).click();

    // Verify warning persists in configure step
    await expect(page.getByText(/You already have a package using this certificate bundle/)).toBeVisible();

    // Complete workflow
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Create Package' }).click();

    await expect(page.getByText(/Package.*created successfully!/)).toBeVisible();
  });

  test('should test Brazilian PKI bundle workflow', async ({ page }) => {
    await page.getByRole('button', { name: /create custom package/i }).click();
    await page.getByRole('button', { name: /Browse Chainguard Suggestions/i }).click();

    // Select Brazilian PKI bundle
    await page.locator('div').filter({ hasText: /PKI ICP Brazil/ }).first().click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Verify configuration step shows correct details
    await expect(page.getByText('PKI ICP Brazil')).toBeVisible();
    await expect(page.getByText('Brazilian Government')).toBeVisible();
    await expect(page.getByText('24')).toBeVisible(); // Certificate count

    // Complete workflow
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Create Package' }).click();

    await expect(page.getByText(/Package.*created successfully!/)).toBeVisible();
  });

  test('should test Google Cloud CA bundle workflow', async ({ page }) => {
    await page.getByRole('button', { name: /create custom package/i }).click();
    await page.getByRole('button', { name: /Browse Chainguard Suggestions/i }).click();

    // Select Google Cloud bundle
    await page.locator('div').filter({ hasText: /Google Cloud Certificate Authority Service/ }).first().click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Verify configuration step shows correct details
    await expect(page.getByText('Google Cloud Certificate Authority Service')).toBeVisible();
    await expect(page.getByText('Google Cloud')).toBeVisible();
    await expect(page.getByText('4')).toBeVisible(); // Certificate count

    // Complete workflow
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Create Package' }).click();

    await expect(page.getByText(/Package.*created successfully!/)).toBeVisible();
  });

  test('should allow navigation back through the workflow', async ({ page }) => {
    await page.getByRole('button', { name: /create custom package/i }).click();
    await page.getByRole('button', { name: /Browse Chainguard Suggestions/i }).click();

    // Select a bundle and go to configure
    await page.locator('div').filter({ hasText: /AWS Private CA Bundle/ }).first().click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Go back to suggestions
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByText('Chainguard Suggestions')).toBeVisible();

    // Go back to selection
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByText('Choose how to create your package')).toBeVisible();
  });

  test('should disable Next button when no bundle is selected', async ({ page }) => {
    await page.getByRole('button', { name: /create custom package/i }).click();
    await page.getByRole('button', { name: /Browse Chainguard Suggestions/i }).click();

    // Verify Next button is disabled when no selection is made
    await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();

    // Select a bundle
    await page.locator('div').filter({ hasText: /AWS Private CA Bundle/ }).first().click();

    // Verify Next button is enabled
    await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  test('should close panel when clicking outside or X button', async ({ page }) => {
    // Open panel
    await page.getByRole('button', { name: /create custom package/i }).click();
    await expect(page.getByText('Create Custom Package')).toBeVisible();

    // Close with X button
    await page.locator('button[aria-label="Close"]').or(page.locator('svg[data-lucide="x"]').locator('..')).click();
    await expect(page.getByText('Create Custom Package')).not.toBeVisible();

    // Open panel again
    await page.getByRole('button', { name: /create custom package/i }).click();

    // Close by clicking outside (on the overlay)
    await page.locator('.fixed.inset-0.bg-black\\/50').click();
    await expect(page.getByText('Create Custom Package')).not.toBeVisible();
  });
});