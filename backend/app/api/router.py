from fastapi import APIRouter
from app.api.endpoints import get_user_route
from app.api import route

api_router = APIRouter()

api_router.include_router(get_user_route.router)

api_router.include_router(route.router)
