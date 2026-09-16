# config.py
from pathlib import Path
import os
from dotenv import load_dotenv

# Charger le .env si présent
load_dotenv()

# ------------------------
# Racine du projet
# ------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

DATABASE_URL = os.getenv("DATABASE_URL")

# Chemin absolu vers uploads/
REAL_BASE_DIR = (
    Path(__file__).resolve().parent.parent.parent.parent
)  # remonte à la racine du projet
UPLOADS_DIR = REAL_BASE_DIR / "uploads"

# Chemin vers ...
BASE_URL = "http://localhost:8000"

# Si true, le schéma public est droppé+recréé et le seed rejoué à chaque boot.
# Utile en dev ; à false (défaut) pour préserver les données (tests, démo).
RESET_DB_ON_BOOT = os.getenv("RESET_DB_ON_BOOT", "false").lower() in (
    "1",
    "true",
    "yes",
)
