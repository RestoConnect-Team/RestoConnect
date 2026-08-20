"""Tests d'intégration — Centres (list, my_center, detail, warehouse, delete).

Couvre /api/center_list, /api/my_center, /api/center/{id}, /api/warehouse/{id},
DELETE /api/center/{id}.

Expose les bugs connus :
- DELETE /api/center/{id} n'a aucune auth (bug hors scope documenté).
"""

from app.database.models import Center


def _login(client, email="superadmin@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text


def test_list_centers_requires_token(client):
    """GET /api/list_centers sans token → 401."""
    r = client.get("/api/list_centers")
    assert r.status_code == 401


def test_list_centers_returns_user_center_plus_others(client):
    """GET /api/list_centers → user_center + centers_list + warehouses_list."""
    _login(client, email="resp1@resto.com", password="1234")
    r = client.get("/api/list_centers")
    assert r.status_code == 200, r.text
    body = r.json()
    assert "user_center" in body
    assert "centers_list" in body
    assert "warehouses_list" in body
    assert body["user_center"]["name"] == "Centre Melun"
    # Le centre de l'utilisateur ne doit pas être dans centers_list
    names = [c["name"] for c in body["centers_list"]]
    assert "Centre Melun" not in names


def test_my_center_requires_token(client):
    """GET /api/my_center sans token → 401."""
    r = client.get("/api/my_center")
    assert r.status_code == 401


def test_my_center_returns_center_infos(client):
    """GET /api/my_center → CenterInfos complet."""
    _login(client, email="resp1@resto.com", password="1234")
    r = client.get("/api/my_center")
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["name"] == "Centre Melun"
    assert body["materials_count"] >= 1
    assert "center_schedule" in body
    assert "contacts" in body
    assert body["is_user_center"] is True


def test_center_detail_returns_infos(client):
    """GET /api/center/{id} → CenterInfos."""
    _login(client, email="superadmin@resto.com", password="1234")
    r = client.get("/api/center/2")
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["center_id"] == 2
    assert body["name"] == "Centre Meaux"


def test_center_detail_not_found(client):
    """GET /api/center/9999 → 404."""
    _login(client, email="superadmin@resto.com", password="1234")
    r = client.get("/api/center/9999")
    assert r.status_code == 404


def test_center_detail_marks_user_center_flag(client):
    """GET /api/center/{id} avec is_user_center=true pour son propre centre."""
    _login(client, email="resp1@resto.com", password="1234")
    r = client.get("/api/center/1")
    assert r.status_code == 200
    assert r.json()["is_user_center"] is True
    r2 = client.get("/api/center/2")
    assert r2.json()["is_user_center"] is False


def test_delete_center_without_token_bug(client):
    """BUG EXPOSÉ — DELETE /api/center/{id} sans auth réussit (devrait être 401).

    Ce test documente un bug de sécurité connu (cf. insights.md).
    On crée un centre jetable, on vérifie qu'on peut le supprimer sans token.
    """
    from app.enums import CenterStatus
    from conftest import TestSessionLocal

    db = TestSessionLocal()
    try:
        c = Center(
            name="Centre jetable test",
            street_number=1,
            street="Rue test",
            city="Test",
            postal_code="00000",
            status=CenterStatus.OPEN,
        )
        db.add(c)
        db.commit()
        db.refresh(c)
        cid = c.id
    finally:
        db.close()

    r = client.delete(f"/api/center/{cid}")
    # Bug documenté : 200 au lieu de 401 (route delete sans auth).
    assert r.status_code == 200, (
        "DELETE center sans token devrait échouer (bug à corriger)"
    )


def test_warehouse_infos(client):
    """GET /api/warehouse/{id} → infos entrepôt (centre 6 = Entrepôt Torcy)."""
    _login(client, email="superadmin@resto.com", password="1234")
    r = client.get("/api/warehouse/6")
    assert r.status_code == 200, r.text
