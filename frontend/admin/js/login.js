const session = new Session();

if (session.get('login') != undefined && session.get('login').login == true) {
    window.location.replace("index.html");
}

var tryToLogin = function() {
    var userName = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (userName == undefined || userName.length < 1) {
        alert("fill user name");
        return;
    }

    if (password == undefined || password.length < 1) {
        alert("fill password");
        return;
    }

    var data = {
        username: userName,
        password: password
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://localhost:8000/login");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));

    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4 &&xmlhttp.status == 200) {
            console.log(xmlhttp.responseText)
            json = JSON.parse(xmlhttp.responseText)
            if (json.success) {
                session.set('login', {login: true, apiKey : json.apiKey});
                window.location.replace("index.html");
            } else {
                alert("username or password wrong!");
            }
        }
    }

}
