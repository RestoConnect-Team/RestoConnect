# Todos — RestoConnect AI-team TDD Playwright

## Étape 0 — Init tâche
- [x] Créer dossier restoconnect-ai-team-tdd-playwright/
- [x] context.md
- [x] todos.md
- [x] insights.md
- [x] RESTOCONNECT_AI_TEAM_PLAN.md (copie du plan approuvé)

## Phase 0 — Réparer la team dev existante (opencode)
- [x] Corriger `~/.config/opencode/agents/explorer.md` : modèle `qwen3-coder:480b-cloud` (retiré 2026-07-15) → `gpt-oss:20b-cloud`

## Phase 1 — Environnement
- [x] Vérifier PostgreSQL installé + accessible (PostgreSQL 17.9 Homebrew, user `yohannravino`)
- [x] Créer `.env` backend (`DATABASE_URL=postgresql://yohannravino@localhost:5432/restos_connect`)
- [x] Créer dossiers `uploads/avatars/` (racine + backend)
- [x] `pip install -r backend/requirements.txt` (venv Python 3.14)
- [x] `npm install` frontend
- [x] Démarrer backend (`uvicorn`, port 8000) + frontend (`next dev`, port 3000) et vérifier

## Phase 2 — Socle de test (prérequis TDD)
- [x] Corriger bug `backend/app/services/generate_random_token_service.py:3` (`from pytest` → `from sqlalchemy.orm`)
- [x] Sortir le `DROP SCHEMA` de `backend/app/main.py` (conditionné à env var `RESET_DB_ON_BOOT`, défaut false)
- [x] Corriger CORS backend (ajouter `127.0.0.1:3000/3001`)
- [x] Corriger `get_user_controller.py` (401 si token None/empty — bug sécurité: `User.token == None` matchait les users non logués)
- [x] Backend : `pytest` + `httpx`, `conftest.py` (DB `restos_connect_test`), fixtures réutilisant `seed.py`
- [x] Frontend E2E : `@playwright/test` + `playwright.config.ts` (`webServer`), user seedé `superadmin@resto.com`/`1234`
- [x] Script `make test` → rapport JSON (Makefile racine)
- [x] Tests backend verts : 6/6 pytest
- [x] Tests E2E verts : 5/5 Playwright (smoke + auth-guard)

## Phase 3 — Boucle TDD RCO-20 (garde d'auth)
- [x] PO : analyse existant (login page `app/page.tsx`, `ClientLayout.tsx` sans garde, endpoints auth cookie-based)
- [x] Test rouge : accès `/my_center` sans cookie → redirigé `/` (échec avant implémentation)
- [x] Dev : `proxy.ts` Next.js 16 (garde d'auth, redirect 401 + redirect login si déjà authentifié)
- [x] QA : `make test` vert (5/5 E2E + 6/6 pytest)
- [x] Reviewer : revue diff
- [x] Commit + merge `dev`
- [x] Brain `hot.md` + `log.md` mis à jour

## Phase 3b — Boucle TDD RCO-21 (droits par centre)
- [x] PO : analyse existant (backend filtre déjà par center_id, gap = frontend Sidebar affiche tout)
- [x] Test rouge : CENTER_ADMIN ne voit pas "Centres" (échec avant implé)
- [x] Dev : `routes.ts` (champ `roles: ADMIN_ROLES`) + `Sidebar.tsx` (`visibleRoutes` filtre par `profile.status`)
- [x] QA : 2/2 E2E verts (rco-21-rights.spec.ts)
- [x] Commit + merge `dev` (à faire dans ce commit)

## Phase 3c — Boucle TDD RCO-32 (fermer navbar)
- [x] PO : analyse — déjà implémenté (overlay + bouton X + hamburger dans ClientLayout)
- [x] Test E2E : bouton X ferme la sidebar (vert, 1 test)
- [x] Commit + merge `dev` (à faire dans ce commit)

## Phase 4 — Orchestrateur Deep Agents
- [x] ~~Construit + validé~~ → **ABANDONNÉ (D7)** : 0 feature en 20 min, latence + tokens inutiles
- [x] Nettoyage : `orchestrator.py`, `.venv-orchestrator/`, `.orchestrator-checkpoint.sqlite*` supprimés
- [x] Document替代 : `workflow-tdd-opencode.md` (mode opératoire avec opencode natif)

## Phase 5 — Suivi & crash/reboot
- [x] Brain hot.md/log.md/ADR mis à jour
- [x] Mode opératoire `workflow-tdd-opencode.md` (reprise après crash = `/prime` + `git status`)
- [ ] Jira statuts "En cours"/"Terminé" au fil de l'eau (accès Jira via Playwright, à faire)

## Validation finale
- [x] `make test` 0 échec (6 pytest + 9 Playwright verts)
- [x] Boucle TDD autonome validée sur RCO-20 + RCO-21 + RCO-32
- [x] Mode opératoire documenté (`workflow-tdd-opencode.md`)
- [x] Brain `/save` final

## Phase 6 — Reprise post-RCO-32 : socle backend (fixes) + épic inventaire

Plan détaillé : `PLAN-PHASE0-SOCLE-BACKEND.md`.

### Phase 0 — Corriger le socle backend (6 bugs découverts par analyse code)
- [x] Branche A `fix/inventory-backend-socle` : Fix #1 mismatch schéma inventaire
- [x] Branche A : Fix #2 `create_inventory_route` GET → POST
- [x] Branche A : Fix #3 `create_inventory_controller` appelle `create_inventory_service`
- [x] Branche A : 3 nouveaux pytest verts + commit + merge `dev`
- [x] Branche B `fix/auth-center-scope` : Fix #4 `is_user_center_admin_service` rôles admin
- [x] Branche B : Fix #5 auth sur `get_list_stocks_inventory_route`
- [x] Branche B : Fix #6 filtre par centre `get_stock_by_reference` + `update_stock_status`
- [x] Branche B : 6 nouveaux pytest verts + commit + merge `dev`
- [x] `insights.md` mis à jour (bugs corrigés + bugs hors scope + D8)

### Phase 1 — Hygiène Jira
- [ ] Vérifier l'accès Jira (token vs cookie Playwright)
- [ ] Statuts : RCO-20/21/32 → Terminé ; RCO-19/17/5 → En cours
- [ ] Créer 8 tickets manquants (transfert, modération, créations, export, inventaires véhicule)

### Phase 2 — RCO-22 (réaliser un inventaire)
- [ ] Branche `feat/rco-22-realiser-inventaire`
- [ ] Page `/inventaires` (manquante) + flow scan→statut
- [ ] Tests E2E + pytest

### Phase 3 — RCO-27 (déjà implémenté)
- [ ] Branche `feat/rco-27-test-e2e`
- [ ] Test E2E manquant + corriger le brain (RCO-27 = fait)

### Phase 4 — RCO-28/29/30 + RCO-23
- [ ] RCO-28 pause/reprise (enum PAUSED + endpoint)
- [ ] RCO-29 valider incomplet (endpoint FINISHED)
- [ ] RCO-30 recommencer (endpoint reset)
- [ ] RCO-23 doublons (vérif au scan)

### Phase 5 — Brain keeper
- [ ] `skill save` final (hot.md + log.md + todos.md)

## Phase 7 — Écrans manquants + seed enrichi + bugs UI (2026-08-20)

Plan : `PLAN-PHASE1-ECRANS-SEED.md`.

- [x] Fix 401 → redirect login (`apiFetch` centralisé)
- [x] Générer avatars placeholder (`uploads/avatars/user_1..6.png`)
- [x] Localiser users seed en Seine-et-Marne
- [x] Enrichir seed (stocks 15, inventaires 4, stock_events 6)
- [x] Libellé "véhicule(s)", `bg-[#F5F5F5]`, `mailto:`, capitalisation historique
- [x] Pages `/inventaires`, `/inventaires/[id]`, `/notifications`
- [x] Formulaires création/édition matériel + véhicule (UI seule)
- [x] Corriger tests E2E navbar-close + rco-27
- [x] 44 pytest + 11 E2E verts
- [x] 6 commits sur dev + insights.md mis à jour

### Reste à faire (hors scope)
- [ ] `all_centers/[id]` : section "Matériels" vide + "Derniers inventaires" vide
- [ ] Historique véhicule codé en dur
- [ ] Câblage backend POST/PUT pour formulaires création/édition

## Phase 8 — Fix sécurité + RCO-22 + CRUD + quick wins UI (2026-09-02)

Plan : `PLAN-PHASE2-SECURITE-RCO22-CRUD.md`.

### Item 1 — Fix sécurité delete_* (branche `fix/delete-routes-auth`)
- [x] Auth (401) sur `delete_stock/vehicule/center` routes
- [x] Filtre centre (403 cross-centre) sur `delete_stock` + `get_stock_detail`
- [x] Corrige double appel service dans `delete_vehicule_controller` + `delete_center_controller`
- [x] Tests : 3 `test_delete_*_without_token_bug` → 401 + tests filtre centre (7 nouveaux)
- [x] 51 pytest verts + commit + merge dev

### Item 2 — RCO-22 flow inventaire (branche `feat/rco-22-realiser-inventaire`)
- [x] Bouton "Réaliser un inventaire" sur `/inventaires` → POST create_inventory
- [x] Endpoint `PATCH /api/inventory/inventory_stock/{id}/status` (marquer Présent/Absent)
- [x] Câblage UI marquage statut dans `/inventaires/[id]`
- [x] 4 tests backend + 2 tests E2E + commit + merge dev

### Item 3 — CRUD matériel + véhicule (branche `feat/crud-materiel-vehicule`)
- [x] Endpoints `POST/PUT /api/stock` + `POST/PUT /api/vehicule` + schémas payload
- [x] Câblage 4 formulaires UI (equipment new/edit, vehicule new/edit)
- [x] Fix `use(params)` sur pages edit (params = Promise)
- [x] 8 tests backend + commit + merge dev

### Item 4 — Quick wins UI (branche `fix/ui-detail-centre-vehicule`)
- [x] Route `GET /api/center/{id}/stocks` + fetch équipements dans `CenterDetailView`
- [x] Historique véhicule dé-hardcodé (documents réels)
- [x] 2 tests backend + commit + merge dev

### Bilan
- 65 pytest + 13 E2E verts (44 → 65 pytest, 11 → 13 E2E)
- 4 branches mergées sur dev