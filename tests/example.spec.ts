import { test, expect, Page, BrowserContext } from '@playwright/test';
import { OnboardingPage } from '../pages/Onboarding';
import { CustomerProfilePage } from '../pages/CustomerProfile';
import { ProductSearchDetails } from '../pages/ProductSearchDetails';
import { CheckoutPage } from '../pages/CheckoutPage';

let context: BrowserContext;
let page: Page;
let onboardingPage: OnboardingPage;

test.describe('Vitacare Automation', () => {
  test.beforeAll(async ({ browser }) => {
    // Create a context and page for all tests in this suite
    context = await browser.newContext();
    page = await context.newPage();
    onboardingPage = new OnboardingPage(page);

    // Go to home
    await page.goto('https://vitacare.nop-station.com/');

    // Close alert
    await onboardingPage.closeAlert();
    console.log('Alert closed');

    // Login
    await onboardingPage.clickLogin();
    await page.waitForTimeout(2000);
    await onboardingPage.fillPhoneNumber('01400000001');
    await onboardingPage.sendOtp();
    await onboardingPage.fillOtp('1234');
    await onboardingPage.verifyOtp();
    console.log('Logged in successfully');
    await page.waitForTimeout(2000);

  });

  test.afterAll(async () => {
    await context.close();
  });

  test('1. Onboarding Journey', async () => {
    // You are already logged in here!
    await expect(page).toHaveTitle(/Home page/);

    // Select location & close popup
    await onboardingPage.selectLocation('Dhaka', 'Adabor');
    await onboardingPage.closePopup();
    await page.waitForTimeout(2000);
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

    // Search for a product and add to cart
    await productSearchDetails.searchProduct('Vitacare Air Freshener Anti -Tobacco Spray 300 ml');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    await productSearchDetails.clickOnProduct('Vitacare Air Freshener Anti -Tobacco Spray 300 ml');
    await productSearchDetails.addToCart();
    await productSearchDetails.closePopupIfAppears();
    await page.waitForTimeout(2000);

  // Search for another product and add to cart
    await productSearchDetails.searchProduct('Vitacare Air Freshener Bakhoor Spray 300 ml');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    await productSearchDetails.clickOnProduct('Vitacare Air Freshener Bakhoor Spray 300 ml');
    await productSearchDetails.addToCart();
    await productSearchDetails.closePopupIfAppears();

    await page.waitForTimeout(2000);
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
