from pydantic import BaseModel
from app.schemas import CenterInfos, WarehouseInfos

class ListCentersResponse (BaseModel):

    centers_list: list[CenterInfos]
    warehouses_list: list[WarehouseInfos] 