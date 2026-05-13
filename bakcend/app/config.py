# config.py
from pathlib import Path
import os
from dotenv import load_dotenv

# Charger le .env si présent
load_dotenv()

# ------------------------
# Racine du projet
# ------------------------
BASE_DIR = Path(__file__).resolve().parent

DATABASE_URL = os.getenv("DATABASE_URL")

