from pydantic import BaseModel
from typing import Optional

from app.enums import CenterStatus
from app.schemas import WeeklySchedule

class CenterInfos(BaseModel):
    center_id : int
    name : str
    #adresse
    street_number : Optional[int] = None
    street : str 
    city : str
    postal_code : str 
    #status Ouvert / fermer / arrêt saisonier
    status : CenterStatus

    description : str
    activities : str
    
    center_headmaster_name : str
    center_headmaster_lastname : str
    center_headmaster_email : str
    center_headmaster_telephone : str

    center_schedule : WeeklySchedule
