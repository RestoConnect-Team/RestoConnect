from enum import Enum

class StockCategory(str, Enum):
    INFORMATIQUE = "Informatique" #####A developper
    REFRIGIRE = "Réfrigéré" ####A developper
    RESTAURATION = "Restauration"
    BUREAU = "Bureau"
    OTHER = "Autre"