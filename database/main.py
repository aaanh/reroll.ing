import sqlite3
import sys
import db_driver as dd
import os


def main():
    args = sys.argv[1:]

    con = sqlite3.connect("sv_db.db")
    cur = con.cursor()

    if len(args) == 1 and args[0] == "update":
        dd.update_db(dd.fetch_new_data())
        dd.fetch_and_store_sv_faces(cur.execute(
            'SELECT * FROM servants').fetchall())

    if len(args) == 2 and args[0] == "update" and args[1] == "--faces":
        dd.fetch_and_store_sv_faces(cur.execute(
            'SELECT * FROM servants').fetchall())

    if len(args) == 1 and args[0] == "download-faces":
        dd.download_sv_faces()

    if os.stat("./sv_db.db").st_size == 0:
        dd.init_sql()
        dd.update_db(dd.load_json())


if __name__ == "__main__":
    main()
