"""Tests backend — modération des commentaires (RCO-34)."""

from app.database.models import Comment


def _login(client, email="resp1@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r


def test_create_comment_requires_token(client):
    r = client.post("/api/comment", json={"content": "test", "center_id": 1})
    assert r.status_code == 401


def test_create_comment(client):
    _login(client)
    r = client.post("/api/comment", json={"content": "Super centre", "center_id": 1})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["status"] == "en attente"
    assert body["content"] == "Super centre"


def test_list_comments(client):
    _login(client)
    client.post("/api/comment", json={"content": "Bon accueil", "center_id": 1})
    r = client.get("/api/comment/1")
    assert r.status_code == 200, r.text
    assert isinstance(r.json(), list)


def test_moderate_comment_forbidden_for_simple_user(client):
    _login(client, "user@resto.com")
    c = client.post("/api/comment", json={"content": "à modérer", "center_id": 1})
    cid = c.json()["id"]
    r = client.patch(f"/api/comment/{cid}/moderate", json={"status": "approuvé"})
    assert r.status_code == 403


def test_moderate_comment_as_admin(client, db):
    _login(client, "superadmin@resto.com")
    c = client.post("/api/comment", json={"content": "à approuver", "center_id": 1})
    cid = c.json()["id"]
    r = client.patch(f"/api/comment/{cid}/moderate", json={"status": "approuvé"})
    assert r.status_code == 200, r.text
    assert r.json()["status"] == "approuvé"

    db.expire_all()
    comment = db.query(Comment).filter(Comment.id == cid).one()
    assert comment.status.value == "approuvé"


def test_moderate_comment_not_found(client):
    _login(client, "superadmin@resto.com")
    r = client.patch("/api/comment/9999/moderate", json={"status": "refusé"})
    assert r.status_code == 404
