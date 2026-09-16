# Plan — Phase 2 : Fix sécurité + RCO-22 + CRUD + quick wins UI

> Suite de `PLAN-PHASE1-ECRANS-SEED.md`. Reprise 2026-09-02. Branche `dev` (22 commits ahead origin).

## Contexte

Socle backend sain (44 pytest + 11 E2E verts). Le croisement brain × code (D8) révèle 4 chantiers restants, dont 3 bugs sécurité documentés mais non corrigés.

## Conventions

- Branches `fix/<slug>` / `feat/<slug>` → merge `dev`.
- TDD : test rouge → implé → vert → commit.
- Pas de commentaires sauf si demandé.
- `make test` vert avant/après chaque item.

---

## Item 1 — Fix sécurité `delete_*` (branche `fix/delete-routes-auth`)

| Fichier | Problème | Fix |
|---|---|---|
| `delete_stock_route.py` / `delete_vehicule_route.py` / `delete_center_route.py` | aucune auth (pas de `Cookie(token)`) | ajouter `token` + 401 |
| `delete_vehicule_controller.py:7-10` | appelle le service 2× (2e → 404) | 1 seul appel |
| `delete_center_controller.py:7-10` | idem double appel | 1 seul appel |
| `delete_stock_controller.py` | pas de filtre centre | 403 cross-centre |
| `get_stock_detail.py` | pas de filtre centre | 403 cross-centre |

Tests : transformer `test_delete_*_without_token_bug` (3) en attente 401, + tests filtre centre. Commit + merge.

## Item 2 — RCO-22 flow inventaire (branche `feat/rco-22-realiser-inventaire`)

- Bouton "Réaliser un inventaire" sur `/inventaires` → `POST /api/inventory/create_inventory` (endpoint sain).
- Nouvel endpoint `PATCH /api/inventory/inventory_stock/{id}/status` pour marquer FOUND/NOT_FOUND (n'existe pas).
- Câblage UI scan→statut. Tests E2E + pytest.

## Item 3 — CRUD matériel + véhicule (branche `feat/crud-materiel-vehicule`)

- Backend : `POST/PUT /api/stock` + `POST/PUT /api/vehicule` (aucun n'existe) + schémas payload.
- Frontend : câbler les 4 formulaires (`equipment/new`, `equipment/[id]/edit`, `vehicule/new`, `vehicule/[id]/edit`) — `onClick={() => {}}` à remplacer.

## Item 4 — Quick wins UI (branche `fix/ui-detail-centre-vehicule`)

- `CenterDetailView.tsx:30` : fetcher les équipements (route `GET /api/center/{id}/stocks` à exposer via `get_center_stocks_list_service`).
- `vehicule/[id]/page.tsx:378-393` : dé-hardcoder l'historique.

---

## Décisions actées

1. **Item 2** : créer `PATCH /api/inventory/inventory_stock/{id}/status` en TDD.
2. **Item 3** : schémas payload (matériel : nom/catégorie/référence/description ; véhicule : nom/immatriculation/catégorie/statut/km), QR généré depuis la référence.
3. **Item 4** : exposer `GET /api/center/{id}/stocks` (route dédiée) plutôt que d'alourdir `CenterInfos`.

## Vérification

- `make test` 0 échec après chaque item.
- Chaque fix = test pytest rouge → vert.
- Chaque branche mergeée vers `dev` après review `git diff`.
- Brain `hot.md`/`log.md` + `todos.md` + `insights.md` à jour en fin de session.
