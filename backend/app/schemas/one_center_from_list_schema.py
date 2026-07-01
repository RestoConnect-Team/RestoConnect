from pydantic import BaseModel
from typing import Optional

from app.enums import CenterStatus


class OneCenterFromList(BaseModel):
    center_id : int
    name : str
    #city
    city : str
    #status Ouvert / fermer / arrêt saisonier
    status : CenterStatus