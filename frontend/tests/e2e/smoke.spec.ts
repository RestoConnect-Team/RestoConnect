import { test, expect } from "@playwright/test";

/**
 * Smoke tests E2E — valident que le frontend démarre et que le login fonctionne.
 * User seedé : superadmin@resto.com / 1234
 */

test("page d'accueil affiche le formulaire de login", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("RestoConnect");
  await expect(page.getByPlaceholder("utilisateur@email.com")).toBeVisible();
  await expect(page.getByPlaceholder("••••••••")).toBeVisible();
});

test("login avec bons identifiants → redirigé vers /my_center", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByPlaceholder("utilisateur@email.com").fill("superadmin@resto.com");
  await page.getByPlaceholder("••••••••").fill("1234");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/my_center/, { timeout: 15000 });
});

test("login avec mauvais identifiants → message d'erreur", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("utilisateur@email.com").fill("superadmin@resto.com");
  await page.getByPlaceholder("••••••••").fill("wrongpassword");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByText(/identifiants invalides/i)).toBeVisible({
    timeout: 10000,
  });
});