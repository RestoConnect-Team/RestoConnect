from enum import Enum

class StockStatus(str, Enum):
    DISPONIBLE = "Disponible"
    LOST= "Perdu"