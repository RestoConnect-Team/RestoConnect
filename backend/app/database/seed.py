from datetime import date

from .connection import SessionLocal
from .models import User, Stock, Center, Vehicule, VehiculeDocument
from app.enums import VehiculeCategory, VehiculeStatus

#crypt context for password hashing
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def seed():
    db = SessionLocal()
    
    # Vérifie que les users n'existent pas déjà
    if db.query(User).first():
        print("DB déjà seedée, skip")
        db.close()
        return

    users = [
        User(name="Admin",lastname="super", email="admin@resto.com", password=hash_password("1234"),photo_url="/uploads/avatars/user_1.png", center_id=1, status="admin", telephone="0123456789", street="123 Main St", city="Cityville", postal_code="12345",created_at="2026-01-01", updated_at="2026-01-01"),
        User(name="Test User", lastname="Test", email="user@resto.com", password=hash_password("1234"),photo_url="/uploads/avatars/user_2.png", center_id=2, status="user", telephone="0123456789", street="456 Oak Ave", city="Townsville", postal_code="67890",created_at="2026-02-01", updated_at="2026-02-01"),
        User(name="Responsable Centre 1", lastname="Resp1", email="resp1@resto.com", password=hash_password("1234"),photo_url="/uploads/avatars/user_3.png", center_id=1, status="responsable de centre", telephone="0123456789", street="789 Pine St", city="Villagetown", postal_code="54321",created_at="2026-03-01", updated_at="2026-03-01"),
        User(name="Responsable Centre 2", lastname="Resp2", email="resp2@resto.com", password=hash_password("1234"),photo_url="/uploads/avatars/user_4.png", center_id=2, status="responsable de centre", telephone="0123456789", street="012 Pine St", city="Villagetown", postal_code="54321",created_at="2026-03-01", updated_at="2026-03-01"),
        User(name="Utilisateur 1", lastname="User1", email="user1@resto.com", password=hash_password("1234"),photo_url="/uploads/avatars/user_5.png", center_id=1, status="user", telephone="0123456789", street="321 Elm St", city="Cityville", postal_code="12345",created_at="2026-04-01", updated_at="2026-04-01")
    ]

    stocks = [
        Stock(reference="REF001_c1", name="Produit 1", categorie="Catégorie 1", quantity=100, center_id=1),
        Stock(reference="REF002_c1", name="Produit 2", categorie="Catégorie 2", quantity=50, center_id=1),
        Stock(reference="REF001_c2", name="Produit 1", categorie="Catégorie 2", quantity=50, center_id=2),
        Stock(reference="REF002_c2", name="Produit 2", categorie="Catégorie 2", quantity=50, center_id=2),
        Stock(reference="REF003_c2", name="Produit 3", categorie="Catégorie 3", quantity=75, center_id=2)
    ]

    centers = [
        Center(name="Centre 1", location="Location 1"),
        Center(name="Centre 2", location="Location 2"),
    ]

    vehicules = [
        Vehicule(
        name="Véhicule 1",
        immatriculation="AA-123-AA",
        category=VehiculeCategory.VOITURE,
        status=VehiculeStatus.IN_SERVICE,
        nb_km=120000,
        last_technical_inspection_date=date(2025, 6, 1),
        next_technical_inspection_date=date(2026, 6, 1),
        last_service_date=date(2025, 3, 10),
        next_service_date=date(2025, 9, 10),
        center_id=1,
        user_id=3
        ),
        Vehicule(
        name="Véhicule 2",
        immatriculation="BB-456-BB",
        category=VehiculeCategory.CAMION,
        status=VehiculeStatus.IN_MAINTENANCE,
        nb_km=150000,
        last_technical_inspection_date=date(2025, 6, 1),
        next_technical_inspection_date=date(2026, 6, 1),
        last_service_date=date(2025, 3, 10),
        next_service_date=date(2025, 9, 10),
        center_id=1,
        user_id=5
        ),
        Vehicule(
        name="Véhicule 3",
        immatriculation="CC-789-CC",
        category=VehiculeCategory.VOITURE,
        status=VehiculeStatus.IN_SERVICE,
        nb_km=90000,
        last_technical_inspection_date=date(2025, 6, 1),
        next_technical_inspection_date=date(2026, 6, 1),
        last_service_date=date(2025, 3, 10),
        next_service_date=date(2025, 9, 10),
        center_id=2,
        user_id=4
        ),
        Vehicule(
        name="Véhicule 4",
        immatriculation="DD-012-DD",
        category=VehiculeCategory.UTILITAIRE,
        status=VehiculeStatus.OUT_OF_SERVICE,
        nb_km=200000,
        last_technical_inspection_date=date(2025, 6, 1),
        next_technical_inspection_date=date(2026, 6, 1),
        last_service_date=date(2025, 3, 10),
        next_service_date=date(2025, 9, 10),
        center_id=2,
        user_id=None
        ),
        Vehicule(
        name="Véhicule 5",
        immatriculation="EE-345-EE",
        category=VehiculeCategory.FOURGON,
        status=VehiculeStatus.UNDER_REPAIR,
        nb_km=10000,
        last_technical_inspection_date=date(2025, 6, 1),
        next_technical_inspection_date=date(2026, 6, 1),
        last_service_date=date(2025, 3, 10),
        next_service_date=date(2025, 9, 10),
        center_id=1,
        user_id=None
        )
    ]

    vehicule_documents = [
        VehiculeDocument(
            file_name="document1.pdf",
            description="Description du document 1",
            upload_date="2026-01-01",
            file_date = "2026-01-01",
            expiration_date="2027-01-01",
            file_url="/uploads/vehicule_documents/document1.pdf",
            vehicule_id=1
            ),
        VehiculeDocument(
            file_name="document2.pdf",
            description="Description du document 2",
            upload_date="2025-08-01",
            file_date = "2025-01-01",
            expiration_date="2026-01-01",
            file_url="/uploads/vehicule_documents/document2.pdf",
            vehicule_id=1
            ),
        VehiculeDocument(
            file_name="document3.pdf",
            description="",
            upload_date="2026-01-01",
            file_date = "2026-01-01",
            expiration_date="2027-01-01",
            file_url="/uploads/vehicule_documents/document3.pdf", 
            vehicule_id=2),
        VehiculeDocument(
            file_name="document4.pdf",
            description="Description du document 4",
            upload_date="2026-01-01",
            file_date = "2026-01-01",
            expiration_date="2026-08-01",
            file_url="/uploads/vehicule_documents/document4.pdf",
            vehicule_id=3),
        VehiculeDocument(
            file_name="document5.pdf",
            description="Description du document 5",
            upload_date="2026-01-01",
            file_date = "2026-01-01",
            expiration_date="2027-01-01",
            file_url="/uploads/vehicule_documents/document5.pdf",
            vehicule_id=5)
    ]

    db.add_all(users)
    db.add_all(stocks)
    db.add_all(centers)
    db.add_all(vehicules)
    db.add_all(vehicule_documents)
    db.commit()
    db.close()
    print("Seed OK ✅")