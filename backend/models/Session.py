import math
import uuid
from datetime import datetime, UTC
from typing import Optional, Annotated

from fastapi import HTTPException
from pydantic import BaseModel, Field, BeforeValidator
from database.mongodb_connection import MongoDBConnection

EXPIRY_TIME_SECONDS = 604800
PyObjectId = Annotated[str, BeforeValidator(str)]
connection = MongoDBConnection()
sessions = connection.get_collection("sessions")


class DatabaseSession(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    session: uuid.UUID = Field()
    username: str = Field(max_length=16)
    expires_in: int = Field()


def get_new_session_expiry_date():
    return math.floor(datetime.now(UTC).timestamp() + EXPIRY_TIME_SECONDS)


async def find_session(query: dict) -> DatabaseSession | None:
    result = await sessions.find_one(query)
    if result is None:
        return

    return DatabaseSession(**result)


async def create_new_session(username: str) -> DatabaseSession:
    while True:
        session = DatabaseSession(
            username=username,
            session=uuid.uuid4(),
            expires_in=get_new_session_expiry_date(),
        )

        if (await find_session({"session": session.session})) is not None:
            continue

        inserted = await sessions.insert_one(session.model_dump(by_alias=True, exclude={"id"}))
        if inserted.acknowledged:
            return session
        else:
            raise HTTPException(status_code=500, detail="Failed to create session.")
