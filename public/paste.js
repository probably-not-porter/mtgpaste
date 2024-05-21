// ================= CREATE NEW ================= //
function createDeck(){
    let name = document.getElementById('nameInput').value;
    let author = document.getElementById('authorInput').value;
    let notes = document.getElementById('notesInput').value;
    let text = document.getElementById('pastebox').value;

    if (name == "" || name == null){
        name = "Untitled Decklist";
    }
    if (author == "" || author == null){
        author = "Unknown Author";
    }
    if (notes == "" || notes == null){
        notes = "";
    }

    jQuery.ajax({
        url: "/create",
        type: "POST",
        data: { 
            "name": name,
            "text": text,
            "notes": notes,
            "id": "",
            "author": author
        },
        dataType: "json",
        success: function(result) {
            console.log(result);
            window.location = window.location.origin + `?id=${result}`
        }
    }); 
}
// ================= LOAD DECK BY ID ================= //
function loadDeck(id){
    $.ajax({ // api request using built in user data
        type: 'GET',
        url: '/fetch',
        data: {id: id},
        success: function(result) { 
            if (result != "" && result != null){
                CARDLIST = result.text;
                //render_list(result.text,result.name,result.author,result.notes);
                render_list(result);
            }
            else{
                document.getElementById("deck_container").innerHTML = `Decklist not found! <a href="${window.location.origin}">Why not make one?</a>`;
            }
        },
        error: function(xhr, status, err) {
            console.error("something went wrong...");
        }
    });
}

// ================= CREATE DECKBUILDER ================= //
function deckbuilder(){
    let html = `<textarea maxlength="10000" type="text" id='pastebox' placeholder="Paste some cards" name="txtarea"></textarea>`

    let side_html = `
    <h1>MTGPaste</h1>
    <input type="text" placeholder='Deck Name' class='deckinput' id='nameInput'></><br>
    <input type="text" placeholder='Author Name' class='deckinput' id='authorInput'></><br>
    <textarea maxlength="200" placeholder='Deck Notes' class='deckinput' id='notesInput'></textarea><br>
    <button onclick='createDeck()' id='create'>Create</button> 
    <button onclick="location.href='/syntax'">Syntax Reference</button> 
    <button onclick="location.href='https://github.com/probably-not-porter/mtgpaste'">Github</button>
    <br><br><br><br>

    <p1><strong>How to use this tool</strong></p1>
    <ol>
        <li>Paste your deck from the Web, Xmage, Arena, or MTGO, or type it out.</li>
        <li>Add your name, a title, or notes (all optional).</li>
        <li>Copy the link and go forth to share.</li>
    </ol> 
    <br><br>
    `;

    document.getElementById("deck_container").innerHTML = html;
    document.getElementById("sidebar").innerHTML = side_html;
}

// ================= RENDER CARDLIST ================= //
async function render_list(deck){
    // render meta inf
    document.getElementById("sidebar").innerHTML = `
    <h1>${deck.name}</h1>
    <h2>by ${deck.author}</h2>
    <p1>${deck.notes}</p1>
    <br><br><br><br>
    <button onclick='location.href=location.origin'>Create new</button> 
    <button onclick="location.href='/syntax'">Syntax Reference</button> 
    <button onclick="location.href='https://github.com/probably-not-porter/mtgpaste'">Github</button>
    `;
    
    // render deck
    document.getElementById("deck_container").innerHTML = "";
    maindeck_html = "";
    for (const [cardname, cardnum] of Object.entries(deck.mainboard)) {
        maindeck_html += `<div><auto-card name="${cardname}">${cardnum} ${cardname}</auto-card></div>`;
    }
    maindeck_html += `<br>`;
    for (const [cardname, cardnum] of Object.entries(deck.sideboard)) {
        maindeck_html += `<div><auto-card name="${cardname}">${cardnum} ${cardname}</auto-card></div>`;
    }
    document.getElementById("deck_container").innerHTML += maindeck_html;
}

// ================= ONLOAD ================= //
window.addEventListener("load", (event) => {
    console.info("page is fully loaded, checking URL for decklist.");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get('id') != null){
        console.info("Found decklist ID, attempting to fetch.");
        let id = urlParams.get('id');
        loadDeck(id);
    }
    else{ 
        console.info("No decklist ID, creating deck builder.");
        deckbuilder(); 
    }
});