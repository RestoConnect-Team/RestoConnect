import csv
import io

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database.models import Center, Stock, User


def export_centers_service(center_ids: list[int], db: Session) -> str:
    centers = (
        db.query(Center).filter(Center.id.in_(center_ids)).order_by(Center.id).all()
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(
        [
            "Nom",
            "Ville",
            "Code postal",
            "Adresse",
            "Téléphone",
            "Email",
            "Statut",
            "Matériels",
            "Contacts",
        ]
    )

    for center in centers:
        materials_count = (
            db.scalar(select(func.count(Stock.id)).where(Stock.center_id == center.id))
            or 0
        )
        contacts_count = (
            db.scalar(select(func.count(User.id)).where(User.center_id == center.id))
            or 0
        )
        writer.writerow(
            [
                center.name or "",
                center.city or "",
                center.postal_code or "",
                f"{center.street_number or ''} {center.street or ''}".strip(),
                center.telephone or "",
                center.email or "",
                center.status.value if center.status else "",
                materials_count,
                contacts_count,
            ]
        )

    return output.getvalue()
