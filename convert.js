const regex_dck = /\[.{3}:.{1,3}\]/;
const regex_mtga = /\(.{3}\)/;
var exception_names = [];

async function getExceptions(url){
    let card_exceptions_json = await fetch(url);
    let card_exceptions = await card_exceptions_json.json();
    for (x = 0; x < card_exceptions.data.length; x++){
        card = card_exceptions.data[x];
        exception_names.push(card.name);
    }
    console.log(`Loaded ${card_exceptions.data.length} exceptions. (Total: ${exception_names.length})`)

    if (card_exceptions.next_page){
        getExceptions(card_exceptions.next_page);
    }
}
getExceptions(`https://api.scryfall.com/cards/search?q="%2F%2F"&unique=cards&as=grid&order=name`);

function testException(name){
    for (let j = 0; j < exception_names.length; j++) {
        let e = exception_names[j];
        if (e.toLowerCase().includes(name.toLowerCase()) && e.split(" // ")[0] !=  e.split(" // ")[1]){
            return e
        }
    }
    return name
}

module.exports = {
    convMain: async function (input_text) {
        let decklist_obj = {
            mainboard: {},
            sideboard: {},
        }
        let sideboard_mode = false;
        let lines = input_text.split("\n");
        for (x = 0; x < lines.length; x++){
            let line = lines[x];

            // if there is a line in the middle with no content, its a sideboard divider. (MTGA AND DEK)
            if (x != 0 && line == ""){ sideboard_mode = true; } 
            // if the line starts with "SB: ", its a sideboard card. (DCK)
            else if (x != 0 && line.includes("SB: ")){ 
                sideboard_mode = true; 
                line = line.replace("SB: ", "");
            } 
            if (line != ""){
                if (regex_dck.test(line.split(" ")[1])) { // DCK line detected
                    let parts = line.split(" ");
                    let quantity = line[0]
                    let name = await testException(parts.slice(2).join(" "));
                    //let name = parts.slice(2).join(" ");
                    if (sideboard_mode == true){
                        decklist_obj.sideboard[name] = quantity;
                    }
                    else{
                        decklist_obj.mainboard[name] = quantity;
                    }
                    
                }
                else if (regex_mtga.test(line.split(" ")[line.split(" ").length - 2])) { // MTGA line detected
                    let parts = line.split(" ");
                    let quantity = line[0];
                    let name = await testException(parts.slice(1, parts.length - 2).join(" "));

                    if (sideboard_mode == true){
                        decklist_obj.sideboard[name] = quantity;
                    }
                    else{
                        decklist_obj.mainboard[name] = quantity;
                    }
                    
                }
                else {                                          // assume DEK file
                    let parts = line.split(" ");
                    let quantity = line[0];
                    let name = await testException(parts.slice(1).join(" "));

                    if (sideboard_mode == true){
                        decklist_obj.sideboard[name] = quantity;
                    }
                    else{
                        decklist_obj.mainboard[name] = quantity;
                    }
                }
            }

        }
        return decklist_obj
    }
};



// ============== .dck ==============
// 1 [M20:194] Shifting Ceratops
// 1 [ORI:174] Elemental Bond
// 1 [IKO:164] Migration Path
// 1 [ISD:130] Blasphemous Act
// SB: 1 [XLN:222] Gishath, Sun's Avatar


// ============== .dek ==============
// 1 Shifting Ceratops
// 1 Elemental Bond
// 1 Migration Path
// 1 Blasphemous Act

// 1 Gishath, Sun's Avatar


// ============== .mtga ==============
// 1 Shifting Ceratops (M20) 194
// 1 Elemental Bond (ORI) 174
// 1 Migration Path (IKO) 164
// 1 Blasphemous Act (ISD) 130

// 1 Gishath, Sun's Avatar (XLN) 222