import secrets

def generate_random_token_service() -> str:
    return secrets.token_urlsafe(32)