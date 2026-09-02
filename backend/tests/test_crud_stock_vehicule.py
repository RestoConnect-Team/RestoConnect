"""Tests backend — CRUD matériel + véhicule (création/édition).

Couvre POST/PUT /api/stock et POST/PUT /api/vehicule.
"""

from app.database.models import Stock, Vehicule


def _login(client, email="resp1@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text


def test_create_stock_requires_token(client):
    r = client.post(
        "/api/stock",
        json={"name": "Test", "category": "Informatique", "reference": "REF_TEST"},
    )
    assert r.status_code == 401


def test_create_stock_persists(client, db):
    _login(client)
    r = client.post(
        "/api/stock",
        json={"name": "Test", "category": "Informatique", "reference": "REF_TEST_CRUD"},
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["reference"] == "REF_TEST_CRUD"
    assert body["name"] == "Test"

    db.expire_all()
    stock = db.query(Stock).filter(Stock.reference == "REF_TEST_CRUD").one_or_none()
    assert stock is not None
    assert stock.center_id == 1


def test_update_stock_persists(client, db):
    from app.enums import StockStatus, StockCategory
    from conftest import TestSessionLocal
    from datetime import date

    _db = TestSessionLocal()
    try:
        s = Stock(
            reference="REF_UPDATE_TEST",
            name="Stock à renommer",
            category=StockCategory.INFORMATIQUE,
            status=StockStatus.AVAILABLE,
            qr_code="REF_UPDATE_TEST",
            creation_date=date(2025, 1, 1),
            center_id=1,
        )
        _db.add(s)
        _db.commit()
        _db.refresh(s)
        sid = s.id
    finally:
        _db.close()

    _login(client)
    r = client.put(
        f"/api/stock/{sid}",
        json={"name": "Stock renommé"},
    )
    assert r.status_code == 200, r.text
    assert r.json()["name"] == "Stock renommé"

    db.expire_all()
    stock = db.query(Stock).filter(Stock.id == sid).one()
    assert stock.name == "Stock renommé"


def test_update_stock_cross_center_403(client):
    _login(client)
    # stock 3 = centre 2, resp1 est au centre 1
    r = client.put("/api/stock/3", json={"name": "X"})
    assert r.status_code == 403


def test_create_stock_duplicate_reference_400(client):
    _login(client)
    # REF001_c1 existe déjà (seed)
    r = client.post(
        "/api/stock",
        json={"name": "Doublon", "category": "Informatique", "reference": "REF001_c1"},
    )
    assert r.status_code == 400


def test_create_stock_creates_initial_event(client, db):
    from app.database.models import StockEvent

    _login(client)
    r = client.post(
        "/api/stock",
        json={
            "name": "Avec event",
            "category": "Informatique",
            "reference": "REF_EVENT_TEST",
        },
    )
    assert r.status_code == 200, r.text
    sid = r.json()["id"]

    db.expire_all()
    events = db.query(StockEvent).filter(StockEvent.stock_id == sid).all()
    assert len(events) == 1
    assert events[0].event_type.value == "Ajouté au système"


def test_create_vehicule_requires_token(client):
    r = client.post(
        "/api/vehicule",
        json={
            "name": "Véhicule test",
            "immatriculation": "XX-000-XX",
            "category": "voiture",
            "status": "en service",
        },
    )
    assert r.status_code == 401


def test_create_vehicule_persists(client, db):
    _login(client)
    r = client.post(
        "/api/vehicule",
        json={
            "name": "Véhicule test",
            "immatriculation": "XX-000-XX",
            "category": "voiture",
            "status": "en service",
            "nb_km": 1000,
        },
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["immatriculation"] == "XX-000-XX"

    db.expire_all()
    v = db.query(Vehicule).filter(Vehicule.immatriculation == "XX-000-XX").one_or_none()
    assert v is not None
    assert v.center_id == 1


def test_update_vehicule_persists(client, db):
    from app.enums import VehiculeCategory, VehiculeStatus
    from conftest import TestSessionLocal
    from datetime import date

    _db = TestSessionLocal()
    try:
        v = Vehicule(
            name="Véhicule à renommer",
            immatriculation="YY-111-YY",
            category=VehiculeCategory.VOITURE,
            status=VehiculeStatus.IN_SERVICE,
            nb_km=0,
            last_technical_inspection_date=date(2025, 1, 1),
            next_technical_inspection_date=date(2026, 1, 1),
            center_id=1,
        )
        _db.add(v)
        _db.commit()
        _db.refresh(v)
        vid = v.id
    finally:
        _db.close()

    _login(client)
    r = client.put(
        f"/api/vehicule/{vid}",
        json={"name": "Véhicule renommé"},
    )
    assert r.status_code == 200, r.text
    assert r.json()["name"] == "Véhicule renommé"

    db.expire_all()
    v = db.query(Vehicule).filter(Vehicule.id == vid).one()
    assert v.name == "Véhicule renommé"


def test_update_vehicule_cross_center_403(client):
    _login(client)
    # véhicule 3 = centre 2, resp1 est au centre 1
    r = client.put("/api/vehicule/3", json={"name": "X"})
    assert r.status_code == 403


def test_create_vehicule_duplicate_immatriculation_400(client):
    _login(client)
    # AA-123-AA existe déjà (seed)
    r = client.post(
        "/api/vehicule",
        json={
            "name": "Doublon",
            "immatriculation": "AA-123-AA",
            "category": "voiture",
            "status": "en service",
        },
    )
    assert r.status_code == 400
