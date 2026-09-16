# Context — RestoConnect AI-team TDD Playwright

## Pourquoi

Mettre en place une équipe IA autonome qui poursuit le développement de RestoConnect en TDD (Playwright E2E + pytest backend), sans intervention humaine continue, avec reprise après crash et suivi structuré de progression. Le projet est en mécénat Aubay pour les Restos du Cœur ; le backlog Jira est en retard sur le code et Figma est en avance.

## Quoi

- Orchestrateur Deep Agents (LangGraph) pilotant une équipe (PO, dev, qa, reviewer) en boucle TDD par ticket Jira
- Socle de test bootstrapé de zéro (aucun test n'existe actuellement) : pytest backend + Playwright frontend E2E
- Recentrage RCO-20 sur le garde d'auth (la page login existe déjà, le vrai gap est l'absence de middleware/redirect 401)
- Gestion crash/reboot via checkpointer SqliteSaver (reprise exacte)
- Suivi de progression via brain `_brain/` + Jira statuts + rapports Playwright JSON
- Respect du système de branches : `feat/<slug>` → merge `dev` (convention existante `feat/`, `feature/`, `fix/`, `refactor/`)

## Sources

- Brain RestoConnect : `/Users/yohannravino/Factory/RestoConnect/_brain/wiki/hot.md`
- État d'avancement : `_brain/wiki/summaries/etat-avancement-2026-08-17.md`
- Backlog Jira : `_brain/wiki/moc/backlog-jira.md` (14 tickets RCO)
- Deep Agents docs : https://docs.langchain.com/oss/python/deepagents/overview
- Template tasks : `[[wiki/concepts/agent-tasks-templates]]`

## Périmètre

- IN : bootstrap socle tests (pytest + Playwright), correctif bug bloquant, orchestrateur Deep Agents, boucle TDD RCO-20 → RCO-21 → inventaires, suivi brain + Jira, gestion crash/reboot
- OUT : refonte UI Figma complète, nouveaux endpoints backend non prévus au backlog, déploiement prod