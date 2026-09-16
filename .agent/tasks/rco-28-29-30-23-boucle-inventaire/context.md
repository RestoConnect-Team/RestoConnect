# Context — Boucle inventaire RCO-28/29/30 + RCO-23 (démo 21/09)

## Pourquoi

Terminer la boucle inventaire de RestoConnect avant la **démo du 21/09/2026** (AG des Restos du Cœur, Nangis). Les 4 tickets restants sont le cœur métier fonctionnel : pause/reprise, validation manuelle, recommencer, gestion des doublons. C'est le parcours le plus cohérent à compléter pour une démo solide, sans rien laisser de côté.

## Quoi (périmètre)

| Ticket | Titre | Type |
|---|---|---|
| RCO-28 | Mettre en pause / reprendre un inventaire | Story |
| RCO-29 | Valider manuellement un inventaire incomplet | Story |
| RCO-30 | Recommencer un inventaire | Story |
| RCO-23 | Gestion des doublons lors de l'inventaire | Fonctionnalité |

Ordre : RCO-28 → RCO-29 → RCO-30 → RCO-23.

## État du code (vérifié 2026-09-08)

- **Enum** : `InventoryStatus` = `ON_GOING ("en cours")` / `FINISHED ("terminé")`. Pas de `PAUSED`.
- **Modèle** : `Inventory` (id, inventory_start_date, inventory_end_date, status, center_id, user_id) ; `InventoryStock` (status Présent/Absent, stock_id, scan_id, inventory_id).
- **Endpoints existants** :
  - `POST /api/inventory/create_inventory` (crée Inventory ON_GOING + 1 InventoryStock par stock du centre).
  - `GET /api/inventory/list_inventories` (liste par centre).
  - `PATCH /api/inventory/inventory_stock/{id}/status` (Présent/Absent, garde centre).
- **Frontend** : `/inventaires` (liste + bouton "Réaliser un inventaire"), `/inventaires/[id]` (détail + toggle Présent/Absent). `lib/api/inventories.ts`.
- **Tests** : 70 pytest + 13 E2E verts. Fixtures `client`/`db` sur DB `restos_connect_test`.

## Décisions actées

1. **Un seul endpoint de statut** `PATCH /api/inventory/{inventory_id}/status` (accepte `en cours`/`en pause`/`terminé`) — RCO-28 + RCO-29 partagent ce mécanisme de transition.
2. **RCO-30** : endpoint dédié `POST /api/inventory/{inventory_id}/restart` (reset statuts + repasse ON_GOING), à confirmer via Figma.
3. **RCO-23** : à clarifier via Figma (`inv-05-scan-erreur`). Vraisemblablement : détection d'une référence scannée 2× ou d'un doublon au scan.
4. **Workflow gitflow strict** : branche `feat/rco-XX-<slug>` → merge `dev` → push origin (le push a été oublié par le passé, ne pas le refaire).
5. **Jira au fil de l'eau** : "En cours" (transition 10038) au début, "Terminé" (10040) à la fin de chaque ticket.

## Sources

- `_brain/wiki/moc/backlog-jira.md` (statuts périmés, à corriger)
- `_brain/wiki/moc/ecrans-figma.md` + `_brain/raw/specs-figma/2026-08-17-structure-figma.md` (frames inv-01→08)
- `backend/app/enums/inventory_status_enum.py`, `backend/app/models/inventory.py`, `create_inventory_service.py`
- `.agent/tasks/restoconnect-ai-team-tdd-playwright/workflow-tdd-opencode.md` (mode opératoire TDD)
- Jira API v3 `/rest/api/3/` (token dans credential.md)

## Périmètre

- IN : RCO-28/29/30/23 (backend + frontend + tests), synchro brain backlog-jira, commits+push.
- OUT : RCO-31 (stationnement), RCO-40 (inventaires véhicule), RCO-41/42 (nouveaux), captures d'écran démo (séparé).
