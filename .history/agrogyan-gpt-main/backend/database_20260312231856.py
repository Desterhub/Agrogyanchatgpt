import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database file (use a path relative to this module so it works regardless of cwd)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'agrogyan.db')}"

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Required for SQLite
)

# Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for models
Base = declarative_base()


def _ensure_columns():
    """Ensure the expected columns exist in the posts table.

    This prevents `OperationalError: no such column` when a DB file was created
    before a schema change (e.g., added likes/dislikes).
    """

    with engine.connect() as conn:
        try:
            result = conn.execute(text("PRAGMA table_info(posts)"))
        except Exception:
            return

        existing_columns = {row[1] for row in result}

        if "likes" not in existing_columns:
            conn.execute(text("ALTER TABLE posts ADD COLUMN likes INTEGER DEFAULT 0"))

        if "dislikes" not in existing_columns:
            conn.execute(text("ALTER TABLE posts ADD COLUMN dislikes INTEGER DEFAULT 0"))

        if "reactions" not in existing_columns:
            conn.execute(text("ALTER TABLE posts ADD COLUMN reactions TEXT DEFAULT '{}'"))


# Apply schema fixes automatically on import
_ensure_columns()
