from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers import delete_vehicule_controller

from app.database.connection import get_db


router = APIRouter()

@router.delete("/{vehicule_id}", response_model=bool)
def delete_vehicule_endpoint(
    vehicule_id: int,
    db: Session = Depends(get_db)
):
    return delete_vehicule_controller(vehicule_id, db)