from enum import Enum

class InventoryStockStatus(str, Enum):
    FOUND = "Présent"
    NOT_FOUND = "Absent"

class InventoryStatus(str, Enum):
    ON_GOING = "en cours"
    FINISHED = "terminé"

class InventoryStockStatus(str, Enum):
    FOUND = "Présent"
    NOT_FOUND = "Absent"
