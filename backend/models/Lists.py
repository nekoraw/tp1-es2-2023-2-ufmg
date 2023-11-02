from typing import Optional, Annotated, List
from uuid import UUID

from fastapi import HTTPException
from pydantic import BaseModel, Field, BeforeValidator
from pymongo import ReturnDocument

from database.mongodb_connection import MongoDBConnection
from models.Session import find_session

PyObjectId = Annotated[str, BeforeValidator(str)]
connection = MongoDBConnection()
todo_lists = connection.get_collection("todo_lists")


class ToDoItemSchema(BaseModel):
    name: str = Field()
    is_done: Optional[bool] = Field(None)


class DatabaseToDoList(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    username: str = Field(max_length=16)
    items: List[ToDoItemSchema] = Field()


async def find_todo_list(query: dict) -> DatabaseToDoList | None:
    result = await todo_lists.find_one(query)
    if result is None:
        return

    return DatabaseToDoList(**result)


async def create_new_todo_list(session: UUID) -> DatabaseToDoList:
    database_session = await find_session({"session": session})
    if await find_todo_list({"username": database_session.username}) is not None:
        raise HTTPException(status_code=409, detail="User already has a todo list.")

    todo_list = DatabaseToDoList(username=database_session.username, items=[])
    inserted = await todo_lists.insert_one(todo_list.model_dump(by_alias=True, exclude={"id"}))
    created_list = await todo_lists.find_one({"_id": inserted.inserted_id})
    return DatabaseToDoList(**created_list)


async def add_item_to_todo_list(content: ToDoItemSchema, session: UUID) -> DatabaseToDoList:
    database_session = await find_session({"session": session})
    if await find_todo_list({"username": database_session.username}) is None:
        raise HTTPException(status_code=404, detail="User does not have a todo list yet.")

    if await todo_lists.find_one({"items.name": content.name}) is not None:
        raise HTTPException(status_code=409, detail="This task already exists.")

    update_result = await todo_lists.find_one_and_update(
        {"username": database_session.username},
        {"$push": {"items": content.model_dump()}},
        return_document=ReturnDocument.AFTER,
    )

    return DatabaseToDoList(**update_result)


async def remove_item_from_todo_list(item_name: str, session: UUID) -> DatabaseToDoList:
    database_session = await find_session({"session": session})
    if await find_todo_list({"username": database_session.username}) is None:
        raise HTTPException(status_code=404, detail="User does not have a todo list yet.")

    update_result = await todo_lists.find_one_and_update(
        {"$and": [{"username": database_session.username}, {"items.name": item_name}]},
        {"$pull": {"items": {"name": item_name}}},
        return_document=ReturnDocument.AFTER,
    )
    if update_result is None:
        raise HTTPException(status_code=404, detail="This item does not exist.")

    return DatabaseToDoList(**update_result)


async def complete_item_on_todo_list(item_name: str, session: UUID, status: bool) -> DatabaseToDoList:
    database_session = await find_session({"session": session})
    if await find_todo_list({"username": database_session.username}) is None:
        raise HTTPException(status_code=404, detail="User does not have a todo list yet.")

    update_result = await todo_lists.find_one_and_update(
        {"$and": [{"username": database_session.username}, {"items.name": item_name}]},
        {"$set": {"items.$.is_done": status}},
        return_document=ReturnDocument.AFTER,
    )
    if update_result is None:
        raise HTTPException(status_code=404, detail="This item does not exist.")

    return DatabaseToDoList(**update_result)
