"""Tests backend — gestion des doublons lors de l'inventaire (RCO-23)."""

from app.database.models import Stock
from app.enums import StockStatus, StockCategory
from conftest import TestSessionLocal
from datetime import date


def _login(client, email="resp1@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r


def _create_stock(reference="REF_DUP_TEST", center_id=1):
    db = TestSessionLocal()
    try:
        s = Stock(
            reference=reference,
            name="Stock doublon",
            category=StockCategory.INFORMATIQUE,
            status=StockStatus.AVAILABLE,
            qr_code=reference,
            creation_date=date(2025, 1, 1),
            center_id=center_id,
        )
        db.add(s)
        db.commit()
        db.refresh(s)
        return s.id
    finally:
        db.close()


def test_first_scan_not_duplicate(client):
    """Premier scan d'un stock → already_found = False."""
    _login(client)
    sid = _create_stock("REF_DUP_FIRST")

    client.post("/api/inventory/create_inventory")

    r = client.get("/api/stock/scan", params={"reference": "REF_DUP_FIRST"})
    assert r.status_code == 200, r.text
    assert r.json()["already_found"] is False


def test_second_scan_is_duplicate(client):
    """Deux scans du même stock dans le même inventaire → already_found = True."""
    _login(client)
    sid = _create_stock("REF_DUP_SECOND")

    client.post("/api/inventory/create_inventory")

    r1 = client.get("/api/stock/scan", params={"reference": "REF_DUP_SECOND"})
    assert r1.status_code == 200, r.text
    assert r1.json()["already_found"] is False

    r2 = client.get("/api/stock/scan", params={"reference": "REF_DUP_SECOND"})
    assert r2.status_code == 200, r.text
    assert r2.json()["already_found"] is True
