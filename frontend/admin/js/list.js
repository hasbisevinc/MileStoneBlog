var fillTable = function(stone) {
    var table = document.getElementById("stone_list");

    var row = table.insertRow(-1);
    
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = stone.title;
    cell2.innerHTML = unixtToDate(stone.date);
    cell3.innerHTML = '<input onclick="removeStone(this, \''+stone._id+'\')" type="submit" value="Remove">';
}

var getStones = function() {
    var node = document.getElementById("stone_list");
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }

    loading = document.getElementById("loading");
    loading.style.display = '';

    var data = {
        apiKey: getApiKey(),
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", API_URL+"allItems");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));

    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4 &&xmlhttp.status == 200) {
            loading.style.display = 'none';
            var allStones = JSON.parse(this.responseText);
            for (var i = 0 ; i < allStones.length; i ++) {
                fillTable(allStones[i]);
            }
        }
    }
}

var unixtToDate = function(unixTime) {
    var date = new Date(unixTime*1000);
    formattedDate = date.getDay() + "." + date.getMonth() + "." + date.getFullYear(); 
    return formattedDate;
}

var removeStone = function(btn, stoneId) {
    var data = {
        _id: stoneId,
        apiKey: getApiKey(),
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", API_URL+"remove");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));

    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4 &&xmlhttp.status == 200) {
            json = JSON.parse(xmlhttp.responseText)
            
            if (json.success) {
                alert("removed");
                var row = btn.parentNode.parentNode;
                row.parentNode.removeChild(row);
            } else {
                alert("an error:"+json.message);
            }
        }
    }
}

