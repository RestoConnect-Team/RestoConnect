from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router

from app.database.connection import Base, engine
from app.database.seed import seed

from app.core.config import UPLOADS_DIR, DATABASE_URL, RESET_DB_ON_BOOT

from sqlalchemy import create_engine, text
from sqlalchemy.engine.url import make_url


# =========================================================
# CREATE DATABASE IF NOT EXISTS
# =========================================================


url = make_url(DATABASE_URL)

database_name = url.database

# Connect to default postgres database
default_db_url = url.set(database="postgres")

temp_engine = create_engine(default_db_url)

with temp_engine.connect() as conn:
    conn.execution_options(isolation_level="AUTOCOMMIT")

    result = conn.execute(
        text(f"SELECT 1 FROM pg_database WHERE datname = '{database_name}'")
    )

    exists = result.scalar()

    if not exists:
        conn.execute(text(f'CREATE DATABASE "{database_name}"'))
        print(f"Database '{database_name}' created ✅")
    else:
        print(f"Database '{database_name}' already exists ✅")

temp_engine.dispose()

# =========================================================
# DATABASE INITIALIZATION
# =========================================================

if RESET_DB_ON_BOOT:
    with engine.connect() as conn:
        conn.execute(text("DROP SCHEMA public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))
        conn.commit()
    print("Schéma public reset (RESET_DB_ON_BOOT=true)")

Base.metadata.create_all(bind=engine)

with engine.connect() as co:
    print("Connexion OK ✅")
print("Tables prêtes")
if RESET_DB_ON_BOOT:
    seed()
    print("Seed terminé")
else:
    # seed est idempotent (skip si users existent déjà)
    seed()

# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],  # Allow Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir les fichiers statiques (images)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Include API routes
app.include_router(api_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Backend running"}
