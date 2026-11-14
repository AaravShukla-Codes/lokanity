"""Create / update the database without starting the server:  python init_db.py"""
import sqlite3

from app import create_app
from app.db import init_database

app = create_app({"AUTO_MIGRATE": False})
applied = init_database(app)
path = app.config["DATABASE"]
print("Database:", path)
print("Applied now:", ", ".join(applied) if applied else "nothing (already up to date)")
with sqlite3.connect(path) as c:
    tables = [r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")]
    print("Tables:", ", ".join(tables))
