"""Tests backend — export des données centres (RCO-39)."""


def _login(client, email="superadmin@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r


def test_export_requires_token(client):
    r = client.post("/api/center/export", json={"center_ids": [1]})
    assert r.status_code == 401


def test_export_forbidden_for_center_admin(client):
    _login(client, "resp1@resto.com")
    r = client.post("/api/center/export", json={"center_ids": [1]})
    assert r.status_code == 403


def test_export_empty_selection_400(client):
    _login(client)
    r = client.post("/api/center/export", json={"center_ids": []})
    assert r.status_code == 400


def test_export_returns_csv(client):
    _login(client)
    r = client.post("/api/center/export", json={"center_ids": [1, 2]})
    assert r.status_code == 200, r.text
    assert r.headers["content-type"].startswith("text/csv")
    assert "Nom" in r.text
    assert "Matériels" in r.text
