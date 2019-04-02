const path = require('path');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');

const upload = multer(); // for parsing multipart/form-data

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const timer = require('./records.js');

const routes = express.Router();

routes.post('/records', upload.none(), (req, res) => {
  if (req.body.action === 'start') timer.start(req.body);
  else if (req.body.action === 'stop') timer.stop(req.body);
  else {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

routes.get('/records', (req, res) => {
  timer.getRecords(req.query.offset, req.query.limit).then((data) => {
    res.status(200).send(JSON.stringify(data));
  }).catch((reason) => {
    console.error(reason);
    res.sendStatus(400);
  });
});

routes.use('/', express.static(path.join('public')));

app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Listening on port ${port}`);

module.exports = app;
