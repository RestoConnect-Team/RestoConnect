# Plan — Phase 0 : Socle backend (fixes) + reprise post-RCO-32

> Suite du plan `RESTOCONNECT_AI_TEAM_PLAN.md`. Reprise 2026-08-17 après livraison RCO-20/21/32.
> Décision D7 actée : opencode natif en TDD direct, subagents pour la recherche uniquement.

## Contexte de la reprise

À l'issue de la session précédente, le socle TDD est en place (6 pytest + 9 Playwright E2E verts), RCO-20/21/32 livrés sur `dev`. L'analyse approfondie du code réel (vs brain) a révélé **6 bugs backend** non documentés qui bloquent l'épic inventaire (RCO-22 → RCO-30) et compromettent RCO-21.

Le brain était **périmé** sur plusieurs points :
- RCO-27 "UI à finir" → en fait **déjà implémenté** (backend + UI `ManualSearch`).
- RCO-22 "backend partiel" → en fait **cassé** (controller n'appelle pas le service, route en GET, mismatch schéma).
- RCO-21 "fait" → en fait **partiel** (frontend Sidebar OK, backend ne filtre pas par centre).

## Conventions

- **Branches** : `fix/<slug>` et `feat/<slug>` → merge `dev`. Jamais de dev direct sur `main`/`dev`.
- **TDD** : test pytest rouge → implé minimal → vert → commit, par branche.
- **Brain** : `skill save` en fin de session (hot.md + log.md + todos.md + ADR si décision).
- **Code** : pas de commentaires sauf si demandé. Respecter les conventions du fichier environnant.

## Bugs découverts (Phase 0, bloquants)

| # | Fichier(s) | Problème | Branche |
|---|---|---|---|
| 1 | `schemas/one_inventory_from_inventorys.py` + `controllers/get_list_inventories_controller.py` | **Mismatch de champs** : schéma attend `inventory_id`/`start_date`/`end_date`/`status_inventory_stock`, controller passe `id`/`inventory_start_date`/`inventory_end_date`/`status` → Pydantic ValidationError | `fix/inventory-backend-socle` |
| 2 | `api/endpoints/create_inventory_route.py` | Route en **GET** (devrait être POST) + ne crée rien | `fix/inventory-backend-socle` |
| 3 | `controllers/create_inventory_controller.py` | N'appelle pas `create_inventory_service` (le service existe mais est mort) | `fix/inventory-backend-socle` |
| 4 | `services/is_user_center_admin_service.py` | Retourne `true` uniquement pour `CENTER_ADMIN` → SUPER_ADMIN/ADMIN refusés (403) | `fix/auth-center-scope` |
| 5 | `api/endpoints/get_list_stocks_inventory_route.py` | **Aucune auth** (pas de cookie token) → fuite de données | `fix/auth-center-scope` |
| 6 | `controllers/get_stock_by_reference.py` + `controllers/update_stock_status.py` | **Pas de filtre par centre** → user du centre 1 peut lire/modifier le stock du centre 2 (violation RCO-21) | `fix/auth-center-scope` |

## Bugs hors scope (documentés dans `insights.md`, pas corrigés sans accord)

- `delete_stock_route` / `delete_vehicule_route` / `delete_center_route` : aucune auth.
- `delete_vehicule_controller` : appelle `delete_vehicule_service` deux fois.
- `get_stock_detail` : pas de filtre par centre.
- `routes.ts` : pointe vers `/inventaires` et `/notifications` qui n'existent pas (404 sidebar).

## Phases d'exécution

### Phase 0 — Socle backend (2 branches, 6 fixes, TDD)

#### Branche A : `fix/inventory-backend-socle` (fixes #1-3)

Séquence TDD par fix : test rouge → implé → vert.

- **Fix #1** : Aligner `OneInventoryFromInventorys` (schéma) et `get_list_inventories_controller` (mapping).
  - Décision : aligner le controller sur le schéma (le schéma est la source de vérité API).
  - Test : `GET /api/inventory/list_inventories` avec token superadmin → 200 + JSON avec `inventory_id`/`start_date`/`end_date`/`status_inventory_stock`.
- **Fix #2** : `create_inventory_route` GET → POST.
  - Test : `POST /api/inventory/create_inventory` avec token → 201/200 ; `GET` → 405.
- **Fix #3** : `create_inventory_controller` appelle `create_inventory_service`.
  - Test : `POST /api/inventory/create_inventory` → un `Inventory` est créé en DB (compter avant/après), + `InventoryStock` créés pour chaque stock du centre.
- Commit + merge `dev`.

#### Branche B : `fix/auth-center-scope` (fixes #4-6)

- **Fix #4** : `is_user_center_admin_service` accepte SUPER_ADMIN/ADMIN/CENTER_ADMIN (et STOCK_ADMIN selon ticket RCO-22 "chargé de logistique").
  - Test : superadmin (SUPER_ADMIN) → `POST /api/inventory/create_inventory` 200 (pas 403).
- **Fix #5** : Auth sur `get_list_stocks_inventory_route` (cookie token + 401 si absent/invalide).
  - Test : `GET /api/inventory/list_stocks_inventory/1` sans token → 401 ; avec token → 200.
- **Fix #6** : Filtre par centre dans `get_stock_by_reference` + `update_stock_status`.
  - `get_stock_by_reference` : si `product.center_id != user.center_id` (et pas entrepôt) → 403/404.
  - `update_stock_status` : idem avant modification.
  - Test : user du centre 1 scan une réf du centre 2 → 403/404 ; scan une réf du centre 1 → 200.
- Commit + merge `dev`.

### Phase 1 — Hygiène Jira (pas de branche)

- Vérifier l'accès Jira réel (token Atlassian vs cookie Playwright) avant toute écriture.
- Statuts : RCO-20/21/32 → Terminé ; RCO-19/17/5 → En cours.
- Créer 8 tickets manquants : transfert matériel, modération commentaires, création matériel, création véhicule, édition matériel, édition véhicule, export centres, inventaires véhicule (veh-02→06).

### Phase 2 — RCO-22 (branche `feat/rco-22-realiser-inventaire`)

Backend désormais sain. Câbler l'UI :
- Créer la page `/inventaires` (manquante — `routes.ts` pointe déjà dessus).
- Flow : bouton "Réaliser un inventaire" → `POST /api/inventory/create_inventory` → liste des `InventoryStock` → scan QR → marquer "Présent".
- Tests E2E Playwright + pytest backend.

### Phase 3 — RCO-27 (branche `feat/rco-27-test-e2e`)

Déjà implémenté (backend `get_stock_by_reference` + UI `ManualSearch`). Reste :
- Écrire le test E2E manquant (`rco-27-search-by-reference.spec.ts`).
- Corriger le brain (marquer RCO-27 fait).

### Phase 4 — RCO-28/29/30 (branches dédiées)

- RCO-28 (pause/reprise) : ajouter `PAUSED` à `InventoryStatus` + endpoint.
- RCO-29 (valider incomplet) : endpoint pour passer un inventaire en FINISHED.
- RCO-30 (recommencer) : endpoint pour réinitialiser.
- RCO-23 (doublons) : vérifier au scan si le stock est déjà dans l'inventaire en cours.

### Phase 5 — Brain keeper

- `skill save` : hot.md + log.md + todos.md + ADR si décision structurante.
- Mettre à jour `insights.md` avec les bugs hors scope.

## Vérification

- `make test` — 0 échec (6 pytest + 9 Playwright E2E) au départ, puis +tests par fix.
- Chaque fix = test pytest rouge → vert.
- Chaque branche mergeée vers `dev` après review `git diff`.
- Brain `hot.md`/`log.md` à jour en fin de session.

## Séquence de démarrage

1. Sauvegarder ce plan (fait — ce fichier).
2. `git status` + `git log --oneline -5` + `make test` → baseline verte sur `dev`.
3. `git checkout -b fix/inventory-backend-socle` → attaquer Fix #1.