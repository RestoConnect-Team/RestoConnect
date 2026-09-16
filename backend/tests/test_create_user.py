"""Tests backend — création de compte utilisateur (RCO-42)."""

from app.database.models import User


def _login(client, email, password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r


_PAYLOAD = {
    "name": "Nouveau",
    "lastname": "Benevole",
    "email": "nouveau.benevole@resto.com",
    "password": "1234",
    "status": "Utilisateur",
    "center_id": 1,
    "telephone": "0102030405",
    "city": "Avon",
    "postal_code": "77210",
}


def test_create_user_requires_token(client):
    r = client.post("/api/user", json=_PAYLOAD)
    assert r.status_code == 401


def test_create_user_forbidden_for_center_admin(client):
    """Un responsable de centre ne peut pas créer de compte."""
    _login(client, "resp1@resto.com")
    r = client.post("/api/user", json=_PAYLOAD)
    assert r.status_code == 403


def test_create_user_forbidden_for_simple_user(client):
    _login(client, "user@resto.com")
    r = client.post("/api/user", json=_PAYLOAD)
    assert r.status_code == 403


def test_create_user_as_admin(client, db):
    _login(client, "superadmin@resto.com")
    r = client.post("/api/user", json=_PAYLOAD)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["email"] == "nouveau.benevole@resto.com"
    assert body["name"] == "Nouveau"

    db.expire_all()
    user = db.query(User).filter(User.email == "nouveau.benevole@resto.com").one()
    assert user is not None
    assert user.password != "1234"  # hashed


def test_create_user_duplicate_email_400(client):
    _login(client, "superadmin@resto.com")
    payload = {**_PAYLOAD, "email": "dup.test@resto.com"}
    r1 = client.post("/api/user", json=payload)
    assert r1.status_code == 200
    r2 = client.post("/api/user", json=payload)
    assert r2.status_code == 400
