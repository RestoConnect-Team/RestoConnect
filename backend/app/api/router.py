from fastapi import APIRouter

from app.api.endpoints import (
    get_login_connection_route,
    deconnect_route,
    get_user_route,
    get_list_vehicules_route,
    get_vehicule_infos_route,
    delete_vehicule_route,
    get_list_stocks_route,
    delete_stock_route,
    get_stock_by_scan,
    update_stock_status,
    get_stock_detail,
    get_my_center_infos_route,
    get_list_centers_route,
    get_center_infos_route,
    get_warehouse_infos_route,
    delete_center_route,
    create_inventory_route,
    get_list_inventories_route,
    get_list_stocks_inventory_route,
    update_inventory_stock_status_route,
    get_qr_code_route,
)

api_router = APIRouter()


api_router.include_router(
    get_login_connection_route.router
)  # , prefix="/login", tags=["Login"])
api_router.include_router(
    deconnect_route.router
)  # , prefix="/deconnection", tags=["Deconnection"])

api_router.include_router(get_user_route.router)
api_router.include_router(get_user_route.router, prefix="/user", tags=["User"])

api_router.include_router(get_list_vehicules_route.router, tags=["Vehicule"])
api_router.include_router(
    get_vehicule_infos_route.router, prefix="/vehicule", tags=["Vehicule"]
)
api_router.include_router(
    delete_vehicule_route.router, prefix="/vehicule", tags=["Vehicule"]
)

api_router.include_router(get_list_centers_route.router, tags=["Center"])
api_router.include_router(get_my_center_infos_route.router, tags=["Center"])
api_router.include_router(
    get_center_infos_route.router, prefix="/center", tags=["Center"]
)
api_router.include_router(
    get_warehouse_infos_route.router, prefix="/warehouse", tags=["Warehouse", "Center"]
)
api_router.include_router(delete_center_route.router, prefix="/center", tags=["Center"])

api_router.include_router(get_list_stocks_route.router, tags=["Stock"])
api_router.include_router(get_stock_by_scan.router, prefix="/stock", tags=["Stock"])
api_router.include_router(update_stock_status.router, prefix="/stock", tags=["Stock"])
api_router.include_router(delete_stock_route.router, prefix="/stock", tags=["Stock"])
api_router.include_router(get_stock_detail.router, prefix="/stock", tags=["Stock"])

api_router.include_router(
    create_inventory_route.router, prefix="/inventory", tags=["Inventory"]
)
api_router.include_router(
    get_list_inventories_route.router, prefix="/inventory", tags=["Inventory"]
)
api_router.include_router(
    get_list_stocks_inventory_route.router, prefix="/inventory", tags=["Inventory"]
)
api_router.include_router(
    update_inventory_stock_status_route.router, prefix="/inventory", tags=["Inventory"]
)
api_router.include_router(get_qr_code_route.router, prefix="/qr_code", tags=["QR Code"])
