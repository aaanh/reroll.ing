import sqlite3
import sys
import db_driver as dd
import os


def main():
    args = sys.argv[1:]

    if len(args) == 0: # default no args
        print("Initializing database...")
        dd.init_sql()
        dd.update_db(dd.fetch_new_data())

        # Query and download
        print("Downloading assets")
        dd.download_sv_faces()


    con = sqlite3.connect("sv_db.db")
    cur = con.cursor()

    if len(args) == 2 and args[0] == "download" and args[1] == "--new":
        dd.update_db(dd.fetch_new_data())
        sql_data = cur.execute('SELECT * FROM servants').fetchall()
        dd.fetch_and_store_sv_faces(sql_data) # This queries the API, should not be used

    if len(args) == 1 and args[0] == "download":
        dd.download_sv_faces()

    if len(args) == 1 and args[0] == "zip":
        dd.zip_sv_faces()


if __name__ == "__main__":
    main()
