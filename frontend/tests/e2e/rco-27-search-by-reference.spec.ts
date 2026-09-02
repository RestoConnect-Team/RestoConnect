import { test, expect } from "@playwright/test";

/**
 * RCO-27 — Recherche d'un matériel par référence (étiquette illisible).
 *
 * La page /scan expose un bouton "Étiquette illisible ? Rechercher par référence"
 * qui révèle un input. Une référence valide du centre de l'utilisateur renvoie
 * la fiche produit ; une référence inexistante affiche "Étiquette non reconnue".
 *
 * User seedé : superadmin@resto.com / 1234 (SUPER_ADMIN, centre Melun).
 * Stocks du centre 1 : REF001_c1 (Pc, Perdu), REF002_c1 (Frigo, Disponible).
 */

async function loginAndGoToScan(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByPlaceholder("utilisateur@email.com").fill("superadmin@resto.com");
  await page.getByPlaceholder("••••••••").fill("1234");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/my_center/, { timeout: 15000 });
  await page.goto("/scan");
}

test("RCO-27: recherche par référence valide → affiche la fiche produit", async ({
  page,
}) => {
  await loginAndGoToScan(page);

  await page
    .getByRole("button", { name: "Étiquette illisible ?" })
    .click();
  const input = page.getByPlaceholder("Rechercher par référence");
  await expect(input).toBeVisible({ timeout: 5000 });
  await input.fill("REF001_c1");
  await input.press("Enter");

  await expect(page.getByText("Pc").first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("REF001_c1").first()).toBeVisible();
});

test("RCO-27: recherche par référence inexistante → affiche 'Étiquette non reconnue'", async ({
  page,
}) => {
  await loginAndGoToScan(page);

  await page
    .getByRole("button", { name: "Étiquette illisible ?" })
    .click();
  const input = page.getByPlaceholder("Rechercher par référence");
  await expect(input).toBeVisible({ timeout: 5000 });
  await input.fill("REF_INEXISTANTE");
  await input.press("Enter");

  await expect(page.getByText("Étiquette non reconnue").first()).toBeVisible({
    timeout: 10000,
  });
});