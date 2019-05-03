const path = require('path');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');

const upload = multer(); // for parsing multipart/form-data

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const records = require('./records.js');

const routes = express.Router();

routes.post('/records', upload.none(), (req, res) => {
  if (req.body.action === 'start') records.startTimer(req.body);
  else if (req.body.action === 'stop') records.stopTimer(req.body);
  else {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

routes.get('/records', (req, res) => {
  const handler = (data) => {
    res.status(200).send(JSON.stringify(data));
  };
  const errHandler = (reason) => {
    console.error(reason);
    res.sendStatus(400);
  };
  if (req.query.active) {
    records.getActiveRecordFor(req.query.username).then(handler).catch(errHandler);
  } else {
    records.getRecords(req.query.offset, req.query.limit).then(handler).catch(errHandler);
  }
});

routes.delete('/records', (req, res) => {
  const handler = (data) => {
    res.status(200).send(JSON.stringify(data));
  };
  const errHandler = (reason) => {
    console.error(reason);
    res.sendStatus(400);
  };
  records.deleteRecord(req.query.username, req.query.start).then(handler).catch(errHandler);
});

routes.get('/users_list', (req, res) => {
  records.getUsers().then((data) => {
    res.status(200).send(JSON.stringify(data));
  }).catch((reason) => {
    console.error(reason);
    res.sendStatus(400);
  });
});

routes.get('/projects_list', (req, res) => {
  records.getProjects(req.query.user).then((data) => {
    res.status(200).send(JSON.stringify(data));
  }).catch((reason) => {
    console.error(reason);
    res.sendStatus(400);
  });
});

routes.get('/tasks_list', (req, res) => {
  records.getTasks(req.query.project).then((data) => {
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
