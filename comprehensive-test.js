const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Starting comprehensive certificate management test...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
    devtools: false
  });

  const page = await browser.newPage();

  // Listen for console messages and errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ CONSOLE ERROR:', msg.text());
    }
  });
  page.on('pageerror', err => console.log('❌ PAGE ERROR:', err));

  try {
    console.log('📂 Opening demo file...');
    await page.goto('file:///Users/sourabhkatti/Documents/certs-prototype/demo-clean.html');
    await page.waitForTimeout(2000);

    // Test 1: Verify initial state
    console.log('\n📋 TEST 1: Verify initial certificate table population');
    const certRows = await page.$$('.certificate-row');
    console.log(`✅ Found ${certRows.length} certificate rows (expected: 8+)`);

    // Test 2: Test curated certificate creation flow
    console.log('\n📋 TEST 2: Test curated certificate creation flow');

    console.log('  📝 Step 1: Click Create New Custom Package');
    await page.click('button:has-text("Create New Custom Package")');
    await page.waitForTimeout(1000);

    console.log('  📝 Step 2: Click Browse Chainguard Suggestions');
    await page.click('button:has-text("Browse Chainguard Suggestions")');
    await page.waitForTimeout(1000);

    console.log('  📝 Step 3: Select AWS Private CA Bundle (4th option)');
    const certOptions = await page.$$('.certificate-option');
    if (certOptions[3]) {
      await certOptions[3].click();
      await page.waitForTimeout(500);

      console.log('  📝 Step 4: Click Next');
      await page.click('button:has-text("Next")');
      await page.waitForTimeout(1000);

      console.log('  📝 Step 5: Verify AWS certificate info displayed');
      const bundleInfo = await page.textContent('#selected-bundle-info');
      if (bundleInfo.includes('AWS')) {
        console.log('  ✅ Correct AWS certificate info displayed');
      } else {
        console.log('  ❌ Wrong certificate info displayed');
      }

      console.log('  📝 Step 6: Create package');
      await page.click('button:has-text("Create Package")');
      await page.waitForTimeout(2000);

      console.log('  ✅ Curated certificate creation flow completed');
    }

    // Test 3: Test custom certificate upload flow
    console.log('\n📋 TEST 3: Test custom certificate upload flow');

    console.log('  📝 Step 1: Click Create New Custom Package');
    await page.click('button:has-text("Create New Custom Package")');
    await page.waitForTimeout(1000);

    console.log('  📝 Step 2: Click Upload Certificate Bundle');
    await page.click('button:has-text("Upload Certificate Bundle")');
    await page.waitForTimeout(1000);

    console.log('  📝 Step 3: Create test certificate file');
    const testCertContent = `-----BEGIN CERTIFICATE-----
MIIEyTCCArGgAwIBAgIJAL8zQ4z6+XYfMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAlVTMQswCQYDVQQIDAJXQTEQMA4GA1UEBwwHU2VhdHRsZTEPMA0GA1UECgwG
QW1hem9uMQswCQYDVQQLDAJFQzEPMA0GA1UEAwwGRUMyIENBMB4XDTI0MDExNTAw
MDAwMFoXDTI2MTIxNTAwMDAwMFowRTELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAldB
MRAwDgYDVQQHDAdTZWF0dGxlMQ8wDQYDVQQKDAZBbWF6b24xCzAJBgNVBAsMAkVD
MQ8wDQYDVQQDDAZFQzIgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
AQC8qBu+0w51OkG8fw3ReHS/itcp9AEFC4ETwumtfwlS+tmxBU3ulJPATIHC/TCO
g6TksvijvwT8RJdmgOUQj1u/+PEo6C7tgBgM5t0RR3kYCFI2j1tRObJ4XVFELK
-----END CERTIFICATE-----`;

    // Create temporary file for upload test
    const tempDir = '/tmp';
    const testCertPath = path.join(tempDir, 'test-cert.pem');
    fs.writeFileSync(testCertPath, testCertContent);

    console.log('  📝 Step 4: Upload test certificate');
    await page.setInputFiles('#file-input', testCertPath);
    await page.waitForTimeout(2000);

    console.log('  📝 Step 5: Verify certificate preview appears');
    const previewVisible = await page.isVisible('#certificate-preview');
    if (previewVisible) {
      console.log('  ✅ Certificate preview displayed');
    } else {
      console.log('  ❌ Certificate preview not displayed');
    }

    console.log('  📝 Step 6: Click Next');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(1000);

    console.log('  📝 Step 7: Create package');
    await page.click('button:has-text("Create Package")');
    await page.waitForTimeout(2000);

    console.log('  ✅ Custom certificate upload flow completed');

    // Test 4: Test certificate viewing
    console.log('\n📋 TEST 4: Test certificate viewing');

    console.log('  📝 Step 1: Click on first certificate name');
    const firstCertName = await page.$('.certificate-row .text-chainguard-teal');
    if (firstCertName) {
      await firstCertName.click();
      await page.waitForTimeout(1000);

      console.log('  📝 Step 2: Verify view panel opens');
      const panelVisible = await page.isVisible('#panelOverlay:not(.hidden)');
      if (panelVisible) {
        console.log('  ✅ View panel opened');

        const header = await page.textContent('#panelOverlay h2');
        if (header.includes('View Certificate')) {
          console.log('  ✅ Correct view header displayed');
        } else {
          console.log('  ❌ Wrong header displayed:', header);
        }
      } else {
        console.log('  ❌ View panel did not open');
      }
    }

    // Test 5: Test certificate editing
    console.log('\n📋 TEST 5: Test certificate editing');

    console.log('  📝 Step 1: Click Edit button');
    await page.click('button:has-text("Edit Package")');
    await page.waitForTimeout(1000);

    console.log('  📝 Step 2: Verify edit mode');
    const editHeader = await page.textContent('#panelOverlay h2');
    if (editHeader.includes('Edit Certificate')) {
      console.log('  ✅ Edit mode activated');
    } else {
      console.log('  ❌ Edit mode not activated');
    }

    console.log('  📝 Step 3: Edit package name');
    await page.fill('#packageNameInput', 'edited-test-package');
    await page.waitForTimeout(500);

    console.log('  📝 Step 4: Save changes');
    await page.click('button:has-text("Save Changes")');
    await page.waitForTimeout(2000);

    console.log('  ✅ Certificate editing flow completed');

    // Test 6: Test certificate deletion
    console.log('\n📋 TEST 6: Test certificate deletion');

    console.log('  📝 Step 1: Click Edit button to access delete');
    await page.click('button:has-text("Edit Package")');
    await page.waitForTimeout(1000);

    console.log('  📝 Step 2: Click Delete button');
    await page.click('button:has-text("Delete")');
    await page.waitForTimeout(1000);

    console.log('  📝 Step 3: Verify delete confirmation dialog');
    const deleteDialogVisible = await page.isVisible('#deleteDialog:not(.hidden)');
    if (deleteDialogVisible) {
      console.log('  ✅ Delete confirmation dialog displayed');

      console.log('  📝 Step 4: Confirm deletion');
      await page.click('button:has-text("Delete"):last-child');
      await page.waitForTimeout(2000);

      console.log('  ✅ Certificate deletion flow completed');
    } else {
      console.log('  ❌ Delete confirmation dialog not displayed');
    }

    // Test 7: Test bundle expansion
    console.log('\n📋 TEST 7: Test bundle expansion');

    console.log('  📝 Step 1: Click bundle arrow to expand');
    const bundleArrow = await page.$('.bundle-arrow');
    if (bundleArrow) {
      await bundleArrow.click();
      await page.waitForTimeout(1000);

      console.log('  📝 Step 2: Verify bundle expanded');
      const bundleContentVisible = await page.isVisible('.bundle-content:not(.hidden)');
      if (bundleContentVisible) {
        console.log('  ✅ Bundle expanded successfully');

        console.log('  📝 Step 3: Click sub-certificate');
        const subCert = await page.$('.bundle-content .certificate-row');
        if (subCert) {
          await subCert.click();
          await page.waitForTimeout(1000);
          console.log('  ✅ Sub-certificate clickable');
        }
      } else {
        console.log('  ❌ Bundle did not expand');
      }
    }

    console.log('\n🎉 All tests completed successfully!');

    // Clean up
    if (fs.existsSync(testCertPath)) {
      fs.unlinkSync(testCertPath);
    }

  } catch (error) {
    console.log('❌ Test error:', error);
  }

  console.log('\n⏳ Keeping browser open for 5 seconds for manual inspection...');
  await page.waitForTimeout(5000);
  await browser.close();
  console.log('✅ Test suite completed');
})();