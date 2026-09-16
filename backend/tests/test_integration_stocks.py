"""Tests d'intégration — Stocks/Matériel (list, scan, detail, status, delete).

Couvre /api/stock_list, /api/stock/scan, /api/stock/{id} (detail),
PATCH /api/stock/{id}/status, DELETE /api/stock/{id}.

Expose les bugs connus :
- DELETE /api/stock/{id} sans auth (bug hors scope documenté).
- get_stock_detail sans filtre par centre (bug hors scope documenté).
"""

from app.database.models import Stock


def _login(client, email="superadmin@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text


def test_stock_list_requires_token(client):
    """GET /api/stock_list sans token → 401."""
    r = client.get("/api/stock_list")
    assert r.status_code == 401


def test_stock_list_returns_stocks_of_user_center_plus_warehouse(client):
    """GET /api/stock_list → stocks du centre de l'user + stocks de l'entrepôt."""
    _login(client, email="resp1@resto.com", password="1234")
    r = client.get("/api/stock_list")
    assert r.status_code == 200, r.text
    body = r.json()
    assert isinstance(body, list)
    assert len(body) >= 1
    refs = [s["reference"] for s in body]
    # resp1 est au centre 1 : REF001_c1, REF002_c1
    assert "REF001_c1" in refs
    # Ne doit pas contenir les stocks du centre 2
    assert "REF001_c2" not in refs


def test_stock_detail_returns_infos(client):
    """GET /api/stock/{id} → ProductDetailResponse (details + history)."""
    _login(client, email="superadmin@resto.com", password="1234")
    r = client.get("/api/stock/1")
    assert r.status_code == 200, r.text
    body = r.json()
    assert "details" in body
    assert "history" in body
    assert body["details"]["id"] == 1
    assert body["details"]["reference"] == "REF001_c1"


def test_stock_detail_not_found(client):
    """GET /api/stock/9999 → 404."""
    _login(client, email="superadmin@resto.com", password="1234")
    r = client.get("/api/stock/9999")
    assert r.status_code == 404


def test_stock_detail_cross_center_403(client):
    """GET /api/stock/{id} sur un stock d'un autre centre → 403."""
    _login(client, email="resp1@resto.com", password="1234")
    # stock 3 = REF001_c2 (centre 2), resp1 est au centre 1
    r = client.get("/api/stock/3")
    assert r.status_code == 403


def test_scan_unknown_reference_returns_404(client):
    """GET /api/stock/scan?reference=INEXISTANT → 404."""
    _login(client, email="resp1@resto.com", password="1234")
    r = client.get("/api/stock/scan", params={"reference": "REF_INEXISTANTE"})
    assert r.status_code == 404


def test_update_stock_status_same_center_ok(client):
    """PATCH /api/stock/{id}/status sur un stock de son centre → 200."""
    _login(client, email="resp1@resto.com", password="1234")
    r = client.patch("/api/stock/1/status", json={"status": "Disponible"})
    assert r.status_code == 200, r.text


def test_update_stock_status_unknown_stock_404(client):
    """PATCH /api/stock/9999/status → 404."""
    _login(client, email="resp1@resto.com", password="1234")
    r = client.patch("/api/stock/9999/status", json={"status": "Disponible"})
    assert r.status_code == 404


def test_delete_stock_without_token_401(client):
    """DELETE /api/stock/{id} sans token → 401."""
    r = client.delete("/api/stock/1")
    assert r.status_code == 401


def test_delete_stock_same_center_ok(client):
    """DELETE /api/stock/{id} sur un stock de son centre → 200."""
    from app.enums import StockStatus, StockCategory
    from conftest import TestSessionLocal
    from datetime import date

    db = TestSessionLocal()
    try:
        s = Stock(
            reference="REF_JETABLE_TEST",
            name="Stock jetable",
            category=StockCategory.INFORMATIQUE,
            status=StockStatus.AVAILABLE,
            qr_code="REF_JETABLE_TEST",
            creation_date=date(2025, 1, 1),
            center_id=1,
        )
        db.add(s)
        db.commit()
        db.refresh(s)
        sid = s.id
    finally:
        db.close()

    _login(client, email="resp1@resto.com", password="1234")
    r = client.delete(f"/api/stock/{sid}")
    assert r.status_code == 200, r.text


def test_delete_stock_cross_center_403(client):
    """DELETE /api/stock/{id} sur un stock d'un autre centre → 403."""
    _login(client, email="resp1@resto.com", password="1234")
    # stock 3 = REF001_c2 (centre 2), resp1 est au centre 1
    r = client.delete("/api/stock/3")
    assert r.status_code == 403


def test_delete_stock_not_found(client):
    """DELETE /api/stock/9999 avec token → 404 (le service retourne False)."""
    _login(client, email="resp1@resto.com", password="1234")
    r = client.delete("/api/stock/9999")
    assert r.status_code == 404
