from enum import Enum

# à développer selon les besoins de l'application
class StockEventType(str, Enum):
    AJOUT_SYSTEME = "Ajouté au système"
    TRANSFERT_RECU = "Transfert reçu"
    TRANSFERT_ENVOYE = "Transfert envoyé"
    PROBLEME_REPORTED = "Problème signalé" 