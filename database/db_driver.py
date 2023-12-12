import sqlite3
from sqlite3 import OperationalError
import json
import os

import requests

con = sqlite3.connect("sv_db.db")
cur = con.cursor()


def init_sql():
    if os.stat("./sv_db.db").st_size == 0:
        with open("./init.sql", "r") as db_init:
            commands = db_init.read().split(';')

            for cmd in commands:
                try:
                    cur.execute(cmd)
                except OperationalError as msg:
                    print("Command skipped: ", msg)


def load_json():
    with open("./fgo-servants-basic.json", "r", encoding="utf-8") as sv_db:
        data = json.load(sv_db)
        servants = data

    return servants


def fetch_new_data():
    url = "https://api.atlasacademy.io/export/JP/basic_servant_lang_en.json"
    r = requests.get(url)
    data = r.json()

    return data


def update_db(json_data):
    for i in range(len(json_data)):
        cur.execute("INSERT INTO servants (collectionNo, sv_name, rarity, class_name, face) VALUES (?, ?, ?, ?, ?)",
                    (json_data[i]['collectionNo'], json_data[i]['name'], json_data[i]['rarity'], json_data[i]['className'], json_data[i]['face']))

        con.commit()
