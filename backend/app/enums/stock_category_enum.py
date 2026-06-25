from enum import Enum

class StockCategory(str, Enum):
    INFORMATIQUE = "Informatique"
    REFRIGIRE = "Réfrigéré"
    RESTAURATION = "Restauration"
    BUREAU = "Bureau"
    OTHER = "Autre"