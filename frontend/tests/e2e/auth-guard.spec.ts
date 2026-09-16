import { test, expect } from "@playwright/test";

/**
 * RCO-20 — Garde d'authentification.
 *
 * État actuel : la page login existe (app/page.tsx), mais il n'y a AUCUN garde
 * d'auth côté frontend. /my_center est accessible sans cookie.
 *
 * Ce test est ROUGE tant que le middleware Next.js + redirect n'est pas implémenté.
 * Il passera au VERT une fois le garde d'auth en place.
 */

test("RED: /my_center sans cookie → doit rediriger vers / (login)", async ({
  page,
  context,
}) => {
  // S'assurer qu'aucun cookie n'est présent
  await context.clearCookies();

  // Tenter d'accéder à /my_center directement sans authentification
  await page.goto("/my_center");

  // Comportement attendu : redirection vers / (page de login)
  // Comportement actuel : reste sur /my_center (bug — pas de garde)
  await expect(page).toHaveURL(/^http:\/\/localhost:3000\/$/, {
    timeout: 8000,
  });
});

test("RED: /equipment sans cookie → doit rediriger vers / (login)", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto("/equipment");
  await expect(page).toHaveURL(/^http:\/\/localhost:3000\/$/, {
    timeout: 8000,
  });
});