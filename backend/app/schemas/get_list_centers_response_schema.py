from pydantic import BaseModel
from app.schemas import OneCenterFromList

class ListCentersResponse (BaseModel):

    user_center: OneCenterFromList
    centers_list: list[OneCenterFromList]
    warehouses_list: list[OneCenterFromList]
