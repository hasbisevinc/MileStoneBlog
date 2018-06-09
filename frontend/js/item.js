var getStone = function() {
    var url = new URL(window.location);
    var itemId = url.searchParams.get("id");
    if (itemId.length < 1) {
        notFound();
        return;
    }

    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost:8000/item/"+itemId;

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText.length < 1) {
                notFound();
                return;
            }
            var stone = JSON.parse(this.responseText);
            if (stone.error) {
                notFound();
                return;
            }
            fillStone(stone);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

var unixtToDate = function(unixTime) {
    var date = new Date(unixTime*1000);
    formattedDate = date.getDay() + " " + monthNames[date.getMonth()] + " " + date.getFullYear(); 
    return formattedDate;
}

var fillStone = function(stone) {
    var container = document.createElement("div");
    container.className = "cd-item__content";

    var h2 = document.createElement("h2");
    h2.innerHTML = stone.title;
    
    var date = document.createElement("p");
    date.innerHTML = unixtToDate(stone.date);
    
    var body = document.createElement("p");
    body.innerHTML = (stone.body.length < 1) ? stone.shortBody : stone.body;

    container.appendChild(h2);
    container.appendChild(date);
    container.innerHTML += (stone.body.length < 1) ? stone.shortBody : stone.body;

    document.getElementById("item").appendChild(container);
}

var notFound = function() {
    var container = document.createElement("div");
    container.className = "cd-item__content";

    var h2 = document.createElement("h2");
    h2.innerHTML = "404 Not Found";
    
    var body = document.createElement("p");
    body.innerHTML = "This page is not here"

    container.appendChild(h2);
    container.appendChild(body);

    document.getElementById("item").appendChild(container);
}
