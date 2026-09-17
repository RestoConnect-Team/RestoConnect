-- Migrations manuelles RestoConnect (2026-09-16)
-- À appliquer sur tout environnement où create_all() ne migre pas l'existant.
-- Idempotent : chaque instruction peut être rejouée sans effet de bord.

-- RCO-28/29 : ajout du statut "en pause" à l'enum inventorystatus
ALTER TYPE inventorystatus ADD VALUE IF NOT EXISTS 'PAUSED';

-- RCO-31 : emplacement de stationnement des véhicules
ALTER TABLE vehicule ADD COLUMN IF NOT EXISTS parking_location VARCHAR;

-- RCO-34 : modération des commentaires des centres
CREATE TABLE IF NOT EXISTS comment (
    id SERIAL PRIMARY KEY,
    content VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'en attente',
    created_at TIMESTAMP DEFAULT now(),
    center_id INTEGER NOT NULL REFERENCES center(id),
    user_id INTEGER REFERENCES "user"(id)
);

-- RCO-40 : inventaires véhicule
CREATE TABLE IF NOT EXISTS vehicule_inventory (
    id SERIAL PRIMARY KEY,
    inventory_start_date DATE DEFAULT CURRENT_DATE,
    inventory_end_date DATE,
    status VARCHAR NOT NULL,
    center_id INTEGER NOT NULL REFERENCES center(id),
    user_id INTEGER REFERENCES "user"(id)
);

CREATE TABLE IF NOT EXISTS vehicule_inventory_item (
    id SERIAL PRIMARY KEY,
    status VARCHAR NOT NULL,
    vehicule_id INTEGER REFERENCES vehicule(id),
    inventory_id INTEGER REFERENCES vehicule_inventory(id)
);
