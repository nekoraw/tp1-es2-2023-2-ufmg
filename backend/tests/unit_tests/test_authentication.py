import bcrypt
import pytest
from fastapi import HTTPException

from models.Authentication import LoginRequestSchema, RegisterRequestSchema
from models.User import DatabaseUser
from routes.authentication import generate_password_hash, verify_password_hash


def test_password_hash_generation():
    any_password = "super_secure_password"
    pw_hash = generate_password_hash(RegisterRequestSchema(username="juliano", password=any_password))
    result = bcrypt.checkpw(any_password.encode(), pw_hash.encode())
    assert result is True


def test_correct_password_hash_verification():
    any_password = "super_secure_password"
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(any_password.encode(), salt)

    login_request = LoginRequestSchema(username="juliano", password=any_password)
    user = DatabaseUser(username="juliano", password=hashed_password.decode())

    res = verify_password_hash(login_request, user)
    assert res is None


def test_incorrect_password_hash_verification():
    any_password = "super_secure_password"

    login_request = LoginRequestSchema(username="juliano", password=any_password)
    user = DatabaseUser(username="juliano", password="not a hash")

    with pytest.raises(HTTPException):
        res = verify_password_hash(login_request, user)
