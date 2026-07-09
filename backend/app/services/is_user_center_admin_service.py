from app.database.models import User
from app.enums import UserStatus


def is_user_center_admin_service( user: User ) -> bool:
    
    return user.status == UserStatus.CENTER_ADMIN