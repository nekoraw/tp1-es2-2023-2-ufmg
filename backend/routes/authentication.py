import re
from fastapi import APIRouter, HTTPException
from database.mongodb_connection import MongoDBConnection
from models.Authentication import LoginRequestSchema, RegisterRequestSchema
from constants import regexes
from models.Session import DatabaseSession, create_new_session
from models.User import find_user, DatabaseUser

router = APIRouter()
connection = MongoDBConnection()
users = connection.get_collection("users")


@router.post("/login")
async def login(data: LoginRequestSchema) -> DatabaseSession:
    login_user = await find_user({"username": data.username})

    if login_user is None:
        raise HTTPException(detail={"error": "User not found."}, status_code=404)

    if login_user.password_hash != data.password_hash:
        raise HTTPException(detail={"error": "Incorrect password."}, status_code=403)

    return await create_new_session(data.username)


@router.post("/register")
async def register(data: RegisterRequestSchema) -> DatabaseUser:
    if data.email is not None:
        result = re.match(regexes.email, data.email)
        if result is None:
            raise HTTPException(detail={"error": "Invalid e-mail"}, status_code=422)

    existing_user = await find_user({"username": data.username})
    if existing_user is not None:
        raise HTTPException(detail={"error": "User already exists"}, status_code=409)

    inserted = await users.insert_one(data.model_dump(by_alias=True, exclude={"id"}))
    created_user = await users.find_one({"_id": inserted.inserted_id})
    return created_user
