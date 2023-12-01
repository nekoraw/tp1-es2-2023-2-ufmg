import math
import pytest
from datetime import datetime, UTC
from uuid import UUID

from fastapi import HTTPException

from models.Session import DatabaseSession
from routes.todo_crud import verify_session_expiry_date


def test_verify_valid_session_expiry_date():
    unexpired_time = math.floor(datetime.now(UTC).timestamp() + 600000)
    session = DatabaseSession(session=UUID(int=0x4), username="foo", expires_in=unexpired_time)

    res = verify_session_expiry_date(session)
    assert res is None


def test_verify_invalid_session_expiry_date():
    expired_time = math.floor(datetime.now(UTC).timestamp() - 600000)
    session = DatabaseSession(session=UUID(int=0x4), username="foo", expires_in=expired_time)

    with pytest.raises(HTTPException):
        verify_session_expiry_date(session)
