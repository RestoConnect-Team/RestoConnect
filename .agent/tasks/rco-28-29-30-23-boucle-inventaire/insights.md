# Insights — Boucle inventaire RCO-28/29/30 + RCO-23

_Bullets uniquement._

## Constats initiaux (2026-09-08)

- `InventoryStatus` n'a que 2 valeurs (en cours / terminé) → `PAUSED` manquant pour RCO-28.
- Aucun endpoint de statut au niveau `Inventory` (seulement au niveau `InventoryStock` via `PATCH /inventory_stock/{id}/status`).
- `create_inventory_service` crée un Inventory ON_GOING + 1 InventoryStock (NOT_FOUND) par stock du centre → pas de gestion de doublon ni de garde "inventaire déjà en cours".
- Le frontend `/inventaires` ne gère que la création et le toggle Présent/Absent ; pas de pause/reprise/validation/recommencer.
- Le brain `backlog-jira.md` est périmé : RCO-22/27/35/36/37/38/43 sont `Terminé` côté Jira, mais marqués "À faire"/"En cours" côté brain.
- Jira a 3 nouveaux tickets vs brain : RCO-41 (nomenclature), RCO-42 (créer compte), RCO-43 (normaliser états/catégories, Terminé).

## Décisions

- Un endpoint unique `PATCH /api/inventory/{id}/status` mutualise RCO-28 (pause/reprise) et RCO-29 (terminé).
- Workflow gitflow strict avec push origin (corrige l'oubli de push du passé).

## Risques

- Conflit avec l'équipe Aubay sur `dev` → toujours `git pull origin dev` avant de partir.
- IDs de transition Jira à découvrir dynamiquement (ne pas les hardcoder).
- RCO-30 et RCO-23 : specs ambiguës → lire Figma avant d'implémenter, arbitrer si flou.
