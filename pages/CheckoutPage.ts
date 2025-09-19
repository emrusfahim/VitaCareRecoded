import { Page } from '@playwright/test';

export class CheckoutPage {
    constructor(private page: Page) { }


    //goto cart status side slider type="button"
    async goToCartStatusSidebar(): Promise<void> {
        await this.page.locator('#topcartlink').click();
    }

    // click on Go to cart button from cart status sidebar .button-1.cart-button
    async goToCartFromSidebar(): Promise<void> {
        await this.page.locator('.button-1.cart-button').click();
    }

    // click 1st qty increase button class="qty-btn qty-plus"
    async increaseQuantity(times: number): Promise<void> {
        for (let i = 0; i < times; i++) {
            await this.page.locator('.qty-btn.qty-plus').first().click();
            await this.page.waitForTimeout(2000); // wait for two seconds between clicks
        }
    }

    // click 2nd qty decrease button class="qty-btn qty-minus"
    async decreaseQuantity(times: number): Promise<void> {
        for (let i = 0; i < times; i++) {
            await this.page.locator('.qty-btn.qty-minus').nth(1).click();
            await this.page.waitForTimeout(2000); // wait for two seconds between clicks
        }
    }

    // enter #discountcouponcode
    async enterDiscountCode(code: string): Promise<void> {
        await this.page.locator('#discountcouponcode').fill(code);
    }
    // click apply coupon button #applydiscountcouponcode
    async clickApplyCoupon(): Promise<void> {
        await this.page.locator('#applydiscountcouponcode').click();
    }

    // enter #giftcardcouponcode 
    async enterGiftCardCode(code: string): Promise<void> {
        await this.page.locator('#giftcardcouponcode').fill(code);
    }
    // click apply gift card button #applygiftcardcouponcode
    async clickApplyGiftCard(): Promise<void> {
        await this.page.locator('#applygiftcardcouponcode').click();
    }

    //Checkbox check Pickup in store label for="PickupInStore"
    async checkPickupInStore(): Promise<void> {
        await this.page.locator('label[for="PickupInStore"]').click();
    }

    /*
    // get subtotal by class="value-summary"
    async getSubtotal(): Promise<string> {
        return await this.page.locator('.value-summary').innerText();
    }
    //Get discount by class="value-summary"
    async getDiscount(): Promise<string> {
        return await this.page.locator('.value-summary').nth(1).innerText();
    }
    //Get gift card discount by class="value-summary"
    async getGiftCardDiscount(): Promise<string> {
        return await this.page.locator('.value-summary').nth(2).innerText();
    }
    //Get total by class="value-summary"
    async getTotal(): Promise<string> {
        return await this.page.locator('.value-summary').nth(3).innerText();
    }
    */
};