"""Tests backend — stocks d'un centre (GET /api/center/{id}/stocks)."""


def test_center_stocks_returns_list(client):
    r = client.get("/api/center/1/stocks")
    assert r.status_code == 200, r.text
    body = r.json()
    assert isinstance(body, list)
    assert len(body) >= 1
    refs = [s["reference"] for s in body]
    assert "REF001_c1" in refs


def test_center_stocks_not_found(client):
    r = client.get("/api/center/9999/stocks")
    assert r.status_code == 404
