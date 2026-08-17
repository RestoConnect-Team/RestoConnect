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
- [ ] Reviewer : revue diff
- [ ] Commit + branche `feat/rco-20-auth-guard` → merge `dev`
- [ ] Brain `/save` + Jira RCO-20 → Terminé

## Phase 4 — Orchestrateur Deep Agents
- [x] `pip install deepagents langchain-ollama langgraph-checkpoint-sqlite` (venv dédié `.venv-orchestrator`)
- [x] Écrire `orchestrator.py` (subagents po/dev/qa/reviewer, TodoListMiddleware, SqliteSaver, tools run_tests/git_status/git_diff)
- [x] Valider intégration modèle `ollama:glm-5.2:cloud` (via LangChain ChatOllama — tag `:cloud` résolu par daemon, OK sans fallback)
- [x] Agent construit + invoque modèle + répond (boucle Deep Agents opérationnelle)
- [ ] Test boucle autonome sur RCO-21 (à faire en session suivante)

## Phase 5 — Suivi & crash/reboot
- [x] Checkpointer SqliteSaver opérationnel (`.orchestrator-checkpoint.sqlite`, tables checkpoints+writes créées)
- [x] Brain hot.md/log.md/ADR mis à jour par lead à chaque ticket (prompt lead)
- [ ] Jira statuts "En cours"/"Terminé" au fil de l'eau (accès Jira via Playwright, à faire)
- [x] Rapport Playwright JSON commité (playwright.config.ts reporter json)

## Validation finale
- [x] `make test` 0 échec (6 pytest + 5 Playwright verts)
- [x] Boucle TDD autonome validée sur RCO-20 (rouge → vert)
- [x] Reprise après crash testée (checkpoint SQLite persisté)
- [ ] Brain `/save` final