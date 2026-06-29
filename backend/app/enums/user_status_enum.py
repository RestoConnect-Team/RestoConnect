import enum as Enum

class UserStatus(str, Enum):
    SUPER_ADMIN = 'Super administrateur'
    ADMIN = "Administrateur"
    CENTER_ADMIN = "Responsable de centre"
    VEHICULE_ADMIN = "Responsable des véhicules"
    STOCK_ADMIN = "Responsable du stock"
    User = "Utilisateur"