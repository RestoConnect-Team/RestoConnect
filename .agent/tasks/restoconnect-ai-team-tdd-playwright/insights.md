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
- Plafond 3 modèles Ollama Cloud Pro — respecté (glm-5.2, minimax-m3, gpt-oss-20b)