"""Tests backend — transfert de matériel entre centres (RCO-33)."""

from app.database.models import Stock, StockEvent
from app.enums.stock_event_type_enum import StockEventType


def _login(client, email="resp1@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r


def test_transfer_stock_requires_token(client):
    r = client.post("/api/stock/1/transfer", json={"target_center_id": 2})
    assert r.status_code == 401


def test_transfer_stock_changes_center(client, db):
    _login(client)  # resp1 = centre 1
    # stock 1 est au centre 1
    r = client.post("/api/stock/1/transfer", json={"target_center_id": 2})
    assert r.status_code == 200, r.text
    assert r.json()["center_name"]  # a un centre

    db.expire_all()
    stock = db.query(Stock).filter(Stock.id == 1).one()
    assert stock.center_id == 2


def test_transfer_stock_creates_event(client, db):
    _login(client)
    client.post("/api/stock/1/transfer", json={"target_center_id": 2})

    db.expire_all()
    events = (
        db.query(StockEvent)
        .filter(
            StockEvent.stock_id == 1,
            StockEvent.event_type == StockEventType.TRANSFERT_ENVOYE,
        )
        .all()
    )
    assert len(events) > 0


def test_transfer_stock_cross_center_403(client):
    _login(client, "resp2@resto.com")  # centre 2
    # stock 2 (REF002_c1) est au centre 1 ; resp2 ne peut pas y accéder
    r = client.post("/api/stock/2/transfer", json={"target_center_id": 1})
    assert r.status_code == 403


def test_transfer_stock_target_not_found_404(client):
    _login(client)
    r = client.post("/api/stock/6/transfer", json={"target_center_id": 9999})
    assert r.status_code == 404
