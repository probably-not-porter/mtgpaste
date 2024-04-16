const express =         require('express');
var path =              require('path');
var favicon =           require('serve-favicon');
const { QuickDB } =     require("quick.db");
const bodyParser =      require('body-parser');



const db = new QuickDB();
const app = express();
const jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser);
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

app.get('/fetch', async function(req, res) {
    console.log(`attempt to fetch ${req.query.id}`)
    let deck = await db.get(req.query.id);
    res.send(deck);
  });

app.post('/create', jsonParser, async function(req, res) {
    var id = Date.now().toString();
    console.log(req.body)
    const newDeck = {
        name: req.body.name,
        author: req.body.author,
        id: id,
        text: req.body.text,
        notes: req.body.notes
    };
    await db.set(id, newDeck);
    res.send(id);
  });

app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    res.render("mtgpaste",{
    })
});
app.get('/syntax', function(req, res) {
  res.render("syntax",{
  })
});

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 9080, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
