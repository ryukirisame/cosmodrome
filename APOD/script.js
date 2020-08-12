var method = "GET";
const key = "U0PqJ5UprbVQExkXc7ZgsGVfIM7Z1O8Uiv7g2hOO";
var url = "https://api.nasa.gov/planetary/apod?api_key=" + key + "&date=";
var mode = true;
var date;

function getDate() {
    date = document.getElementById("dateText").value;
    console.log(date);
    sendHttpRequest(method, url + date, mode).then((data) => {
        //console.log(data);
        update(data);

    });

}

function update(data) {

    document.getElementById("caption1").innerHTML = data.date;
    document.getElementById("des1").innerHTML = data.title;
    document.getElementById("pic1").src = data.url;
//    document.getElementById("description").innerHTML = data.explanation;
    return data;
}

function sendHttpRequest(method, url, mode) {
    return new Promise((resolve, reject) => {

        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var data = JSON.parse(this.response);
                    //console.log(data);
                    resolve(data);


                }

            }
        }
        req.open(method, url, mode);
        req.send();
    });
}
