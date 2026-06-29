import enum as Enum

class CenterStatus(str, Enum):
    OPEN = "Ouvert"
    CLOSE = "Fermé"
    TEMPORARY_CLOSE = "Fermeture saisonière"