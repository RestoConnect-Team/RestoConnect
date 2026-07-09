from enum import Enum

class InventoryStatus(str, Enum):
    ON_GOING = "en cours"
    FINISHED = "terminé"
