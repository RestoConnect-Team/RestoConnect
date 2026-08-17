"""Tests backend — inventaire (fixes Phase 0).

Couvre :
- Fix #1 : GET /api/inventory/list_inventories → JSON valide (mismatch schéma/controller).
- Fix #2 : POST /api/inventory/create_inventory (pas GET).
- Fix #3 : create_inventory crée réellement un Inventory + InventoryStock.
"""

from app.database.models import Inventory, InventoryStock


def _login(client, email="superadmin@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r


def test_list_inventories_returns_valid_json(client):
    """Fix #1 — GET /api/inventory/list_inventories renvoie un JSON avec les bons champs."""
    _login(client)
    r = client.get("/api/inventory/list_inventories")
    assert r.status_code == 200, r.text
    body = r.json()
    assert isinstance(body, list)
    assert len(body) >= 1
    inv = body[0]
    assert "inventory_id" in inv
    assert "start_date" in inv
    assert "end_date" in inv
    assert "status_inventory_stock" in inv


def test_create_inventory_is_post_not_get(client):
    """Fix #2 — GET /api/inventory/create_inventory doit être refusé (405), POST accepté."""
    _login(client, email="resp1@resto.com", password="1234")
    r_get = client.get("/api/inventory/create_inventory")
    assert r_get.status_code == 405
    r_post = client.post("/api/inventory/create_inventory")
    assert r_post.status_code in (200, 201), r_post.text


def test_create_inventory_persists_inventory_and_stocks(client, db):
    """Fix #3 — POST crée un Inventory + un InventoryStock par stock du centre."""
    _login(client, email="resp1@resto.com", password="1234")

    count_before = db.query(Inventory).count()
    stocks_before = db.query(InventoryStock).count()

    r = client.post("/api/inventory/create_inventory")
    assert r.status_code in (200, 201), r.text

    db.expire_all()
    count_after = db.query(Inventory).count()
    stocks_after = db.query(InventoryStock).count()

    assert count_after == count_before + 1, "Inventory non créé"
    assert stocks_after > stocks_before, "InventoryStock non créés"
