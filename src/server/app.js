const path = require('path');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');

const upload = multer(); // for parsing multipart/form-data

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const timer = require('./timer.js');

const routes = express.Router();

routes.post('/records', upload.array(), (req, res) => {
  // console.log(req);
  console.log(req.body);
  if (req.body.action === 'start') timer.start(req.body);
  else if (req.body.action === 'stop') timer.stop(req.body);
  else {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

routes.use('/', express.static(path.join('public')));

app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Listening on port ${port}`);

module.exports = app;
