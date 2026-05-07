from .connection import SessionLocal
from .models import User

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

    db.add_all(users)
    db.commit()
    db.close()
    print("Seed OK ✅")