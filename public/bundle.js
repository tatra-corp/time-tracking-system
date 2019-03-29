

function openTab(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function sendRecord(action) {
    let data = new FormData(document.forms["record"]);
    data.append("action", action);
    if(action === 'stop') data.append("stop_time", (new Date).getTime() / 1000);
    data.append("start_time", start.getTime() / 1000);
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

let start;

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
                start = new Date();
                sendRecord('start');
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