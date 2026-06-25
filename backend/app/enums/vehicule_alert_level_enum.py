from enum import Enum

class VehiculeAlertLevel(str, Enum):
    EXPIRED = "expired"
    WILL_EXPIRE_SOON = "will_expire_soon"