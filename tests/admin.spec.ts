import { test, expect, Page, BrowserContext } from '@playwright/test';
import * as XLSX from 'xlsx';
import { OnboardingPage } from '../pages/Onboarding';
import { CustomerProfilePage } from '../pages/CustomerProfile';
import { ProductSearchDetails } from '../pages/ProductSearchDetails';
import { CheckoutPage } from '../pages/CheckoutPage';

let context: BrowserContext;
let page: Page;
let onboardingPage: OnboardingPage;
// Load Excel data
const workbook = XLSX.readFile('test-data/TestData.xlsx');

test.describe('Vitacare Automation', () => {
  test.setTimeout(120000); // Set timeout to 120 seconds
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000); // Set timeout to 120 seconds
    // Create a context and page for all tests in this suite
    context = await browser.newContext();

    // await context.route('**/*.{png,jpg,jpeg,gif,svg,webp,ico}', r => r.abort());
    // await context.route('**/*.{woff,woff2,ttf,otf}', r => r.abort());
    // await context.route('**/{analytics,gtag,tagmanager,hotjar,fb,segment}**', r => r.abort());

    page = await context.newPage();
    onboardingPage = new OnboardingPage(page);

    // Go to home
    await page.goto('https://vitacare.nop-station.com/');

    // Close alert
    await onboardingPage.closeAlert();
    console.log('Alert closed');

    // Load Excel data and get first sheet for auth data
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
    // Auth data from first row
    const { Phone: phone, OTP: otp } = rows[0] as { Phone: string; OTP: string };
    // Print phone and otp in console
    console.log(`Phone: ${phone}, OTP: ${otp}`);

    // Login
    await onboardingPage.clickLogin();
    await page.waitForTimeout(2000);
    //use phone and otp
    await onboardingPage.fillPhoneNumber(phone);
    await onboardingPage.sendOtp();
    await onboardingPage.fillOtp(otp);
    await onboardingPage.verifyOtp();
    console.log('Logged in successfully');
    await page.waitForTimeout(2000);

  });
  /*
    test.afterAll(async () => {
      await context.close();
    }); 
  */

  test('1. Onboarding Journey', async () => {
    // You are already logged in here!
    await expect(page).toHaveTitle(/Home page/);

    // Select location & close popup
    await onboardingPage.selectLocation('Dhaka', 'Adabor');
    await onboardingPage.closePopup();
  });

  
});
