from enum import Enum

class CenterStatus(str, Enum):
    OPEN = "Ouvert"
    CLOSE = "Fermé"
    TEMPORARY_CLOSE = "Fermeture saisonière"

class WeekDays(str, Enum):
    MONDAY = "Lundi"
    TUESDAY = "Mardi"
    WEDNESDAY = "Mercredi"
    THURSDAY = "Jeudi"
    FRIDAY = "Vendredi"
    SATURDAY = "Samedi"
    SUNDAY = "Dimanche"
    