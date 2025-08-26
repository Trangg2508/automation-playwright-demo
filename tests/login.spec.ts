import { test, expect } from "@playwright/test";
import { data } from "../data/constants";
import { LoginPage } from "../pages/LoginPage";
import { User } from "../interfaces/User";

test.describe("Login Suit", () => {
  test("User can log into Railway with valid username and password", async ({
    page,
  }) => {
    const user: User = {
      email: "oghdbneh@sharklasers.com",
      password: "12345678",
    };

    const loginPage = new LoginPage(page);

    // 1. Navigate to QA Railway Website
    await page.goto(data.pathRailway);

    // 2. Click on "Login" tab
    await loginPage.navigateTo("login");

    // 3. Enter valid Email and Password
    // 4. Click on "Login" button
    await loginPage.login(user);

    // VP: User is logged into Railway. Welcome user message is displayed.
    await expect(page.getByRole("link", { name: "Log out" })).toBeVisible();
    await expect(page).toHaveURL(
      "http://saferailway.somee.com/Page/HomePage.cshtml"
    );
  });

  test("User cannot login with blank Username", async ({ page }) => {
    const user: User = {
      email: "",
      password: "12345678",
    };

    const loginPage = new LoginPage(page);
    const errMess: string =
      "There was a problem with your login and/or errors exist in your form.";

    // 1. Navigate to QA Railway Website
    await page.goto(data.pathRailway);

    // 2. Click on "Login" tab
    await loginPage.navigateTo("login");

    // 3. User doesn't type any words into "Username" textbox but enter valid information into "Password" textbox
    // 4. Click on "Login" button
    await loginPage.login(user);

    // VP: User can't login and message "There was a problem with your login and/or errors exist in your form. " appears.
    await loginPage.verifyErrorMessage(errMess);
  });
});
