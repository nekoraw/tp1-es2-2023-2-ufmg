import re
from constants.regexes import email


def test_email_regex():
    assert re.match(email, "example@example.com") is not None
    assert re.match(email, "example.com") is None
