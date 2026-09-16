from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Comment
from app.enums import CommentStatus


def create_comment_service(
    content: str, center_id: int, user_id: int, db: Session
) -> Comment:
    comment = Comment(
        content=content,
        center_id=center_id,
        user_id=user_id,
        status=CommentStatus.PENDING,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def get_comments_service(center_id: int, db: Session) -> list[Comment]:
    query = (
        select(Comment)
        .where(Comment.center_id == center_id)
        .order_by(Comment.created_at.desc())
    )
    return db.scalars(query).all()


def moderate_comment_service(
    comment_id: int, status: CommentStatus, db: Session
) -> Comment | None:
    comment = db.query(Comment).filter(Comment.id == comment_id).one_or_none()
    if not comment:
        return None
    comment.status = status
    db.commit()
    db.refresh(comment)
    return comment
