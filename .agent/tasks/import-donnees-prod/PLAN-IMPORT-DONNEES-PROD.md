# Plan — Import des données réelles de production

> Reprise 2026-09-02. Objectif : remplacer les données seed de démo par les vraies données
> de production (fichiers Excel de la clé USB `SANS-TITRE`), pour que l'app les affiche.

## Contexte

- Le projet contient des données seed de démo (`backend/app/database/seed.py`).
- La clé USB `/Volumes/SANS-TITRE/restoducoeur.tar.gz` (763 Mo) contient les vrais fichiers Excel.
- Archive extraite (partiellement) vers `/tmp/restoducoeur/restoducoeur/`.
- **⚠️ Découverte** : la branche `main` ne contient que `README.md` (commit "Initial commit").
  Tout le code (backend + frontend) est sur `dev` (162 commits ahead). L'import doit donc
  se faire sur `dev` (ou une branche dérivée de `dev`), pas sur `main`.

## Sources de données exploitables (3)

| Fichier Excel | Contenu | Table cible | Volume |
|---|---|---|---|
| `Centres Restos du coeur de Seine et Marne.xlsx` | 33 centres AD77 | `center` | 33 |
| `Copie de Base véhicules 08 01 25 PYR.xlsx` (sheet `liste vehicules`) | parc véhicules | `vehicule` | ~50 |
| `Inventaire RDC – Copie.xlsx` (sheet `Inventaire au 290125`) | matériels par centre | `stock` | 1619 |

## Mapping de cohérence (normalisation vers les enums existants)

### Centres → `Center`
- `NOM` → `name` (nettoyé, ex. `AD77 – Centre d'AVON` → `Centre Avon`)
- `ADRESSE` → `street` (le numéro est dans la chaîne, pas de `street_number` fiable)
- `CODE POSTAL` → `postal_code` (str)
- `VILLE` → `city`
- `TEL` → `telephone`
- `MAIL` → `email`
- `status` → `CenterStatus.OPEN` (défaut) ; le siège/entrepôts → `is_warehouse`

### Véhicules → `Vehicule`
- `Immat` → `immatriculation` (unique)
- `Marque` + `Modele` → `name`
- `Type` (UL/VP/Bus/…) → `category` via mapping :
  - `VP` → `VOITURE`, `UL`/`UL Hayon`/`UL FRIGO` → `UTILITAIRE`/`FOURGON`/`FRIGORIFIQUE`,
    `Bus` → `CAMION`
- `Date du prochain CT` → `next_technical_inspection_date`
- `Klm` → `nb_km`
- `Affectation du véhicule` → `center_id` (résolu par nom de centre)
- `Quel est selon vous l'état du véhicule` → `status` (mapping MOYEN/CORRECT/HS/FIN DE VIE → enum)

### Matériels → `Stock`
- `CODE ARTICLE` → `reference` (unique ; `NON IMAT`/None → générer)
- `LIBELLE` → `name`
- `FAMILLE (CATEGORIE)` → `category` via mapping vers `StockCategory` :
  - `INFORMATIQUE`/`TELEPHONE` → `INFORMATIQUE`
  - `CONGELATEUR`/`REFRIGERATEUR` → `REFRIGIRE`
  - `MATERIELS DE CUISINE`/`BALANCE`/`BAC` → `RESTAURATION`
  - `MATERIEL DE BUREAU`/`MOBILIER DE BUREAU`/`RAYONNAGE` → `BUREAU`
  - `ENTRETIEN`/`MANUTENTION`/autres → `OTHER`
- `CENTRE` → `center_id` (résolu par nom, avec normalisation des variantes d'espace)
- `VALEUR ACHAT` → `rating` (int, arrondi)
- `DATE ACHAT` → `creation_date`
- `status` → `StockStatus.AVAILABLE` (défaut)

## Approche

- **Script d'import séparé** `backend/app/database/import_prod.py` (ne touche pas `seed.py`).
- Lit les Excel via `openpyxl` (ajouté à `requirements.txt`).
- Insère dans l'ordre des FK : centres → véhicules → matériels.
- Idempotent : skip si la table cible est déjà remplie (ou `--force` pour vider).
- Résolution des centres par nom normalisé (uppercase + strip) pour relier véhicules/matériels.

## Vérification

- Lancer l'import sur la base locale, vérifier : FK valides, enums valides, uniques respectés.
- `make test` vert (le seed de démo reste intact pour les tests).

## Décisions actées

1. Import sur `dev` (pas `main` — `main` est vide).
2. Script séparé `import_prod.py`, pas de modification de `seed.py`.
3. Mapping de catégories/familles vers les enums existants (pas de nouvel enum).
