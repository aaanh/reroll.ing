import sqlite3
from sqlite3 import OperationalError

con = sqlite3.connect("sv_db.db")
cur = con.cursor()

cols = cur.execute("pragma table_info ('servants')").fetchone()
getall = cur.execute("SELECT * FROM servants").fetchall()
print(getall[0])