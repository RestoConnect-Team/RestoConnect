from pydantic import BaseModel


class CenterExportRequest(BaseModel):
    center_ids: list[int]
