# Mode opératoire — Équipe TDD RestoConnect avec opencode (skills + tools)

> Remplace l'approche Deep Agents (abandonnée — voir D7 dans `insights.md`).
> L'agent opencode principal **EST** l'équipe : il joue tous les rôles (PO, dev, QA, reviewer) en séquence, en TDD direct.

## Pourquoi pas Deep Agents

| Deep Agents | opencode natif |
|---|---|
| 0 feature en 20 min (log vide) | RCO-20 + RCO-21 + RCO-32 livrés en direct |
| Multi-tours PO→dev→qa→reviewer = latence | L'agent fait tout en 1 session, sans délégation |
| Tokens consommés pour orchestrer, pas pour coder | Tokens utilisés pour coder directement |
| Venv Python + dépendances externes | Zéro dépendance, intégré à la config existante |
| Reprise crash = checkpointer SQLite | Reprise = `/prime` (lit `hot.md`) + `git status` |

## Rôles joués par l'agent (en séquence, pas en parallèle)

| Rôle | Quand | Tools/skills utilisés |
|---|---|---|
| **PO** | Début de ticket | `read`, `grep`, `glob` (analyse existant), `task` subagent `explore` si recherche large |
| **Dev (test rouge)** | Après PO | `write` (crée le test E2E/pytest qui doit échouer) |
| **Dev (implé)** | Après test rouge | `edit` (implémente le code minimal pour faire passer le test) |
| **QA** | Après implé | `bash` (lance `make test` ou `npx playwright test`) |
| **Reviewer** | Après QA vert | `bash` (`git diff`), `read` (revue visuelle) |
| **Committer** | Après review OK | `bash` (`git add` + `git commit`), branche `feat/<slug>` |
| **Brain keeper** | Fin de session | skill `save` (met à jour `hot.md` + `log.md`) |

## Séquence type pour 1 ticket (ex. RCO-XX)

```
┌─ 1. PO : analyser l'existant ─────────────────────────────┐
│  read backend/app/...   (endpoints, services concernés)  │
│  read frontend/src/...   (composants, pages concernées)   │
│  grep "pattern"         (vérifier doublons/régression)    │
│  → conclusion : ce qui existe, ce qui manque, les risques  │
└──────────────────────────────────────────────────────────┘
          ↓
┌─ 2. Dev : écrire le test ROUGE ──────────────────────────┐
│  write frontend/tests/e2e/rco-XX-<slug>.spec.ts           │
│  (ou backend/tests/test_XX.py pour backend)               │
│  Le test doit ÉCHOUE maintenant (feature non implémentée) │
└──────────────────────────────────────────────────────────┘
          ↓
┌─ 3. QA : valider que le test est rouge ──────────────────┐
│  bash : npx playwright test rco-XX-<slug>.spec.ts          │
│  → doit afficher "failed" (c'est le but)                  │
└──────────────────────────────────────────────────────────┘
          ↓
┌─ 4. Dev : implémenter le code minimal ──────────────────┐
│  edit backend/app/...   (backend si besoin)              │
│  edit frontend/src/...   (frontend si besoin)            │
│  Respecter les conventions du fichier environnant         │
│  Pas de commentaires sauf si demandé                       │
└──────────────────────────────────────────────────────────┘
          ↓
┌─ 5. QA : valider que le test passe (VERT) ───────────────┐
│  bash : npx playwright test rco-XX-<slug>.spec.ts          │
│  bash : make test   (vérifier non-régression globale)     │
│  → doit afficher "passed"                                 │
└──────────────────────────────────────────────────────────┘
          ↓
┌─ 6. Reviewer : revue du diff ────────────────────────────┐
│  bash : git diff   (lire le diff)                         │
│  Vérifier : pas de doublon, pas de régression, sécurité   │
│  Si problème → retour étape 4                             │
└──────────────────────────────────────────────────────────┘
          ↓
┌─ 7. Committer : versionner ─────────────────────────────┐
│  bash : git checkout -b feat/rco-XX-<slug>                │
│  bash : git add <fichiers> && git commit -m "feat(RCO-XX)"│
│  bash : git checkout dev && git merge feat/rco-XX-<slug> │
└──────────────────────────────────────────────────────────┘
          ↓
┌─ 8. Brain keeper : documenter ───────────────────────────┐
│  skill save   (met à jour hot.md + append log.md)        │
│  edit .agent/tasks/.../todos.md   (cocher le ticket)     │
└──────────────────────────────────────────────────────────┘
```

## Tools et skills à combiner (référence rapide)

### Tools opencode (natifs)

| Tool | Usage | Exemple |
|---|---|---|
| `read` | Lire un fichier | `read backend/app/main.py` |
| `grep` | Chercher un pattern | `grep "def login" backend/app/` |
| `glob` | Trouver des fichiers | `glob **/*.spec.ts` |
| `edit` | Modifier un fichier existant | `edit backend/app/main.py` |
| `write` | Créer un nouveau fichier | `write frontend/tests/e2e/rco-XX.spec.ts` |
| `bash` | Lancer une commande | `bash: npx playwright test` |
| `task` | Déléguer à un subagent | `task explore "trouve tous les endpoints admin"` |
| `todowrite` | Suivre les tâches | `todowrite [...]` |

### Subagents (via `task`)

| Subagent | Modèle | Rôle | Permission |
|---|---|---|---|
| `explore` | gpt-oss:20b-cloud | Recherche code (lecture seule, économique) | read + grep + glob |
| `researcher` | gpt-oss:20b-cloud | Veille web + doc | read + webfetch + websearch |
| `explorer` | gpt-oss:20b-cloud | Exploration large (lecture seule) | read + grep + glob |

> **Quand déléguer** : uniquement pour la recherche large (ex. "trouve tous les endpoints qui ne vérifient pas le rôle"). Pour l'implémentation, ne délègue pas — code en direct.

### Skills (via `skill`)

| Skill | Quand | Action |
|---|---|---|
| `prime` | Début de session | Lit `hot.md` + charge le contexte minimal |
| `save` | Fin de session productive | Met à jour `hot.md` + append `log.md` + crée ADR si décision |
| `query` | Question cross-thèmes | Interroge le brain avec citations |
| `ingest` | Nouvelle source brute | Capitalise dans `_brain/raw/` |
| `lint` | ~1 fois/mois | Audit santé du brain |

### Playwright (via opencode MCP)

| Tool | Usage |
|---|---|
| `playwright_browser_navigate` | Aller sur une URL |
| `playwright_browser_snapshot` | Capturer l'accessibility tree |
| `playwright_browser_click` | Cliquer un élément |
| `playwright_browser_type` | Remplir un champ |
| `playwright_browser_take_screenshot` | Capture visuelle |

> **Quand utiliser Playwright MCP** : pour déboguer un test E2E qui échoue (naviguer manuellement, voir ce qui se passe). Pour les tests automatisés, utiliser `npx playwright test` via `bash`.

## Prérequis (vérifier au début de chaque session)

```bash
# 1. Serveurs tournent ?
curl -s -o /dev/null -w "backend=%{http_code} " http://localhost:8000/
curl -s -o /dev/null -w "frontend=%{http_code}\n" http://localhost:3000/

# 2. Si non, démarrer :
# Backend :
cd backend && . venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 &

# Frontend :
cd frontend
npx next dev --webpack --port 3000 &

# 3. PostgreSQL ?
pg_isready

# 4. Tests verts au départ ?
make test
```

## Seed users pour les tests (déterministe)

| Email | Mot de passe | Rôle (status) | Centre |
|---|---|---|---|
| superadmin@resto.com | 1234 | Super administrateur | Centre Lyon Part-Dieu |
| admin@resto.com | 1234 | Administrateur | Centre Lyon Part-Dieu |
| resp1@resto.com | 1234 | Responsable de centre | Centre Lyon Part-Dieu |
| resp2@resto.com | 1234 | Responsable de centre | Centre Paris Bastille |

> Voir `backend/app/database/seed.py` pour la liste complète (14 users, 6 centres).

## Conventions à respecter

- **Branche** : `feat/<slug>` (ex. `feat/rco-21-rights-by-center`) → merge vers `dev`
- **Commit** : `feat(RCO-XX): <description courte>`
- **Test E2E** : `frontend/tests/e2e/<slug>.spec.ts` (un fichier par ticket)
- **Test backend** : `backend/tests/test_<slug>.py`
- **Code** : pas de commentaires sauf si demandé
- **Next.js 16** : lire `node_modules/next/dist/docs/` avant de coder du Next non trivial (breaking changes)
- **Brain** : `hot.md` < 2k tokens, `log.md` append-only, ADR si décision structurante

## Tickets livrés (état 2026-08-17)

| Ticket | Statut | Tests |
|---|---|---|
| RCO-20 (Login/garde d'auth) | ✅ Terminé | 2 E2E (`auth-guard.spec.ts`) + 3 E2E (`smoke.spec.ts`) |
| RCO-21 (Droits par centre) | ✅ Terminé | 2 E2E (`rco-21-rights.spec.ts`) |
| RCO-32 (Fermer navbar) | ✅ Terminé | 1 E2E (`navbar-close.spec.ts`) |

## Tickets restants (ordre suggéré)

| Ticket | Titre | Complexité | Prérequis |
|---|---|---|---|
| RCO-27 | Recherche matériel par référence | Faible (backend OK, UI à finir) | RCO-21 |
| RCO-22 | Réaliser un inventaire | Moyenne (scan QR + statuts) | RCO-21 |
| RCO-23 | Gestion doublons inventaire | Moyenne | RCO-22 |
| RCO-28 | Pause/reprise inventaire | Faible | RCO-22 |
| RCO-29 | Valider manuellement inventaire incomplet | Faible | RCO-22 |
| RCO-30 | Recommencer un inventaire | Faible | RCO-22 |
| RCO-31 | Suivre stationnement véhicules | Moyenne | RCO-21 |

## Reprendre après un crash/interruption

1. **`/prime`** (skill) → lit `hot.md`, sait où on en est.
2. `git status` → voir les changements non commités.
3. `git log --oneline -5` → voir le dernier commit.
4. `make test` → vérifier que tout est vert.
5. Reprendre au ticket suivant dans `todos.md`.

> C'est le équivalent du checkpointer SqliteSaver, mais avec **zéro dépendance** — l'état est dans git + le brain.