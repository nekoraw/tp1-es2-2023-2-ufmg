import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
load_dotenv()


class MongoDBConnection:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        self.client = AsyncIOMotorClient(os.environ.get("MONGODB_URI"))
        self.db = self.client[os.environ.get("MONGODB_DATABASE")]

    def get_collection(self, collection_name):
        return self.db[collection_name]
