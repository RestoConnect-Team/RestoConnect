import { test, expect } from "@playwright/test";

/**
 * RCO-32 — Fermer la navbar (quick win UI).
 * Vérifie que la sidebar mobile s'ouvre via hamburger et se ferme via X / overlay.
 * La sidebar mobile a un conteneur avec classe translate-x-full (fermée) / translate-x-0 (ouverte).
 */

async function loginAndGoMobile(page, context) {
  await context.clearCookies();
  await page.goto("/");
  await page.getByPlaceholder("utilisateur@email.com").fill("superadmin@resto.com");
  await page.getByPlaceholder("••••••••").fill("1234");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/my_center/, { timeout: 30000 });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
}

// Le conteneur de la sidebar mobile (z-50, fixed, avec translate-x)
function mobileSidebar(page) {
  return page.locator("div.fixed.inset-y-0.left-0.z-50");
}

test("RCO-32: navbar mobile s'ouvre via hamburger et se ferme via bouton X", async ({
  page,
  context,
}) => {
  await loginAndGoMobile(page, context);

  // Fermée au départ → conteneur a translate-x-full
  await expect(mobileSidebar(page)).toHaveClass(/-translate-x-full/);

  // Ouvrir via hamburger
  await page.locator("button.lg\\:hidden").first().click();
  await page.waitForTimeout(800);
  await expect(mobileSidebar(page)).toHaveClass(/translate-x-0/);

  // Fermer via bouton X (icône lucide-x dans la sidebar mobile)
  await page.locator("button:has(svg.lucide-x)").first().click();
  await page.waitForTimeout(800);
  await expect(mobileSidebar(page)).toHaveClass(/-translate-x-full/);
});

test("RCO-32: navbar mobile se ferme via clic sur l'overlay", async ({
  page,
  context,
}) => {
  await loginAndGoMobile(page, context);

  await page.locator("button.lg\\:hidden").first().click();
  await page.waitForTimeout(800);
  await expect(mobileSidebar(page)).toHaveClass(/translate-x-0/);

  // Cliquer sur l'overlay (bg-black/40), à droite de la sidebar (288px)
  await page
    .locator(".fixed.inset-0.z-40")
    .click({ position: { x: 350, y: 400 } });
  await page.waitForTimeout(800);
  await expect(mobileSidebar(page)).toHaveClass(/-translate-x-full/);
});
