import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { User } from "../interfaces/User";

export class RegisterPage extends BasePage {
  private emailTextbox: Locator;
  private confirmPasswordTextbox: Locator;
  private pIdTextbox: Locator;
  private registerButton: Locator;
  private validateErrField: (msg: string) => Locator;

  constructor(page: Page) {
    super(page);
    this.emailTextbox = this.page.locator("#email");
    this.confirmPasswordTextbox = this.page.locator("#confirmPassword");
    this.pIdTextbox = this.page.locator("#pid");
    this.registerButton = this.page.getByTitle("Register");
    this.validateErrField = (msg: string) =>
      this.page.locator(
        `//label[@class="validation-error" and contains(text(),"${msg}")]`
      );
  }

  async register(user: User) {
    await this.footer.scrollIntoViewIfNeeded();
    await this.emailTextbox.fill(user.email ?? "");
    await this.page.keyboard.press("Tab");
    await this.passwordTextbox.fill(user.password);
    await this.page.keyboard.press("Tab");
    await this.confirmPasswordTextbox.fill(user.confirmPassword ?? "");
    await this.page.keyboard.press("Tab");
    await this.pIdTextbox.fill(user.PID ?? "");
    await this.registerButton.click();
  }

  async verifyValidateErrorField(msg: string) {
    await this.footer.scrollIntoViewIfNeeded();
    console.log(this.validateErrField(msg));
    await expect(this.validateErrField(msg)).toBeVisible();
  }
}
