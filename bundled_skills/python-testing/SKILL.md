---
name: python-testing
description: Use when the user wants to write or improve Python tests using pytest.
license: Apache-2.0
author: OpenGriffin
---

# Python testing with pytest

## Test layout

```
project/
├── src/myapp/
└── tests/
    ├── test_unit.py
    ├── test_integration.py
    └── conftest.py    # shared fixtures
```

## Fixtures

```python
import pytest

@pytest.fixture
def db():
    conn = sqlite3.connect(":memory:")
    conn.executescript(SCHEMA)
    yield conn
    conn.close()
```

Scope (`function`, `class`, `module`, `session`) controls reuse — default is `function`.

## Parametrize

```python
@pytest.mark.parametrize("input,expected", [
    ("hello", 5),
    ("", 0),
    ("a b c", 5),
])
def test_length(input, expected):
    assert len(input) == expected
```

## Async tests

```python
@pytest.mark.asyncio
async def test_fetch():
    result = await fetch_url("...")
    assert result.status == 200
```

Add `pytest-asyncio` to deps.

## Mocking

```python
def test_calls_api(monkeypatch):
    monkeypatch.setattr("myapp.client.requests.get", lambda url: FakeResponse(...))
    ...
```

## Coverage

```bash
pytest --cov=src/myapp --cov-report=term-missing
```

## Anti-patterns

- Tests that share state via globals or the filesystem (use `tmp_path` fixture).
- Mocking what you own (mock at boundaries: HTTP, filesystem, time).
- Tests that pass even when the code is broken (write the test FAILING first).
