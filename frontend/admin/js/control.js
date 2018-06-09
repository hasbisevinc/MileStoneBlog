const session = new Session();
var apiKey = "";

//session.set('login', {login: true, apiKey : 'hahsd89ha8shd8s'});
if (session.get('login') == undefined || session.get('login').login != true) {
  console.log("gooooo")
  window.location.replace("login.html");
} else {
  apiKey = session.get('login').apiKey;  
}

var getApiKey = function() {
  return apiKey;
}
