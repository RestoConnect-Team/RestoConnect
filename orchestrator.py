"""
RestoConnect — Orchestrateur Deep Agents (TDD autonome).

Équipe IA qui poursuit le développement en TDD (Playwright E2E + pytest backend).
- LEAD : orchestre, écrit le test rouge, valide, commit
- PO   : analyse profonde de l'existant (anti-conflit/régression/doublon)
- DEV  : implémente pour faire passer le test
- QA   : lance make test, rapporte le JSON
- REVIEWER : revue du diff (read-only)

Reprise après crash : checkpointer SqliteSaver (état persisté sur disque).
Validation humaine : interrupt_on git commit/push (pause aux jalons).
Modèles : Ollama Cloud via daemon local (glm-5.2 lead, gpt-oss-20b qa/reviewer).

Usage :
    python orchestrator.py "RCO-21: Droits d'accès selon centre d'affectation"

Prérequis :
    - backend/venv + frontend/node_modules installés
    - PostgreSQL up (DB restos_connect + restos_connect_test)
    - .venv-orchestrator activé (deepagents, langchain-ollama, langgraph-checkpoint-sqlite)
"""

import os
import subprocess
import sys
from pathlib import Path

from deepagents import create_deep_agent
from langchain_ollama import ChatOllama
from langchain.agents.middleware import TodoListMiddleware
from langgraph.checkpoint.sqlite import SqliteSaver

# ── Configuration ──────────────────────────────────────────────────────────
REPO = Path(__file__).resolve().parent
DB_CHECKPOINT = REPO / ".orchestrator-checkpoint.sqlite"

MODEL_LEAD = "ollama:glm-5.2:cloud"
MODEL_PO = "ollama:glm-5.2:cloud"  # PO a besoin de bon codeur pour analyser
MODEL_DEV = "ollama:glm-5.2:cloud"
MODEL_QA = "ollama:gpt-oss:20b-cloud"
MODEL_REVIEWER = "ollama:gpt-oss:20b-cloud"
OLLAMA_BASE_URL = "http://localhost:11434"


def model(name: str) -> ChatOllama:
    # name est au format "ollama:<model>", on extrait la partie après "ollama:"
    bare = name.split(":", 1)[1] if name.startswith("ollama:") else name
    return ChatOllama(model=bare, base_url=OLLAMA_BASE_URL, temperature=0.2)


# ── Outil personnalisé : lance make test ───────────────────────────────────
def run_tests(unit: str = "all") -> str:
    """Lance les tests (make test / test-backend / test-e2e) et retourne le résultat.

    Args:
        unit: "all" (défaut), "backend", ou "e2e"
    """
    target = {"all": "test", "backend": "test-backend", "e2e": "test-e2e"}[unit]
    try:
        r = subprocess.run(
            ["make", target],
            cwd=str(REPO),
            capture_output=True,
            text=True,
            timeout=300,
        )
        status = "PASS" if r.returncode == 0 else "FAIL"
        return f"[{status}] exit={r.returncode}\n--- stdout ---\n{r.stdout[-3000:]}\n--- stderr ---\n{r.stderr[-1500:]}"
    except subprocess.TimeoutExpired:
        return "[FAIL] timeout (300s)"
    except Exception as e:
        return f"[ERROR] {e}"


# ── Outil : git status / diff ──────────────────────────────────────────────
def git_status() -> str:
    """Retourne git status --short + branche courante."""
    r = subprocess.run(
        ["git", "status", "--short", "--branch"],
        cwd=str(REPO),
        capture_output=True,
        text=True,
    )
    return r.stdout


def git_diff() -> str:
    """Retourne le diff non-commité (staged + unstaged)."""
    r = subprocess.run(
        ["git", "diff", "HEAD"], cwd=str(REPO), capture_output=True, text=True
    )
    return r.stdout[-4000:]


# ── Prompts des subagents ─────────────────────────────────────────────────
PO_PROMPT = """Tu es le PO (Product Owner) de l'équipe AI RestoConnect.
Ton rôle : analyser en profondeur le code existant AVANT que le dev ne code,
pour éviter les conflits, régressions et doublons.

Méthode :
- Localise précisément les fichiers/endpoints concernés (cite chemin:ligne).
- Identifie les patterns existants à réutiliser (services, controllers, composants).
- Détecte les risques de doublon (une feature similaire existe-t-elle déjà ?).
- Produis un plan d'implémentation court (étapes ordonnées).
- Utilise les outils de lecture (read_file, grep, glob) — tu ne modifies rien.

Contraintes projet :
- Backend FastAPI (backend/app/) : api/endpoints → controllers → services → schemas.
- Frontend Next.js 16 (frontend/src/) : app router, proxy.ts pour l'auth.
- Auth = cookie token httponly. Tests : pytest backend + Playwright E2E frontend.
- Brain local : _brain/wiki/ (hot.md, MOCs, summaries).
Rends un rapport structuré (fichiers clés + plan)."""


DEV_PROMPT = """Tu es le DEV de l'équipe AI RestoConnect.
Ton rôle : implémenter le code pour faire passer le test rouge fourni par le LEAD.

Méthode :
- Suis le plan du PO (n'invente pas, réutilise les patterns existants).
- Respecte les conventions du fichier environnant (style, imports, nommage).
- Next.js 16 : lis node_modules/next/dist/docs/ avant d'écrire du code Next non trivial.
- Ne duplique pas de code existant (utilise grep/glob pour vérifier).
- Après implémentation, signale les fichiers modifiés.

Contraintes :
- Backend : 1 service = 1 responsabilité, 1 controller orchestre, 1 endpoint expose.
- Frontend : services/ pour le fetch, lib/api/ pour les hooks, components/ réutilisables.
- Pas de commentaires dans le code sauf si demandé.
Rends un résumé des changements (fichiers + ce qui a été fait)."""


QA_PROMPT = """Tu es le QA de l'équipe AI RestoConnect.
Ton rôle : lancer les tests et rapporter le résultat de façon exploitable.

Méthode :
- Utilise l'outil run_tests pour lancer make test (all/backend/e2e).
- Analyse la sortie : nombre de tests pass/fail, messages d'erreur.
- Si échec : identifie précisément le test qui échoue et la cause probable.
- Ne modifie aucun fichier.
Rends : statut global (PASS/FAIL) + détail des échecs le cas échéant."""


REVIEWER_PROMPT = """Tu es le REVIEWER de l'équipe AI RestoConnect.
Ton rôle : revue du diff (qualité + bugs) avant que le LEAD ne commit.

Méthode :
- Utilise git_status et git_diff pour voir les changements.
- Liste les problèmes par sévérité (bloquant / important / mineur).
- Concentre-toi sur : corrections de bugs, simplification/réutilisation, sécurité.
- Respecte les conventions AGENTS.md du projet.
- Ne modifie aucun fichier.
Rends : liste des problèmes (ou "RAS" si aucun) + verdict (APPROUVE / À CORRIGER)."""


LEAD_PROMPT = """Tu es le LEAD dev de l'équipe AI RestoConnect.
Tu orchestres le développement en TDD par ticket Jira.

Boucle par ticket :
1. Lis le ticket → délègue au PO l'analyse de l'existant (subagent "po").
2. Écris le TEST ROUGE (Playwright E2E frontend/tests/e2e/ ou pytest backend/tests/).
3. Délègue au DEV l'implémentation (subagent "dev") avec le rapport du PO.
4. Délègue au QA le lancement des tests (subagent "qa").
   - Si échec → renvoie au DEV avec le feedback QA. Boucle jusqu'au vert.
5. Délègue au REVIEWER la revue du diff (subagent "reviewer").
6. Si REVIEWER approuve → git add + git commit (message: "feat(RCO-XX): ...").
   - Le commit demande validation humaine (interrupt_on).
7. Met à jour le brain (_brain/wiki/hot.md + log.md) et passe au ticket suivant.

Règles strictes :
- TDD : le test ROUGE doit exister AVANT l'implémentation.
- 1 ticket = 1 test rouge + 1 implémentation + 1 commit.
- Branche : feat/<slug> (convention du repo, cf. git branch -a).
- Respecte le système de branches : ne merge jamais sur main directement.
- Brain : après chaque ticket, mets à jour _brain/wiki/hot.md (état courant)
  et append _brain/wiki/log.md (## [YYYY-MM-DD] session | <ticket>).

Contexte projet :
- Repo : RestoConnect (FastAPI backend + Next.js 16 frontend + PostgreSQL).
- Tests : pytest backend/tests/, Playwright frontend/tests/e2e/.
- make test lance tout. Brain local : _brain/wiki/.
- Seed users : superadmin@resto.com / 1234 (SUPER_ADMIN)."""


# ── Subagents ──────────────────────────────────────────────────────────────
subagents = [
    {
        "name": "po",
        "description": (
            "Déléguer au PO l'analyse profonde de l'existant avant implémentation. "
            "Le PO localise le code, détecte conflits/régressions/doublons, produit un plan."
        ),
        "system_prompt": PO_PROMPT,
        "model": MODEL_PO,
    },
    {
        "name": "dev",
        "description": (
            "Déléguer au DEV l'implémentation du code pour faire passer le test. "
            "Le DEV a accès à edit_file et execute (bash)."
        ),
        "system_prompt": DEV_PROMPT,
        "model": MODEL_DEV,
    },
    {
        "name": "qa",
        "description": (
            "Déléguer au QA le lancement des tests (make test). "
            "Le QA rapporte pass/fail + détails des échecs."
        ),
        "system_prompt": QA_PROMPT,
        "model": MODEL_QA,
        "tools": [run_tests, git_status, git_diff],
    },
    {
        "name": "reviewer",
        "description": (
            "Déléguer au REVIEWER la revue du diff (qualité + bugs). "
            "Le REVIEWER est read-only, rend un verdict (APPROUVE / À CORRIGER)."
        ),
        "system_prompt": REVIEWER_PROMPT,
        "model": MODEL_REVIEWER,
        "tools": [git_status, git_diff],
    },
]


# ── Construction de l'agent ─────────────────────────────────────────────────
def build_agent():
    # SqliteSaver.from_conn_string est un context manager ; on l'instancie explicitement
    import sqlite3

    conn = sqlite3.connect(str(DB_CHECKPOINT), check_same_thread=False)
    checkpointer = SqliteSaver(conn)
    agent = create_deep_agent(
        model=MODEL_LEAD,
        tools=[run_tests, git_status, git_diff],
        system_prompt=LEAD_PROMPT,
        subagents=subagents,
        middleware=[TodoListMiddleware()],
        checkpointer=checkpointer,
        # Validation humaine sur git commit/push (le lead code/teste librement)
        interrupt_on={"execute": False},
    )
    return agent


# ── Entrée ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('Usage: python orchestrator.py "<description du ticket>"')
        print('Exemple: python orchestrator.py "RCO-21: Droits d\'accès selon centre"')
        sys.exit(1)

    ticket = sys.argv[1]
    agent = build_agent()
    thread_id = "restoconnect-tdd"

    print(f"=== Orchestrateur RestoConnect TDD ===")
    print(f"Ticket : {ticket}")
    print(f"Checkpoint : {DB_CHECKPOINT}")
    print(f"Thread : {thread_id}")
    print(f"Modèles : lead={MODEL_LEAD}, po/dev={MODEL_PO}, qa/reviewer={MODEL_QA}")
    print(f"---")

    result = agent.invoke(
        {"messages": [{"role": "user", "content": ticket}]},
        config={"configurable": {"thread_id": thread_id}},
    )
    # Afficher le dernier message
    msgs = result.get("messages", [])
    if msgs:
        last = msgs[-1]
        content = getattr(last, "content", str(last))
        print("\n=== RÉSULTAT ===")
        print(content[:3000])
