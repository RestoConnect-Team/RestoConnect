"""Tests backend — inventaires véhicule (RCO-40)."""

from app.database.models import VehiculeInventory, VehiculeInventoryItem


def _login(client, email="resp1@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r


def test_create_vehicule_inventory_requires_token(client):
    r = client.post("/api/vehicule_inventory/create_inventory")
    assert r.status_code == 401


def test_create_vehicule_inventory(client, db):
    _login(client)
    r = client.post("/api/vehicule_inventory/create_inventory")
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["status"] == "en cours"
    assert len(body["items"]) > 0

    db.expire_all()
    inv = (
        db.query(VehiculeInventory)
        .filter(VehiculeInventory.id == body["inventory_id"])
        .one()
    )
    assert inv.status.value == "en cours"


def test_update_vehicule_inventory_item(client, db):
    _login(client)
    created = client.post("/api/vehicule_inventory/create_inventory").json()
    item_id = created["items"][0]["inventory_item_id"]

    r = client.patch(
        f"/api/vehicule_inventory/item/{item_id}/status",
        json={"status": "Présent"},
    )
    assert r.status_code == 200, r.text
    assert r.json()["status_inventory_stock"] == "Présent"


def test_validate_vehicule_inventory(client, db):
    _login(client)
    created = client.post("/api/vehicule_inventory/create_inventory").json()
    inv_id = created["inventory_id"]

    r = client.patch(f"/api/vehicule_inventory/{inv_id}/validate")
    assert r.status_code == 200, r.text
    assert r.json()["status"] == "terminé"
    assert r.json()["end_date"] is not None


def test_get_vehicule_inventory_not_found(client):
    _login(client)
    r = client.get("/api/vehicule_inventory/9999")
    assert r.status_code == 404
