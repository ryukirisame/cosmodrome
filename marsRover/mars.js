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
var Chem_camera = "&camera=chemcam";
var mahli_camera = "&camera=mahli";
var mardi_camera = "&camera=mardi";
var pan_camera = "&camera=pancam";
var minites_camera = "&camera=minites";
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
var imageContainer;
var mainImage;
var ImgBox;
var img;
var card_image;
var closeImage;
var box;
var currentUrlIndex;
var index;
var getCamera;

// This function wil allow user to choose the following rovers, there are three rovers available;
function chooseRover() {


    curiosity_box = document.getElementById('Curiosity').checked;
    Opportunity_box = document.getElementById('Opportunity').checked;
    Spirit_box = document.getElementById('Spirit').checked;

    if (curiosity_box === true) {
        rover = curiosity;

    } else if (Opportunity_box === true) {
        rover = opportunity;
        opportunityCalender();
    } else {
        rover = spirit;
        spiritCalender();
    }

    update_url = "https://api.nasa.gov/mars-photos/api/v1/rovers" + rover + "photos?api_key=" + api_key + "&earth_date=";
    // console.log(update_url);

}
// this function will send the httpRequest to the nasa api server, it takes three arguments, 1. Method (that could be GET or POST),2. url , 3. mode (either true or false).
function sendHttpRequest(method, update_url, mode) {

    return new Promise((resolve, reject) => {

        // chooseRover();
        // console.log(rover);

        var req = new XMLHttpRequest();
        req.onload = function () {
            if (req.readyState == 4 && req.status == 200) {
                data = JSON.parse(req.response);
                resolve(data);


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
//it will allow to set loading image as per requirement.
function loadingImg(mode) {
    document.getElementById('loadImg').style.display = mode;
}
// This function will be used for disable following buttons.
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
// for enable main image
function enableImage() {
    document.getElementById("pic").style.display = "inline-block";
}
// for disable main image when it will not available
function disableImage() {
    document.getElementById("pic").style.display = "none";

}
// when image is successfully parsed from the server then, showpic() will allow to show that pictures on the webpage.
function showPic() {
    var i = 0;
    console.log(data);
    imageContainer = document.getElementById("imageContainer");
    while (i < data.photos.length) {
        ImgBox = document.createElement("div");
        img = document.createElement('img');
        img.className = "cardImage";
        ImgBox.id = "card";
        ImgBox.appendChild(img);
        img.src = data.photos[i].img_src;
        img.onload = function () {
            loadingImg('none');
            enableImage();
            enableBtn();
            document.getElementById("toggle").style.visibility = "hidden";
        }
        disablebtn();
        img.onerror = () => {
            loadingImg("none");
            disableImage();
            errorImage('inline');
        }
        imageContainer.appendChild(ImgBox);
        i++;

    }
    modalImage();
}

function removeChild() {
    var list = document.getElementById("imageContainer");

    // As long as <ul> has a child node, remove it
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
}
//It will allow user to go to the next image.
function nextPic() {

    // urlIndex = getImageUrl();
    urlIndex++;
    if (urlIndex > data.photos.length) {
        urlIndex = 0;

    }
    if (urlIndex < data.photos.length) {
        card_image.src = data.photos[urlIndex].img_src;
        console.log(urlIndex);
    }
}
// to jump for previous image
function prevPic() {
    urlIndex--;
    if (urlIndex < 0) {
        urlIndex = data.photos.length;
    } else {
        card_image.src = data.photos[urlIndex].img_src;
        console.log(urlIndex);
    }
}
// date_change will store the information about date choosen by the user each time.

function date_change() {

    imgDate = document.getElementById("dateText").value;
    document.getElementById("toggle").style.visibility = "visible";

}

function fcam() {

    modalImage();
    console.log('front camera is enabled!');
    sendHttpRequest(method, update_url + imgDate + front_camera, mode).then((test) => {
        date_change();
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
            removeChild();
            showPic();
            getImageUrl();

        }

    });
}
// unlike fcam it will ask for rear camera angle photos to the server.
function rcam() {

    console.log('Rear camera is enabled!');
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
            removeChild();
            showPic();
            getImageUrl();
        }
    });
}
// this is for another camera angle, that is navigation.
function navcam() {

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
            removeChild();
            showPic();
            getImageUrl();
        }
    });
}

function chemCam() {
    console.log('Chemistry & camera complex  cam is enabled!');
    // date_change();
    sendHttpRequest(method, update_url + imgDate + Chem_camera, mode).then((test) => {
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
            removeChild();
            showPic();
            getImageUrl();
        }
    });
}

function mahliCam() {
    console.log('mahli_cam is enabled!');
    // date_change();
    sendHttpRequest(method, update_url + imgDate + mahli_camera, mode).then((test) => {
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
            removeChild();
            showPic();
            getImageUrl();
        }
    });
}

function mardiCam() {
    console.log('madr_cam is enabled!');
    // date_change();
    sendHttpRequest(method, update_url + imgDate + mardi_camera, mode).then((test) => {
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
            removeChild();
            showPic();
            getImageUrl();
        }
    });
}

function onChangeDate() {
    document.addEventListener("change", date_change, true);

    document.getElementById("toggle").style.visibility = "hidden";

}

function modalImage() {
    box = document.createElement('div')
    closeImage = document.getElementById('close');
    const modalHeader = document.getElementById('modalHeader');

    const next = document.getElementById('next');
    box.id = "box"
    document.body.appendChild(box);
    const images = document.getElementById('imageContainer').querySelectorAll('img');


    images.forEach(image => {

        image.addEventListener('click', e => {
            getImageUrl();
            box.classList.add('active');
            // closeImage.classList.add('active');
            modalHeader.classList.add('active');
            card_image = document.createElement('img');

            card_image.src = image.src;


            while (box.firstChild) {
                box.removeChild(box.firstChild)
            }

            box.appendChild(card_image);
            // box.appendChild(closeImage);
            box.appendChild(modalHeader);

        })
    })
}

function closeButton() {

    closeImage.addEventListener('click', e => {
        if (e.target == e.closeImage)
            return
        box.classList.remove('active');
    })
}

function ripples() {
    const buttons = document.getElementById('modalHeader').querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;

            let ripple = document.createElement('span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove()
            }, 1000);

        });
    });
}
// for all the images with every possible camera angle

function allPhotos() {
    sendHttpRequest(method, update_url + imgDate, mode).then((test) => {

        date_change();
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
            removeChild();
            showPic();
            getImageUrl();
            fetchCamera();
           
            
        }

    })
}

function getImageUrl() {
    const img = document.getElementById('imageContainer').querySelectorAll('img');
    var i;
    for (i = 0; i < img.length; i++) {
        img[i].src = data.photos[i].img_src;
        img[i].setAttribute("index-data", i);
        //after changing image src i just want to show index of clicked image
        img[i].onclick = function () {
            index = this.getAttribute("index-data");
            urlIndex = index;
            console.log(index);
        }
    }
    return index;

}

function opportunityCalender() {
    imgDate = document.getElementById("dateText");
    imgDate.min = "2004-01-26";
    imgDate.max = "2018-06-10";
}
function spiritCalender()
{
    imgDate = document.getElementById("dateText");
    imgDate.min = "2004-01-04";
    imgDate.max = "2010-03-22";
}

function disableCamera()
{
    document.getElementById('front').style.display = 'none';
    document.getElementById('rear').style.display = 'none';
    document.getElementById('nav').style.display = 'none';
    document.getElementById('chem').style.display = 'none';
    document.getElementById('mahli').style.display = 'none';
    document.getElementById('mardi').style.display = 'none';
    document.getElementById('pan').style.display = "none";
    document.getElementById('minites').style.display = 'none';
}

// function enableCamera()
// {
//     if(getCamera == 'FHAZ')
//     {
//         document.getElementById('front').style.display = 'inline';
//     }
//     else
//     {
//         document.getElementById('front').style.display = 'none';

//     }
    
//     document.getElementById('rear').style.display = 'inline';
//     document.getElementById('nav').style.display = 'inline';
//     document.getElementById('chem').style.display = 'inline';
//     document.getElementById('mahli').style.display = 'inline';
//     document.getElementById('mardi').style.display = 'inline';
//     document.getElementById('minites').style.display = 'inline';
//     document.getElementById('pan').style.display = "inline";
// }

disableCamera();

function fetchCamera()
{

    sendHttpRequest(method, update_url + imgDate, mode).then((test) => {

        date_change();
        if (data.photos.length < 1) {
            errorImage('inline');
            loadingImg('none');
            console.log("no data found for this date!");
        } else {
            var i;
            for(i = 0; i<data.photos.length;i++)
            {
                getCamera = data.photos[i].camera.name;
                console.log(getCamera);
            }
        
            errorImage('none');
          
        }

    })
}