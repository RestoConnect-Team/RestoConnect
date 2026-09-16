"""Tests backend — suivi du stationnement des véhicules (RCO-31)."""

from app.database.models import Vehicule


def _login(client, email="vehicule1@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r


def test_vehicule_detail_exposes_parking_location(client):
    """Le détail véhicule renvoie parking_location (None si non renseigné)."""
    _login(client)
    r = client.get("/api/vehicule/1")
    assert r.status_code == 200, r.text
    body = r.json()["vehicule"]
    assert "parking_location" in body


def test_update_vehicule_parking_location(client, db):
    """Mise à jour du parking_location via PUT."""
    _login(client)
    r = client.put("/api/vehicule/1", json={"parking_location": "Parking nord"})
    assert r.status_code == 200, r.text

    db.expire_all()
    v = db.query(Vehicule).filter(Vehicule.id == 1).one()
    assert v.parking_location == "Parking nord"


def test_create_vehicule_with_parking_location(client, db):
    _login(client)
    r = client.post(
        "/api/vehicule",
        json={
            "name": "Véhicule test parking",
            "immatriculation": "ZZ-999-ZZ",
            "category": "voiture",
            "status": "en service",
            "nb_km": 0,
            "parking_location": "Garage B",
        },
    )
    assert r.status_code == 200, r.text

    db.expire_all()
    v = db.query(Vehicule).filter(Vehicule.immatriculation == "ZZ-999-ZZ").one()
    assert v.parking_location == "Garage B"
