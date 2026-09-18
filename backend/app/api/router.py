from fastapi import APIRouter

from app.api.endpoints import get_qr_code_route  # ou déplacé dans stock, selon ta décision

from app.domains.stock import routes as stock_routes
from app.domains.inventory import routes as inventory_routes
from app.domains.center import routes as center_routes
from app.domains.vehicule import routes as vehicule_routes
from app.domains.auth import routes as auth_routes
from app.domains.user import routes as user_routes

api_router = APIRouter()

# --- auth ---
api_router.include_router(auth_routes.router, tags=["Login", "Deconnection"])

# --- user ---
api_router.include_router(user_routes.router, tags=["User"])

# --- vehicule ---
api_router.include_router(vehicule_routes.router, tags=["Vehicule"])
api_router.include_router(vehicule_routes.vehicule_router, prefix="/vehicule", tags=["Vehicule"])

# --- center ---
api_router.include_router(center_routes.router, tags=["Center"])
api_router.include_router(center_routes.center_router, prefix="/center", tags=["Center"])
api_router.include_router(center_routes.warehouse_router, prefix="/warehouse", tags=["Warehouse", "Center"])

# --- stock ---
api_router.include_router(stock_routes.router, tags=["Stock", "Center"])

# --- inventory ---
api_router.include_router(inventory_routes.router, prefix="/inventory", tags=["Inventory"])

# --- qr code---
api_router.include_router(get_qr_code_route.router, prefix="/qr_code", tags=["QR Code"])