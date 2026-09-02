import { test, expect } from "@playwright/test";

/**
 * RCO-22 — Réaliser un inventaire.
 *
 * La page /inventaires expose un bouton "Réaliser un inventaire" qui appelle
 * POST /api/inventory/create_inventory puis recharge la liste. Le détail d'un
 * inventaire permet de marquer un stock "Présent"/"Absent".
 *
 * User seedé : superadmin@resto.com / 1234 (SUPER_ADMIN, centre Melun).
 */

async function login(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByPlaceholder("utilisateur@email.com").fill("superadmin@resto.com");
  await page.getByPlaceholder("••••••••").fill("1234");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/my_center/, { timeout: 15000 });
}

test("RCO-22: la page inventaires affiche le bouton 'Réaliser un inventaire'", async ({
  page,
}) => {
  await login(page);
  await page.goto("/inventaires");

  await expect(
    page.getByRole("button", { name: "Réaliser un inventaire" }),
  ).toBeVisible({ timeout: 10000 });
});

test("RCO-22: le détail d'un inventaire liste les stocks avec action de marquage", async ({
  page,
}) => {
  await login(page);
  await page.goto("/inventaires");

  const firstRow = page.locator("tbody tr").first();
  await expect(firstRow).toBeVisible({ timeout: 10000 });

  await firstRow.getByRole("link").click();
  await expect(page).toHaveURL(/\/inventaires\/\d+/, { timeout: 10000 });

  await expect(
    page.getByRole("button", { name: /Marquer (présent|absent)/ }).first(),
  ).toBeVisible({ timeout: 10000 });
});
