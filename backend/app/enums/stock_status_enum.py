from enum import Enum

class StockStatus(str, Enum):
    AVAILABLE = "Disponible"
    LOST= "Perdu"