# Plan — RestoConnect AI-team TDD Playwright

## Étape 0 — Init tâche (avant toute implémentation)

**Créer** `/Users/yohannravino/Factory/merenza/.agent/tasks/restoconnect-ai-team-tdd-playwright/` avec :
- `context.md` — objectif : équipe IA autonome TDD pour RestoConnect, orchestrateur Deep Agents, reprise crash
- `todos.md` — checklist par phase
- `insights.md` — décisions + bugs détectés, mis à jour au fil des sessions
- `RESTOCONNECT_AI_TEAM_PLAN.md` — copie de ce plan détaillé

---

## Context

RestoConnect = web app gestion centres Restos du Cœur (Next.js 16 + FastAPI + PostgreSQL). Aucun test n'existe. Backlog Jira (14 tickets RCO) en retard sur le code. Figma v2 en avance. Le but : mettre en place une équipe IA autonome qui code en TDD (Playwright E2E + pytest backend), avec reprise après crash et suivi structuré.

Repo = `RestoConnect-Team/RestoConnect` (branche courante `dev`, convention `feat/`, `feature/`, `fix/`, `refactor/`). Brain local `_brain/` (pattern Karpathy, gitignored).

---

## Architecture de l'équipe (Deep Agents / LangGraph)

### Rôles et modèles (respect plafond 3 modèles Ollama Cloud Pro)

| Rôle | Modèle | Permissions | Responsabilité |
|---|---|---|---|
| LEAD | `ollama:glm-5.2:cloud` | edit + bash + task | orchestre, écrit le test rouge, valide jalons, commit |
| PO | `ollama:minimax-m3:cloud` | read-only | analyse profonde existant (anti-conflit/régression/doublon), produit plan d'implémentation |
| DEV | `ollama:glm-5.2:cloud` | edit + bash | implémente pour faire passer le test |
| QA | `ollama:gpt-oss:20b-cloud` | bash (read) | lance `make test`, rapporte JSON |
| REVIEWER | `ollama:gpt-oss:20b-cloud` | read-only | revue diff (réutilise commande `review-changes`) |

### Boucle par ticket (PO = garde-fou anti-régression)

1. LEAD lit ticket Jira → délègue au PO l'analyse de l'existant (fichiers, endpoints, patterns, risques de doublon)
2. PO rend rapport `chemin:ligne` + plan d'implémentation
3. LEAD écrit le **test rouge** (Playwright E2E ou pytest)
4. LEAD délègue au DEV l'implémentation (guidé par le rapport PO)
5. LEAD délègue au QA le lancement de la suite → test vert
6. LEAD délègue au REVIEWER la revue du diff
7. LEAD valide → commit + branche `feat/<slug>` → merge `dev` → met à jour brain + Jira

### Composants Deep Agents

- `TodoListMiddleware` : plan par ticket (statuts pending/in_progress/completed persistés)
- `checkpointer=SqliteSaver` : reprise exacte après crash/reboot
- `memory` → `_brain/AGENTS.md` : contexte brain chargé au boot
- `interrupt_on` : `git commit` / `git push` (validation humaine aux jalons uniquement)
- `FilesystemMiddleware` backend = repo RestoConnect (edit/read/glob/grep/execute)
- `execute` tool : lance `make test`, `git`, etc.
- Skills : réutilise les skills opencode (`prime`, `save`, `query`) au format Agent Skills standard

---

## Structure du repo (repère rapide)

```
backend/app/
├── api/endpoints/     — routes FastAPI (20 fichiers)
├── controllers/       — logique métier (21 fichiers)
├── services/          — logique applicative (28 fichiers, 1 service = 1 responsabilité)
├── schemas/           — modèles Pydantic
├── database/models/   — modèles SQLAlchemy (12 fichiers)
├── database/seed.py   — seed déterministe (14 users, 6 centres, 5 stocks, 5 véhicules, 2 inventaires)
├── enums/             — énums métier (12 fichiers)
└── core/config.py     — config (lit .env DATABASE_URL)

frontend/src/
├── app/               — pages Next.js 16 (app router)
├── components/         — composants (layout, ui, scan, table, modals...)
├── services/          — auth, center, equipment (fetch vers localhost:8000)
├── lib/api/            — couche API (fetch hooks)
├── hooks/              — useFetchData
├── routes.ts          — routes sidebar
└── types/              — types TS
```

Auth = cookie `token` httponly (pas de JWT). Login endpoint `POST /api/login` existe. Chaque endpoint lit `Cookie(token=...)`. **Aucun garde d'auth frontend** (ClientLayout ne redirige pas si non connecté).

Seed users connus : `superadmin@resto.com`/`1234` (SUPER_ADMIN), `admin@resto.com`/`1234`, `resp1@resto.com`/`1234` (CENTER_ADMIN), etc.

---

## Bugs/incohérences à corriger (Phase 2, bloquants)

1. `backend/app/services/generate_random_token_service.py:3` → `from pytest import Session` (devrait être `from sqlalchemy.orm import Session`)
2. `backend/app/main.py:54` → `DROP SCHEMA public CASCADE` à chaque boot (à conditionner via env var `RESET_DB_ON_BOOT`)
3. `~/.config/opencode/agents/explorer.md:4` → modèle `qwen3-coder:480b-cloud` retiré le 2026-07-15

---

## Phases d'exécution

### Phase 0 — Réparer la team dev existante (opencode)
- Corriger `~/.config/opencode/agents/explorer.md` : `qwen3-coder:480b-cloud` → `gpt-oss:20b-cloud`

### Phase 1 — Environnement
- Vérifier PostgreSQL installé + accessible (port 5432)
- Créer `.env` backend : `DATABASE_URL=postgresql://postgres:<password>@localhost:5432/restos_connect`
- Créer dossiers `backend/uploads/avatars/`
- `pip install -r backend/requirements.txt` (venv)
- `npm install` frontend
- Démarrer backend (`uvicorn app.main:app --reload`, port 8000) + frontend (`npm run dev`, port 3000)
- Vérifier `http://localhost:8000/` → `{"message": "Backend running"}`

### Phase 2 — Socle de test (prérequis TDD)
- Corriger les 3 bugs ci-dessus
- **Backend** : `pytest` + `httpx`/`TestClient`, `conftest.py` (DB `restos_connect_test`), fixtures réutilisant `seed.py`
- **Frontend E2E** : `@playwright/test` + `playwright.config.ts` (`webServer` lance backend+frontend), user seedé `superadmin@resto.com`/`1234`
- **Script** : `make test` (lance tout headless, sort rapport JSON)

### Phase 3 — Boucle TDD RCO-20 (garde d'auth)
- PO : analyse existant (`page.tsx` login, `ClientLayout.tsx`, endpoints auth, risques)
- Test rouge E2E : accès `/my_center` sans cookie → redirigé `/`
- Dev : middleware Next.js + redirect 401 + états Figma `00-2 LOGIN Error` / `00-3 LOGIN Warning`
- QA : `make test` vert
- Reviewer : revue diff
- Commit + branche `feat/rco-20-auth-guard` → merge `dev`
- Brain `/save` + Jira RCO-20 → Terminé

### Phase 4 — Orchestrateur Deep Agents
- `pip install deepagents` (+ `deepagents[quickjs]` pour dynamic subagents)
- Écrire `orchestrator.py` : `create_deep_agent` avec subagents `[po, dev, qa, reviewer]`, `TodoListMiddleware`, `checkpointer=SqliteSaver`, `memory` → `_brain/AGENTS.md`, `interrupt_on` sur commit/push
- Filesystem backend = repo RestoConnect ; `execute` pour `make test`
- **Valider intégration modèle** : `ChatOllama` avec `ollama:glm-5.2:cloud` (API native). Si tag `:cloud` non résolu → fallback `ChatOpenAI(base_url="http://localhost:11434/v1")` (endpoint OpenAI-compatible, identique à opencode)
- Test boucle autonome sur RCO-21 (droits par centre)

### Phase 5 — Suivi & crash/reboot
- **SqliteSaver** = reprise exacte après crash (kill process → restart → reprend ticket en cours)
- Brain `_brain/` : `hot.md`/`log.md`/ADR mis à jour par le LEAD à chaque ticket
- Jira : statuts "En cours"/"Terminé" au fil de l'eau
- Rapport Playwright JSON = source de vérité objective (commité)

---

## Risques identifiés

1. **Intégration `:cloud` via LangChain** (risque n°1) — fallback `ChatOpenAI` documenté ci-dessus
2. **`DROP SCHEMA` au boot** — détruit la DB à chaque redémarrage ; à isoler avant tout test
3. **Brain périmé** — dit « aucune page login » alors qu'elle existe ; à corriger en Phase 2
4. **Plafond 3 modèles** — respecté (glm-5.2, minimax-m3, gpt-oss-20b)
5. **Next.js 16 breaking changes** — `frontend/AGENTS.md` impose de lire `node_modules/next/dist/docs/` avant de coder

---

## Vérification

1. `make test` — 0 échec (backend pytest + frontend Playwright)
2. Boucle TDD autonome validée sur ≥1 ticket (RCO-20 puis RCO-21)
3. Reprise après crash testée (kill process → restart → reprend ticket en cours)
4. Brain `/save` final + Jira à jour