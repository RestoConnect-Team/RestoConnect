# Insights — RestoConnect AI-team TDD Playwright

_Mis à jour au fil des sessions. Bullets uniquement, pas de blocs code._

## Décisions structurantes (actées 2026-08-17)

- D1 : Orchestrateur = Deep Agents (LangGraph), pas opencode natif — autonomie + reprise crash + suivi structuré
- D2 : Checkpointer = SqliteSaver (persistant, survit crash/reboot), pas MemorySaver
- D3 : Validation humaine = `interrupt_on` sur git commit/push seulement (le lead code/teste librement, validation aux jalons)
- D4 : Modèle lead = `glm-5.2:cloud` (orchestrateur/codeur), PO = `minimax-m3:cloud` (1M ctx, read-only), qa/reviewer = `gpt-oss:20b-cloud`
- D5 : RCO-20 recentré sur garde d'auth — la page login existe déjà (`frontend/src/app/page.tsx`), le vrai gap est l'absence de middleware/redirect 401
- D6 : Branches — respect convention existante `feat/<slug>` → merge `dev` (branche courante = dev)
- D7 (révision 2026-08-17) : **Deep Agents abandonné** — l'orchestrateur a produit 0 feature en ~20 min (log vide), tandis qu'opencode natif (moi) a livré RCO-20 + socle en direct. L'orchestrateur ajoute latence + tokens pour déléguer ce que l'agent principal fait déjà. Retour à l'approche simple : l'agent opencode principal EST l'équipe, TDD en direct, subagents explore/researcher pour chercher, skill save pour le brain.

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

## Session 2026-08-17 (reprise post-RCO-32) — Phase 0 socle backend

Analyse approfondie du code réel (vs brain) : 6 bugs backend non documentés découverts, bloquants pour l'épic inventaire. Le brain était périmé (RCO-27 "à finir" alors qu'il est déjà implémenté, RCO-22 "backend partiel" alors qu'il était cassé).

### Bugs corrigés (Phase 0, 2 branches mergées sur dev)

- **Fix #1** : `OneInventoryFromInventorys` (schéma) vs `get_list_inventories_controller` — mismatch de champs (`id`/`inventory_start_date` vs `inventory_id`/`start_date`) → Pydantic ValidationError. Aligné le controller sur le schéma. Branche `fix/inventory-backend-socle`.
- **Fix #2** : `create_inventory_route` était en GET (anti-pattern REST) → passé en POST. Branche `fix/inventory-backend-socle`.
- **Fix #3** : `create_inventory_controller` n'appelait jamais `create_inventory_service` (le service était mort) → câblé. Branche `fix/inventory-backend-socle`.
- **Fix #4** : `is_user_center_admin_service` retournait `true` uniquement pour `CENTER_ADMIN` → SUPER_ADMIN/ADMIN/STOCK_ADMIN refusés (403). Accepte désormais les 4 rôles admin. Branche `fix/auth-center-scope`.
- **Fix #5** : `get_list_stocks_inventory_route` n'avait aucune auth → ajouté cookie token + 401. Branche `fix/auth-center-scope`.
- **Fix #6** : `get_stock_by_reference` + `update_stock_status` ne filtraient pas par centre → un user du centre 1 pouvait lire/modifier le stock du centre 2 (violation RCO-21). Ajouté filtre (403 cross-centre, entrepôt autorisé). Branche `fix/auth-center-scope`.

### Bugs hors scope (documentés, à corriger avec accord)

- `delete_stock_route` / `delete_vehicule_route` / `delete_center_route` : aucune auth (suppression non authentifiée possible). **3 tests d'intégration documentent ce comportement** (`test_delete_*_without_token_bug`).
- `delete_vehicule_controller` : appelle `delete_vehicule_service` deux fois (double suppression).
- `get_stock_detail` : pas de filtre par centre (même famille que Fix #6).
- `routes.ts` : pointe vers `/inventaires` et `/notifications` qui n'existent pas (404 sidebar).
- Test E2E `navbar-close.spec.ts:45` (clic overlay) échoue : le lien `/scan` intercepte le pointer events. Bug UI/test préexistant, hors Phase 0.

### Session 2026-08-17 (tests d'intégration backend) — branche test/integration-backend-coverage

Ajout de 29 tests d'intégration backend par domaine (44/44 pytest verts au total). 7 bugs corrigés au passage, 3 bugs exposés (documentés).

#### Bugs corrigés

- `deconnect_user_controller` : 401 si pas de token (sinon `User.token == None` matchait un user non logué et le "déconnectait").
- `get_list_centers_controller` / `get_my_center_infos_controller` / `get_list_vehicules_controller` / `get_list_stocks_controller` : 401 si pas de token (même bug `User.token == None` — ces 4 controllers laissaient passer les requêtes sans auth).
- `get_warehouse_infos_controller` : `AttributeError` (`stock.id` sur une liste) + kwargs mismatch (`warehouse_schedule` vs `center_schedule`, `stocks_list` single vs `List`). L'endpoint warehouse était complètement cassé.
- `get_qr_code_route` : double prefix `/qr_code/qr_code/{reference}` → corrigé en `/qr_code/{reference}`.
- `requirements.txt` : ajout `Pillow` (requis par `qrcode` pour générer du PNG, sinon `ModuleNotFoundError: No module named 'PIL'`) + `httpx` (utilisé par TestClient). Conversion UTF-16 → UTF-8.

#### Bugs exposés (tests documentent le comportement actuel, à corriger dans un fix dédié)

- `DELETE /api/center/{id}` sans auth → 200 (`test_delete_center_without_token_bug`).
- `DELETE /api/vehicule/{id}` sans auth → 200 (`test_delete_vehicule_without_token_bug`).
- `DELETE /api/stock/{id}` sans auth → 200 (`test_delete_stock_without_token_bug`).

#### Couverture par domaine

| Domaine | Fichier | Tests | Couverture |
|---|---|---|---|
| Auth | test_integration_auth.py | 4 | deconnect, profil complet, login email vide |
| Centres | test_integration_centers.py | 9 | list, my_center, detail, warehouse, delete (bug), not_found, is_user_center |
| Véhicules | test_integration_vehicules.py | 5 | list, detail (VehiculeDetailResponse), delete (bug), not_found |
| Stocks | test_integration_stocks.py | 9 | list, scan, detail, status, delete (bug), not_found, cross-center |
| QR | test_integration_qr.py | 2 | génération PNG, réf inconnue |

### Tests

- Backend : 6 pytest (smoke) → 15 pytest (smoke + inventory + auth_scope). 15/15 verts.
- E2E : 8/9 (inchangé vs baseline, le 9e échec est le bug overlay préexistant).

### Décision

D8 : Le brain doit être vérifié contre le code réel avant chaque ticket (le brain peut être périmé). Ne pas se fier au statut "backend OK" du brain sans lire le controller + le schéma.