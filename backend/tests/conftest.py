import os
import sys
from pathlib import Path

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine.url import make_url

# S'assurer que le package app est importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.config import DATABASE_URL
from app.database.connection import Base
from app.database.seed import seed
from app.enums import UserStatus  # noqa: F401  (force import des enums pour les modèles)
from app.database import models  # noqa: F401  (force import de tous les modèles)

# URL de la DB de test : on remplace le nom de la DB par restos_connect_test
TEST_DATABASE_URL = make_url(DATABASE_URL).set(database="restos_connect_test")

# Engine de test (utilise la même URL que la prod mais sur la DB _test)
test_engine = create_engine(TEST_DATABASE_URL)
TestSessionLocal = sessionmaker(bind=test_engine)


def _reset_test_db():
    """Recrée le schéma + seed sur la DB de test (idempotent)."""
    with test_engine.connect() as conn:
        conn.execute(text("DROP SCHEMA IF EXISTS public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))
        conn.commit()
    Base.metadata.create_all(bind=test_engine)
    # Seed via une session sur l'engine de test
    from app.database.seed import seed as _seed

    # seed() utilise SessionLocal (lié à l'engine de prod) → on patch temporairement
    import app.database.seed as seed_mod

    _orig = seed_mod.SessionLocal
    seed_mod.SessionLocal = TestSessionLocal
    try:
        _seed()
    finally:
        seed_mod.SessionLocal = _orig


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Une fois par session de test : reset + seed la DB de test."""
    _reset_test_db()
    yield
    # pas de teardown (on garde la DB pour debug)


@pytest.fixture()
def db():
    """Session DB par test (rollback implicite via le yield/close)."""
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client():
    """Client FastAPI TestClient avec DB de test injectée."""
    from fastapi.testclient import TestClient
    from app.main import app
    from app.database.connection import get_db

    def override_get_db():
        session = TestSessionLocal()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
