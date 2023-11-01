from typing import Optional
from pydantic import BaseModel, Field


class LoginRequestSchema(BaseModel):
    username: str = Field(max_length=16)
    password_hash: str = Field()


class RegisterRequestSchema(BaseModel):
    username: str = Field(max_length=16)
    password_hash: str = Field()
    email: Optional[str] = Field(None, max_length=40)
