import datetime
from typing import Dict, List
from pydantic import BaseModel

from app.enums import CenterStatus
from app.schemas import WeeklySchedule

class CenterInfos(BaseModel):
    center_id : str
    name : str
    #adresse
    street_number : int
    street : str 
    city : str
    postal_code : str 
    #status Ouvert / fermer / arrêt saisonier
    status : CenterStatus

    description : str
    
    center_headmaster_name : str
    center_headmaster_lastname : str
    center_headmaster_email : str
    center_headmaster_number : str

    center_schedule : WeeklySchedule
