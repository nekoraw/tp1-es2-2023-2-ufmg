import asyncio

import pytest
from database.mongodb_connection import MongoDBConnection
from models.User import DatabaseUser, find_user

pytest_plugins = ("pytest_asyncio",)


@pytest.fixture(scope="module")
def event_loop():
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture()
def setup():
    connection = MongoDBConnection()
    yield connection
    asyncio.ensure_future(connection.client.drop_database("project_test"))


@pytest.mark.asyncio
async def test_find_user(setup: MongoDBConnection):
    collection = setup.get_collection("users")
    test_user = DatabaseUser(username="juliano", password="123123", email="example@example.com")
    await collection.insert_one(test_user.model_dump(by_alias=True, exclude={"id"}))

    found_user = await find_user({"username": "juliano"})
    assert found_user.username == "juliano"
    assert found_user.password == "123123"
    assert found_user.email == "example@example.com"


@pytest.mark.asyncio
async def test_nonexistent_user():
    found_user = await find_user({"username": "nao existe esse usuario"})
    assert found_user is None
