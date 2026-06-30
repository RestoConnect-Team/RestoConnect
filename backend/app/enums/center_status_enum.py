from enum import Enum

class CenterStatus(str, Enum):
    OPEN = "Ouvert"
    CLOSE = "Fermé"
    TEMPORARY_CLOSE = "Fermeture saisonière"