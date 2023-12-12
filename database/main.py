import sqlite3
import db_driver as dd
import os


def main():
    dd.init_sql()
    # dd.update_db(dd.load_json())

    con = sqlite3.connect("sv_db.db")
    cur = con.cursor()

    fetched = cur.execute('SELECT * FROM servants').fetchall()
    for row in fetched:
        print(row)


if __name__ == "__main__":
    main()
