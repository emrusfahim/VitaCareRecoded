import { expect, Page } from '@playwright/test';

export class CustomerProfilePage {
    constructor(private page: Page) { }

    async clickCustomerInfo() {
        // Click on the customer information link //ul[@class='login-dropdown-menu']//a[normalize-space()='Customer info']
        await this.page.locator('.user-dropdown').hover();
        await this.page.waitForTimeout(1000);
        await this.page.locator("a:has-text('Customer info')").first().click();
    }

    async expectAccountTitle() {
        await expect(this.page).toHaveTitle(/Account/);
    }

    async checkGenderMale() {
        await this.page.check('.forcheckbox');
    }

    async enterFirstname(firstname: string) {
        await this.page.fill('#FirstName', firstname);
    }

    async enterLastname(lastname: string) {
        await this.page.fill('#LastName', lastname);
    }

    // async enterPhone(phone: string) {
    //     await this.page.fill('#Phone', phone);
    // }

    async enterEmail(email: string) {
        await this.page.fill('#Email', email);
    }

    async enterCompanyName(companyName: string) {
        await this.page.fill('#Company', companyName);
    }

    // check newsletter subscription label[for='Newsletter']
    async newsLetterSubscription() {
        await this.page.check("label[for='Newsletter']");
    }   
    
    async saveButton() {
        await this.page.click('button:has-text("Save")');
    }

};