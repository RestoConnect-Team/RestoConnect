from enum import Enum


class CommentStatus(str, Enum):
    PENDING = "en attente"
    APPROVED = "approuvé"
    REJECTED = "refusé"
