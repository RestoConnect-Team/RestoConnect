from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers import get_list_centers_controller
from app.schemas import ListCentersResponse

from app.database.connection import get_db

router = APIRouter()

@router.get("/list_centers", response_model=ListCentersResponse)
def profil_endpoint( db: Session = Depends(get_db)):
    return get_list_centers_controller( db)