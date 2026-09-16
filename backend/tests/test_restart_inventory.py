"""Tests backend — recommencer un inventaire (RCO-30)."""

from app.database.models import Inventory, InventoryStock
from app.enums import InventoryStatus, InventoryStockStatus


def _login(client, email="resp1@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r


def test_restart_inventory_requires_token(client):
    r = client.post("/api/inventory/4/restart")
    assert r.status_code == 401


def test_restart_resets_stocks_and_status(client, db):
    """POST restart → statut ON_GOING, end_date None, stocks Absent."""
    _login(client)

    # Inventaire 4 est en cours avec des stocks Présent/Absent
    r = client.post("/api/inventory/4/restart")
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["status_inventory_stock"] == "en cours"
    assert body["end_date"] is None

    db.expire_all()
    inv = db.query(Inventory).filter(Inventory.id == 4).one()
    assert inv.status == InventoryStatus.ON_GOING
    assert inv.inventory_end_date is None

    stocks = db.query(InventoryStock).filter(InventoryStock.inventory_id == 4).all()
    assert len(stocks) > 0
    for s in stocks:
        assert s.status == InventoryStockStatus.NOT_FOUND
        assert s.scan_id is None


def test_restart_finished_inventory(client, db):
    """Un inventaire terminé peut être recommencé."""
    _login(client)
    # Inventaire 1 est terminé (centre 1)
    r = client.post("/api/inventory/1/restart")
    assert r.status_code == 200, r.text
    assert r.json()["status_inventory_stock"] == "en cours"


def test_restart_inventory_cross_center_403(client):
    _login(client, email="resp2@resto.com", password="1234")
    r = client.post("/api/inventory/4/restart")
    assert r.status_code == 403


def test_restart_inventory_not_admin_403(client):
    _login(client, email="user@resto.com", password="1234")
    r = client.post("/api/inventory/4/restart")
    assert r.status_code == 403


def test_restart_inventory_not_found_404(client):
    _login(client)
    r = client.post("/api/inventory/9999/restart")
    assert r.status_code == 404
