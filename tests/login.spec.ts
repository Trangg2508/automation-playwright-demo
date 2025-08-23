import { test, expect } from "@playwright/test";
import { data } from "../data/constants";
import { LoginPage } from "../pages/LoginPage";

test.describe("Login Suit", () => {
  test("User can log into Railway with valid username and password", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await page.goto(data.pathRailway);

    await loginPage.navigateTo("login");

    await loginPage.login(data.email, data.password);

    await expect(page.getByRole("link", { name: "Log out" })).toBeVisible();

    await expect(page).toHaveURL(
      "http://saferailway.somee.com/Page/HomePage.cshtml"
    );
  });
});
