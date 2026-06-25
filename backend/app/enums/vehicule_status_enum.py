from enum import Enum

class VehiculeStatus(str, Enum):
    IN_SERVICE = "en service"
    IN_MAINTENANCE = "en maintenance"
    UNDER_REPAIR = "en réparation"
    OUT_OF_SERVICE = "hors service"