# MTG Tools

## MTG Paste
NodeJS/SQLite website to create and share decklists

## Misc Scripts
Some other mtg related scripts and bits.

### abc.py
Find the best combos for Now I Know My ABC's

```py
python3 abc.py \
  -i /storage/datasets/mtg-tcg/mtg-unique.json \
  -n 10 \
  -v 1000000 \
  -m 5 \
  -c W U B R G
```

## Data
Some of my scripts make use of Scryfall data. Use the following quick bash scripts to pull new versions of these datasets.

### mtg-unique.json (~150MB)
