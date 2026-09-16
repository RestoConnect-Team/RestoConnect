from app.database.models import User
from app.enums import UserStatus


_ADMIN_ROLES = {
    UserStatus.SUPER_ADMIN,
    UserStatus.ADMIN,
    UserStatus.CENTER_ADMIN,
    UserStatus.STOCK_ADMIN,
}


def is_user_center_admin_service(user: User) -> bool:
    return user.status in _ADMIN_ROLES
