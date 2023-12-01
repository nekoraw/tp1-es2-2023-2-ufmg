import asyncio
import pytest
from uuid import UUID
from database.mongodb_connection import MongoDBConnection
from models.Session import DatabaseSession, find_session, create_new_session

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
async def test_find_session(setup: MongoDBConnection):
    collection = setup.get_collection("sessions")
    test_session = DatabaseSession(
        username="juliano",
        session=UUID(int=0x12),
        expires_in=-1,
    )
    await collection.insert_one(test_session.model_dump(by_alias=True, exclude={"id"}))

    found_session = await find_session({"username": "juliano"})
    assert found_session.username == "juliano"
    assert found_session.session == UUID(int=0x12)
    assert found_session.expires_in == -1


@pytest.mark.asyncio
async def test_nonexistent_session():
    found_session = await find_session({"username": "nao existe esse usuario, logo nao vai existir a sessao"})
    assert found_session is None


@pytest.mark.asyncio
async def test_create_session():
    session = await create_new_session("juliano")
    found_session = await find_session({"username": "juliano"})

    assert session.username == found_session.username
    assert session.session == found_session.session
    assert session.expires_in == found_session.expires_in
