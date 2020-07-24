var method = "GET";
var imgDate = "2015-02-02"
var url = "https://api.nasa.gov/mars-photos/api/v1/rovers/Curiosity/photos?earth_date=" + imgDate + "&camera=FHAZ&api_key=21760btk212aupCr25Qmmc1jK6yVyMc7Fin6bM8A"
var mode = true;


function sendHttpRequest(method, url, mode) {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {

            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.response);
                resolve(data);
                console.log(data);
            } else if (this.status == 404) {
                reject(this.status);
            }
        };
        req.open(method, url, mode);
        req.send();
    });
}

sendHttpRequest(method, url, mode).then(function () {
    console.log("Resolved");

}).catch(function () {
    console.log("you did very wrong sir !");
})