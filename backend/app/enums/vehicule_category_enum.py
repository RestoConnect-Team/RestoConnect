from enum import Enum

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
    