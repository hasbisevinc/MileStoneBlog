const session = new Session();
var apiKey = "";

if (session.get('login') == undefined || session.get('login').login != true) {
  document.body.innerHTML = ""
  window.location.replace("login.html");
} else {
  apiKey = session.get('login').apiKey;  
}

var getApiKey = function() {
  return apiKey;
}
