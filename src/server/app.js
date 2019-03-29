import * as path from 'path';
import express from 'express';

const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
// v1.0.5
const upload = multer(); // for parsing multipart/form-data

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

const routes = express.Router();

async function findStudentID(username) {
  const result = await client.query('SELECT id FROM student WHERE name = $1', [username]);
  if (typeof result === 'undefined') return undefined;
  return result.rows[0].id;
}

async function findProjectID(projectName) {
  const result = await client.query('SELECT id FROM project WHERE name = $1', [projectName]);
  if (typeof result === 'undefined') return undefined;
  return result.rows[0].id;
}

async function findTaskID(taskName, projectID) {
  const result = await client.query('SELECT id FROM task WHERE name = $1 AND project = $2', [taskName, projectID]);
  if (typeof result === 'undefined') return undefined;
  return result.rows[0].id;
}

async function startTimer(body) {
  const studentId = await findStudentID(body.username);
  const projectID = await findProjectID(body.project_name);
  const taskID = await findTaskID(body.task_name, projectID);

  client.query('INSERT INTO record(student, project, task, start) values($1, $2, $3, to_timestamp($4))', [studentId,
    projectID, taskID, body.start_time]);
}

async function findRecordID(body) {
  const studentID = await findStudentID(body.username);
  const projectID = await findProjectID(body.project_name);
  const taskID = await findTaskID(body.task_name, projectID);

  const result = await client.query('SELECT id FROM record WHERE student = $1 AND project = $2 AND task = $3'
        + 'AND start = to_timestamp($4)', [studentID, projectID, taskID, body.start_time]);
  if (typeof result === 'undefined') return undefined;
  return result.rows[0].id;
}

async function stopTimer(body) {
  const recordID = await findRecordID(body);

  client.query('UPDATE record SET stop = to_timestamp($1) WHERE id = $2', [body.stop_time, recordID]);
}

routes.post('/records', upload.array(), (req, res) => {
  console.log(req.method);
  console.log(req.body);
  res.send();
  if (req.body.action === 'start') startTimer(req.body);
  else if (req.body.action === 'stop') stopTimer(req.body);
});

routes.use('/', express.static(path.join('public')));

app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Listening on port ${port}`);
