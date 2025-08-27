import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  protected page: Page;
  protected navLogin: Locator;
  protected navBookTicket: Locator;
  protected navRegister: Locator;
  protected navTimetable: Locator;
  protected passwordTextbox: Locator;
  protected generalErrorMsg: Locator;
  protected footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navLogin = page.getByRole("link", { name: "Login" });
    this.navTimetable = page.getByRole("link", { name: "Timetable" });
    this.navBookTicket = page.getByRole("link", { name: "Book ticket" });
    this.navRegister = page.getByRole("link", { name: "Register" });
    this.passwordTextbox = this.page.locator("#password");
    this.generalErrorMsg = this.page.locator(
      "//div[@id='content']//p[contains(@class,'message error')]"
    );
    this.footer = this.page.locator("#footer");
  }

  async navigateTo(menuName: string) {
    switch (menuName.toLowerCase()) {
      case "timetable":
        await this.navTimetable.click();
        break;
      case "book ticket":
        await this.navBookTicket.click();
        break;
      case "register":
        await this.navRegister.click();
        break;
      case "login":
        await this.navLogin.click();
        break;
      default:
        throw new Error(`Menu '${menuName}' not found`);
    }
  }

  async verifyErrorMessage(message: string) {
    await expect(this.generalErrorMsg).toBeVisible();
    await expect(this.generalErrorMsg).toContainText(message);
  }
}
