import { Page, Locator } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly navLogin: Locator;
  readonly navBookTicket: Locator;
  readonly navRegister: Locator;
  readonly navTimetable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navLogin = page.getByRole("link", { name: "Login" });
    this.navTimetable = page.getByRole("link", { name: "Timetable" });
    this.navBookTicket = page.getByRole("link", { name: "Book ticket" });
    this.navRegister = page.getByRole("link", { name: "Register" });
  }

  async goto(url: string) {
    await this.page.goto(url);
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
        throw new Error(`❌ Menu '${menuName}' not found`);
    }
  }
}
