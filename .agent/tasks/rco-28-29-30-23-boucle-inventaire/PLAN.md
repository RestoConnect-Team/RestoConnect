# Plan — Boucle inventaire RCO-28/29/30 + RCO-23

> TDD, gitflow strict, Jira au fil de l'eau. Chaque phase = 1 branche + 1 commit + 1 push + 1 transition Jira.

## Phase 0 — Synchronisation & socle

1. Mettre à jour `_brain/wiki/moc/backlog-jira.md` : statuts réels (RCO-22/27/35/36/37/38/43 = Terminé), ajouter RCO-41/42.
2. Mettre à jour `_brain/wiki/hot.md`.
3. Lire les transitions Jira disponibles (IDs exacts) via `GET /rest/api/3/issue/RCO-XX/transitions`.

## Phase 1 — RCO-28 : pause / reprise d'un inventaire

- [ ] Enum : ajouter `PAUSED = "en pause"` à `InventoryStatus`.
- [ ] Schema `InventoryStatusUpdate` (Literal en cours / en pause / terminé).
- [ ] Service `update_inventory_status_service` (transition avec gardes).
- [ ] Controller + route `PATCH /api/inventory/{inventory_id}/status`.
- [ ] Frontend : boutons Pause/Reprendre sur `/inventaires`, badge "en pause".
- [ ] Tests pytest (transition légale, 403 cross-centre, refus FINISHED).
- [ ] Commit `feat(RCO-28)` + push + merge dev + Jira Terminé.

## Phase 2 — RCO-29 : valider manuellement un inventaire incomplet

- [ ] Réutiliser `PATCH /api/inventory/{id}/status` avec `terminé` (pose `inventory_end_date`).
- [ ] Frontend : bouton "Valider l'inventaire" (confirm) sur `/inventaires/[id]` et/ou liste.
- [ ] Tests pytest (clôture avec Absent restants).
- [ ] Commit `feat(RCO-29)` + push + merge dev + Jira Terminé.

## Phase 3 — RCO-30 : recommencer un inventaire

- [ ] (à préciser via Figma) endpoint `POST /api/inventory/{id}/restart`.
- [ ] Reset des InventoryStock → NOT_FOUND + status ON_GOING (ou recréation).
- [ ] Frontend : bouton "Recommencer" sur un inventaire terminé.
- [ ] Tests pytest.
- [ ] Commit `feat(RCO-30)` + push + merge dev + Jira Terminé.

## Phase 4 — RCO-23 : gestion des doublons

- [ ] (à préciser via Figma `inv-05-scan-erreur`) détection doublon référence au scan/création.
- [ ] Implémentation + tests.
- [ ] Commit `feat(RCO-23)` + push + merge dev + Jira Terminé.

## Phase 5 — Bilan

- [ ] `make test` vert (pytest + E2E).
- [ ] `skill save` (hot.md + log.md).
- [ ] Mettre à jour `todos.md` + `SESSION_LOG.md` + `insights.md`.
