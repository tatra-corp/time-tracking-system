import * as path from 'path';
import express from 'express';

let app = express();
let bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const routes = express.Router();

routes.post('/records', upload.array(), function(req, res) {
    console.log("Yaaaaaay");
    console.log(req.body);
});

routes.use('/',express.static(path.join('public')));

app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);