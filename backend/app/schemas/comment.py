from typing import Optional

from pydantic import BaseModel

from app.enums import CommentStatus


class CommentCreate(BaseModel):
    content: str
    center_id: int


class CommentModerate(BaseModel):
    status: CommentStatus


class CommentResponse(BaseModel):
    id: int
    content: str
    status: CommentStatus
    center_id: int
    user_name: Optional[str] = None
    user_lastname: Optional[str] = None
