"""Tests backend — statut d'inventaire (RCO-28 pause/reprise + RCO-29 valider)."""

from app.database.models import Inventory


def _login(client, email="resp1@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r


def test_pause_inventory_requires_token(client):
    r = client.patch("/api/inventory/4/status", json={"status": "en pause"})
    assert r.status_code == 401


def test_pause_ongoing_inventory(client):
    _login(client)
    # inventaire 4 = centre 1, en cours
    r = client.patch("/api/inventory/4/status", json={"status": "en pause"})
    assert r.status_code == 200, r.text
    assert r.json()["status_inventory_stock"] == "en pause"


def test_resume_paused_inventory(client):
    _login(client)
    client.patch("/api/inventory/4/status", json={"status": "en pause"})
    r = client.patch("/api/inventory/4/status", json={"status": "en cours"})
    assert r.status_code == 200, r.text
    assert r.json()["status_inventory_stock"] == "en cours"


def test_pause_inventory_cross_center_403(client):
    _login(client, email="resp2@resto.com", password="1234")
    # inventaire 4 = centre 1, resp2 = centre 2
    r = client.patch("/api/inventory/4/status", json={"status": "en pause"})
    assert r.status_code == 403


def test_pause_inventory_not_admin_403(client):
    _login(client, email="user@resto.com", password="1234")
    r = client.patch("/api/inventory/4/status", json={"status": "en pause"})
    assert r.status_code == 403


def test_pause_inventory_not_found_404(client):
    _login(client)
    r = client.patch("/api/inventory/9999/status", json={"status": "en pause"})
    assert r.status_code == 404


def test_finish_inventory_sets_end_date(client, db):
    """RCO-29 — valider un inventaire incomplet : statut terminé + end_date posé."""
    _login(client)
    r = client.patch("/api/inventory/4/status", json={"status": "terminé"})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["status_inventory_stock"] == "terminé"
    assert body["end_date"] is not None

    db.expire_all()
    inv = db.query(Inventory).filter(Inventory.id == 4).one()
    assert inv.inventory_end_date is not None
