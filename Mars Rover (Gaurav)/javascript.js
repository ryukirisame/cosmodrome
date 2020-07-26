var method = "GET";
var mode = true;
var imgDate;

var api_key = "21760btk212aupCr25Qmmc1jK6yVyMc7Fin6bM8A"
var url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=" + api_key + "&earth_date=";
var date;
var data;

var urlIndex = 0;

function sendHttpRequest(method, url, mode) {

    return new Promise((resolve, reject) => {

        var req = new XMLHttpRequest();
        req.onload = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    data = JSON.parse(req.response);
                    resolve(data);
                    console.log(data)
                }
                if (req.status == 404) {
                    console.log("file not found");
                }
            }
        };
        req.open(method, url + imgDate, mode);
        req.send();
    })
}

 function disablebtn(){
     document.getElementById("next").disabled = true;
 }

 function enableBtn(){
    document.getElementById("next").disabled = false;
 }

function showPic()
{
    var image = document.getElementById("pic");
    image.onload = function(){
        enableBtn();
    }
    disablebtn();
    image.src = data.photos[urlIndex].img_src;
}
function nextPic()
{
    urlIndex++;
    if(urlIndex > data.photos.length)
    {
        urlIndex = 0;
    }
   showPic();
}


document.addEventListener("change", function () {
    imgDate = document.getElementById("dateText").value;
    sendHttpRequest(method, url, mode).then((test) =>
    {
        data = test;
        urlIndex = 0;
        showPic();

    });
})
