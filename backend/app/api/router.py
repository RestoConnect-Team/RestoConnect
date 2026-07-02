from fastapi import APIRouter

from app.api.endpoints import (
    get_user_route,
    get_list_vehicules_route,
    get_vehicule_infos_route,
    get_list_stocks_route,
    get_my_center_infos_route,
    get_list_centers_route,
    get_center_infos_route,
    get_warehouse_infos_route,
    get_stock_by_scan,
    update_product_status
)

from app.api import route
api_router = APIRouter()

api_router.include_router(route.router)

api_router.include_router(get_user_route.router)
api_router.include_router(get_user_route.router, prefix="/user", tags=["User"])

api_router.include_router(get_list_vehicules_route.router)
api_router.include_router(get_vehicule_infos_route.router)

api_router.include_router(get_list_stocks_route.router)

api_router.include_router(get_my_center_infos_route.router)

api_router.include_router(get_list_centers_route.router)

api_router.include_router(get_center_infos_route.router)

api_router.include_router(get_warehouse_infos_route.router)

api_router.include_router(get_stock_by_scan.router, prefix="/stock", tags=["Stock"])
api_router.include_router(update_product_status.router, prefix="/stock", tags=["Stock"])