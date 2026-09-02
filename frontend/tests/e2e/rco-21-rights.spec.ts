import { test, expect } from "@playwright/test";

/**
 * RCO-21 — Droits d'accès selon centre d'affectation.
 *
 * Un CENTER_ADMIN (Responsable de centre) ne doit pas voir les routes admin
 * (ex. "Centres" /all_centers). Seuls ADMIN/SUPER_ADMIN les voient.
 * User seedé : resp1@resto.com / 1234 (CENTER_ADMIN, centre Melun).
 */

test("RED: CENTER_ADMIN ne doit pas voir le lien Centres dans la sidebar", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto("/");
  await page.getByPlaceholder("utilisateur@email.com").fill("resp1@resto.com");
  await page.getByPlaceholder("••••••••").fill("1234");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/my_center/, { timeout: 30000 });

  // Attendre que la sidebar soit rendue avec le profil chargé
  await expect(page.getByRole("link", { name: "Mon tableau de bord" })).toBeVisible({
    timeout: 10000,
  });
  // Attendre que le profil soit chargé (le nom du user apparaît)
  await page.waitForTimeout(3000);

  // Le lien "Centres" ne doit pas être visible pour un CENTER_ADMIN
  await expect(page.getByRole("link", { name: "Centres" })).not.toBeVisible({
    timeout: 5000,
  });
});

test("GREEN check: SUPER_ADMIN voit le lien Centres dans la sidebar", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto("/");
  await page.getByPlaceholder("utilisateur@email.com").fill("superadmin@resto.com");
  await page.getByPlaceholder("••••••••").fill("1234");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/my_center/, { timeout: 30000 });

  // Le lien "Centres" doit être visible pour un SUPER_ADMIN
  await expect(page.getByRole("link", { name: "Centres" })).toBeVisible({
    timeout: 5000,
  });
});