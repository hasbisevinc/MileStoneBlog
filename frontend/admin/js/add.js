var add = function() {
    let title = document.getElementById("add_title").value;
    let color = document.getElementById("add_color").value;
    let date = new Date(document.getElementById("add_date").value).getTime() / 1000;
    let icons = document.getElementsByName("add_icon");
    var icon = icons[0].value;
    for (var i = 0; i < icons.length; i++) {
        if (icons[i].checked) {
            icon = icons[i].value;
            break;
        }
    }
    let milestone = document.getElementById("add_milestone").checked;
    let shortBody = document.getElementById("add_shortBody").value;
    let body = document.getElementById("add_body").value;

    if (title.length < 1) {
        alert("Please fill title");
        return;
    }
    
    if (isNaN(date)) {
        alert("Please fill date");
        return;
    }
        
    if (shortBody.length < 1) {
        alert("Please fill short text");
        return;
    }

    var data = {
        title: title,
        color: color,
        date: date,
        icon: icon,
        milestone: milestone,
        shortBody: shortBody,
        body: body,
        apiKey: getApiKey(),
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://localhost:8000/add");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));

    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4 &&xmlhttp.status == 200) {
            if (xmlhttp.responseText.indexOf("title") > -1) {
                alert("created!");
            } else {
                json = JSON.parse(xmlhttp.responseText)
                alert(json.message);
            }
        }
    }
}