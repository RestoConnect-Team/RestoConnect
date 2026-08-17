"""Tests d'intégration — QR code.

Couvre GET /api/qr_code/{reference} — génère une image PNG à partir d'une référence.
Note: pas d'auth sur cette route (endpoint public de génération QR).
"""


def test_qr_code_returns_png(client):
    """GET /api/qr_code/{reference} → image/png."""
    r = client.get("/api/qr_code/REF001_c1")
    assert r.status_code == 200
    assert r.headers["content-type"] == "image/png"
    assert len(r.content) > 0


def test_qr_code_any_reference_works(client):
    """GET /api/qr_code/{reference} génère un QR même pour une réf inconnue (pas de vérif DB)."""
    r = client.get("/api/qr_code/NIMPORTE_QUOI")
    assert r.status_code == 200
    assert r.headers["content-type"] == "image/png"
