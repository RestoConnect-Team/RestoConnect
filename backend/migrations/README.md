# Migrations RestoConnect

Le projet n'utilise pas Alembic. Les migrations de schéma sont des fichiers SQL
idempotents versionnés, à appliquer dans l'ordre chronologique.

## Appliquer une migration

```bash
psql -d restos_connect -f backend/migrations/2026-09-16-demo-21-sept.sql
```

## Fichiers

- `2026-09-16-demo-21-sept.sql` — ajout `PAUSED` (inventorystatus), `parking_location`
  (vehicule), tables `comment`, `vehicule_inventory`, `vehicule_inventory_item`.
