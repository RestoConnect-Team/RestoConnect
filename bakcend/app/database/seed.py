from .connection import SessionLocal
from .models import User, Stock

def seed():
    db = SessionLocal()
    
    # Vérifie que les users n'existent pas déjà
    if db.query(User).first():
        print("DB déjà seedée, skip")
        db.close()
        return

    users = [
        User(name="Admin", email="admin@resto.com", password="1234"),
        User(name="Test User", email="user@resto.com", password="1234"),
    ]

    stocks = [
        Stock(reference="REF001", name="Produit 1", categorie="Catégorie 1", quantity=100),
        Stock(reference="REF002", name="Produit 2", categorie="Catégorie 2", quantity=50),
    ]

    db.add_all(users)
    db.add_all(stocks)
    db.commit()
    db.close()
    print("Seed OK ✅")