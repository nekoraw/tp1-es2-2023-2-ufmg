import re
from fastapi import APIRouter
from starlette.responses import JSONResponse

from database.mongodb_connection import MongoDBConnection
from models.Authentication import LoginRequestSchema, RegisterRequestSchema
from constants import regexes
from models.User import find_user

router = APIRouter()
connection = MongoDBConnection()
users = connection.get_collection("users")


@router.post("/login")
def login(data: LoginRequestSchema):
    login_user = await find_user({"username": data.username})

    if login_user is None:
        return JSONResponse({"error": "User not found."}, status_code=404)

    if login_user.password_hash != data.password_hash:
        return JSONResponse({"error": "Incorrect password."}, status_code=403)

    return data


@router.post("/register")
async def register(data: RegisterRequestSchema):
    if data.email is not None:

        result = re.match(regexes.email, data.email)
        if result is None:
            return JSONResponse({"error": "Invalid e-mail"}, status_code=422)

    inserted = await users.insert_one(data.model_dump(by_alias=True, exclude={"id"}))
    created_user = await users.find_one(
        {"_id": inserted.inserted_id}
    )
    return created_user, 200
    return data, 201

