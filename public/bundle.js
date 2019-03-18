
function sendRecord(action) {
    let data = new FormData(document.forms["record"]);
    data.append("action", action);
    data.append("time", new Date);
    data.delete("x");
    data.delete("y");

    const Http = new XMLHttpRequest();
    const url = "/records";
    Http.open("POST", url);
    Http.send(data);
    /*
    return new Promise((resolve) => {
        Http.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                resolve();
            }
        }
    });*/
}

function setInputsLocked(is_locked) {
    const form = document.forms["record"];
    form["username"].readOnly = is_locked;
    form["project_name"].readOnly = is_locked;
    form["task_name"].readOnly = is_locked;

}

function validateForm() {
    return true;
}

let start = new Date();

function getDateDiff(date1, date2) {
    return new Date(date2.getTime() - date1.getTime());
}

function updateTime(initial) {
    const diff = getDateDiff(initial, new Date());

    let time = document.getElementById("time");
    time.value = ("0" + diff.getUTCHours()).slice(-2) + ":" +
        ("0" + diff.getMinutes()).slice(-2) + ":" +
        ("0" + diff.getSeconds()).slice(-2);
}

let interval = null;

document.body.onload = function () {
    const button = document.getElementById("button");
    document.getElementById("record").onsubmit =  function (e) {
        e.preventDefault();
        if(validateForm()) {
            if(!interval) {
                sendRecord('start');
                start = new Date();
                interval = setInterval(updateTime, 1000, start);
                button.src = "img/stop.jpg";
                setInputsLocked(true);

            } else {
                sendRecord('stop');
                clearInterval(interval);
                interval = null;
                button.src = "img/play.png";
                updateTime(new Date());
                setInputsLocked(false);
            }
        }
    };
};