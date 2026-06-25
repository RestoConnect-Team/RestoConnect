from sqlalchemy import select
from sqlalchemy.orm import Session

from datetime import date

from app.database.models import VehiculeDocument, Vehicule

from app.schemas import (
    VehiculeInfos,
    VehiculeAlert,
    VehiculeDetailResponse,
    VehiculeDocumentInfos,
)



def get_vehicule_infos_service(vehicule_id: int, db: Session):
    vehicule_info_query = (
        select(
            Vehicule
        )
        .where(Vehicule.id == vehicule_id)
    )
    vehicule = db.execute(vehicule_info_query).scalar_one_or_none()

    vehicule_documents_query = (
        select(
            VehiculeDocument
        )
        .where(VehiculeDocument.vehicule_id == vehicule_id)
    )
    vehicule_documents = db.execute(vehicule_documents_query).scalars().all()

    if not vehicule:
        return None


    ## Création des document_alertes pour les documents du véhicule
    document_alertes = []

    for document in vehicule_documents:
        if document.expiration_date is None:
            continue

        delta_days = ( document.expiration_date - date.today() ).days

        if delta_days < 0 :
            document_alertes.append(
                VehiculeAlert(
                    level = "expired",
                    name = vehicule.name,
                    description = document.description,
                    expire_date = document.expiration_date,
                    expired_since = abs(delta_days)
                )
            )

        elif delta_days <= 30 :
            document_alertes.append(
                VehiculeAlert(
                    level = "will_expire_soon",
                    name = vehicule.name,
                    description = document.description,
                    expire_date = document.expiration_date,
                    will_expire_in = abs(delta_days)
                )
            )

    # ## Création des km_alertes pour le kilométrage du véhicule:
    # km_alertes = []
    # if vehicule.nb_km > 

    ## Création de l'alerte contrôle technique basée sur le document correspondant
    technical_inspection_alerte = None

    technical_documents = [
        doc
        for doc in vehicule_documents
        if doc.expiration_date is not None
        and doc.description is not None
        and (
            "contrôle technique" in doc.description.lower()
            or "controle technique" in doc.description.lower()
        )
    ]

    if technical_documents:
        # If multiple technical docs exist, use the one expiring first.
        technical_document = min(technical_documents, key=lambda doc: doc.expiration_date)
        delta_technical_inspection_days = (
            technical_document.expiration_date - date.today()
        ).days

        if delta_technical_inspection_days < 0:
            technical_inspection_alerte = VehiculeAlert(
                level="expired",
                name=vehicule.name,
                description="Contrôle technique expiré !",
                expire_date=technical_document.expiration_date,
                expired_since=abs(delta_technical_inspection_days),
            )
        elif delta_technical_inspection_days <= 30:
            technical_inspection_alerte = VehiculeAlert(
                level="will_expire_soon",
                name=vehicule.name,
                description="Contrôle technique à renouveler bientôt !",
                expire_date=technical_document.expiration_date,
                will_expire_in=abs(delta_technical_inspection_days),
            )

    vehicule_infos = VehiculeInfos(
        id=vehicule.id,
        name=vehicule.name,
        immatriculation=vehicule.immatriculation,
        category=vehicule.category,
        status=vehicule.status,
        nb_km=vehicule.nb_km,
        last_technical_inspection_date=vehicule.last_technical_inspection_date,
        next_technical_inspection_date=vehicule.next_technical_inspection_date,
        last_service_date=vehicule.last_service_date,
        next_service_date=vehicule.next_service_date,
        center_name=vehicule.center.name,
        responsable_name=vehicule.user.name if vehicule.user else None,
        responsable_lastname=vehicule.user.lastname if vehicule.user else None,
        responsable_email=vehicule.user.email if vehicule.user else None,
        responsable_phone=vehicule.user.telephone if vehicule.user else None,
    )

    vehicule_documents_infos = [
        VehiculeDocumentInfos(
            id=document.id,
            file_name=document.file_name,
            description=document.description,
            upload_date=document.upload_date,
            file_date=document.file_date,
            expiration_date=document.expiration_date,
            file_url=document.file_url,
        )
        for document in vehicule_documents
    ]
    

    return VehiculeDetailResponse(
        vehicule=vehicule_infos,
        documents=vehicule_documents_infos,
        document_alertes=document_alertes,
        technical_inspection_alerte=technical_inspection_alerte,
    )