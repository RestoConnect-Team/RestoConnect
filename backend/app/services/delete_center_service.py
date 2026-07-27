from sqlalchemy.orm import Session
from app.database.models import Center

def delete_center_service(center_id: int, db: Session) -> bool:
    center = db.query(Center).filter(Center.id == center_id).one_or_none()
    if not center:
        return False

    db.delete(center)
    db.commit()
    
    return True