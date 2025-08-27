import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { User } from "../interfaces/User";

export class LoginPage extends BasePage {
  private usernameTextbox: Locator;
  private loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameTextbox = this.page.locator("#username");
    this.loginButton = this.page.getByTitle("Login");
  }

  async login(user: User) {
    await this.usernameTextbox.fill(user.email ?? "");
    await this.passwordTextbox.fill(user.password);
    await this.loginButton.click();
  }
}
