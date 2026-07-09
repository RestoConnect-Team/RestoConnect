from enum import Enum

class InventoryStockStatus(str, Enum):
    FOUND = "Présent"
    NOT_FOUND = "Absent"
