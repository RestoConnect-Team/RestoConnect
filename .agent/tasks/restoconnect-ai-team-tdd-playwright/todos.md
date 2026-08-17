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