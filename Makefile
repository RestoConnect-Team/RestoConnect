# RestoConnect — make test
# Lance les tests backend (pytest) + frontend E2E (Playwright) headless.
# Prérequis : backend/venv activé, frontend/node_modules installé, PostgreSQL up.

.PHONY: test test-backend test-e2e install

install:
	cd backend && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install
	cd frontend && npx playwright install chromium

test: test-backend test-e2e

test-backend:
	cd backend && . venv/bin/activate && python -m pytest tests/ -v --tb=short

test-e2e:
	cd frontend && npx playwright test --reporter=list

test-e2e-headed:
	cd frontend && npx playwright test --headed