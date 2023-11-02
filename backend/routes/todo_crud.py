import math
from datetime import datetime, UTC
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, HTTPException, Header, Depends
from database.mongodb_connection import MongoDBConnection
from models.Lists import (
    DatabaseToDoList,
    ToDoItemSchema,
    find_todo_list,
    add_item_to_todo_list,
    remove_item_from_todo_list,
    complete_item_on_todo_list,
    create_new_todo_list,
)
from models.Session import find_session

router = APIRouter()
connection = MongoDBConnection()
users = connection.get_collection("users")


async def verify_session(session: Annotated[UUID, Header()]):
    database_session = await find_session({"session": session})
    if database_session is None:
        raise HTTPException(status_code=401, detail="Invalid user session")

    is_expired = database_session.expires_in - math.floor(datetime.now(UTC).timestamp()) <= 0
    if is_expired:
        raise HTTPException(status_code=401, detail="Invalid user session")


@router.get("/get_list", dependencies=[Depends(verify_session)])
async def get_todo_list(session: Annotated[UUID, Header()]) -> DatabaseToDoList:
    database_session = await find_session({"session": session})
    return await find_todo_list({"username": database_session.username})


@router.post("/create_list", dependencies=[Depends(verify_session)])
async def create_todo_list(session: Annotated[UUID, Header()]) -> DatabaseToDoList:
    return await create_new_todo_list(session)


@router.post("/add_item", dependencies=[Depends(verify_session)])
async def add_item(session: Annotated[UUID, Header()], data: ToDoItemSchema) -> DatabaseToDoList:
    return await add_item_to_todo_list(content=data, session=session)


@router.delete("/remove_item", dependencies=[Depends(verify_session)])
async def remove_item(session: Annotated[UUID, Header()], item_name: str) -> DatabaseToDoList:
    return await remove_item_from_todo_list(item_name=item_name, session=session)


@router.patch("/change_item_status", dependencies=[Depends(verify_session)])
async def change_item_status(session: Annotated[UUID, Header()], item_name: str, status: bool) -> DatabaseToDoList:
    return await complete_item_on_todo_list(item_name=item_name, status=status, session=session)
