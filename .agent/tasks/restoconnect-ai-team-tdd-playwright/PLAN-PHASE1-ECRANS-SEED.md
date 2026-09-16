# Plan — Phase 1 : Écrans manquants + seed enrichi + bugs UI

> Suite de `PLAN-PHASE0-SOCLE-BACKEND.md`. Reprise 2026-08-20.
> Objectif : préparer une démo riche pour Christelle (données seed Seine-et-Marne + écrans fonctionnels).

## Contexte

Le socle backend est sain (44 pytest verts). Mais l'inspection Playwright a révélé des écrans cassés et des données seed pauvres/incohérentes. Le brain était périmé sur l'état réel des écrans.

## Bugs détectés (inspection Playwright 2026-08-20)

| # | Bug | Cause | Sévérité |
|---|---|---|---|
| 1 | "Invalid token" affiché au lieu d'une redirection login | Le proxy ne valide pas le token ; après re-seed, cookie navigateur invalide → erreur brute 401 affichée | Bloquant |
| 2 | `/inventaires` → 404 | Page inexistante (routes.ts pointe dessus) | Bloquant |
| 3 | `/notifications` → 404 | Page inexistante | Bloquant |
| 4 | Avatar utilisateur cassé | `uploads/avatars/` vide mais seed référence `user_1.png`… | Bloquant |
| 5 | Ville profil incohérente | Users centre 1 = `Cityville`/`123 Main St` (factice anglais) vs centre "Melun" | Donnée |
| 6 | "5 matériel(s) trouvé(s)" sur page Véhicules | Libellé copié-collé | Mineur |
| 7 | Section "Matériels (3)" vide sur `all_centers/[id]` | `equipments` jamais fetché (TODO) | Donnée |
| 8 | "Derniers inventaires" vide | TODO | Donnée |
| 9 | Historique équipement vide | Aucun `stock_events` seedé | Donnée |
| 10 | Historique véhicule en dur | Données factices codées en dur | Donnée |
| 11 | `mailto:` vide sur profil | TODO | Mineur |
| 12 | `bg-[F5F5F5]` sans `#` | Bug CSS | Mineur |

## Conventions

- Branches `fix/<slug>` / `feat/<slug>` → merge `dev`.
- TDD : test rouge → implé → vert → commit.
- Pas de commentaires sauf si demandé.
- Validation finale : Playwright sur chaque écran (desktop + mobile) + `make test`.

## Phases d'exécution

### Phase 1 — Bugs bloquants (branche `fix/ui-bugs-ecrans`)
1. **401 → redirect login** : intercepter les 401 dans `useFetchData` + services, nettoyer cookie, rediriger `/`.
2. **Avatars** : générer fichiers placeholder `uploads/avatars/user_1.png` … `user_6.png`.
3. **Localiser users** : remplacer `Cityville`/`Townsville`/`Villagetown`/`123 Main St`… par adresses 77 cohérentes.

### Phase 2 — Incohérences (même branche)
4. Libellé "matériel(s)" → "véhicule(s)".
5. `bg-[F5F5F5]` → `bg-[#F5F5F5]`.
6. `mailto:` vide → `mailto:{email}`.

### Phase 3 — Écrans manquants (branche `feat/ecrans-inventaires-notifications`)
7. `/inventaires` — liste (`GET /api/list_inventories`).
8. `/inventaires/[id]` — détail (`GET /api/list_stocks_inventory/{id}`).
9. `/notifications` — alertes (`alerts` de `/api/my_center`).

### Phase 4 — Enrichir le seed (branche `feat/seed-enrichi`)
10. Plus de stocks (catégories/statuts variés), véhicules, inventaires, `stock_events`, documents véhicule. Tout en 77.

### Phase 5 — Formulaires UI sans backend (branche `feat/formulaires-ui`)
11. Création/édition matériel + véhicule (wizard 2 étapes, UI seule).

### Phase 6 — Validation
12. Playwright chaque écran (desktop + mobile), erreurs console, `make test`.

## Vérification

- `make test` 0 échec.
- Chaque écran navigué via Playwright, 0 erreur console.
- Brain `hot.md`/`log.md`/`insights.md` à jour.
