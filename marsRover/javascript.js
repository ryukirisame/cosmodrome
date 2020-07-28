var method = "GET";
var mode = true;
var imgDate;
var api_key = "21760btk212aupCr25Qmmc1jK6yVyMc7Fin6bM8A"
var url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=" + api_key + "&earth_date=";
var date;
var data;
var front_camera = "&camera=FHAZ";
var Rear_camera = "&camera=RHAZ";
var showFrontImage;
var showRearImage;

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
        req.open(method, url, mode);
        req.send();
    })
}

function disablebtn() {
    document.getElementById("next").disabled = true;
    document.getElementById("prev").disabled = true;
}

function enableBtn() {
    document.getElementById("next").disabled = false;
    document.getElementById("prev").disabled = false;
}

function showPic() {
    var image = document.getElementById("pic");
    image.onload = function () {
        enableBtn();
        document.getElementById("toggle").style.visibility = "hidden";

    }

    disablebtn();
    image.src = data.photos[urlIndex].img_src;
}

function nextPic() {
    urlIndex++;
    if (urlIndex > data.photos.length) {
        urlIndex = 0;

    }
    if (urlIndex < data.photos.length) {
        showPic();
    }
}

function prevPic() {
    try {
        urlIndex--;
        console.log(urlIndex);
        showPic();

    } catch (error) {
        urlIndex = data.photos.length;
        console.log("You can't go back!");
        enableBtn();


    }
}

function date_change() {

    imgDate = document.getElementById("dateText").value;
    sendHttpRequest(method, url + imgDate + front_camera, mode).then((test) => {
        data = test;
        urlIndex = 0;
        showFrontImage = showPic();
    });
    sendHttpRequest(method, url + imgDate + Rear_camera, mode).then((test) => {
        data = test;
        urlIndex = 0;
        showRearImage = showPic();
    });

}

function fcam() {
    console.log('front camera is enabled!');
    date_change();
    document.getElementById("fornt");

    // sendHttpRequest(method,url + imgDate +front_camera, mode).then((test) => {
    //     data = test;
    //     urlIndex = 0;
    //     showPic();
    // });
}

function rcam() {
    console.log('Rear camera is enabled!');
    date_change();
    document.getElementById("rear");
    // sendHttpRequest(method,url + imgDate +Rear_camera, mode).then((test) => {
    //     data = test;
    //     urlIndex = 0;
    //     showPic();
    // });
}

document.addEventListener("change", date_change, true);
// document.addEventListener("click",date_change,true);

function changeEvent(change) {
    document.getElementById("toggle").style.visibility = "visible";
}

document.addEventListener("change", changeEvent);