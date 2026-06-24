from enum import Enum

class VehicleCategory(str, Enum):
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