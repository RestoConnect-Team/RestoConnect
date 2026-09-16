from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service, is_user_center_admin_service
from app.services.restart_inventory_service import restart_inventory_service
from app.schemas import OneInventoryFromInventorys
from app.database.models import Inventory


def restart_inventory_controller(
    inventory_id: int, token: str | None, db: Session
) -> OneInventoryFromInventorys:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    if not is_user_center_admin_service(user):
        raise HTTPException(status_code=403, detail="User is not the center admin")

    inventory = db.query(Inventory).filter(Inventory.id == inventory_id).one_or_none()
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory not found")
    if inventory.center_id != user.center_id:
        raise HTTPException(status_code=403, detail="Accès refusé à cet inventaire")

    updated = restart_inventory_service(inventory_id, db)
    if not updated:
        raise HTTPException(status_code=404, detail="Inventory not found")

    return OneInventoryFromInventorys(
        inventory_id=updated.id,
        start_date=updated.inventory_start_date,
        end_date=updated.inventory_end_date,
        status_inventory_stock=updated.status,
    )
