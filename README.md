# MTG Paste
NodeJS/SQLite website to create and share decklists. Built with [mtgify](https://mtgify.org/), and inspiration from [pokepast.es](https://pokepast.es/).

# Database Structure
Each deck has the following structure in the sqlite database:
```json
{
    name: "Deck name",
    author: "Deck Author",
    id: 123123123,
    mainboard: {
        "Card Name 1": 1,
        "Card Name 2": 4
    },
    sideboard: {
        "Card Name 1": 2,
        "Card Name 2": 2
    },
    notes: "User notes about deck"
}
```
Decks are keyed by ID and accessible by the API.

# Conversions 
Basic conversions are done on the backend to accomodate multiple file types being pasted in. `convert.js` determines the type of each line (in case lists are mixed) and reduces it to a name and quantity in a data structure, and then passes it back to the API to be saved in a sqlite database.

### .DCK File Example
Determined with this regex: `/\[.{3}:.{1,3}\]/`
```
1 [M20:194] Shifting Ceratops
1 [ORI:174] Elemental Bond
1 [IKO:164] Migration Path
1 [ISD:130] Blasphemous Act
SB: 1 [XLN:222] Gishath, Sun's Avatar
```
### .MTGA File Example
Determined with this regex: `/\(.{3}\)/`
```
1 Shifting Ceratops (M20) 194
1 Elemental Bond (ORI) 174
1 Migration Path (IKO) 164
1 Blasphemous Act (ISD) 130

1 Gishath, Sun's Avatar (XLN) 222
```

### .DEK File Example
If neither of the other two regex are a match, it is this format, which is the same as the output from the website.
```
1 Shifting Ceratops
1 Elemental Bond
1 Migration Path
1 Blasphemous Act

1 Gishath, Sun's Avatar
```
# Exceptions
Currently, the input for mtgify will fail on two-sided cards from some decklist providers (including Xmage).
These cards should have their names represented like this: `Aberrant Researcher // Perfected Form`, but will sometimes only show up with the "side A" name: `Aberrant Researcher`.

To solve this, there is an exceptions system in `convert.js` which takes scryfall search queries and adjusts the names of matching cards.

Query to fix two-sided cards:
https://api.scryfall.com/cards/search?q="%2F%2F"&unique=cards&as=grid&order=name