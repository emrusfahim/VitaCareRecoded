import { Page } from '@playwright/test';

export class ProductSearchDetails {
    static goToCartFromSidebar() {
        throw new Error('Method not implemented.');
    }
    constructor(private page: Page) { }

    async searchProduct(productName: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'Search store' }).fill(productName);
    }

    // click on exact product from search result with product name
    async clickOnProduct(productName: string): Promise<void> {
        await this.page.getByRole('link', { name: productName }).first().click();
    }

    async addToCart(): Promise<void> {
        await this.page.getByRole('button', { name: 'Add to cart' }).first().click();
    }

    //close popup appears after adding to cart by title="Close"
    async closePopupIfAppears(): Promise<void> {
        const closeButton = this.page.locator('button[title="Close"]');
        if (await closeButton.isVisible()) {
            await closeButton.click();
        }
    }

};