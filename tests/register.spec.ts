import { test, expect } from "@playwright/test";
import { data } from "../data/constants";
import { RegisterPage } from "../pages/RegisterPage";
import { User } from "../interfaces/User";
import { TemporaryMailPage } from "../pages/TemporaryMailPage";
import { mail } from "../data/mail";

test.describe("Register suit", () => {
  test("User can't create account with an already in-use email", async ({
    page,
  }) => {
    const errMess = "This email address is already in use.";
    const registerPage = new RegisterPage(page);
    const tempMailPage = new TemporaryMailPage(page);

    // Pre-condition: an actived account is existing
    await page.goto(data.pathGuerrillaMail);
    const tempMail = await tempMailPage.getTempMail();

    const user: User = {
      email: tempMail,
      password: "12345678",
      confirmPassword: "12345678",
      PID: "1324321345",
    };

    await registerPage.openInNewTab(data.pathRailway);
    await registerPage.navigateTo("register");
    await registerPage.register(user);

    await page.bringToFront();

    await tempMailPage.selectEmailAndConfirm(
      mail.activateAccTitle,
      mail.activateAccLink
    );

    // 1. Navigate to QA Railway Website
    await registerPage.openInNewTab(data.pathRailway);

    // 2. Click on "Register" tab
    await registerPage.navigateTo("register");

    // 3. Enter information of the created account in Pre-condition
    // 4. Click on "Register" button
    await registerPage.register(user);

    // VP: Error message "This email address is already in use." displays above the form.
    await registerPage.verifyErrorMessage(errMess);
  });
});
