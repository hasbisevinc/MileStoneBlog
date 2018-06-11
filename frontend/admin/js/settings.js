var saveSettings = function() {
    var username = document.getElementById("settings_username").value;
    var oldPassword = document.getElementById("settings_old_passowrd").value;
    var newPassword = document.getElementById("settings_new_password").value;
    var reNewPassword = document.getElementById("settings_re_new_password").value;

    if (newPassword != reNewPassword) {
        alert("new password is not match");
        return;
    }

    if (username.length < 1 || newPassword.length < 1 || oldPassword.length < 1) {
        alert("please fill all areas");
        return;
    }

    data = {
        username: username,
        oldPassword: oldPassword,
        password: newPassword,
        apiKey: getApiKey()
    }
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", API_URL+"saveSettings");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));

    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4 &&xmlhttp.status == 200) {
            console.log(xmlhttp.responseText)
            json = JSON.parse(xmlhttp.responseText)
            if (json.success) {
                alert("saved!")
            } else {
                alert("password wrong!");
            }
        }
    }
}