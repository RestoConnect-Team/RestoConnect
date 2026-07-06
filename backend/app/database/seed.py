from datetime import date, time

from .connection import SessionLocal
from .models import User, Stock, Center, Vehicule, VehiculeDocument, CenterSchedule, ClosingPeriod
from app.enums import VehiculeCategory, VehiculeStatus, UserStatus, CenterStatus, WeekDays, StockStatus, StockCategory

#crypt context for password hashing
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def seed():
    db = SessionLocal()
    
    # Vérifie que les users n'existent pas déjà
    if db.query(User).first():
        print("DB déjà seedée, skip")
        db.close()
        return

 
    users = [
        User(
            name="Antoine", lastname="Lefebvre", email="superadmin@resto.com",
            password=hash_password("1234"),photo_url="/uploads/avatars/user_1.png",
            center_id=1, status=UserStatus.SUPER_ADMIN,
            telephone="0123456789", street="123 Main St", city="Cityville",
            postal_code="12345", created_at=date(2026, 1, 1), updated_at=date(2026, 1, 1),
        ),
        User(
            name="Julie", lastname="Moreau", email="admin@resto.com",
            password=hash_password("1234"), photo_url="/uploads/avatars/user_2.png",
            center_id=1, status=UserStatus.ADMIN,
            telephone="0123456789", street="456 Oak Ave", city="Townsville",
            postal_code="67890", created_at=date(2026, 1, 5), updated_at=date(2026, 1, 5),
        ),
        User(
            name="Marc", lastname="Dubois", email="resp1@resto.com",
            password=hash_password("1234"), photo_url="/uploads/avatars/user_3.png",
            center_id=1, status=UserStatus.CENTER_ADMIN,
            telephone="0123456789", street="789 Pine St", city="Villagetown",
            postal_code="54321", created_at=date(2026, 2, 1), updated_at=date(2026, 2, 1),
        ),
        User(
            name="Sophie", lastname="Bernard", email="resp2@resto.com",
            password=hash_password("1234"), photo_url="/uploads/avatars/user_4.png",
            center_id=2, status=UserStatus.CENTER_ADMIN,
            telephone="0123456789", street="012 Pine St", city="Villagetown",
            postal_code="54321", created_at=date(2026, 2, 5), updated_at=date(2026, 2, 5),
        ),
        User(
            name="Karim", lastname="Benali", email="vehicule1@resto.com",
            password=hash_password("1234"), photo_url="/uploads/avatars/user_5.png",
            center_id=1, status=UserStatus.VEHICULE_ADMIN,
            telephone="0123456789", street="654 Maple St", city="Cityville",
            postal_code="12345", created_at=date(2026, 3, 1), updated_at=date(2026, 3, 1),
        ),
        User(
            name="Léa", lastname="Girard", email="vehicule2@resto.com",
            password=hash_password("1234"), photo_url=None,
            center_id=2, status=UserStatus.VEHICULE_ADMIN,
            telephone="0123456789", street="741 Spruce St", city="Townsville",
            postal_code="67890", created_at=date(2026, 3, 5), updated_at=date(2026, 3, 5),
        ),
        User(
            name="Hugo", lastname="Petit", email="stock1@resto.com",
            password=hash_password("1234"), photo_url=None,
            center_id=1, status=UserStatus.STOCK_ADMIN,
            telephone="0123456789", street="987 Birch St", city="Cityville",
            postal_code="12345", created_at=date(2026, 3, 10), updated_at=date(2026, 3, 10),
        ),
        User(
            name="Nina", lastname="Roux", email="stock2@resto.com",
            password=hash_password("1234"), photo_url=None,
            center_id=2, status=UserStatus.STOCK_ADMIN,
            telephone="0123456789", street="258 Walnut St", city="Townsville",
            postal_code="67890", created_at=date(2026, 4, 1), updated_at=date(2026, 4, 1),
        ),
        User(
            name="Paul", lastname="Fontaine", email="user@resto.com",
            password=hash_password("1234"), photo_url=None,
            center_id=1, status=UserStatus.User,
            telephone="0123456789", street="321 Elm St", city="Cityville",
            postal_code="12345", created_at=date(2026, 4, 5), updated_at=date(2026, 4, 5),
        ),
        User(
            name="Emma", lastname="Chevalier", email="user2@resto.com",
            password=hash_password("1234"), photo_url=None,
            center_id=2, status=UserStatus.User,
            telephone="0123456789", street="159 Cedar St", city="Townsville",
            postal_code="67890", created_at=date(2026, 5, 1), updated_at=date(2026, 5, 1),
        ),
    ]

    stocks = [
        Stock(
            reference="REF001_c1",
            name="Pc",
            category=StockCategory.INFORMATIQUE,
            status = StockStatus.LOST,
            qr_code = "",
            creation_date = date(2025,1,1),
            last_scan_date = date(2026,6,1),
            center_id=1
            ),
        Stock(
            reference="REF002_c1",
            name="Frigo",
            category=StockCategory.REFRIGIRE,
            status = StockStatus.DISPONIBLE,
            qr_code = "",
            creation_date = date(2025,6,1),
            last_scan_date = date(2026,6,1),
            center_id=1
            ),
        Stock(
            reference="REF001_c2",
            name="Pc",
            category=StockCategory.INFORMATIQUE,
            status = StockStatus.LOST,
            qr_code = "",
            creation_date = date(2025,1,1),
            last_scan_date = date(2026,3,1),
            center_id=2
            ),
        Stock(
            reference="REF002_c2",
            name="Frigo",
            category=StockCategory.REFRIGIRE,
            status = StockStatus.DISPONIBLE,
            qr_code = "",
            creation_date = date(2025,9,1),
            last_scan_date = date(2026,4,1),
            center_id=2
            ),
        Stock(
            reference="REF003_c2",
            name="Table",
            category=StockCategory.BUREAU,
            status = StockStatus.DISPONIBLE,
            qr_code = "",
            creation_date = date(2025,1,1),
            last_scan_date = date(2026,6,1),
            center_id=2
            )
    ]

    centers = [
        Center(
            name="Centre Lyon Part-Dieu",
            street_number=17,
            street="Rue Servient",
            city="Lyon",
            postal_code="69003",
            telephone="04 72 00 11 22",
            email="partdieu@restosducoeur.org",
            status=CenterStatus.OPEN,
            description="Centre principal situé au cœur du quartier d'affaires de Lyon.",
            activities="Restauration rapide, livraison",
        ),
        Center(
            name="Centre Lyon Croix-Rousse",
            street_number=42,
            street="Boulevard de la Croix-Rousse",
            city="Lyon",
            postal_code="69004",
            telephone="04 72 00 22 33",
            email="croixrousse@restosducoeur.org",
            status=CenterStatus.OPEN,
            description="Centre situé sur les pentes de la Croix-Rousse.",
            activities="Restauration sur place, traiteur",
        ),
        Center(
            name="Centre Villeurbanne",
            street_number=8,
            street="Avenue Henri Barbusse",
            city="Villeurbanne",
            postal_code="69100",
            telephone="04 72 00 33 44",
            email="villeurbanne@restosducoeur.org",
            status=CenterStatus.TEMPORARY_CLOSE,
            description="Centre fermé temporairement pour travaux.",
            activities="Restauration rapide",
        ),
        Center(
            name="Centre Bron",
            street_number=23,
            street="Avenue Franklin Roosevelt",
            city="Bron",
            postal_code="69500",
            telephone="04 72 00 44 55",
            email="bron@restosducoeur.org",
            status=CenterStatus.OPEN,
            description="Centre desservant le secteur est de l'agglomération.",
            activities="Livraison, traiteur événementiel",
        ),
        Center(
            name="Centre Vénissieux",
            street_number=5,
            street="Rue Marcel Cachin",
            city="Vénissieux",
            postal_code="69200",
            telephone="04 72 00 55 66",
            email="venissieux@restosducoeur.org",
            status=CenterStatus.CLOSE,
            description="Centre actuellement fermé.",
            activities="Restauration rapide",
        ),
        Center(
            name="Entrepôt Vaulx-en-Velin",
            street_number=15,
            street="Avenue de la République",
            city="Vaulx-en-Velin",
            postal_code="69800",
            status=CenterStatus.OPEN,
            description="Entrepôt situé dans le quartier de la République.",
            activities="Stockage, livraison",
            is_warehouse=True
        )
    ]

    center_schedules = [
        # Centre 1
        CenterSchedule(center_id=1, day_of_week=WeekDays.MONDAY, opening_time=time(9, 0), closing_time=time(19, 0)),
        CenterSchedule(center_id=1, day_of_week=WeekDays.TUESDAY, opening_time=time(9, 0), closing_time=time(19, 0)),
        CenterSchedule(center_id=1, day_of_week=WeekDays.WEDNESDAY, opening_time=time(9, 0), closing_time=time(19, 0)),
        CenterSchedule(center_id=1, day_of_week=WeekDays.THURSDAY, opening_time=time(9, 0), closing_time=time(19, 0)),
        CenterSchedule(center_id=1, day_of_week=WeekDays.FRIDAY, opening_time=time(9, 0), closing_time=time(19, 0)),
        CenterSchedule(center_id=1, day_of_week=WeekDays.SATURDAY, opening_time=time(10, 0), closing_time=time(17, 0)),

        # Centre 2
        CenterSchedule(center_id=2, day_of_week=WeekDays.MONDAY, opening_time=time(8, 30), closing_time=time(18, 30)),
        CenterSchedule(center_id=2, day_of_week=WeekDays.TUESDAY, opening_time=time(8, 30), closing_time=time(18, 30)),
        CenterSchedule(center_id=2, day_of_week=WeekDays.WEDNESDAY, opening_time=time(8, 30), closing_time=time(18, 30)),
        CenterSchedule(center_id=2, day_of_week=WeekDays.THURSDAY, opening_time=time(8, 30), closing_time=time(18, 30)),
        CenterSchedule(center_id=2, day_of_week=WeekDays.FRIDAY, opening_time=time(8, 30), closing_time=time(18, 30)),
        CenterSchedule(center_id=2, day_of_week=WeekDays.SATURDAY, opening_time=time(9, 0), closing_time=time(16, 0)),

        # Centre 3 (fermé temporairement, mais on garde des horaires de référence)
        CenterSchedule(center_id=3, day_of_week=WeekDays.MONDAY, opening_time=time(9, 0), closing_time=time(18, 0)),
        CenterSchedule(center_id=3, day_of_week=WeekDays.TUESDAY, opening_time=time(9, 0), closing_time=time(18, 0)),
        CenterSchedule(center_id=3, day_of_week=WeekDays.WEDNESDAY, opening_time=time(9, 0), closing_time=time(18, 0)),
        CenterSchedule(center_id=3, day_of_week=WeekDays.THURSDAY, opening_time=time(9, 0), closing_time=time(18, 0)),
        CenterSchedule(center_id=3, day_of_week=WeekDays.FRIDAY, opening_time=time(9, 0), closing_time=time(18, 0)),

        # Centre 4
        CenterSchedule(center_id=4, day_of_week=WeekDays.MONDAY, opening_time=time(9, 0), closing_time=time(19, 30)),
        CenterSchedule(center_id=4, day_of_week=WeekDays.TUESDAY, opening_time=time(9, 0), closing_time=time(19, 30)),
        CenterSchedule(center_id=4, day_of_week=WeekDays.WEDNESDAY, opening_time=time(9, 0), closing_time=time(19, 30)),
        CenterSchedule(center_id=4, day_of_week=WeekDays.THURSDAY, opening_time=time(9, 0), closing_time=time(19, 30)),
        CenterSchedule(center_id=4, day_of_week=WeekDays.FRIDAY, opening_time=time(9, 0), closing_time=time(19, 30)),
        CenterSchedule(center_id=4, day_of_week=WeekDays.SATURDAY, opening_time=time(10, 0), closing_time=time(18, 0)),

        # Centre 5 (fermé, pas d'horaires actuels)
    ]

    vehicules = [
        Vehicule(
        name="Véhicule 1",
        immatriculation="AA-123-AA",
        category=VehiculeCategory.VOITURE,
        status=VehiculeStatus.IN_SERVICE,
        nb_km=120000,
        last_technical_inspection_date=date(2025, 6, 1),
        next_technical_inspection_date=date(2026, 6, 1),
        last_service_date=date(2025, 3, 10),
        next_service_date=date(2025, 9, 10),
        center_id=1,
        user_id=3
        ),
        Vehicule(
        name="Véhicule 2",
        immatriculation="BB-456-BB",
        category=VehiculeCategory.CAMION,
        status=VehiculeStatus.IN_MAINTENANCE,
        nb_km=150000,
        last_technical_inspection_date=date(2025, 6, 1),
        next_technical_inspection_date=date(2026, 6, 1),
        last_service_date=date(2025, 3, 10),
        next_service_date=date(2025, 9, 10),
        center_id=1,
        user_id=5
        ),
        Vehicule(
        name="Véhicule 3",
        immatriculation="CC-789-CC",
        category=VehiculeCategory.VOITURE,
        status=VehiculeStatus.IN_SERVICE,
        nb_km=90000,
        last_technical_inspection_date=date(2025, 6, 1),
        next_technical_inspection_date=date(2026, 6, 1),
        last_service_date=date(2025, 3, 10),
        next_service_date=date(2025, 9, 10),
        center_id=2,
        user_id=4
        ),
        Vehicule(
        name="Véhicule 4",
        immatriculation="DD-012-DD",
        category=VehiculeCategory.UTILITAIRE,
        status=VehiculeStatus.OUT_OF_SERVICE,
        nb_km=200000,
        last_technical_inspection_date=date(2025, 6, 1),
        next_technical_inspection_date=date(2026, 6, 1),
        last_service_date=date(2025, 3, 10),
        next_service_date=date(2025, 9, 10),
        center_id=2,
        user_id=None
        ),
        Vehicule(
        name="Véhicule 5",
        immatriculation="EE-345-EE",
        category=VehiculeCategory.FOURGON,
        status=VehiculeStatus.UNDER_REPAIR,
        nb_km=10000,
        last_technical_inspection_date=date(2025, 6, 1),
        next_technical_inspection_date=date(2026, 6, 1),
        last_service_date=date(2025, 3, 10),
        next_service_date=date(2025, 9, 10),
        center_id=1,
        user_id=None
        )
    ]

    vehicule_documents = [
        VehiculeDocument(
            file_name="document1.pdf",
            description="Contrôle technique",
            upload_date=date(2026, 1, 5),
            file_date=date(2026, 1, 5),
            expiration_date=date(2027, 1, 5),
            file_url="/uploads/vehicule_documents/document1.pdf",
            vehicule_id=1,
        ),
        VehiculeDocument(
            file_name="document2.pdf",
            description="Assurance",
            upload_date=date(2026, 2, 10),
            file_date=date(2026, 2, 10),
            expiration_date=date(2027, 2, 10),
            file_url="/uploads/vehicule_documents/document2.pdf",
            vehicule_id=1,
        ),
        VehiculeDocument(
            file_name="document3.pdf",
            description="Contrôle technique",
            upload_date=date(2026, 3, 14),
            file_date=date(2026, 3, 14),
            expiration_date=date(2027, 3, 14),
            file_url="/uploads/vehicule_documents/document3.pdf",
            vehicule_id=2,
        ),
        VehiculeDocument(
            file_name="document4.pdf",
            description="Assurance",
            upload_date=date(2026, 4, 2),
            file_date=date(2026, 4, 2),
            expiration_date=date(2027, 4, 2),
            file_url="/uploads/vehicule_documents/document4.pdf",
            vehicule_id=3,
        ),
        VehiculeDocument(
            file_name="document5.pdf",
            description="Document ATP",
            upload_date=date(2026, 5, 9),
            file_date=date(2026, 5, 9),
            expiration_date=date(2027, 5, 9),
            file_url="/uploads/vehicule_documents/document5.pdf",
            vehicule_id=5,
        ),
    ]

    closing_periods = [
        ClosingPeriod(center_id=1, start_date=date(2026, 7, 13), end_date=date(2026, 7, 30)),
        ClosingPeriod(center_id=1, start_date=date(2026, 8, 10), end_date=date(2026, 8, 23)),
        ClosingPeriod(center_id=2, start_date=date(2026, 7, 20), end_date=date(2026, 8, 15)),
    ]

    db.add_all(users)
    db.add_all(stocks)
    db.add_all(centers)
    db.add_all(center_schedules)
    db.add_all(vehicules)
    db.add_all(vehicule_documents)
    db.commit()
    db.add_all(closing_periods)
    db.commit()
    db.close()
    print("Seed OK ✅")