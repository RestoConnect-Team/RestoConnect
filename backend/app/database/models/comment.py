from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..connection import Base

from app.enums import CommentStatus


class Comment(Base):
    __tablename__ = "comment"

    id = Column(Integer, primary_key=True)
    content = Column(String, nullable=False)
    status = Column(
        SQLEnum(CommentStatus), default=CommentStatus.PENDING, nullable=False
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    center_id = Column(Integer, ForeignKey("center.id"), nullable=False)
    center = relationship("Center")

    user_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    user = relationship("User")
