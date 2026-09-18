from pydantic import BaseModel

class LoginResponse(BaseModel):
    message: str

class LoginRequest(BaseModel):
    email: str
    password: str