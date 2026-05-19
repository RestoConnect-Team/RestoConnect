from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.http_request import router
from app.database.connection import Base, engine
from app.database.seed import seed
from pathlib import Path

# Chemin absolu vers uploads/
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # remonte à la racine du projet
UPLOADS_DIR = BASE_DIR / "uploads"


Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)  # crée les tables au démarrage
with engine.connect() as co:
    print("Connexion OK ✅")
print("Tables recréées")
seed()  # Exécute le script de seed
print("Seed terminé")


app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Allow Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir les fichiers statiques (images)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Include API routes
app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Backend running"}

