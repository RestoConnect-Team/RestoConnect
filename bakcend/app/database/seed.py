from .connection import SessionLocal
from .models import User, Stock, Center

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
        User(name="Admin", email="admin@resto.com", password=hash_password("1234"), center_id=1),
        User(name="Test User", email="user@resto.com", password=hash_password("1234"), center_id=2),
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

    db.add_all(users)
    db.add_all(stocks)
    db.add_all(centers)
    db.commit()
    db.close()
    print("Seed OK ✅")