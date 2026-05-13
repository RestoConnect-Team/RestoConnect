from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import DATABASE_URL



engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass

# Dépendance FastAPI pour injecter la session dans les routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()