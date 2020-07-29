var method = "GET";
var mode = true;
var imgDate;
var rover;
var api_key = "21760btk212aupCr25Qmmc1jK6yVyMc7Fin6bM8A"
var url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=" + api_key + "&earth_date=";
var date;
var data;
var front_camera = "&camera=FHAZ";
var Rear_camera = "&camera=RHAZ";
var Nav_camera = "&camera=navcam";
var curiosity = "/curiosity/";
var opportunity = "/opportunity/";
var spirit = "/spirit/";
var showFrontImage;
var showRearImage;

var urlIndex = 0;

var Curiosity_box;
var Opportunity_box;
var Spirit_box;
var update_url;


function chooseRover()
{

    curiosity_box = document.getElementById('Curiosity').checked;
    Opportunity_box = document.getElementById('Opportunity').checked;
    Spirit_box = document.getElementById('Spirit').checked;

if(curiosity_box === true)
{
    rover = curiosity;
}
else if(Opportunity_box === true)
{
    rover = opportunity;
}
else
{
    rover = spirit;
}

update_url  = "https://api.nasa.gov/mars-photos/api/v1/rovers"+rover+"photos?api_key=" + api_key + "&earth_date=";
console.log(update_url);

}






function sendHttpRequest(method, update_url, mode) {

    return new Promise((resolve, reject) => {

        // chooseRover();
        // console.log(rover);

        var req = new XMLHttpRequest();
        req.onload = function () {
            if (req.readyState == 4 && req.status == 200) {
                    data = JSON.parse(req.response);
                    resolve(data);
                    console.log(data)
                
                if (req.status == 404) {
                    console.log("file not found");
                }
            }
        };
       // chooseRover();
        req.open(method, update_url, mode);
        req.send();
    })
}

function loadingImg(mode) {
    document.getElementById('loadImg').style.display = mode;
}

function disablebtn() {
    document.getElementById("next").disabled = true;
    document.getElementById("prev").disabled = true;
}

function enableBtn() {
    document.getElementById("next").disabled = false;
    document.getElementById("prev").disabled = false;
}
// This function will leave a message whenever photos will not available.
function errorImage(mode) {
    disableImage();
    document.getElementById('notFound').style.display = mode;
}

function enableImage() {
    document.getElementById("pic").style.display = "inline-block";
}
//
function disableImage() {
    document.getElementById("pic").style.display = "none";

}

function showPic() {
    var image = document.getElementById("pic");
    image.onload = function () {
        //alert("hello");
        loadingImg('none');
        enableImage();
        enableBtn();
        document.getElementById("toggle").style.visibility = "hidden";
    }
    disablebtn();
    image.onerror = () => {
        loadingImg("none");
        disableImage();
        errorImage('inline');
    }

    image.src = data.photos[urlIndex].img_src;



}

function nextPic() {
    urlIndex++;
    if (urlIndex > data.photos.length) {
        urlIndex = 0;

    }
    if (urlIndex < data.photos.length) {
       // disableImage();
      //  loadingImg("inline");

        showPic();
        console.log(urlIndex);
    }
}

function prevPic() {
    urlIndex--;
    if (urlIndex < 0) {
        urlIndex = data.photos.length -1;
    } else {
        showPic();
        console.log(urlIndex);
    }
}

function date_change() {

    imgDate = document.getElementById("dateText").value;

}

function fcam() {
    console.log('front camera is enabled!');
    sendHttpRequest(method, update_url + imgDate + front_camera, mode).then((test) => {

        if (data.photos.length < 1) {
            // alert("we are here");
            errorImage('inline');
            loadingImg('none');
            // disableImage();
            console.log("no data found for this date!");

        } else {
            errorImage('none');
            data = test;
            urlIndex = 0;
            showPic();
        }

    });
}

function rcam() {
    console.log('Rear camera is enabled!');
    // date_change();
    sendHttpRequest(method, update_url + imgDate + Rear_camera, mode).then((test) => {
        data = test;

        if (data.photos.length < 1) {
            // alert("we are here");
            errorImage('inline');
            loadingImg('none');
            // disableImage();
            console.log("no data found for this date!");

        } else {
            errorImage('none');
            data = test;
            urlIndex = 0;
            showPic();
        }
    });
}

function navcam()
{
    console.log('Nav cam is enabled!');
    // date_change();
    sendHttpRequest(method, update_url + imgDate + Nav_camera, mode).then((test) => {
        data = test;

        if (data.photos.length < 1) {
            // alert("we are here");
            errorImage('inline');
            loadingImg('none');
            // disableImage();
            console.log("no data found for this date!");

        } else {
            errorImage('none');
            data = test;
            urlIndex = 0;
            showPic();
        }
    });
}

document.addEventListener("change", date_change, true);
// document.addEventListener("click",date_change,true);

function onChangeDate(){
    
}