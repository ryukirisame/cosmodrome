var method = "GET";
var mode = true;
var imgDate;
var rover;
var api_key = "21760btk212aupCr25Qmmc1jK6yVyMc7Fin6bM8A";
var url =
  "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=" +
  api_key +
  "&earth_date=";
var date;
var data;
var front_camera = "&camera=FHAZ";
var Rear_camera = "&camera=RHAZ";
var Nav_camera = "&camera=navcam";
var mast_camera = "&camera=mast";
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
var today;


window.onclick = function(e){
  const hide = document.getElementById('menu_btn');
  const ham_menu = document.getElementById('ham_menu');

  if(e.target !== hide){
    ham_menu.classList.add('ham-deactive');
    ham_menu.classList.remove('ham-active');
    if(e.target == ham_menu)
    {
      ham_menu.classList.add('ham-active');
      ham_menu.classList.remove('ham-deactive');

    }

  }
  else
  {
    ham_menu.classList.remove('ham-deactive');
  }
}

/**
 * * * This function wil allow user to choose the following rovers, there are three rovers available;
 */

function getDay() {
  var dateText = document.getElementById("dateText");
  var day = document.getElementById("day").value;
  var month = document.getElementById("month").value;
  var year = document.getElementById("year").value;

  var date = year + "-" + month + "-" + day;
  dateText.value = date;
  imgDate = dateText.value;

  update_url =
    "https://api.nasa.gov/mars-photos/api/v1/rovers" +
    rover +
    "photos?api_key=" +
    api_key +
    "&earth_date=";

  console.log(update_url);
}
function selectRover() {
  var curiosity_rover = document.getElementById("curiosity_r").checked;
  var opportunity_rover = document.getElementById("opportunity_r").checked;
  var spirit_rover = document.getElementById("spirit_r").checked;
}

function check_cur() {
  var cur_rover = document.getElementById("curiosity_r");
  cur_rover.checked = true;
  rover = curiosity;
  getDay();
}
function check_opp() {
  var opp_rover = document.getElementById("opportunity_r");
  opp_rover.checked = true;
  rover = opportunity;
  getDay();
}
function check_spi() {
  var spi_rover = document.getElementById("spirit_r");
  spi_rover.checked = true;
  rover = spirit;
  getDay();
}



// function chooseRover() {
//   curiosity_box = document.getElementById("Curiosity").checked;
//   Opportunity_box = document.getElementById("Opportunity").checked;
//   Spirit_box = document.getElementById("Spirit").checked;

//   if (curiosity_box === true) {
//     rover = curiosity;
//     // currentDate();
//     curiosityCalender();
//     // chooseDateSection();
//     // goToChooseRover();
//   } else if (Opportunity_box === true) {
//     rover = opportunity;
//     opportunityCalender();
//   } else {
//     rover = spirit;
//     spiritCalender();
//   }

// }
// * this function will send the httpRequest to the nasa api server, it takes three arguments, 1. Method (that could be GET or POST),2. url , 3. mode (either true or false).

function sendHttpRequest(method, update_url, mode) {
  return new Promise((resolve, reject) => {
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
  });
}
//it will allow to set loading image as per requirement.
function loadingImg(mode) {
  document.getElementById("loadImg").style.display = mode;
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
  document.getElementById("notFound").style.display = mode;
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
    img = document.createElement("img");
    img.className = "cardImage";
    ImgBox.id = "card";
    ImgBox.classList.add("card");
    ImgBox.appendChild(img);
    img.src = data.photos[i].img_src;
    img.onload = function () {
      loadingImg("none");

      enableImage();
      enableBtn();
      document.getElementById("toggle").style.visibility = "hidden";
    };
    disablebtn();
    img.onerror = () => {
      loadingImg("none");
      disableImage();
      errorImage("inline");
    };
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
  searchOnEnterKey();
}

function fcam() {
  modalImage();
  console.log("front camera is enabled!");
  sendHttpRequest(method, update_url + imgDate + front_camera, mode).then(
    (test) => {
      date_change();
      if (data.photos.length < 1) {
        // alert("we are here");
        errorImage("inline");
        loadingImg("none");
        // disableImage();
        console.log("no data found for this date!");
      } else {
        errorImage("none");
        data = test;
        urlIndex = 0;
        removeChild();
        showPic();
        getImageUrl();
      }
    }
  );
}
// unlike fcam it will ask for rear camera angle photos to the server.
function rcam() {
  console.log("Rear camera is enabled!");
  sendHttpRequest(method, update_url + imgDate + Rear_camera, mode).then(
    (test) => {
      data = test;

      if (data.photos.length < 1) {
        // alert("we are here");
        errorImage("inline");
        loadingImg("none");
        // disableImage();
        console.log("no data found for this date!");
      } else {
        errorImage("none");
        data = test;
        urlIndex = 0;
        removeChild();
        showPic();
        getImageUrl();
      }
    }
  );
}
// this is for another camera angle, that is navigation.
function navcam() {
  console.log("Nav cam is enabled!");
  // date_change();
  sendHttpRequest(method, update_url + imgDate + Nav_camera, mode).then(
    (test) => {
      data = test;

      if (data.photos.length < 1) {
        // alert("we are here");
        errorImage("inline");
        loadingImg("none");
        // disableImage();
        console.log("no data found for this date!");
      } else {
        errorImage("none");
        data = test;
        urlIndex = 0;
        removeChild();
        showPic();
        getImageUrl();
      }
    }
  );
}

function chemCam() {
  console.log("Chemistry & camera complex  cam is enabled!");
  // date_change();
  sendHttpRequest(method, update_url + imgDate + Chem_camera, mode).then(
    (test) => {
      data = test;

      if (data.photos.length < 1) {
        // alert("we are here");
        errorImage("inline");
        loadingImg("none");
        // disableImage();
        console.log("no data found for this date!");
      } else {
        errorImage("none");
        data = test;
        urlIndex = 0;
        removeChild();
        showPic();
        getImageUrl();
      }
    }
  );
}

function mahliCam() {
  console.log("mahli_cam is enabled!");
  // date_change();
  sendHttpRequest(method, update_url + imgDate + mahli_camera, mode).then(
    (test) => {
      data = test;

      if (data.photos.length < 1) {
        // alert("we are here");
        errorImage("inline");
        loadingImg("none");
        // disableImage();
        console.log("no data found for this date!");
      } else {
        errorImage("none");
        data = test;
        urlIndex = 0;
        removeChild();
        showPic();
        getImageUrl();
      }
    }
  );
}

function mardiCam() {
  console.log("madri_cam is enabled!");
  // date_change();
  sendHttpRequest(method, update_url + imgDate + mardi_camera, mode).then(
    (test) => {
      data = test;

      if (data.photos.length < 1) {
        // alert("we are here");
        errorImage("inline");
        loadingImg("none");
        // disableImage();
        console.log("no data found for this date!");
      } else {
        errorImage("none");
        data = test;
        urlIndex = 0;
        removeChild();
        showPic();
        getImageUrl();
      }
    }
  );
}

function mastcam() {
  console.log("mast_cam is enabled!");
  // date_change();
  sendHttpRequest(method, update_url + imgDate + mast_camera, mode).then(
    (test) => {
      data = test;

      if (data.photos.length < 1) {
        // alert("we are here");
        errorImage("inline");
        loadingImg("none");
        // disableImage();
        console.log("no data found for this date!");
      } else {
        errorImage("none");
        data = test;
        urlIndex = 0;
        removeChild();
        showPic();
        getImageUrl();
      }
    }
  );
}

function onChangeDate() {
  document.addEventListener("change", date_change, true);

  document.getElementById("toggle").style.visibility = "hidden";

  disableCamera();
}

function modalImage() {
  box = document.createElement("div");
  closeImage = document.getElementById("close");
  const modalHeader = document.getElementById("modalHeader");

  const next = document.getElementById("next");
  box.id = "box";
  document.body.appendChild(box);
  const images = document
    .getElementById("imageContainer")
    .querySelectorAll("img");

  images.forEach((image) => {
    image.addEventListener("click", (e) => {
      document.body.style.overflow = "hidden";
      ripples();
      getImageUrl();
      box.classList.add("active");
      // closeImage.classList.add('active');
      modalHeader.classList.add("active");
      card_image = document.createElement("img");

      card_image.src = image.src;

      while (box.firstChild) {
        box.removeChild(box.firstChild);
      }

      box.appendChild(card_image);
      // box.appendChild(closeImage);
      box.appendChild(modalHeader);
    });
  });
}

function closeButton() {
  closeImage.addEventListener("click", (e) => {
    document.body.style.overflow = "scroll";
    if (e.target == e.closeImage) return;
    box.classList.remove("active");
  });
}

function ripples() {
  const buttonsSplashEffect = document.querySelectorAll(".splash-effect");

  buttonsSplashEffect.forEach((button) => {
    button.addEventListener("click", function (e) {
      var elem = button.getBoundingClientRect();
      var x = e.clientX - elem.left;
      var y = e.clientY - elem.top;

      let ripple = document.createElement("div");
      ripple.classList.add("splash-effect-ripple");

      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 1000);
    });
  });

  //        buttons background effect script

  const buttonsBackgroundEffect = document.querySelectorAll(
    ".button-background-color-splash"
  );

  buttonsBackgroundEffect.forEach((button) => {
    button.addEventListener("mouseenter", (event) => {
      var elem = button.getBoundingClientRect();
      var x = event.clientX - elem.left;
      var y = event.clientY - elem.top;

      let background = document.createElement("div");
      background.classList.add("button-background-color");
      background.style.left = x + "px";
      background.style.top = y + "px";

      event.target.insertBefore(background, event.target.firstChild);
    });

    button.addEventListener("mouseleave", (event) => {
      var item = document.querySelector(".button-background-color");
      item.parentNode.removeChild(item);
    });
  });
}
// for all the images with every possible camera angle

function allPhotos() {
  sendHttpRequest(method, update_url + imgDate, mode).then((test) => {
    date_change();
    if (data.photos.length < 1) {
      // alert("we are here");
      errorImage("inline");
      removeChild();
      loadingImg("none");
      // disableImage();
      console.log("no data found for this date!");
    } else {
      errorImage("none");
      data = test;
      urlIndex = 0;
      removeChild();
      showPic();
      getImageUrl();
      fetchCamera();
    }
  });
}

function getImageUrl() {
  const img = document.getElementById("imageContainer").querySelectorAll("img");
  var i;
  for (i = 0; i < img.length; i++) {
    img[i].src = data.photos[i].img_src;
    img[i].setAttribute("index-data", i);
    //after changing image src i just want to show index of clicked image
    img[i].onclick = function () {
      index = this.getAttribute("index-data");
      urlIndex = index;
      console.log(index);
    };
  }
  return index;
}

function opportunityCalender() {
  imgDate = document.getElementById("dateText");
  imgDate.min = "2004-01-26";
  imgDate.max = "2018-06-10";
}

function spiritCalender() {
  imgDate = document.getElementById("dateText");
  imgDate.min = "2004-01-04";
  imgDate.max = "2010-03-22";
}

function curiosityCalender() {
  imgDate = document.getElementById("dateText");
  imgDate.max = today;
}

function disableCamera() {
  document.getElementById("camera_heading").style.display = "none";
  document.getElementById("front").style.display = "none";
  document.getElementById("rear").style.display = "none";
  document.getElementById("chem").style.display = "none";
  document.getElementById("mahli").style.display = "none";
  document.getElementById("mardi").style.display = "none";
  document.getElementById("pan").style.display = "none";
  document.getElementById("minites").style.display = "none";
  document.getElementById("mast").style.display = "none";
  document.getElementById("nav").style.display = "none";
}

disableCamera();

function fetchCamera() {
  sendHttpRequest(method, update_url + imgDate, mode).then((test) => {
    date_change();
    if (data.photos.length < 1) {
      errorImage("inline");
      loadingImg("none");
      console.log("no data found for this date!");
    } else {
      var i;
      for (i = 0; i < data.photos.length; i++) {
        getCamera = data.photos[i].camera.name;
        console.log(getCamera);

        if (getCamera) {
          document.getElementById("camera_heading").style.display = "inline";
        }

        switch (getCamera) {
          case "FHAZ":
            document.getElementById("front").style.display = "inline";
            break;
          case "RHAZ":
            document.getElementById("rear").style.display = "inline";
            break;
          case "MAST":
            document.getElementById("mast").style.display = "inline";
            break;
          case "CHEMCAM":
            document.getElementById("chem").style.display = "inline";
            break;
          case "MAHLI":
            document.getElementById("mahli").style.display = "inline";
          case "MARDI":
            document.getElementById("mardi").style.display = "inline";
            break;
          case "NAVCAM":
            document.getElementById("nav").style.display = "inline";
            break;
          case "PANCAM":
            document.getElementById("pan").style.display = "inline";
            break;
          case "MINITES":
            document.getElementById("minites").style.display = "inline";
            break;

          default:
        }
      }

      errorImage("none");
    }
  });
}

function currentDate() {
  today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  console.log(today);
}

function searchOnEnterKey() {
  const input = document.getElementById("dateText");
  input.addEventListener("keyup", function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      document.getElementById("allImg").click();
    }
  });
}
hideOnScroll();

function hideOnScroll() {
  var mybutton = document.getElementById("mybtn");

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 4000 ||
      document.documentElement.scrollTop > 4000
    ) {
    
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }
}

function goToTopOfThePage() {
  //Get the button
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// function ScrollBlock()
// {
//   document.body.style.overflow = "hidden";
// }
// function ScrollEnable()
// {
//   document.body.style.overflow = "hidden";
// }

// function chooseDateSection() {
//   var dateBox = document.createElement("div");
//   dateBox.classList.add("dateBox");
//   const date = document.getElementById("textDate");
//   var element = document.querySelector(".rover_container");
//   element.appendChild(date);
// }

/**
 * *This function will make you jump to the page where you can choose the rover of your own choice;
 */

function goToChooseRover() {
  var elmntToView = document.getElementById("rover_contr");
  elmntToView.scrollIntoView();
  elmntToView.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
}

function getDateSelect() {
  // alert('hello');
  var get = document.getElementById("choose_date_page");
  get.style.display = "block";
}

function open_ham() {
  const ham_menu = document.querySelector('menu_btn');
  const ham = document.querySelector('.ham_menu');
  ham.classList.toggle('ham-active');
  ham_menu.classList.remove('ham-deactive');

  // var ham = document.querySelector(".ham_menu");

  // if (ham.style.display === "none") {
  //   ham.style.display = "block";
  // } else {
  //   // ham.classList.add('js-is-hidden');
  //   ham.style.display = "none";
  // }
}






// window.onload = function{
//   const hidediv = document.getElementById('ham_menu');
//   document.onclick = function(div){
//     if(div.target.id !== 'ham_menu')
//     {
//       hidediv.style.display ="none";
//     }
//   };
// }

// const app = () =>{
 
// }

