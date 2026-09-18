from enum import Enum

from typing import Optional
import datetime
from pydantic import BaseModel


class VehiculeAlertLevel(str, Enum):
    EXPIRED = "expired"
    WILL_EXPIRE_SOON = "will_expire_soon"

class VehiculeAlert(BaseModel):
    
    level: VehiculeAlertLevel

    name: str
    description: Optional[str] = None
    expire_date: datetime.date
    expired_since: Optional[int] = None
    will_expire_in: Optional[int] = None


class VehiculeCategory(str, Enum):
    FRIGORIFIQUE = "frigorifique"
    PLATEAU = "plateau"
    FOURGON = "fourgon"
    VOITURE = "voiture"
    CAMION = "camion"
    UTILITAIRE = "utilitaire"
    BENNE = "benne"
    CITERNE = "citerne"
    REMORQUE = "remorque"
    SEMI_REMORQUE = "semi-remorque"
    
class VehiculeStatus(str, Enum):
    IN_SERVICE = "en service"
    IN_MAINTENANCE = "en maintenance"
    UNDER_REPAIR = "en réparation"
    OUT_OF_SERVICE = "hors service"

    ## Non attribué

class WeekDays(str, Enum):
    MONDAY = "Lundi"
    TUESDAY = "Mardi"
    WEDNESDAY = "Mercredi"
    THURSDAY = "Jeudi"
    FRIDAY = "Vendredi"
    SATURDAY = "Samedi"
    SUNDAY = "Dimanche"
    