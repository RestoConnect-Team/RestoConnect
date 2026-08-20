"""Tests d'intégration — Auth (login, deconnect, profil).

Couvre les endpoints /api/login, /api/deconnection, /api/profil, /api/user.
Valide le flow complet : login → cookie token → profil → deconnect → token invalidé.
"""

from app.database.models import User


def _login(client, email="superadmin@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r


def test_deconnect_invalidates_token(client):
    """GET /api/deconnection invalide le token en DB."""
    _login(client)
    user_before = client.get("/api/profil").json()
    assert user_before["email"] == "superadmin@resto.com"

    r = client.get("/api/deconnection")
    assert r.status_code == 200, r.text
    assert r.json() is True

    r2 = client.get("/api/profil")
    assert r2.status_code == 401


def test_deconnect_without_token(client):
    """GET /api/deconnection sans token → 401."""
    r = client.get("/api/deconnection")
    assert r.status_code == 401


def test_profil_returns_full_user_profile(client):
    """GET /api/profil renvoie le profil complet (id, name, status, center)."""
    _login(client, email="resp1@resto.com", password="1234")
    r = client.get("/api/profil")
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["email"] == "resp1@resto.com"
    assert body["status"] == "Responsable de centre"
    assert body["center"] == "Centre Melun"
    assert "id" in body and "name" in body and "lastname" in body


def test_login_email_missing_field(client):
    """POST /api/login avec email vide → 400 (il manque un champ)."""
    r = client.post("/api/login", json={"email": "", "password": "1234"})
    assert r.status_code == 400
