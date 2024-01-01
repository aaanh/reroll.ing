import sqlite3
from sqlite3 import OperationalError
import json
import os
from time import perf_counter
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
    json_data = r.json()

    return json_data


def zip_sv_faces():
    """
    Zip all servant faces in the local assets folder into sv_faces.zip
    """

    if os.name == "nt":
        # Windows
        os.system(
            "powershell Compress-Archive -Force -Path ./assets -DestinationPath ./sv_faces.zip")

    if os.name == "posix":
        # Linux
        os.system("zip -r ./sv_faces.zip ./assets")


def fetch_and_store_sv_faces(sql_data):
    """
    Fetch and store all servant faces in the local database from the Atlas Academy API
    """

    if os.path.exists("./assets") is not True:
        os.mkdir("./assets")

    start = perf_counter()

    for row in sql_data:
        url = f"{row[8]}"
        print(url)
        if os.path.exists(f"./assets/{row[0]}.png"):
            print(f"Face for ({row[0]}) {row[1]} already exists, skipping")
            continue
        else:
            r = requests.get(url)
            with open(f"./assets/{row[0]}.png", "wb") as f:
                f.write(r.content)
            print(f"Stored face for ({row[0]}) {row[1]} - {len(r.content)}")

    end = perf_counter()

    print(f"Downloaded {len(sql_data)} faces in {end - start} seconds")


def download_sv_faces():
    """
    Download sv_faces.zip from the latest release on GitHub
    """

    if os.path.exists("./sv_faces.zip"):
        os.remove("./sv_faces.zip")

    asset_url = requests.get(
        "https://api.github.com/repos/aaanh/reroll.ing/releases").json()[0]['assets'][0]["browser_download_url"]
    # print(asset_url)
    r = requests.get(asset_url)
    with open("./sv_faces.zip", "wb") as f:
        f.write(r.content)
    print(f"Downloaded sv_faces.zip, size: {len(r.content)}")

    if os.path.exists("./assets"):
        print("assets folder already exists, skipping unzip")
    else:
        # unzip downloaded file
        os.system("unzip ./sv_faces.zip -d .")


def update_db(json_data):
    """
    Update the SQLite database with the data from the json file
    """

    current_path = os.getcwd()
    for i in range(len(json_data)):
        try:
            face_path = f"https://api.reroll.ing/assets/{json_data[i]['collectionNo']}.png"
            cur.execute("INSERT INTO servants (collectionNo, sv_original_name, sv_name, rarity, class_name, atk_max, hp_max, attribute, face_url, face_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        (json_data[i]['collectionNo'], json_data[i]['originalName'], json_data[i]['name'], json_data[i]['rarity'], json_data[i]['className'], json_data[i]['atkMax'], json_data[i]['hpMax'], json_data[i]['attribute'], json_data[i]['face'], face_path))
        except sqlite3.IntegrityError:
            print(
                f"Servant already exists in database, skipping: {json_data[i]['collectionNo']} - \"{json_data[i]['name']}\"")

        con.commit()
