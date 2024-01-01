# Reroll.ing Server

## Endpoint

- `/roll/single`
- `/roll/multi`
- `/servant/:collectionNo`
- `/health`

## Rate calculations

Excluding Craft Essence to simplify the logic.

### Single

A roll is an independent event. Given a set of unique FGO servant entries (abbrev. `SV`), each servant is given a discrete rarity value from 0 to 5, corresponding to `Special case (Angra Mainyu), 1 star, 2 stars, Rare, SR, and SSR`.

For a single draw, the rate is defined as such.

```
SSR: 1%
SR: 3%
R: 40%
Others: 56%
```

Example: Chance of getting a particular SSR when pulling an SSR (say you want Castoria from the SSR pool) = 100 / Number of SSR ---> Overall chance = 1% \* Particular chance.

### Multi

A multi-roll is defined as the collection of 11 independent rolls with the 1st roll has a 100% probability bias to get an SR or SSR. We shall refer to this as the guaranteed roll (GR) to generalize it for permutations. Meaning that the GR can appear at any n-th roll.

## Get One Servant

Single query of one servant by their collection number is done via the endpoint: `/servant/:collectionNo` with `collectionNo` be an integer from 1 to whatever.

Example:

> APi server is listening on localhost.

HTTP Request:

```sh
curl localhost:8080/servant/1
```

Response:

```json
{
  "servant": {
    "collectionNo": 1,
    "originalName": "マシュ・キリエライト",
    "name": "Mash Kyrielight",
    "rarity": 3,
    "className": "shielder",
    "atkMax": 6791,
    "hpMax": 10302,
    "attribute": "earth",
    "face": "https://static.atlasacademy.io/JP/Faces/f_8001000.png",
    "face_path": "https://api.reroll.ing/assets/1.png"
  }
}
```
