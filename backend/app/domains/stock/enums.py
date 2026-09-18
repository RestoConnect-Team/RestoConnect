from enum import Enum

class StockCategory(str, Enum):
    INFORMATIQUE = "Informatique" #####A developper
    REFRIGIRE = "Réfrigéré" ####A developper
    RESTAURATION = "Restauration"
    BUREAU = "Bureau"
    OTHER = "Autre"

class StockStatus(str, Enum):
    AVAILABLE = "Disponible"
    LOST= "Perdu"

# à développer selon les besoins de l'application
class StockEventType(str, Enum):
    AJOUT_SYSTEME = "Ajouté au système"
    TRANSFERT_RECU = "Transfert reçu"
    TRANSFERT_ENVOYE = "Transfert envoyé"
    PROBLEME_REPORTED = "Problème signalé" 
