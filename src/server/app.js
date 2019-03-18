import * as path from 'path';
import express from 'express';

let app = express();
let bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        console.log(JSON.stringify(row));
    }
    client.end();
});

const routes = express.Router();

function startTimer(body) {

}

function stopTimer(body) {
    
}

routes.post('/records', upload.array(), function(req, res) {
    console.log(req.method);
    console.log(req.body);
    res.send();
    if(req.body.action === "start") 
        startTimer(req.body);
    else if(req.body.action === "stop")
        stopTimer(req.body);
});

routes.use('/',express.static(path.join('public')));

app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);
