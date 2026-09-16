"""Tests backend — auth & scope par centre (fixes Phase 0, branche B).

Couvre :
- Fix #4 : is_user_center_admin_service accepte SUPER_ADMIN/ADMIN/CENTER_ADMIN.
- Fix #5 : get_list_stocks_inventory_route exige un token (401 sinon).
- Fix #6 : get_stock_by_reference + update_stock_status filtrent par centre.
"""

from app.database.models import Inventory


def _login(client, email="superadmin@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r


def test_create_inventory_allows_super_admin(client, db):
    """Fix #4 — un SUPER_ADMIN peut créer un inventaire (pas de 403)."""
    _login(client, email="superadmin@resto.com", password="1234")
    count_before = db.query(Inventory).count()
    r = client.post("/api/inventory/create_inventory")
    assert r.status_code in (200, 201), r.text
    db.expire_all()
    assert db.query(Inventory).count() == count_before + 1


def test_list_stocks_inventory_requires_token(client):
    """Fix #5 — GET /api/inventory/list_stocks_inventory/<id> sans token -> 401."""
    r = client.get("/api/inventory/list_stocks_inventory/1")
    assert r.status_code == 401, r.text


def test_list_stocks_inventory_with_token_ok(client):
    """Fix #5 — avec token -> 200."""
    _login(client, email="superadmin@resto.com", password="1234")
    r = client.get("/api/inventory/list_stocks_inventory/1")
    assert r.status_code == 200, r.text


def test_scan_reference_scoped_to_user_center(client):
    """Fix #6 — un user du centre 1 ne peut pas scanner une ref du centre 2.

    resp1@resto.com est au centre 1. La réf 'REF001_c2' appartient au centre 2.
    -> 403 (ou 404) mais pas 200.
    """
    _login(client, email="resp1@resto.com", password="1234")
    r = client.get("/api/stock/scan", params={"reference": "REF001_c2"})
    assert r.status_code in (403, 404), r.text


def test_scan_reference_same_center_ok(client):
    """Fix #6 — un user du centre 1 scanne une réf du centre 1 -> 200."""
    _login(client, email="resp1@resto.com", password="1234")
    r = client.get("/api/stock/scan", params={"reference": "REF001_c1"})
    assert r.status_code == 200, r.text


def test_update_stock_status_scoped_to_center(client):
    """Fix #6 — un user du centre 1 ne peut pas modifier le statut d'un stock du centre 2.

    Stock id=3 (REF001_c2) appartient au centre 2. resp1 est au centre 1.
    -> 403 (ou 404) mais pas 200.
    """
    _login(client, email="resp1@resto.com", password="1234")
    r = client.patch(
        "/api/stock/3/status",
        json={"status": "Disponible"},
    )
    assert r.status_code in (403, 404), r.text
