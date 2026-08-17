"""Smoke tests backend — valident que l'app démarre et les endpoints clés répondent."""

from app.database.models import User


def test_db_seeded(db):
    """La DB de test est seedée avec les users attendus."""
    users = db.query(User).all()
    assert len(users) >= 14, f"attendu ≥14 users seedés, obtenu {len(users)}"
    superadmin = db.query(User).filter_by(email="superadmin@resto.com").first()
    assert superadmin is not None
    assert superadmin.status.value == "Super administrateur"


def test_health(client):
    """GET / répond Backend running."""
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["message"] == "Backend running"


def test_login_success(client):
    """POST /api/login avec bons identifiants → 200 + cookie token."""
    r = client.post(
        "/api/login",
        json={"email": "superadmin@resto.com", "password": "1234"},
    )
    assert r.status_code == 200
    assert r.json()["message"] == "Login successful"
    assert "token" in r.cookies


def test_login_bad_password(client):
    """POST /api/login avec mauvais mot de passe → 401."""
    r = client.post(
        "/api/login",
        json={"email": "superadmin@resto.com", "password": "wrong"},
    )
    assert r.status_code == 401


def test_profil_requires_token(client):
    """GET /api/profil sans cookie → 401 (garde d'auth backend)."""
    r = client.get("/api/profil")
    assert r.status_code == 401


def test_profil_with_token(client):
    """GET /api/profil avec cookie token → 200 + profil user."""
    client.post(
        "/api/login",
        json={"email": "superadmin@resto.com", "password": "1234"},
    )
    r = client.get("/api/profil")
    assert r.status_code == 200
    body = r.json()
    assert body["email"] == "superadmin@resto.com"
    assert body["center"] == "Centre Lyon Part-Dieu"
