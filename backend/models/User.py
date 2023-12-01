from typing import Optional, Annotated
from pydantic import BaseModel, Field, BeforeValidator
from database.mongodb_connection import MongoDBConnection

PyObjectId = Annotated[str, BeforeValidator(str)]
connection = MongoDBConnection()
users = connection.get_collection("users")


class DatabaseUser(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    username: str = Field(max_length=16)
    password: str = Field()
    email: Optional[str] = ""


async def find_user(query: dict) -> DatabaseUser | None:
    result = await users.find_one(query)
    if result is None:
        return

    return DatabaseUser(**result)
