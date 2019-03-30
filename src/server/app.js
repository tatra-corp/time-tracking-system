import * as path from 'path';
import express from 'express';

const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');

const upload = multer(); // for parsing multipart/form-data

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const timer = require('./timer.js');

const routes = express.Router();

routes.post('/records', upload.array(), (req, res) => {
  console.log(req.method);
  console.log(req.body);
  res.send();
  if (req.body.action === 'start') timer.start(req.body);
  else if (req.body.action === 'stop') timer.stop(req.body);
});

routes.use('/', express.static(path.join('public')));

app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Listening on port ${port}`);
