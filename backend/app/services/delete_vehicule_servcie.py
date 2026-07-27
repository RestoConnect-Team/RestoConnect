from sqlalchemy.orm import Session
from app.database.models import Vehicule

def delete_vehicule_service(vehicule_id: int, db: Session) -> bool:
    vehicule = db.query(Vehicule).filter(Vehicule.id == vehicule_id).one_or_none()
    if not vehicule:
        return False

    db.delete(vehicule)
    db.commit()
    
    return True