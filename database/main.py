import json
import sqlite3
from db_driver import init_sql
import os

if __name__ == "__main__":
    servants = []

    with open("./fgo-servants-basic.json", "r", encoding="utf-8") as sv_db:
        data = json.load(sv_db)
        servants = data

    if os.stat("./sv_db.db").st_size == 0:
        init_sql()

    con = sqlite3.connect("sv_db.db")
    cur = con.cursor()

    cur.execute('SELECT * FROM servants').fetchall()
