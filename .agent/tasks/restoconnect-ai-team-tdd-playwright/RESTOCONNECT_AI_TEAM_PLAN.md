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

## Architecture de l'équipe (opencode natif, pas Deep Agents)

> **D7 (2026-08-17)** : Deep Agents abandonné — 0 feature en 20 min, latence + tokens inutiles.
> L'agent opencode principal EST l'équipe : il joue tous les rôles en séquence (PO → dev test rouge → dev implé → QA → reviewer → committer → brain keeper).
> Voir `workflow-tdd-opencode.md` pour le mode opératoire détaillé.

### Rôles joués en séquence (pas en parallèle)

| Rôle | Tools utilisés | Quand |
|---|---|---|
| PO | `read`, `grep`, `glob`, `task explore` | Début : analyse existant (anti-doublon/régression) |
| Dev (rouge) | `write` | Écrit le test qui doit échouer |
| Dev (implé) | `edit` | Implémente le code minimal |
| QA | `bash` (`make test`) | Valide test vert + non-régression |
| Reviewer | `bash` (`git diff`), `read` | Revue du diff |
| Committer | `bash` (`git add`/`commit`) | Versionne sur branche `feat/<slug>` → merge `dev` |
| Brain keeper | `skill save` | Met à jour `hot.md` + `log.md` |

### Subagents (délégation limitée à la recherche)

| Subagent | Usage |
|---|---|
| `explore` / `explorer` | Recherche code large (lecture seule, économique) — ex. "trouve tous les endpoints admin" |
| `researcher` | Veille web/doc (lecture seule) — ex. "doc Next.js 16 proxy.ts" |

> Ne JAMAIS déléguer l'implémentation. Le dev code en direct.

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

### Phase 4 — ~~Orchestrateur Deep Agents~~ → ABANDONNÉ (D7)
- Deep Agents construit et validé techniquement (modèles Ollama OK, SqliteSaver OK) MAIS 0 feature produite en 20 min.
- Nettoyage : `orchestrator.py`, `.venv-orchestrator/`, `.orchestrator-checkpoint.sqlite*` supprimés.
- Remplacement : `workflow-tdd-opencode.md` (mode opératoire opencode natif).

### Phase 5 — Suivi & crash/reboot (opencode natif)
- Brain `_brain/` : `hot.md`/`log.md`/ADR mis à jour à chaque ticket (skill `save`).
- Reprise après crash = `/prime` (lit `hot.md`) + `git status` + `make test`.
- Rapport Playwright JSON (playwright.config.ts reporter json).

---

## Risques identifiés

1. **~~Intégration `:cloud` via LangChain~~** — écarté (Deep Agents abandonné)
2. **`DROP SCHEMA` au boot** — corrigé (conditionné à `RESET_DB_ON_BOOT`, défaut false)
3. **Brain périmé** — corrigé (`hot.md` réécrit 2026-08-17, RCO-20/21/32 marqués Terminé)
4. **Next.js 16 breaking changes** — `frontend/AGENTS.md` impose de lire `node_modules/next/dist/docs/` (proxy.ts au lieu de middleware.ts)

---

## Vérification

1. `make test` — 0 échec (6 pytest + 9 Playwright E2E)
2. Boucle TDD validée sur RCO-20 + RCO-21 + RCO-32 (rouge → vert)
3. Reprise après interruption = `/prime` + `git status` + `make test`
4. Brain `/save` final