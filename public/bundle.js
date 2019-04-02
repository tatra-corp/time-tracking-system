let start;

function sendRecord(action) {
  const data = new FormData(document.forms.record);
  data.append('action', action);
  if (action === 'stop') data.append('stop_time', (new Date()).getTime() / 1000);
  data.append('start_time', start.getTime() / 1000);
  data.delete('x');
  data.delete('y');
  data.delete('time'); // we already sending unix time;

  const Http = new XMLHttpRequest();
  const url = '/records';
  Http.open('POST', url);
  Http.send(data);
  /*
    return new Promise((resolve) => {
        Http.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                resolve();
            }
        }
    }); */
}

function setInputsLocked(isLocked) {
  const form = document.forms.record;
  form.username.readOnly = isLocked;
  form.project_name.readOnly = isLocked;
  form.task_name.readOnly = isLocked;
}

function validateForm() {
  return true;
}

function getTimeDiff(date1, date2) {
  // console.log(date1);
  // console.log(date2);
  const diff = new Date(date2.getTime() - date1.getTime());
  return `${(`0${diff.getUTCHours()}`).slice(-2)}:${
    (`0${diff.getMinutes()}`).slice(-2)}:${
    (`0${diff.getSeconds()}`).slice(-2)}`;
}

function updateTime(initial) {
  const time = document.getElementById('time');
  time.value = getTimeDiff(initial, new Date());
}

function getRecords(offset, limit) {
  const Http = new XMLHttpRequest();
  const url = `/records?offset=${offset}&limit=${limit}`;
  Http.open('GET', url);
  Http.send();
  Http.onload = () => {
    if (Http.status === 200) {
      const records = JSON.parse(Http.responseText);
      const template = document.querySelector('div#records_table table tbody .table_record');
      let prev = document.querySelector('div#records_table table tbody .table_record:last-child');
      for (let i = 0; i < records.length; i += 1) {
        const row = template.cloneNode(true);
        if (records[i].stop === null) {
          records[i].stop = new Date();
        }
        row.querySelector('.table_time').innerHTML = getTimeDiff(new Date(records[i].start), new Date(records[i].stop));
        row.querySelector('.table_user').innerHTML = records[i].student;
        row.querySelector('.table_project').innerHTML = records[i].project;
        row.querySelector('.table_task').innerHTML = records[i].task;
        row.style.display = '';
        prev.after(row);
        prev = row;
      }
    } else {
      console.error(`Muhaha, I lied, I will log into console till I die!\nResponse status: ${Http.status}`);
    }
  };
}

let interval = null;

document.body.onload = function () {
  const button = document.getElementById('button');
  document.getElementById('record').onsubmit = function (e) {
    e.preventDefault();
    if (validateForm()) {
      if (!interval) {
        start = new Date();
        sendRecord('start');
        interval = setInterval(updateTime, 1000, start);
        button.src = 'img/stop.jpg';
        setInputsLocked(true);
      } else {
        sendRecord('stop');
        clearInterval(interval);
        interval = null;
        button.src = 'img/play.png';
        updateTime(new Date());
        setInputsLocked(false);
      }
    }
  };
  getRecords(0, 10);
};
