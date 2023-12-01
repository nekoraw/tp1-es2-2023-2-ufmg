import re
from typing import Any

from fastapi import APIRouter, HTTPException
from database.mongodb_connection import MongoDBConnection
from models.Authentication import LoginRequestSchema, RegisterRequestSchema
from constants import regexes
from models.Session import DatabaseSession, create_new_session
from models.User import find_user, DatabaseUser
import bcrypt


router = APIRouter()
connection = MongoDBConnection()
users = connection.get_collection("users")


def generate_password_hash(data: RegisterRequestSchema) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(data.password.encode(), salt)
    return hashed_password.decode()


def verify_password_hash(data: LoginRequestSchema, login_user: DatabaseUser):
    try:
        is_password_correct = bcrypt.checkpw(data.password.encode(), login_user.password.encode())
        if not is_password_correct:
            raise HTTPException(detail={"error": "Incorrect password."}, status_code=403)
    except ValueError:
        raise HTTPException(detail={"error": "Incorrect password."}, status_code=403)


@router.post("/login")
async def login(data: LoginRequestSchema) -> DatabaseSession:
    login_user = await find_user({"username": data.username})

    if login_user is None:
        raise HTTPException(detail={"error": "User not found."}, status_code=404)

    verify_password_hash(data, login_user)

    return await create_new_session(data.username)


@router.post("/register", status_code=201)
async def register(data: RegisterRequestSchema) -> dict[str, Any]:
    if data.email is not None:
        result = re.match(regexes.email, data.email)
        if result is None:
            raise HTTPException(detail={"error": "Invalid e-mail"}, status_code=422)

    existing_user = await find_user({"username": data.username})
    if existing_user is not None:
        raise HTTPException(detail={"error": "User already exists"}, status_code=409)

    data.password = generate_password_hash(data)

    inserted = await users.insert_one(data.model_dump(by_alias=True, exclude={"id"}))
    created_user = await users.find_one({"_id": inserted.inserted_id}, projection={"_id": False, "password": False})
    return {"username": created_user["username"]}
