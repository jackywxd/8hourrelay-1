import { expect, test } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByPlaceholder("Your email").click();
  await page.getByPlaceholder("Your email").fill("t1@test.com");
  await page.getByPlaceholder("Password").click();
  await page.getByPlaceholder("Password").fill("123456");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.getByRole("button", { name: "My Registrations" }).click();
  await page.getByRole("button", { name: "My Team" }).click();
  await page.goto("http://localhost:3000/my-team");
});
