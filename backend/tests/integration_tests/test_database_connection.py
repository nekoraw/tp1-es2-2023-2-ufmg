import pytest
import pytest_asyncio
from motor.core import AgnosticCollection
from database.mongodb_connection import MongoDBConnection

pytest_plugins = ("pytest_asyncio",)


@pytest_asyncio.fixture
async def setup():
    connection = MongoDBConnection()

    yield connection

    await connection.client.drop_database("project_test")


@pytest.mark.asyncio
async def test_collection_getter(setup: MongoDBConnection):
    collection = setup.get_collection("test_collection")
    assert isinstance(collection, AgnosticCollection)
    assert collection.name == "test_collection"
