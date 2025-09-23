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
    console.log(phone, otp);

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

  test('2. Customer Profile Page', async () => {
    const customerProfilePage = new CustomerProfilePage(page);

    await customerProfilePage.clickCustomerInfo();
    await customerProfilePage.expectAccountTitle();
    await customerProfilePage.checkGenderMale();
    await customerProfilePage.enterFirstname('John');
    await customerProfilePage.enterLastname('Doe');
    // await customerProfilePage.enterPhone('01400000001');
    await customerProfilePage.enterEmail('john.doe@example.com');
    await customerProfilePage.enterCompanyName('Test Company Ltd');
    // check newsletter subscription
    await customerProfilePage.newsLetterSubscription();
    await customerProfilePage.saveButton();

    await page.waitForTimeout(2000);
  });

  test('3. Product Search & Details', async () => {
    const productSearchDetails = new ProductSearchDetails(page);


        // Load Excel data
    const sheet = workbook.Sheets[workbook.SheetNames[1]];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
    // console.log(rows);

    //use loop to take all data from excel Product Name, Price, Qty, Total
    for (const row of rows) {
      const { 'Product Name': productName, Price: price, Qty: qty, Total: total } = row;
      console.log(`Product Name: ${productName}, Price: ${price}, Qty: ${qty}, Total: ${total}`);
      // Search for a product and add to cart
      await productSearchDetails.searchProduct(productName as string);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await productSearchDetails.clickOnProduct(productName as string);
      await productSearchDetails.addToCart();
      await productSearchDetails.closePopupIfAppears();
      await page.waitForTimeout(2000);
    }
  });

  test('4. Checkout Page', async () => {
    const checkoutPage = new CheckoutPage(page);

    // Go to cart status sidebar
    await page.waitForTimeout(2000);
    await checkoutPage.goToCartStatusSidebar();
    await page.waitForTimeout(2000);

    // Go to cart for checkout page from sidebar
    await checkoutPage.goToCartFromSidebar();

    // Increase quantity
    await checkoutPage.increaseQuantity(2);

    // Decrease quantity
    await checkoutPage.decreaseQuantity(1);

    // Enter discount code
    await checkoutPage.enterDiscountCode('test10');
    await checkoutPage.clickApplyCoupon();

    // Enter gift card code
    await checkoutPage.enterGiftCardCode('5ba27cfd-a121');
    await checkoutPage.clickApplyGiftCard();

    // Check Pickup in store
    await checkoutPage.checkPickupInStore();

    /*
    // Get subtotal and log it
    const subtotal = await checkoutPage.getSubtotal();
    console.log('Subtotal:', subtotal);
    // Get discount and log it
    const discount = await checkoutPage.getSubtotal();
    console.log('Discount:', discount);
    // Get gift card and log it
    const giftCard = await checkoutPage.getSubtotal();
    console.log('Gift Card:', giftCard);
    // Get total and log it
    const total = await checkoutPage.getSubtotal();
    console.log('Total:', total); */

    await page.waitForTimeout(7000);
  });

});
