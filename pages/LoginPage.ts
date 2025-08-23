import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private emailTextbox = this.page.locator("#username");
  private passwordTextbox = this.page.locator("#password");
  private loginButton = this.page.getByTitle("Login");
  private generalErrorMsg = this.page.getByRole("paragraph", {
    name: "message error LoginForm",
  });

  async login(email: string, password: string) {
    await this.emailTextbox.fill(email);
    await this.passwordTextbox.fill(password);
    await this.loginButton.click();
  }
}
