let db = require('./db').getDb();

module.exports = {
    start: startTimer,
    stop: stopTimer
};

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
    const projectIdPromise = findProjectID(body.project_name);
    const studentIdPromise = findStudentID(body.username);
    const projectId = await projectIdPromise;
    const taskIdPromise = findTaskID(body.task_name, projectId);
    const studentId = await studentIdPromise;
    const taskId = await taskIdPromise;

    const result = await db.query('SELECT id FROM record WHERE student = $1 AND project = $2 AND task = $3'
        + 'AND start = to_timestamp($4)', [studentId, projectId, taskId, body.start_time]);
    if (typeof result === 'undefined') return undefined;
    return result.rows[0].id;
}

async function startTimer(body) {
    const projectIdPromise = findProjectID(body.project_name);
    const studentIdPromise = findStudentID(body.username);
    const projectId = await projectIdPromise;
    const taskIdPromise = findTaskID(body.task_name, projectId);
    const studentId = await studentIdPromise;
    const taskId = await taskIdPromise;

    db.query('INSERT INTO record(student, project, task, start) values($1, $2, $3, to_timestamp($4))', [studentId,
        projectId, taskId, body.start_time]);
}

async function stopTimer(body) {
    const recordID = await findRecordID(body);

    db.query('UPDATE record SET stop = to_timestamp($1) WHERE id = $2', [body.stop_time, recordID]);
}