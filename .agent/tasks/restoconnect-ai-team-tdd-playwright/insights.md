# Insights — RestoConnect AI-team TDD Playwright

_Mis à jour au fil des sessions. Bullets uniquement, pas de blocs code._

## Décisions structurantes (actées 2026-08-17)

- D1 : Orchestrateur = Deep Agents (LangGraph), pas opencode natif — autonomie + reprise crash + suivi structuré
- D2 : Checkpointer = SqliteSaver (persistant, survit crash/reboot), pas MemorySaver
- D3 : Validation humaine = `interrupt_on` sur git commit/push seulement (le lead code/teste librement, validation aux jalons)
- D4 : Modèle lead = `glm-5.2:cloud` (orchestrateur/codeur), PO = `minimax-m3:cloud` (1M ctx, read-only), qa/reviewer = `gpt-oss:20b-cloud`
- D5 : RCO-20 recentré sur garde d'auth — la page login existe déjà (`frontend/src/app/page.tsx`), le vrai gap est l'absence de middleware/redirect 401
- D6 : Branches — respect convention existante `feat/<slug>` → merge `dev` (branche courante = dev)

## Bugs/incohérences détectés (inspection profonde 2026-08-17)

- `~/.config/opencode/agents/explorer.md:4` pointe vers `qwen3-coder:480b-cloud` RETIRÉ du service le 2026-07-15 (cf. `opencode.jsonc:45`) → agent explorer mort
- `backend/app/services/generate_random_token_service.py:3` fait `from pytest import Session` au lieu de `from sqlalchemy.orm import Session` → bug bloquant pour tests/autonomie
- `backend/app/main.py:54` fait `DROP SCHEMA public CASCADE` à chaque boot → DB volatile, à conditionner
- Brain `_brain/wiki/hot.md` dit « ❌ Aucune page login » alors que `frontend/src/app/page.tsx` EST un formulaire login complet → brain périmé sur ce point

## Risques

- Intégration `:cloud` via LangChain `ChatOllama` (API native `/api/chat`) vs opencode (endpoint OpenAI-compatible `/v1`) — même daemon, devrait marcher ; fallback `ChatOpenAI(base_url=localhost:11434/v1)` si échec

## Sessions 2026-08-17 (implémentation)

- Modèle `ollama:glm-5.2:cloud` validé via LangChain `ChatOllama(model='glm-5.2:cloud', base_url='http://localhost:11434')` — le tag `:cloud` est résolu par le daemon, AUCUN fallback nécessaire. Risque n°1 écarté.
- Subagents Deep Agents : le champ `model` doit être au format `provider:model` complet (ex `ollama:glm-5.2:cloud`), pas juste `glm-5.2:cloud` (sinon `init_chat_model` ne déduit pas le provider — ValueError). Fichier impacté : `orchestrator.py:24-28`.
- `SqliteSaver.from_conn_string()` retourne un context manager, pas une instance. Passer `SqliteSaver(sqlite3.connect(path, check_same_thread=False))` directement. Fichier impacté : `orchestrator.py:228-244`.
- CORS backend : le frontend sur `127.0.0.1:3000` était bloqué (CORS autorisait seulement `localhost`). Ajouté `127.0.0.1` au `allow_origins`. Fichier impacté : `backend/app/main.py:79-84`.
- Cookies cross-origin : le login frontend → backend `localhost:8000` depuis `127.0.0.1:3000` ne posait PAS le cookie (SameSite=Lax cross-origin POST). Solution : faire tourner le frontend sur `localhost:3000` (même host que le backend). Fichier impacté : `frontend/playwright.config.ts:23`.
- Bug sécurité backend : `get_user_profile(token=None)` matchait `User.token == None` (users non logués) → 200 au lieu de 401. Fixé : 401 explicite si `not token`. Fichier impacté : `backend/app/controllers/get_user_controller.py:10-11`.
- Next.js 16 : `middleware.ts` renommé en `proxy.ts` (file convention Proxy). Garde d'auth via `proxy.ts` + `export const config = { matcher }`. Fichier impacté : `frontend/src/proxy.ts`.