from pydantic import BaseModel


class StockTransferRequest(BaseModel):
    target_center_id: int
