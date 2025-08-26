import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { data } from "../data/constants";

export class TemporaryMailPage extends BasePage {
  private inboxIdBox: Locator;
  private inboxIdTextbox: Locator;
  private scrambleChecbox: Locator;
  private fullTempEmail: Locator;
  private updateDoneTime: Locator;
  private expectedEmail: (title: string) => Locator;
  private confirmLink: (partialHref: string) => Locator;
  private setInboxIdButton: Locator;

  constructor(page: Page) {
    super(page);
    this.inboxIdBox = this.page.locator("#inbox-id");
    this.inboxIdTextbox = this.page.locator("//span[@id='inbox-id']/input");
    this.scrambleChecbox = this.page.locator("#use-alias");
    this.fullTempEmail = this.page.locator("#email-widget");
    this.updateDoneTime = this.page.locator("#tick", { hasText: "Done." });
    this.expectedEmail = (title: string) =>
      this.page.locator(
        `//tbody[@id='email_list']//td[contains(text(),"${title}")]`
      );
    this.confirmLink = (partialHref: string) =>
      this.page.locator(`//a[contains(@href,"${partialHref}")]`);
    this.setInboxIdButton = this.page.locator("#edit-cancel");
  }

  async waitForEmailWithRetry(title: string) {
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.expectedEmail(title).waitFor({
          timeout: data.defaultTimeout,
        });
        return;
      } catch (e) {
        if (attempt < maxRetries) {
          await this.page.reload({ waitUntil: "load" });
          if (await this.scrambleChecbox.isChecked()) {
            await this.scrambleChecbox.click();
          }
        } else {
          throw new Error(
            `Email with title "${title}" not found after ${maxRetries} retries`
          );
        }
      }
    }
  }

  async getTempMail() {
    const now = new Date();
    if (await this.scrambleChecbox.isChecked()) {
      await this.scrambleChecbox.click();
    }
    await this.inboxIdBox.click();
    await this.inboxIdTextbox.fill(`user"${now.getTime()}"`);
    await this.setInboxIdButton.click();
    return await this.fullTempEmail.innerText();
  }

  async selectEmailAndConfirm(title: string, partialHref: string) {
    await this.waitForEmailWithRetry(title);
    await this.expectedEmail(title).click();
    await this.confirmLink(partialHref).click();
  }
}
