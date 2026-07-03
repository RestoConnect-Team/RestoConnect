#crypt context for password hashing
import bcrypt

def hash_password_service(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
