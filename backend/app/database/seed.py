from .connection import SessionLocal
from .models import User, Stock, Center, Vehicule, VehiculeDocument

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
        Vehicule(name="Véhicule 1", location="Location Véhicule 1", alerte="Alerte 1", category="Catégorie 1", center_id=1, user_id=3),
        Vehicule(name="Véhicule 2", location="Location Véhicule 2", alerte="Alerte 2", category="Catégorie 2", center_id=1, user_id=5),
        Vehicule(name="Véhicule 3", location="Location Véhicule 3", alerte="Alerte 3", category="Catégorie 1", center_id=2, user_id=4),
        Vehicule(name="Véhicule 4", location="Location Véhicule 4", alerte="Alerte 4", category="Catégorie 3", center_id=2, user_id=None),
        Vehicule(name="Véhicule 5", location="Location Véhicule 5", alerte="Alerte 5", category="Catégorie 2", center_id=1, user_id=None)
    ]

    vehicule_documents = [
        VehiculeDocument(filename="document1.pdf", file_url="/uploads/vehicule_documents/document1.pdf", vehicule_id=1),
        VehiculeDocument(filename="document2.pdf", file_url="/uploads/vehicule_documents/document2.pdf", vehicule_id=1),
        VehiculeDocument(filename="document3.pdf", file_url="/uploads/vehicule_documents/document3.pdf", vehicule_id=2),
        VehiculeDocument(filename="document4.pdf", file_url="/uploads/vehicule_documents/document4.pdf", vehicule_id=3),
        VehiculeDocument(filename="document5.pdf", file_url="/uploads/vehicule_documents/document5.pdf", vehicule_id=5)
    ]

    db.add_all(users)
    db.add_all(stocks)
    db.add_all(centers)
    db.add_all(vehicules)
    db.add_all(vehicule_documents)
    db.commit()
    db.close()
    print("Seed OK ✅")