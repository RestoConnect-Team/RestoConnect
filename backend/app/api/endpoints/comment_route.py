from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers.comment_controller import (
    create_comment_controller,
    get_comments_controller,
    moderate_comment_controller,
)
from app.schemas import CommentCreate, CommentModerate, CommentResponse
from app.database.connection import get_db

router = APIRouter()


@router.post("/comment", response_model=CommentResponse)
def create_comment_endpoint(
    payload: CommentCreate,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return create_comment_controller(payload, token, db)


@router.get("/comment/{center_id}", response_model=list[CommentResponse])
def get_comments_endpoint(
    center_id: int,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return get_comments_controller(center_id, token, db)


@router.patch("/comment/{comment_id}/moderate", response_model=CommentResponse)
def moderate_comment_endpoint(
    comment_id: int,
    payload: CommentModerate,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return moderate_comment_controller(comment_id, payload, token, db)
