from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service, is_user_center_admin_service
from app.services.comment_service import (
    create_comment_service,
    get_comments_service,
    moderate_comment_service,
)
from app.schemas import CommentCreate, CommentModerate, CommentResponse
from app.database.models import Comment


def _to_response(c: Comment) -> CommentResponse:
    return CommentResponse(
        id=c.id,
        content=c.content,
        status=c.status,
        center_id=c.center_id,
        user_name=c.user.name if c.user else None,
        user_lastname=c.user.lastname if c.user else None,
    )


def create_comment_controller(
    payload: CommentCreate, token: str | None, db: Session
) -> CommentResponse:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    comment = create_comment_service(payload.content, payload.center_id, user.id, db)
    return _to_response(comment)


def get_comments_controller(
    center_id: int, token: str | None, db: Session
) -> list[CommentResponse]:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    comments = get_comments_service(center_id, db)
    return [_to_response(c) for c in comments]


def moderate_comment_controller(
    comment_id: int, payload: CommentModerate, token: str | None, db: Session
) -> CommentResponse:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    if not is_user_center_admin_service(user):
        raise HTTPException(
            status_code=403, detail="Seul un administrateur peut modérer"
        )

    comment = moderate_comment_service(comment_id, payload.status, db)
    if not comment:
        raise HTTPException(status_code=404, detail="Commentaire non trouvé")

    return _to_response(comment)
