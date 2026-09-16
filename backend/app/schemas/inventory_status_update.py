from pydantic import BaseModel
from typing import Literal

from app.enums import InventoryStatus


class InventoryStatusUpdate(BaseModel):
    status: Literal[
        InventoryStatus.ON_GOING,
        InventoryStatus.PAUSED,
        InventoryStatus.FINISHED,
    ]
