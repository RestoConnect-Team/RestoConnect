"""Tests d'intégration — Véhicules (list, detail, delete).

Couvre /api/list_vehicules, /api/vehicule/{id}, DELETE /api/vehicule/{id}.

Expose les bugs connus :
- GET /api/vehicule/{id} sans auth (pas de token cookie) — accès libre aux détails.
- DELETE /api/vehicule/{id} sans auth (bug hors scope documenté).
- delete_vehicule_controller appelle le service deux fois (bug logique).
"""

from app.database.models import Vehicule


def _login(client, email="superadmin@resto.com", password="1234"):
    r = client.post("/api/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text


def test_list_vehicules_requires_token(client):
    """GET /api/list_vehicules sans token → 401 (le controller vérifie le user)."""
    r = client.get("/api/list_vehicules")
    assert r.status_code == 401


def test_list_vehicules_returns_grouped(client):
    """GET /api/list_vehicules → vehicules_center + vehicules_other."""
    _login(client, email="resp1@resto.com", password="1234")
    r = client.get("/api/list_vehicules")
    assert r.status_code == 200, r.text
    body = r.json()
    assert "vehicules_center" in body
    assert "vehicules_other" in body
    # resp1 est au centre 1, qui a les véhicules 1, 2, 5
    center_ids = [v["id"] for v in body["vehicules_center"]]
    assert 1 in center_ids


def test_vehicule_detail_returns_infos(client):
    """GET /api/vehicule/{id} → VehiculeDetailResponse (note: pas d'auth sur cette route)."""
    r = client.get("/api/vehicule/1")
    assert r.status_code == 200, r.text
    body = r.json()
    assert "vehicule" in body
    assert "documents" in body
    vehicule = body["vehicule"]
    assert vehicule["id"] == 1
    assert vehicule["name"] == "Véhicule 1"
    assert vehicule["immatriculation"] == "AA-123-AA"


def test_vehicule_detail_not_found(client):
    """GET /api/vehicule/9999 → 404."""
    r = client.get("/api/vehicule/9999")
    assert r.status_code == 404


def test_delete_vehicule_without_token_401(client):
    """DELETE /api/vehicule/{id} sans token → 401."""
    r = client.delete("/api/vehicule/1")
    assert r.status_code == 401


def test_delete_vehicule_same_center_ok(client):
    """DELETE /api/vehicule/{id} sur un véhicule de son centre → 200."""
    from app.enums import VehiculeCategory, VehiculeStatus
    from conftest import TestSessionLocal
    from datetime import date

    db = TestSessionLocal()
    try:
        v = Vehicule(
            name="Véhicule jetable",
            immatriculation="ZZ-999-ZZ",
            category=VehiculeCategory.VOITURE,
            status=VehiculeStatus.IN_SERVICE,
            nb_km=0,
            last_technical_inspection_date=date(2025, 1, 1),
            next_technical_inspection_date=date(2026, 1, 1),
            last_service_date=date(2025, 1, 1),
            next_service_date=date(2026, 1, 1),
            center_id=1,
        )
        db.add(v)
        db.commit()
        db.refresh(v)
        vid = v.id
    finally:
        db.close()

    _login(client, email="resp1@resto.com", password="1234")
    r = client.delete(f"/api/vehicule/{vid}")
    assert r.status_code == 200, r.text


def test_delete_vehicule_cross_center_403(client):
    """DELETE /api/vehicule/{id} sur un véhicule d'un autre centre → 403."""
    _login(client, email="resp1@resto.com", password="1234")
    # véhicule 3 = centre 2, resp1 est au centre 1
    r = client.delete("/api/vehicule/3")
    assert r.status_code == 403
