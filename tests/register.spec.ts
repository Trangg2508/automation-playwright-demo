import { test, expect } from "@playwright/test";
import { data } from "../data/constants";
import { RegisterPage } from "../pages/RegisterPage";
import { User } from "../interfaces/User";
import { TemporaryMailPage } from "../pages/TemporaryMailPage";
import { mail } from "../data/mail";

test.describe("Register suit", () => {
  let user: User;

  test.describe("Pre-condition required", () => {
    // Precondition: Pre-condition: an actived account is existing
    test.beforeEach(async ({ page }) => {
      const registerPage = new RegisterPage(page);
      const tempMailPage = new TemporaryMailPage(page);

      await page.goto(data.pathGuerrillaMail);
      const tempMail = await tempMailPage.getTempMail();

      user = {
        email: tempMail,
        password: "12345678",
        confirmPassword: "12345678",
        PID: "1324321345",
      };

      await page.goto(data.pathRailway);
      await registerPage.navigateTo("register");
      await registerPage.register(user);

      await page.goto(data.pathGuerrillaMail);
      await tempMailPage.selectEmailAndConfirm(
        mail.activateAccTitle,
        mail.activateAccLink
      );

      // await page.screenshot({ path: `screenshots/screenshot-${tempMail}.png` });
    });
  });

  test.describe("No pre-condition required", () => {
    test("TC003-User can't create account with an already in-use email", async ({
      page,
    }) => {
      const errMess = "This email address is already in use.";

      // 1. Navigate to QA Railway Website
      // 2. Click on "Register" tab
      const newPage = await page.context().newPage(); // open a fresh tab
      await newPage.goto(data.pathRailway);
      const newRegisterPage = new RegisterPage(newPage);
      await newRegisterPage.navigateTo("register");

      // 3. Enter information of the created account in Pre-condition
      // 4. Click on "Register" button
      await newRegisterPage.register(user);

      // VP: Error message "This email address is already in use." displays above the form.
      await newRegisterPage.verifyErrorMessage(errMess);
    });

    test.only("TC004-User can't create account while password and PID fields are empty", async ({
      page,
    }) => {
      const registerPage = new RegisterPage(page);
      const errMess =
        "There're errors in the form. Please correct the errors and try again.";
      const validateErrPasswordField = "Invalid password length";
      const validateErrPIDField = "Invalid ID length";

      user = {
        email: "dummy+" + Date.now() + "@gmail.com", // fake email
        password: "",
        confirmPassword: "",
        PID: "",
      };

      // 1. Navigate to QA Railway Website
      // 2. Click on "Register" tab
      await page.goto(data.pathRailway);
      await registerPage.navigateTo("register");

      // 3. Enter valid email address and leave other fields empty
      // 4. Click on "Register" button
      await registerPage.register(user);

      // VP: Message "There're errors in the form. Please correct the errors and try again." appears above the form.
      await registerPage.verifyErrorMessage(errMess);
      // VP: Next to password fields, error message "Invalid password length." displays
      await registerPage.verifyValidateErrorField(validateErrPasswordField);
      // VP: Next to PID field, error message "Invalid ID length." displays
      await registerPage.verifyValidateErrorField(validateErrPIDField);
    });
  });
});
