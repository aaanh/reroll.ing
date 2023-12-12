import sqlite3
from sqlite3 import OperationalError

con = sqlite3.connect("sv_db.db")
cur = con.cursor()


def init_sql():
    with open("./init.sql", "r") as db_init:
        commands = db_init.read().split(';')

        for cmd in commands:
            try:
                cur.execute(cmd)
            except OperationalError as msg:
                print("Command skipped: ", msg)
