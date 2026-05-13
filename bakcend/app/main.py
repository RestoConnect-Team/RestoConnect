from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.http_request import router
from app.database.connection import Base, engine
from app.database.seed import seed


Base.metadata.create_all(bind=engine)  # crée les tables au démarrage
with engine.connect() as co:
    print("Connexion OK ✅")

seed()  # Exécute le script de seed


app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Allow Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Backend running"}

