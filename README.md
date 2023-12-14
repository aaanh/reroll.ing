# Reroll.ing

> I bought the domain as a joke and now feel compelled to do something with it.

So I build a full-stack FGO roll simulator.

## Features

- [x] Single roll
  - Partially implemented with Servants-only and all rarities have equal rate.
- [ ] Multi roll
  - Not implemented
- [ ] Servants card face
- [ ] Servants class border
- [x] Servants rarity border

## Database

Everything in this domain is done in Python.

Servants data is retrieved from [Atlas Academy](https://atlasacademy.io) API. The dataset type is basic with servant names in both EN and JP and includes the servant card face asset URL.

The database contains a reduction of this dataset which only includes the following properties/columns/attributes:

```sql
CREATE TABLE servants(
  collectionNo INT PRIMARY KEY,
  sv_name VARCHAR(128) NOT NULL,
  rarity INT,
  class_name VARCHAR(50) NOT NULL,
  face VARCHAR(200) NOT NULL
);
```

Currently, it is implemented in the simplest database SQLite3 for local development with plans to eventually host on a PostgreSQL server somewhere.

### Update

The database update strategy is polling. Every 2 weeks, a schedule task SHOULD run to fetch the latest dataset from the Atlas Academy API. After fetching, the task SHOULD simply execute an update function which would insert any new entries into the database, which SHOULD handle the PRIMARY KEY collision exception and skip existing servant entries.

NOTE: I acknowledge that this is not the most efficient nor optimized way; however, it is not a resource intensive operation nor a frequent operation, so this is a good enough trade-off with the efforts needed to develop better code.

For example:

```python
def fetch_new_data():
    url = "https://api.atlasacademy.io/export/JP/basic_servant_lang_en.json"
    r = requests.get(url)
    data = r.json()

    return data

def update_db(json_data):
    for i in range(len(json_data)):
        try:
            cur.execute("INSERT INTO servants (collectionNo, sv_name, rarity, class_name, face) VALUES (?, ?, ?, ?, ?)",
                        (json_data[i]['collectionNo'], json_data[i]['name'], json_data[i]['rarity'], json_data[i]['className'], json_data[i]['face']))
        except sqlite3.IntegrityError:
            print(
                f"Servant already exists in database, skipping: {json_data[i]['collectionNo']} - \"{json_data[i]['name']}\"")

        con.commit()
```
