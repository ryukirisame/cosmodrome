var API_KEY = "OdR7r0hQ6rqZyotYDkKKychcYrDUQ32tHuI36bhw";
const url = "https://api.nasa.gov/EPIC/api/natural/images?api_key=" + API_KEY + "&date=";
const mode = "true";
const method = "GET";
var curday = function(sp){
today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //As January is 0.
var yyyy = today.getFullYear();

if(dd<10) dd='0'+dd;
if(mm<10) mm='0'+mm;
return (mm+sp+dd+sp+yyyy);
};
var sendHttpRequest = (method, url, mode) => {
    const promise = new Promise((resolve, reject) => {

        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.response);
                console.log(data[0]);
                resolve(data);
            }
        }
        req.open(method, url, mode);
        req.send();
    });
    return promise;
}

function update(data) {
    console.log(data);
    document.getElementById("caption").innerHTML = data[0].caption;
    document.getElementById("identifier").innerHTML = data[0].identifier;
   var imgId= document.getElementById("image").innerHTML = data[0].image;
    var imgUrl="https://api.nasa.gov/EPIC/archive/natural/2020/07/16/png/"+imgId+".png?api_key="+API_KEY;
    console.log(curday('/'));
console.log(curday('-'));
    document.getElementById("version").innerHTML = data[0].version;
    document.getElementById("pic").src = imgUrl;

}
sendHttpRequest(method, url + "2020-07-16", mode).then(update);
var imgUrl="https://api.nasa.gov/EPIC/archive/natural/2019/05/30/png/epic_1b_2019053001.png?api_key="+API_KEY
