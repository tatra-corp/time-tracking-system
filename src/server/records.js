const db = require('./db').getDb();

async function findStudentID(username) {
  const result = await db.query('SELECT id FROM student WHERE name = $1', [username]);
  if (typeof result === 'undefined') return undefined;
  return result.rows[0].id;
}

async function findProjectID(projectName) {
  const result = await db.query('SELECT id FROM project WHERE name = $1', [projectName]);
  if (typeof result === 'undefined') return undefined;
  return result.rows[0].id;
}

async function findTaskID(taskName, projectID) {
  const result = await db.query('SELECT id FROM task WHERE name = $1 AND project = $2', [taskName, projectID]);
  if (typeof result === 'undefined') return undefined;
  return result.rows[0].id;
}

async function findRecordID(body) {
  const projectIdPromise = findProjectID(body.project);
  const studentIdPromise = findStudentID(body.username);
  const projectId = await projectIdPromise;
  const taskIdPromise = findTaskID(body.task, projectId);
  const studentId = await studentIdPromise;
  const taskId = await taskIdPromise;

  const result = await db.query('SELECT id FROM record WHERE student = $1 AND project = $2 AND task = $3'
    + 'AND start = to_timestamp($4)', [studentId, projectId, taskId, body.start_time]);
  if (typeof result === 'undefined') return undefined;
  return result.rows[0].id;
}

async function startTimer(body) {
  const projectIdPromise = findProjectID(body.project);
  const studentIdPromise = findStudentID(body.username);
  const projectId = await projectIdPromise;
  const taskIdPromise = findTaskID(body.task, projectId);
  const studentId = await studentIdPromise;
  const taskId = await taskIdPromise;

  db.query('INSERT INTO record(student, project, task, start) values($1, $2, $3, to_timestamp($4))', [studentId,
    projectId, taskId, body.start_time]);
}

async function stopTimer(body) {
  const recordID = await findRecordID(body);
  db.query('UPDATE record SET stop = to_timestamp($1) WHERE id = $2', [body.stop_time, recordID]);
}

async function getActiveRecordFor(username) {
  const result = await db.query(
    'SELECT record.id, student.name as student, project.name as project, '
      + 'task.name as task, record.start, record.stop FROM record '
      + 'JOIN student ON record.student = student.id JOIN project ON record.project = project.id '
      + 'JOIN task ON record.task = task.id WHERE student.name = $1 AND record.stop IS NULL '
      + 'ORDER BY start DESC', [username],
  );
  return result.rows[0];
}

async function getRecords(offset, limit) {
  const result = await db.query('SELECT record.id, student.name as student, project.name as project, task.name as task, record.start, record.stop FROM record '
    + 'JOIN student ON record.student = student.id JOIN project ON record.project = project.id JOIN task ON record.task = task.id '
    + 'ORDER BY start DESC OFFSET $1 LIMIT $2', [offset, limit]);
  return result.rows;
}

async function getUsers() {
  const result = await db.query('SELECT student.name as username FROM student ORDER BY username');
  return result.rows.map(row => row.username);
}

async function getProjects(username) {
  const result = await db.query('SELECT project.name as project FROM student'
    + ' JOIN participant ON student.name = $1 AND student.id = participant.student'
    + ' JOIN project ON participant.project = project.id'
    + ' ORDER BY project', [username]);
  return result.rows.map(row => row.project);
}

async function getTasks(project) {
  const result = await db.query('SELECT task.name as task FROM project '
    + 'JOIN task ON project.name = $1 AND project.id = task.project '
    + 'ORDER BY task', [project]);
  return result.rows.map(row => row.task);
}

async function deleteRecord(username, start) {
  console.log(username);
  console.log(start);
  const sid = await findStudentID(username);
  const result = await db.query('DELETE FROM record WHERE student = $1 AND start = $2', [sid, start]);
  return result.rows;
}

module.exports = {
  startTimer,
  stopTimer,
  getRecords,
  getUsers,
  getProjects,
  getTasks,
  getActiveRecordFor,
  deleteRecord
};
