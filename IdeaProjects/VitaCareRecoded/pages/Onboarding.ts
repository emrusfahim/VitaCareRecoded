import { Page } from '@playwright/test';

export class OnboardingPage {
    constructor(private page: Page) {}

    async closeAlert(): Promise<void> {
    const alertButton = this.page.locator('#close-push-notification');
    if (await alertButton.isVisible()) {
        await alertButton.click();
    }
}

    async clickLogin() {
        await this.page.locator('#login-link').click();
    }

    async fillPhoneNumber(phone: string) {
        await this.page.locator('#otp_login_Phone').fill(phone);
    }

    async sendOtp() {
        await this.page.getByRole('button', { name: 'Send OTP' }).click();
    }

    async fillOtp(otp: string) {
        await this.page.locator('#otp_login_Otp').fill(otp);
    }

    async verifyOtp() {
        await this.page.getByRole('button', { name: 'Verify OTP' }).click();
    }

    async selectLocation(city: string, area: string) {
        await this.page.locator('.location-selected-text').click();
        await this.page.locator('#select2-SelectedCityId-container').click();
        await this.page.locator('#SelectedCityId').selectOption({ label: city });
        await this.page.locator('#select2-SelectedAreaId-container').click();
        await this.page.locator('#SelectedAreaId').selectOption({ label: area });
        await this.page.locator('button:has-text("Continue")').click();
    }

    async closePopup() {
        await this.page.locator('.close').click();
    }
}