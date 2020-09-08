var method = "GET";

var mode = true;

var hitNum = 0;
var totalHits = 0;
//contains initial search response
var queryResponse = [];
//mediaUrls is an array of urls of a specific hit media
var mediaUrls = [];

var visitedImages = [];

// contains an object with key as quality and value as the index number of the url in mediaUrls
// eg. qualityIndices={"orig":0,"large":1}
var qualityIndices = {};

var currentPage = 1;

var totalPage = 0;
//the selected media type from radio button (image/video)
var selectedMediaType;
//media type of the current hit num value="image" or "video"
var mediaType;
//stores the searching string
var search = "";

//stores current number of cards loaded
var thumbNum = 0;
//stores current number of pages loaded
var currentThumbPage = 1;

// loading animation setTimeOut
var loadingAnimationSetTimeOut;

// message strings
var connecting = "Connecting to NASA...";
var loading = "Loading...";

var notFound404 = "404. The cosmic object you are looking for does not exist.";

var badResquest400 =
  "400. Bad Request. The server could not understand the request due to invalid syntax.";

var problemWithNasaServer =
  "There is some problem with NASA servers.\nPlease try again later.";

var nothingFound =
  "Sorry, we could not find anything, perhaps check what you have typed.";

var onErrorMessage =
  "Error connecting to NASA. Check your internet connection or change media quality.";

var lastPage = "This is the last item!";
var firstPage = "This is the first item!";

// body scroll position when a modal is opened
var bodyScrollPos = 0;

// ----------------------------------------------------------------------

// MEDIA QUERY Code for changing icon size on galaxy fold
var matchMediaMaxWidth320 = window.matchMedia("(max-width: 320px)");
changeIconSizeTo20(matchMediaMaxWidth320);
matchMediaMaxWidth320.addListener(changeIconSizeTo20);

function changeIconSizeTo20(matchMedia) {
  // console.log("myfunction()");
  const icons = document.querySelectorAll(".material-icons");
  if (matchMedia.matches) {
    icons.forEach((icon) => {
      icon.classList.remove("md-24");
      icon.classList.add("md-20");
    });
  } else {
    icons.forEach((icon) => {
      icon.classList.remove("md-20");
      icon.classList.add("md-24");
    });
  }
}

// MEDIA QUERY CODE FOR CHANGING ICON SIZE of back button FOR 900PX+ DEVICES
var matchMediaMaxWidth900 = window.matchMedia("(min-width: 900px)");
doTheJobFor900px(matchMediaMaxWidth900);
matchMediaMaxWidth900.addListener(doTheJobFor900px);

function doTheJobFor900px(matchMedia) {
  // change icon size to 36
  const backButton = document.querySelector(".back-button-container span");
  // const fullScreenIcon = document.querySelector(".full-screen-icon");
  if (matchMedia.matches) {
    backButton.classList.remove("md-24");
    backButton.classList.add("md-36");
    // fullScreenIcon.classList.remove("md-24");
    // fullScreenIcon.classList.add("md-36");

    // focusing the search box on home screen
    const homeScreenSearchBox = document.querySelector(
      ".home-page-search-box-container input"
    );
    homeScreenSearchBox.focus();

    document
      .querySelector(".home-page-search-box-search-icon-container")
      .classList.add("splash-effect");
  } else {
    backButton.classList.remove("md-36");
    backButton.classList.add("md-24");

    document
      .querySelector(".home-page-search-box-search-icon-container")
      .classList.remove("splash-effect");
  }
}

// ---------------------------------------------------------------------

// displays search section at the place of big logo when
// the user is not on the home page. (desktop and tablet landscape)
function showSearchSection() {
  // hiding cosmodrome logo
  document.querySelector(".cosmodrome").classList.add("hide");
  // showing search section
  document
    .querySelector(".nav-bar-search-section-desktop")
    .classList.add("show");
}
function hideSearchSection() {
  // hiding cosmodrome logo
  document.querySelector(".cosmodrome").classList.remove("hide");
  // showing search section
  document
    .querySelector(".nav-bar-search-section-desktop")
    .classList.remove("show");
}
// --------------------------------------------------------------
// code to prevent nav bar from hiding on scroll down on desktop
const navBar = document.querySelector(".nav-bar");
var shouldWeHideNavBar = true;

var matchMediaMaxWidth1280 = window.matchMedia("(min-width: 1280px)");
doTheJobFor1280px(matchMediaMaxWidth1280);
matchMediaMaxWidth1280.addListener(doTheJobFor1280px);

function doTheJobFor1280px(matchMedia) {
  if (matchMedia.matches) {
    // dont allow nav bar to hide
    shouldWeHideNavBar = false;
    // make it visible if its already hidden
    navBar.classList.remove("hidden");
  } else {
    shouldWeHideNavBar = true;
  }
}

// code for nav bar hiding on scroll down and infinite scroll
// we have moved the following event listener to startSearch()

var prevScrollPos = window.pageYOffset;

function handleScroll() {
  // code for infinite scroll
  if (
    window.scrollY + window.innerHeight + 480 >=
    document.documentElement.scrollHeight
  ) {
    if (!isContentModalOpen()) {
      showResultCards();
    }
  }

  // code for hiding and showing the nav bar on page scroll
  // hide the nav bar only when the user has scrolled atleast 360px
  //  from the top. so that there is no white space shown when the
  // nav bar hides itself
  if (window.scrollY >= 640 && shouldWeHideNavBar) {
    var currentScrollPos = window.pageYOffset;

    // when the user scrolls up then prevscrollpos is greater
    //  than currentscrollpos
    if (prevScrollPos > currentScrollPos) {
      navBar.classList.remove("hidden");
    }
    // when the user scrolls down then prevscrollpos is less than
    // currentscrollpos
    else {
      navBar.classList.add("hidden");
      // console.log("we are hiding nav-bar");
    }

    prevScrollPos = currentScrollPos;
  }
}

// --------------------------------------------------------------------

// to get viewport dimensions
getViewportDimensions();
//listening to enter key press
startListeningToEnterKeyPress();

//starting button splash effect listener
listenToButtonClickForSplashEffect();

// starting button background fill effect listener
// listenToButtonHoverForBackgroundFillEffect();

// -------------------------------------------

function getViewportDimensions() {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  let vw = window.innerWidth * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  document.documentElement.style.setProperty("--vw", `${vw}px`);

  // We listen to the resize event
  window.addEventListener("resize", () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;

    document.documentElement.style.setProperty("--vh", `${vh}px`);
    document.documentElement.style.setProperty("--vw", `${vw}px`);

    // calculates number of columns of grid container
    // const cardsContainer = document.querySelector(".cards-container");
    // var columns = window.getComputedStyle(cardsContainer).gridTemplateColumns;
    // columns = columns.split(" ");
    // console.log(" number of columns: " + columns.length);
  });
}

function startListeningToEnterKeyPress() {
  const navBarSearchBox = document.getElementById("nav-search-box");
  // the one besides the logo
  const navBarSearchBoxDesktop = document.getElementById(
    "nav-search-box-desktop"
  );
  const homePageSearchBox = document.getElementById("home-page-search-box");
  navBarSearchBox.addEventListener("keyup", (event) => {
    var char = event.keyCode;
    // console.log("char code:" + char);
    if (char == 13) {
      startSearch(event);
      // console.log("enter key was pressed");
    }
  });
  homePageSearchBox.addEventListener("keyup", (event) => {
    var char = event.keyCode;
    // console.log("char code:" + char);
    if (char == 13) {
      startSearch(event);
    }
  });
  navBarSearchBoxDesktop.addEventListener("keyup", (event) => {
    var char = event.keyCode;
    // console.log("char code:" + char);
    if (char == 13) {
      startSearch(event);
    }
  });
}
function listenToButtonHoverForBackgroundFillEffect() {
  const buttonsBackgroundEffect = document.querySelectorAll(
    ".button-background-color-splash"
  );

  buttonsBackgroundEffect.forEach((btn) => {
    btn.addEventListener("mouseenter", (event) => {
      var elem = btn.getBoundingClientRect();
      var x = event.clientX - elem.left;
      var y = event.clientY - elem.top;

      let background = document.createElement("span");
      background.classList.add("button-background-color");
      background.style.left = x + "px";
      background.style.top = y + "px";

      event.target.insertBefore(background, event.target.firstChild);
    });

    btn.addEventListener("mouseleave", (event) => {
      var item = document.querySelector(".button-background-color");

      item.parentNode.removeChild(item);
    });
  });
}
function listenToButtonClickForSplashEffect() {
  const buttons = document.querySelectorAll(".splash-effect");

  buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      if (btn.classList.contains("splash-effect")) {
        var elem = btn.getBoundingClientRect();
        var x = e.clientX - elem.left;
        var y = e.clientY - elem.top;

        let ripple = document.createElement("span");
        ripple.classList.add("ripple");
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 700);
      }

      // }
    });
  });
}
function handleArrowKeyPress(event) {
  var char = event.keyCode;
  // console.log("key pressed: " + char);
  if (char == 37) {
    // extra if check to not fire prevData() while the button is disabled (media is still loading)

    if (
      !document
        .querySelector("#prev-arrow-button")
        .classList.contains("disabled") &&
      !document
        .querySelector("#prev-item-button")
        .classList.contains("disabled")
    ) {
      prevData();
    }
  }
  if (char == 39) {
    // extra if check to not fire prevData() while the button is disabled (media is still loading)

    if (
      !document
        .querySelector("#next-arrow-button")
        .classList.contains("disabled") &&
      !document
        .querySelector("#next-item-button")
        .classList.contains("disabled")
    ) {
      nextData();
    }
  }
}

function sendHttpRequest(method, url, mode) {
  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest();
    // req.responseType = "json";
    req.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var data = JSON.parse(this.response);
          // var data = this.response;
          //console.log(data);
          resolve(data);
        } else reject(this.status);
      }
    };
    req.open(method, url, mode);
    req.send();
  });
}

function enableBtns() {
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.disabled = false;
  searchBtn.classList.remove("disabled");

  const radioButtonsLabel = document.querySelectorAll(".radio-button-label");
  radioButtonsLabel.forEach((btn) => {
    btn.classList.remove("disabled");
  });

  const mediaTypeImage = document.querySelectorAll(".image-radio-button");
  mediaTypeImage.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove("disabled");
  });

  const mediaTypeVideo = document.querySelectorAll(".video-radio-button");
  mediaTypeVideo.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove("disabled");
  });

  const qualitySelector = document.querySelector("#quality-selector");
  qualitySelector.classList.remove("disabled");

  const arrowButton = document.querySelectorAll(".arrow-button");
  arrowButton.forEach((btn) => {
    btn.classList.remove("disabled");
    btn.classList.remove("md-inactive");
  });

  // changeItemBtn are the big arrow buttons on desktop version
  const changeItemBtn = document.querySelectorAll(".change-item-icon-button");
  changeItemBtn.forEach((btn) => {
    btn.classList.remove("disabled");
    btn.classList.remove("md-inactive");
  });
}

function disableBtns() {
  // console.log("disabling buttons");
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.disabled = true;
  searchBtn.classList.add("disabled");

  const mediaTypeImage = document.querySelectorAll(".image-radio-button");
  mediaTypeImage.forEach((btn) => {
    btn.disabled = true;
    btn.classList.add("disabled");
  });

  const mediaTypeVideo = document.querySelectorAll(".video-radio-button");
  mediaTypeVideo.forEach((btn) => {
    btn.disabled = true;
    btn.classList.add("disabled");
  });

  const radioButtonsLabel = document.querySelectorAll(".radio-button-label");
  radioButtonsLabel.forEach((btn) => {
    btn.classList.add("disabled");
  });

  const qualitySelector = document.querySelector("#quality-selector");
  qualitySelector.classList.remove("disabled");

  const arrowButton = document.querySelectorAll(".arrow-button");
  arrowButton.forEach((btn) => {
    btn.classList.add("disabled");
    btn.classList.add("md-inactive");
  });
  // changeItemBtn are the big arrow buttons on desktop version
  const changeItemBtn = document.querySelectorAll(".change-item-icon-button");
  changeItemBtn.forEach((btn) => {
    btn.classList.add("disabled");
    btn.classList.add("md-inactive");
  });

  // const knowMoreButton = document.querySelector(".know-more-button");
  // knowMoreButton.disabled = true;
  // knowMoreButton.classList.add("disabled");
}

function displayVideo() {
  var vid = document.getElementById("vid");
  if (vid != undefined) vid.style.display = "inline-block";
}

function createVideoElement(url) {
  var mediaContainer = document.getElementById("media-container");
  var vid = document.createElement("video");
  // var source = document.createElement("source");

  vid.id = "vid";
  vid.className = "modal-content";
  vid.autoplay = true;
  vid.controls = true;
  vid.style.display = "none";

  mediaContainer.appendChild(vid);
  stopPreviousIvlVideoListeners();
  startIvlVideoListeners();
  vid.src = url;
  // vid.oncanplay = () => {
  // vid.play();
  // };
}

function hideVideo() {
  var vid = document.getElementById("vid");

  // if there exists a video element with id="vid"
  if (vid != undefined) {
    var mediaContainer = document.getElementById("media-container");
    vid.style.display = "none";
    stopPreviousIvlVideoListeners();
    mediaContainer.removeChild(vid);
  }
}
function pauseVideo() {
  var vid = document.getElementById("vid");
  // if there exists a video element with id="vid".
  if (vid != undefined) {
    const prevTime = vid.currentTime;
    vid.pause();
    vid.currentTime = 0;
    vid.src = "";
    vid.load();
    return prevTime;
  }
  return -1;
}
function displayImage() {
  const pic = document.getElementById("pic");
  pic.style.display = "inline-block";
}
function hideImage() {
  // console.log("hiding image");
  const pic = document.getElementById("pic");

  pic.style.display = "none";
}
function showMessage(messageString, messageBoxNum) {
  //boxNum=0 means the message box inside modal screen
  // boxNum=1 means the message box outside the modal screen

  var messageBoxInsideModal = document.getElementById("messageInsideModal");
  var messageBox = document.getElementById("message");
  // console.log(messageString);
  // message inside modal box
  if (messageBoxNum == 0) {
    messageBoxInsideModal.innerText = messageString;

    messageBoxInsideModal.style.display = "inline-block";
  }
  //message outside modal box
  if (messageBoxNum == 1) {
    messageBox.innerText = messageString;

    messageBox.style.display = "inline-block";
  }
  // console.log("we are going out");
}
function hideMessage() {
  document.getElementById("messageInsideModal").style.display = "none";
  document.getElementById("message").style.display = "none";
}
function isMessageOnDisplay() {
  const messageBoxInsideModal = document.getElementById("messageInsideModal");

  if (messageBoxInsideModal.style.display == "inline-block") {
    return true;
  } else {
    return false;
  }
}
function showQualitySelector() {
  const selectElem = document.querySelector("#quality-selector");

  selectElem.style.display = "inline-block";
}
function hideQualitySelector() {
  const selectElem = document.querySelector("#quality-selector");

  selectElem.style.display = "none";
  // document.getElementById("quality-selector").style.display = "none";
}

function toggleNavBarMediaTypeToVideo() {
  const toggleVideoIcon1 = document.getElementById("toggle-video-icon");
  const toggleVideoIcon2 = document.getElementById("toggle-video-icon-desktop");
  const toggleImageIcon1 = document.getElementById("toggle-image-icon");
  const toggleImageIcon2 = document.getElementById("toggle-image-icon-desktop");
  // hiding image icon
  toggleImageIcon1.classList.add("inactive-media-type");
  toggleImageIcon2.classList.add("inactive-media-type");

  // displaying video icon
  toggleVideoIcon1.classList.remove("inactive-media-type");
  toggleVideoIcon2.classList.remove("inactive-media-type");

  // checking  video buttons at all places
  const videoRadioButtons = document.querySelectorAll(".video-radio-button");
  videoRadioButtons.forEach((btn) => {
    // excluding change media type button as its class is also the same
    if (btn.id != "video-radio-button-2") {
      btn.checked = true;
    }
  });
}

function toggleNavBarMediaTypeToImage() {
  const toggleVideoIcon1 = document.getElementById("toggle-video-icon");
  const toggleVideoIcon2 = document.getElementById("toggle-video-icon-desktop");
  const toggleImageIcon1 = document.getElementById("toggle-image-icon");
  const toggleImageIcon2 = document.getElementById("toggle-image-icon-desktop");

  // hiding video icon
  toggleVideoIcon1.classList.add("inactive-media-type");
  toggleVideoIcon2.classList.add("inactive-media-type");
  // displaying image icon
  toggleImageIcon1.classList.remove("inactive-media-type");
  toggleImageIcon2.classList.remove("inactive-media-type");
  // checking home page image buttons
  const imageRadioButtons = document.querySelectorAll(".image-radio-button");
  imageRadioButtons.forEach((btn) => {
    if (btn.id != "image-radio-button-2") {
      btn.checked = true;
    }
  });
}

function toggleNavBarMediaType() {
  const inactiveMediaType = document.querySelector(".inactive-media-type");

  // if image is active (when video is not active)
  if (
    inactiveMediaType.id == "toggle-video-icon" ||
    inactiveMediaType.id == "toggle-video-icon-desktop"
  ) {
    // making video active
    toggleNavBarMediaTypeToVideo();
  }
  // if image is inactive (when video is active)
  else {
    // making image active
    toggleNavBarMediaTypeToImage();
  }
}

// this function selects all the radio buttons of either image or video
// depending on the value of selectedMediaType
function selectRadioButtons() {
  const imageRadioButtons = document.querySelectorAll(".image-radio-button");
  const videoRadioButtons = document.querySelectorAll(".video-radio-button");
  if (selectedMediaType == "image") {
    imageRadioButtons.forEach((btn) => {
      btn.checked = true;
    });
  } else {
    videoRadioButtons.forEach((btn) => {
      btn.checked = true;
    });
  }
}
function getSelectedMediaType(event) {
  // this function updates the value of selectedMediaType and checks
  //  the respective button at all places

  // if the user pressed the search icon of nav bar or presed enter while typing
  // in the nav search box

  if (
    event.target.id == "nav-start-search-icon-button" ||
    event.target.id == "nav-search-box"
  ) {
    const inactiveMediaType = document.querySelector(
      ".nav-search-section .inactive-media-type"
    );
    if (inactiveMediaType.id == "toggle-video-icon") {
      selectedMediaType = "image";
    } else {
      selectedMediaType = "video";
    }
  } else if (
    event.target.id == "nav-start-search-icon-button-desktop" ||
    event.target.id == "nav-search-box-desktop"
  ) {
    const inactiveMediaType = document.querySelector(
      ".nav-bar-search-section-desktop .inactive-media-type"
    );
    if (inactiveMediaType.id == "toggle-video-icon-desktop") {
      selectedMediaType = "image";
    } else {
      selectedMediaType = "video";
    }
  } else {
    var buttons = document.getElementsByName("media-type-1");
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].checked) {
        selectedMediaType = buttons[i].value;
        break;
      }
    }
  }
  // selecting the radio buttons
  selectRadioButtons();
}

function pageReset() {
  currentPage = 1;
  currentThumbPage = 1;
  totalPage = 0;
}

function calTotalPage() {
  //if there are more than 1 total page
  if (queryResponse[0].collection.metadata.total_hits > 100) {
    /*formula: first divide total hits by 100. and then multiply the quotient(result of the division) by 100. and then
        check if the total hits is greater than this number or not. if it is greater then add 1 to it.
        example: if there are 515 total hits. then dividing it by 100 we get 5(store this). and now multiplying 5 by 100 we get 500. now 515 
        is greater than 500 so there are 5+1=6 pages in total.*/

    var quotient = parseInt(
      queryResponse[0].collection.metadata.total_hits / 100
    );
    if (queryResponse[0].collection.metadata.total_hits > quotient * 100) {
      quotient += 1;
      totalPage = quotient;
    }
    //if there are 100x total hits.eg: 500
    else {
      totalPage = quotient;
    }
  }
  //when there is only 1 total page
  else {
    totalPage = 1;
  }
}

function isNextPageAvailable() {
  currentPage++;
  if (currentPage > totalPage) {
    currentPage--;
    return false;
  } else {
    currentPage--;
    return true;
  }
}

function isPrevPageAvailable() {
  currentPage--;
  if (currentPage < 1) {
    currentPage++;
    return false;
  } else {
    currentPage++;
    return true;
  }
}
function downloadPageAndShowMedia(page) {
  // console.log("downloadPageAndShowMedia()");
  var searchUrl = calSearchUrl(page);
  sendHttpRequest(method, searchUrl, mode)
    .then((response) => {
      console.log(response);
      //storing new page in queryResponse

      queryResponse[page - 1] = response;

      fetchMediaUrl(hitNum, currentPage);
    })
    .catch((errCode) => {
      // console.log("error code: " + errCode);

      enableBtns();
      if (errCode == 404) {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isContentModalOpen()) {
          showMessage(notFound404, 0);
        } else {
          showMessage(notFound404, 1);
        }
      } else if (errCode > 499 && errCode < 600) {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isContentModalOpen()) {
          showMessage(problemWithNasaServer, 0);
        } else {
          showMessage(problemWithNasaServer, 1);
        }
      } else if (errCode == 400) {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isContentModalOpen()) {
          showMessage(badResquest400, 0);
        } else {
          showMessage(badResquest400, 1);
        }
      }

      //for no internet connection
      else {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isContentModalOpen()) {
          showMessage(onErrorMessage, 0);
        } else {
          showMessage(onErrorMessage, 1);
        }
      }
    });
}
function downloadNextPage(page) {
  var searchUrl = calSearchUrl(page);

  sendHttpRequest(method, searchUrl, mode)
    .then((response) => {
      console.log(response);
      queryResponse[page - 1] = response;
      hitNum = -1;

      nextData();
    })
    .catch((errCode) => {
      // console.log("error code: " + errCode);

      enableBtns();
      if (errCode == 404) {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isContentModalOpen()) {
          showMessage(notFound404, 0);
        } else {
          showMessage(notFound404, 1);
        }
      } else if (errCode > 499 && errCode < 600) {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isContentModalOpen()) {
          showMessage(problemWithNasaServer, 0);
        } else {
          showMessage(problemWithNasaServer, 1);
        }
      } else if (errCode == 400) {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isContentModalOpen()) {
          showMessage(badResquest400, 0);
        } else {
          showMessage(badResquest400, 1);
        }
      }

      //for no internet connection
      else {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isContentModalOpen()) {
          showMessage(onErrorMessage, 0);
        } else {
          showMessage(onErrorMessage, 1);
        }
      }
    });
}

function downloadPrevPage(page) {
  var searchUrl = calSearchUrl(page);

  sendHttpRequest(method, searchUrl, mode)
    .then((response) => {
      console.log(response);
      //storing new page in queryResponse
      queryResponse[page - 1] = response;
      hitNum = 100;
      prevData();
    })
    .catch((errCode) => {
      // console.log("error code: " + errCode);

      enableBtns();
      if (errCode == 404) {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isContentModalOpen()) {
          showMessage(notFound404, 0);
        } else {
          showMessage(notFound404, 1);
        }
      } else if (errCode > 499 && errCode < 600) {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isContentModalOpen()) {
          showMessage(problemWithNasaServer, 0);
        } else {
          showMessage(problemWithNasaServer, 1);
        }
      } else if (errCode == 400) {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isContentModalOpen()) {
          showMessage(badResquest400, 0);
        } else {
          showMessage(badResquest400, 1);
        }
      }

      //for no internet connection
      else {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isContentModalOpen()) {
          showMessage(onErrorMessage, 0);
        } else {
          showMessage(onErrorMessage, 1);
        }
      }
    });
}

function nextData() {
  // console.log("nextDAta()");
  // console.log(visitedImages);
  disableBtns();

  hitNum++;
  //if hit number exceeds total number of hits in the current page and if there is a next page then transition to next page
  //    but if there is not a next page(eg: first page with less than 100 items, last page with less than 100 items)
  // then hitNum--;

  //if hit number exceeds total number of hits in the CURRENT page
  if (hitNum > queryResponse[currentPage - 1].collection.items.length - 1) {
    //if next page is available then go to next page

    if (isNextPageAvailable()) {
      hitNum = 0;
      hideMessage();

      nextPage();
    }
    //if next page is not available then display message
    else {
      hitNum--;

      showMessage(lastPage, 0);

      enableBtns();

      // for previous button (the first item)
      if (hitNum == 0 && currentPage == 1) {
        document
          .querySelector(".arrow-button:nth-child(1)")
          .classList.add("disabled");
        document
          .querySelector(".prev-item-icon span")
          .classList.add("disabled");
      } else {
        document
          .querySelector(".arrow-button:nth-child(1)")
          .classList.remove("disabled");
        document
          .querySelector(".prev-item-icon span")
          .classList.remove("disabled");
      }

      // for next button (for last item)
      if (
        hitNum == queryResponse[currentPage - 1].collection.items.length - 1 &&
        currentPage == totalPage
      ) {
        document
          .querySelector(".arrow-button:nth-child(2)")
          .classList.add("disabled");
        document
          .querySelector(".next-item-icon span")
          .classList.add("disabled");
      } else {
        document
          .querySelector(".arrow-button:nth-child(2)")
          .classList.remove("disabled");
        document
          .querySelector(".next-item-icon span")
          .classList.remove("disabled");
      }
    }
  }
  //else show next data from the current page
  else {
    // hideImage();
    pauseVideo();
    hideVideo();
    blurContentSection();
    if (isMessageOnDisplay()) {
      hideMessage();
      showLoadingAnimation();
    } else {
      hideMessage();
      if (mediaType == "image") {
        hideLoadingAnimation();
        if (
          visitedImages[(currentPage - 1) * 100 + parseInt(hitNum)] == undefined
        ) {
          // console.log("showing media loading animation");
          showMediaLoadingAnimation();
        }
      } else {
        hideArrowButtonContainer();
        hideDescription();
      }
    }

    updateStateOfContentModal();

    if (mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)] == undefined) {
      fetchMediaUrl(hitNum, currentPage);
    } else {
      showMedia();
    }
  }
}

//tries going to next page. shows error if its already the last page
function nextPage() {
  //if next page exists
  if (isNextPageAvailable()) {
    // hideImage();
    pauseVideo();
    hideVideo();
    if (isContentModalOpen()) {
      if (mediaType == "image") {
        showMediaLoadingAnimation();
      }
    }

    // showMessage(loading, 0);
    currentPage++;
    //if the next page is not downloaded
    if (queryResponse[currentPage - 1] == undefined) {
      downloadNextPage(currentPage);
    } else {
      hitNum = -1;
      // console.log("using downloaded page");
      nextData();
    }
  }
  //if the next page does not exist (exceeds total pages)
  else {
    showMessage(lastPage, 0);

    enableBtns();
  }
}

function prevData() {
  // console.log("prevData()");
  // console.log(visitedImages);
  disableBtns();

  hitNum--;

  //if hit number becomes less than 0 then transition to prev page
  if (hitNum < 0) {
    //if previous page is available then go to previous page
    if (isPrevPageAvailable()) {
      prevPage();
    }
    //else show message and undo changes to hitNum
    else {
      hitNum++;
      // showMessage(firstPage, 0);

      enableBtns();

      // for previous button (the first item)
      if (hitNum == 0 && currentPage == 1) {
        document
          .querySelector(".arrow-button:nth-child(1)")
          .classList.add("disabled");
        document
          .querySelector(".prev-item-icon span")
          .classList.add("disabled");
      } else {
        document
          .querySelector(".arrow-button:nth-child(1)")
          .classList.remove("disabled");
        document
          .querySelector(".prev-item-icon span")
          .classList.remove("disabled");
      }

      // for next button (for last item)
      if (
        hitNum == queryResponse[currentPage - 1].collection.items.length - 1 &&
        currentPage == totalPage
      ) {
        document
          .querySelector(".arrow-button:nth-child(2)")
          .classList.add("disabled");
        document
          .querySelector(".next-item-icon span")
          .classList.add("disabled");
      } else {
        document
          .querySelector(".arrow-button:nth-child(2)")
          .classList.remove("disabled");
        document
          .querySelector(".next-item-icon span")
          .classList.remove("disabled");
      }
    }
  }
  //else show previous data from the current page
  else {
    // hideImage();
    pauseVideo();
    hideVideo();
    blurContentSection();

    if (isMessageOnDisplay()) {
      hideMessage();
      showLoadingAnimation();
    } else {
      hideMessage();
      if (mediaType == "image") {
        hideLoadingAnimation();
        if (
          visitedImages[(currentPage - 1) * 100 + parseInt(hitNum)] == undefined
        ) {
          showMediaLoadingAnimation();
        }
      } else {
        hideDescription();
      }
    }
    // showMessage(loading, 0);

    updateStateOfContentModal();

    if (mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)] == undefined) {
      // console.log("calling fetchMediaUrl");
      fetchMediaUrl(hitNum, currentPage);
    } else {
      showMedia();
    }

    // showDescription(hitNum, currentPage);
  }
}
//tries going to previous page. shows error if its  first page
function prevPage() {
  currentPage--;

  //if the page we are trying to access is less than 1 then throw error
  if (currentPage < 1) {
    // showMessage(firstPage, 0);

    enableBtns();
    //hitNum = 0;
    currentPage++;
  }
  //else  fetch data
  else {
    pauseVideo();
    hideVideo();
    if (isContentModalOpen()) {
      if (mediaType == "image") {
        showMediaLoadingAnimation();
      }
    }

    if (queryResponse[currentPage - 1] == undefined) {
      downloadPrevPage(currentPage);
    } else {
      hitNum = 100;
      prevData();
    }
  }
}

//returns the file extension of current urlNum (url index) of mediaUrls
function getFileExtension(urlNum) {
  var urlStr =
    mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][urlNum].href;
  var lastIndex = urlStr.lastIndexOf(".");
  var extension = urlStr.slice(lastIndex);
  return extension;
}

//CREATES QUALITY OPTIONS (SELECT)
function createMediaQualityOptions() {
  const select = document.querySelector("#quality-selector");

  //contains all the keys inside qualityIndices
  const keys = Object.keys(qualityIndices);

  //bypass this statement the first time this function is called as there is nothing
  // to remove.

  if (select.length > 0) {
    //it removes all the options in select. IMPORTANT: WE HAVE TO START FROM THE LAST
    // AND NOT FROM THE BEGINNING. OTHERWISE IT WILL NOT WORK.
    // It's important to remove the options backwards;
    // as the remove() method rearranges the options collection.
    // This way, it's guaranteed that the element to be removed still exists!
    for (var i = select.length; i >= 0; i--) {
      select.remove(i);
    }
    select.length = 0;
  }

  //runs a function on each key inside qualityIndices
  // and then creates an option for that key(quality)

  keys.forEach((key) => {
    var option = document.createElement("OPTION");
    option.value = key;
    option.text = key;

    option.id = key;

    select.add(option);
  });
}

//FINDS ALL THE MEDIA QUALITIES AVAILABLE AND THEN STORES IT IN qualityIndices
// IN THE FORMAT qualityIndices={"quality_name":indexOfTheUrl}
function findMediaQualities() {
  var extension, urlStr, firstIndex, lastIndex, qualityName;
  // console.log("findMediaQualities()");
  qualityIndices = {};
  if (mediaType == "video") {
    for (
      var i = 0;
      i < mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)].length;
      i++
    ) {
      //stores the file extension of the current urlNum
      extension = getFileExtension(i);
      if (extension == ".mp4" || extension == ".ogg" || extension == "mpeg") {
        //extracting quality name. eg: orig
        urlStr = mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][i].href;
        firstIndex = urlStr.lastIndexOf("~");
        lastIndex = urlStr.lastIndexOf(".");
        qualityName = urlStr.slice(firstIndex + 1, lastIndex);
        qualityName =
          qualityName.charAt(0).toUpperCase() + qualityName.slice(1);
        if (qualityName == "Orig") qualityName = "Original";

        qualityIndices[qualityName] = i;
      }
    }
  }
  //for image
  else {
    // console.log(mediaUrls);
    for (
      var i = 0;
      i < mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)].length;
      i++
    ) {
      //stores the file extension of the current urlNum
      extension = getFileExtension(i);
      if (
        extension == ".apng" ||
        extension == ".bmp" ||
        extension == ".gif" ||
        extension == ".jpg" ||
        extension == ".jpeg" ||
        extension == ".jfif" ||
        extension == ".pjpeg" ||
        extension == ".pjpg" ||
        extension == ".pjp" ||
        extension == ".png" ||
        extension == ".svg" ||
        extension == ".webp"
      ) {
        //extracting quality name. eg: orig
        urlStr = mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][i].href;
        firstIndex = urlStr.lastIndexOf("~");
        lastIndex = urlStr.lastIndexOf(".");
        qualityName = urlStr.slice(firstIndex + 1, lastIndex);
        // console.log(qualityName);
        qualityName =
          qualityName.charAt(0).toUpperCase() + qualityName.slice(1);
        // console.log(qualityName);
        if (qualityName == "Orig") qualityName = "Original";

        if (qualityName == "Thumb") continue;
        qualityIndices[qualityName] = i;
      }
    }
    // console.log(qualityIndices);
  }
}
function handleVideoLoadingError() {
  pauseVideo();
  hideVideo();
  hideImage();
  hideDescription();

  removeBlurFromContentSection();

  showMessage(onErrorMessage, 0);

  // showing arrow buttons
  showArrowButtonContainer();
  enableBtns();
}

function stopPreviousIvlVideoListeners() {
  var vid = document.getElementById("vid");
  vid.removeEventListener("error", handleVideoLoadingError);
}
function startIvlVideoListeners() {
  var vid = document.getElementById("vid");

  vid.addEventListener("error", handleVideoLoadingError);
}
//SHOWS THE IVL VIDEO
function showIvlVideo() {
  hideMessage();
  hideMediaLoadingAnimation();

  if (mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)].length > 0) {
    if (qualityIndices.hasOwnProperty("Medium")) {
      document.getElementById("Medium").selected = true;
      hideMessage();
      hideLoadingAnimation();

      createVideoElement(
        mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][
          qualityIndices["Medium"]
        ].href
      );
      displayVideo();
      // showing arrow buttons
      showArrowButtonContainer();
      enableBtns();
      if (isContentModalOpen()) {
        showDescription(hitNum, currentPage);
      }
      removeBlurFromContentSection();
    } else if (qualityIndices.hasOwnProperty("Large")) {
      document.getElementById("Large").selected = "true";
      hideMessage();
      hideLoadingAnimation();

      createVideoElement(
        mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][
          qualityIndices["Large"]
        ].href
      );
      displayVideo();
      // showing arrow buttons
      showArrowButtonContainer();
      enableBtns();
      if (isContentModalOpen()) {
        showDescription(hitNum, currentPage);
      }
      removeBlurFromContentSection();
      // console.log("Quality: Large url num: " + qualityIndices["Large"]);
    } else if (qualityIndices.hasOwnProperty("Original")) {
      document.getElementById("Original").selected = true;
      hideMessage();
      hideLoadingAnimation();

      createVideoElement(
        mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][
          qualityIndices["Original"]
        ].href
      );
      displayVideo();
      // showing arrow buttons
      showArrowButtonContainer();
      enableBtns();
      if (isContentModalOpen()) {
        showDescription(hitNum, currentPage);
      }
      removeBlurFromContentSection();
    } else if (qualityIndices.hasOwnProperty("Small")) {
      document.getElementById("Small").selected = true;
      hideMessage();
      hideLoadingAnimation();
      createVideoElement(
        mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][
          qualityIndices["Small"]
        ].href
      );
      displayVideo();
      // showing arrow buttons
      showArrowButtonContainer();
      enableBtns();
      if (isContentModalOpen()) {
        showDescription(hitNum, currentPage);
      }
      removeBlurFromContentSection();
    } else if (qualityIndices.hasOwnProperty("Preview")) {
      document.getElementById("Preview").selected = true;
      hideMessage();
      hideLoadingAnimation();
      createVideoElement(
        mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][
          qualityIndices["Preview"]
        ].href
      );
      displayVideo();
      // showing arrow buttons
      showArrowButtonContainer();
      enableBtns();
      if (isContentModalOpen()) {
        showDescription(hitNum, currentPage);
      }
      removeBlurFromContentSection();
    } else if (qualityIndices.hasOwnProperty("Mobile")) {
      document.getElementById("Mobile").selected = true;
      hideMessage();
      hideLoadingAnimation();
      createVideoElement(
        mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][
          qualityIndices["Mobile"]
        ].href
      );
      displayVideo();
      // showing arrow buttons
      showArrowButtonContainer();
      enableBtns();
      if (isContentModalOpen()) {
        showDescription(hitNum, currentPage);
      }
      removeBlurFromContentSection();
    } else {
      removeBlurFromContentSection();
      hideDescription();
      hideLoadingAnimation();
      hideMediaLoadingAnimation();
      // showing arrow buttons
      showArrowButtonContainer();
      enableBtns();
      showMessage(notFound404, 0);
    }
  } else {
    removeBlurFromContentSection();
    hideDescription();
    hideLoadingAnimation();
    hideMediaLoadingAnimation();
    // showing arrow buttons
    showArrowButtonContainer();
    enableBtns();

    showMessage(notFound404, 0);
  }

  // for previous button (the first item)
  if (hitNum == 0 && currentPage == 1) {
    document
      .querySelector(".arrow-button:nth-child(1)")
      .classList.add("disabled");
    document.querySelector(".prev-item-icon span").classList.add("disabled");
  } else {
    document
      .querySelector(".arrow-button:nth-child(1)")
      .classList.remove("disabled");
    document.querySelector(".prev-item-icon span").classList.remove("disabled");
  }

  // for next button (for last item)
  if (
    hitNum == queryResponse[currentPage - 1].collection.items.length - 1 &&
    currentPage == totalPage
  ) {
    document
      .querySelector(".arrow-button:nth-child(2)")
      .classList.add("disabled");
    document.querySelector(".next-item-icon span").classList.add("disabled");
  } else {
    document
      .querySelector(".arrow-button:nth-child(2)")
      .classList.remove("disabled");
    document.querySelector(".next-item-icon span").classList.remove("disabled");
  }
}

function changeMediaQuality(qualityKey) {
  disableBtns();
  // blur content section for image only.
  if (document.querySelector("#vid") == undefined) {
    blurContentSection();
  }

  hideMessage();

  // if (mediaType == "album") {
  // } else
  if (mediaType == "video") {
    const prevTime = pauseVideo();
    // console.log(prevTime);
    // hideVideo();
    // showLoadingAnimation();

    var vid = document.getElementById("vid");
    vid.src =
      mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][
        qualityIndices[qualityKey]
      ].href;
    vid.currentTime = prevTime;
    enableBtns();
  }
  //for image
  else {
    // hideImage();

    showMediaLoadingAnimation();
    var image = document.getElementById("pic");
    image.src =
      mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][
        qualityIndices[qualityKey]
      ].href;

    enableBtns();
  }
}

function showBlurredBackground(href) {
  const backgroundBlurElement = document.querySelector(".background-blur");

  backgroundBlurElement.src = href;
  backgroundBlurElement.classList.add("show");
}
function hideBlurredBackground() {
  const backgroundBlurElement = document.querySelector(".background-blur");

  backgroundBlurElement.src = "";
  backgroundBlurElement.classList.remove("show");
}

function showIvlImage() {
  var image = document.getElementById("pic");
  var highestQualityAvailableForBlurredBackgroundUrl;

  image.onerror = () => {
    hideImage();
    hideDescription();
    hideLoadingAnimation();
    hideMediaLoadingAnimation();
    showMessage(onErrorMessage, 0);

    // enableBtns();
  };
  image.onload = () => {
    // showDescription(hitNum, currentPage);
    hideMediaLoadingAnimation();
    hideLoadingAnimation();

    if (isContentModalOpen()) {
      showDescription(hitNum, currentPage);
      showBlurredBackground(highestQualityAvailableForBlurredBackgroundUrl);
    }

    // document.getElementById("resolution").innerText =
    //   "Resolution: " + image.naturalWidth + " x " + image.naturalHeight;
    // document.getElementById("message").innerText = "";
    // rePositionImage();
    hideMessage();
    removeBlurFromContentSection();
    displayImage();
    // showing arrow buttons
    showArrowButtonContainer();
    cacheMediaUrl(hitNum, currentPage);

    // console.log("setting visited images");
    visitedImages[(currentPage - 1) * 100 + parseInt(hitNum)] = true;
    // console.log(visitedImages);
    // cacheNextPic(hitNum, currentPage);
    // enableBtns();
  };

  if (mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)].length > 0) {
    if (qualityIndices.hasOwnProperty("Medium")) {
      document.getElementById("Medium").selected = true;

      image.src =
        mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][
          qualityIndices["Medium"]
        ].href;
      image.alt =
        queryResponse[currentPage - 1].collection.items[hitNum].data[0].title;
      highestQualityAvailableForBlurredBackgroundUrl = image.src;
    } else if (qualityIndices.hasOwnProperty("Large")) {
      document.getElementById("Large").selected = "true";

      image.src =
        mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][
          qualityIndices["Large"]
        ].href;
      image.alt =
        queryResponse[currentPage - 1].collection.items[hitNum].data[0].title;
      highestQualityAvailableForBlurredBackgroundUrl = image.src;
    } else if (qualityIndices.hasOwnProperty("Original")) {
      document.getElementById("Original").selected = true;

      image.src =
        mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][
          qualityIndices["Original"]
        ].href;
      image.alt =
        queryResponse[currentPage - 1].collection.items[hitNum].data[0].title;
      highestQualityAvailableForBlurredBackgroundUrl = image.src;
    } else if (qualityIndices.hasOwnProperty("Small")) {
      document.getElementById("Small").selected = true;

      image.src =
        mediaUrls[(currentPage - 1) * 100 + parseInt(hitNum)][
          qualityIndices["Small"]
        ].href;
      image.alt =
        queryResponse[currentPage - 1].collection.items[hitNum].data[0].title;
      highestQualityAvailableForBlurredBackgroundUrl = image.src;
    } else {
      showMessage(notFound404, 0);
    }
  } else {
    showMessage(notFound404, 0);
  }

  // code to disable buttons for first and last item
  // for previous button (the first item)
  if (hitNum == 0 && currentPage == 1) {
    document
      .querySelector(".arrow-button:nth-child(1)")
      .classList.add("disabled");
    document.querySelector(".prev-item-icon span").classList.add("disabled");
  } else {
    document
      .querySelector(".arrow-button:nth-child(1)")
      .classList.remove("disabled");
    document.querySelector(".prev-item-icon span").classList.remove("disabled");
  }

  // for next button (the last item)
  if (
    hitNum == queryResponse[currentPage - 1].collection.items.length - 1 &&
    currentPage == totalPage
  ) {
    document
      .querySelector(".arrow-button:nth-child(2)")
      .classList.add("disabled");
    document.querySelector(".next-item-icon span").classList.add("disabled");
  } else {
    document
      .querySelector(".arrow-button:nth-child(2)")
      .classList.remove("disabled");
    document.querySelector(".next-item-icon span").classList.remove("disabled");
  }
}

function getCurrentCosmicObjectNum(itemNum, pageNum) {
  pageNum--;
  itemNum++;
  var cosmicObjectNum = itemNum + pageNum * 100;

  return cosmicObjectNum;
}

function showMedia() {
  // extra check to show media only when the content modal is open

  if (isContentModalOpen()) {
    if (mediaType == "video") {
      findMediaQualities();
      createMediaQualityOptions();
      showQualitySelector();

      enableBtns();
      // showControls();

      showIvlVideo();
    }

    //contains image
    else {
      findMediaQualities();
      createMediaQualityOptions();
      showQualitySelector();

      enableBtns();
      // showControls();

      showIvlImage();
    }
  }
}
function hideDescription() {
  document.querySelector(".know-more-data-container").classList.remove("show");
}

function showDescription(itemNum, pageNum) {
  const descriptiveData =
    queryResponse[pageNum - 1].collection.items[itemNum].data[0];

  const date = new Date(descriptiveData.date_created);
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  document.getElementById("date").innerText =
    date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

  // document.getElementById("title").innerText =
  //   hitNum + " " + pageNum + " " + descriptiveData.title;
  document.getElementById("title").innerText = descriptiveData.title;
  document.getElementById("description").innerHTML =
    descriptiveData.description;
  // document.getElementById("resolution").innerText = "Calculating...";

  document.querySelector(".know-more-data-container").classList.add("show");
}

// pass current hitNum and currentpage. it will determine itself which ones to cache.
function cacheMediaUrl(itemNum, pageNum) {
  // console.log(itemNum);
  // console.log("caching");

  //  FOR CACHING NEXT ITEMS
  if (mediaUrls[(pageNum - 1) * 100 + parseInt(itemNum) + 5] == undefined) {
    itemNum++;

    // if the itemnum is less than the totals hits of the current page
    if (itemNum < queryResponse[currentPage - 1].collection.items.length) {
      // check if the next mediaurl does not exist. if yes then proceed and cache 5 sets of mediaUrls
      if (mediaUrls[(pageNum - 1) * 100 + parseInt(itemNum)] == undefined) {
        // console.clear();
        console.log("CACHING NEXT 5");

        var url;
        var nasa_id =
          queryResponse[pageNum - 1].collection.items[itemNum].data[0].nasa_id;

        url =
          "https://images-api.nasa.gov/asset/" + encodeURIComponent(nasa_id);

        //sending http request for media links
        sendHttpRequest(method, url, mode).then((fetchedMediaUrls) => {
          mediaUrls[(pageNum - 1) * 100 + parseInt(itemNum)] =
            fetchedMediaUrls.collection.items;

          // console.log(mediaUrls);

          // cache the next 5 sets of mediaUrls
          var limit = parseInt(parseInt(hitNum) + 5);
          if (itemNum < limit) {
            cacheMediaUrl(itemNum, currentPage);
          }
        });
      }
      // else cache only one
      else {
        // making itemNum equal to the next desirable mediaUrl

        itemNum = mediaUrls.length - (currentPage - 1) * 100;

        if (itemNum < queryResponse[currentPage - 1].collection.items.length) {
          // console.log(itemNum);
          // console.clear();
          console.log("CACHING ONE");

          var url;
          var nasa_id =
            queryResponse[pageNum - 1].collection.items[itemNum].data[0]
              .nasa_id;

          url =
            "https://images-api.nasa.gov/asset/" + encodeURIComponent(nasa_id);

          //sending http request for media links
          sendHttpRequest(method, url, mode).then((fetchedMediaUrls) => {
            mediaUrls[(pageNum - 1) * 100 + parseInt(itemNum)] =
              fetchedMediaUrls.collection.items;

            // console.log(mediaUrls);
          });
        }
      }
    }
  }

  // FOR CACHING PREVIOUS ITEMS
  // check if the last media url has not been cached
  else if (
    mediaUrls[(pageNum - 1) * 100 + parseInt(itemNum) - 5] == undefined &&
    itemNum - 5 > -1
  ) {
    itemNum--;
    // if the itemnum is greater than -1
    if (itemNum > -1) {
      // check if the last  mediaurls does not exist. if yes then proceed and cache 5 sets of mediaUrls
      if (mediaUrls[(pageNum - 1) * 100 + parseInt(itemNum)] == undefined) {
        // console.clear();
        console.log("CACHING PREV 5");

        var url;
        var nasa_id =
          queryResponse[pageNum - 1].collection.items[itemNum].data[0].nasa_id;

        url =
          "https://images-api.nasa.gov/asset/" + encodeURIComponent(nasa_id);

        //sending http request for media links
        sendHttpRequest(method, url, mode).then((fetchedMediaUrls) => {
          mediaUrls[(pageNum - 1) * 100 + parseInt(itemNum)] =
            fetchedMediaUrls.collection.items;

          // console.log(mediaUrls);

          // cache the previous 5 sets of mediaUrls
          var limit = parseInt(parseInt(hitNum) - 5);
          if (itemNum > limit) {
            cacheMediaUrl(itemNum, currentPage);
          }
        });
      }
      // else cache only one
      else {
        //trying to find the empty location from the current hitNum towards left
        var i = hitNum;
        i--;
        while (
          mediaUrls[(pageNum - 1) * 100 + parseInt(i)] != undefined &&
          i > 0
        ) {
          i--;
        }
        itemNum = i;

        // making itemNum equal to the next desirable mediaUrl
        // itemNum = mediaUrls.length - (currentPage - 1) * 100;
        console.log("CACHING ONE PREV");
        var url;
        var nasa_id =
          queryResponse[pageNum - 1].collection.items[itemNum].data[0].nasa_id;
        url =
          "https://images-api.nasa.gov/asset/" + encodeURIComponent(nasa_id);
        // sending http request for media links
        sendHttpRequest(method, url, mode).then((fetchedMediaUrls) => {
          mediaUrls[(pageNum - 1) * 100 + parseInt(itemNum)] =
            fetchedMediaUrls.collection.items;
          // console.log(mediaUrls);
        });
      }
    }
  } else {
  }
}
//fetches media urls of a specific hit and calls showIvl()
function fetchMediaUrl(itemNum, pageNum) {
  // console.log("fetchMediaUrl()");

  var url;

  //getting nasa_id
  var nasa_id =
    queryResponse[pageNum - 1].collection.items[itemNum].data[0].nasa_id;
  //appending it to url

  url = "https://images-api.nasa.gov/asset/" + encodeURIComponent(nasa_id);

  //getting media type
  mediaType =
    queryResponse[pageNum - 1].collection.items[itemNum].data[0].media_type;
  // }

  // console.log(url);

  //sending http request for media links
  sendHttpRequest(method, url, mode)
    .then((fetchedMediaUrls) => {
      // console.log(
      //   "Page:" +
      //     pageNum +
      //     " / " +
      //     totalPage +
      //     " HitNum: " +
      //     itemNum +
      //     " Media type:" +
      //     mediaType
      // );

      mediaUrls[(pageNum - 1) * 100 + parseInt(itemNum)] =
        fetchedMediaUrls.collection.items;

      showMedia();
    })
    .catch((errCode) => {
      // console.log("error code: " + errCode);
      hideDescription();
      pauseVideo();
      hideVideo();
      hideImage();
      hideLoadingAnimation();
      hideMediaLoadingAnimation();
      // showing arrow buttons
      showArrowButtonContainer();
      removeBlurFromContentSection();
      enableBtns();
      if (errCode == 404) {
        showMessage(notFound404, 0);
      } else if (errCode > 499 && errCode < 600) {
        showMessage(problemWithNasaServer, 0);
      } else if (errCode == 400) {
        showMessage(badResquest400, 0);
      }

      //for no internet connection
      else {
        hideLoadingAnimation();
        pauseVideo();
        hideVideo();
        hideImage();
        showMessage(onErrorMessage, 0);
      }
    });
  //    }
}

function calSearchUrl(page) {
  return (
    "https://images-api.nasa.gov/search?q=" +
    encodeURIComponent(search) +
    "&media_type=" +
    selectedMediaType +
    "&page=" +
    page
  );
}

//retrives user search input
function startSearch(event) {
  //get the searching string

  // if the user used the search box on the nav bar
  if (
    event.target.id == "nav-start-search-icon-button" ||
    event.target.id == "nav-search-box"
  ) {
    search = document.getElementById("nav-search-box").value;
  }
  // if the user used the search box on the nav bar on desktop/tablet landscape mode
  else if (
    event.target.id == "nav-start-search-icon-button-desktop" ||
    event.target.id == "nav-search-box-desktop"
  ) {
    search = document.getElementById("nav-search-box-desktop").value;
  }
  // if the user used the search box on the home page
  else {
    search = document.getElementById("home-page-search-box").value;
  }

  if (search != "") {
    // console.log("searching for: " + search);

    // removing focus from the search input
    event.target.blur();

    // displaying search section on nav bar in desktop/tablet landscape mode
    showSearchSection();

    //  open nav search bar without focus
    document.querySelector(".nav-search-bar").classList.add("open");

    // putting the search string in nav bar search box
    // if the user used the search box of home screen then we need to fill
    // the search box of nav bar too
    document.querySelector("#nav-search-box").value = search;
    document.querySelector("#nav-search-box-desktop").value = search;

    //hiding home page modal
    hideHomePageModal();

    // if home page modal is not open then show search icon
    if (!isHomePageModalOpen()) {
      showSearchIconOnNavBar();
    } else {
      hideSearchIconOnNavBar();
    }

    //showing cards container
    showCardsContainer();

    hideMessage();

    //  hiding page loading animation.
    // if the user searches when the page loading animation was displaying
    // this will hide it
    hidePageLoadingAnimation();
    // showing loading animation
    showLoadingAnimation();

    disableBtns();
    pauseVideo();
    hideVideo();
    hideDescription();
    hideImage();

    // showLoadingAnimation();
    // showMessage(loading, 0);

    mediaUrls = [];
    queryResponse = [];
    visitedImages = [];

    //get selected media type
    getSelectedMediaType(event);

    pageReset();
    hitNum = 0;
    thumbNum = 0;

    search = search.trim();
    // hide total hits and delete cards
    removeResults();

    recordState("startSearch()", "resultsPage");

    //getting url and fetching query results (initial data)
    getIvl(1);

    // start listening to scroll
    document.addEventListener("scroll", handleScroll);
  }
}
function handleRadioButtonChange() {
  hideMessage();
  removeResults();
  disableBtns();
  showLoadingAnimation();

  if (event.target.classList.contains("image-radio-button")) {
    selectedMediaType = "image";
  } else {
    selectedMediaType = "video";
  }
  // selectRadioButtons();
  mediaUrls = [];
  queryResponse = [];
  pageReset();
  hitNum = 0;
  thumbNum = 0;

  recordState("handleRadioButtonChange()", "resultsPage");

  getIvl(1);
}

//gets Ivl initial data, sets total page and fetches media url
function getIvl(page) {
  hideMessage();
  //console.log(search);
  var searchUrl = calSearchUrl(page);

  // console.log(searchUrl);
  sendHttpRequest(method, searchUrl, mode)
    .then((response) => {
      // hiding page loading error
      if (page != 1) {
        hidePageLoadingError();
      }

      hideLoadingAnimation();
      hidePageLoadingAnimation();
      hideMessage();
      enableBtns();
      totalHits = response.collection.metadata.total_hits;

      console.log("Total hits:" + totalHits);
      console.log(response);
      queryResponse[page - 1] = response;

      //if there are hits then we are ready to fetch media
      if (totalHits != 0) {
        //calculating total page number
        calTotalPage();

        if (totalHits < 4) {
          const cardsContainerGrid = document.querySelector(".cards-container");
          cardsContainerGrid.classList.add("limit-cards-max-width");
        } else {
          const cardsContainerGrid = document.querySelector(".cards-container");
          cardsContainerGrid.classList.remove("limit-cards-max-width");
        }
        showMediaTypeRadioButtonsContainer();

        // console.log(!isBodyOverflowing());
        // while (!isBodyOverflowing()) {
        showResultCards();
        // }

        var runloop = setInterval(() => {
          // console.log(!isBodyOverflowing());

          const totalCardsShown = (currentThumbPage - 1) * 100 + thumbNum;

          if (
            !isBodyOverflowing() &&
            totalCardsShown < totalHits &&
            !isContentModalOpen()
          ) {
            // console.log("calling show result cards");
            // if (!isContentModalOpen()) {
            // console.log("iscontentModalopen ");
            showResultCards();
            // }
          } else {
            clearInterval(runloop);
            // console.log("clearing");
          }
        }, 200);
        // while (!isBodyOverflowing()) {
        //   console.log(!isBodyOverflowing());
        //   showResultCards();

        // }
      }
      //if there are no hits
      else {
        hideLoadingAnimation();
        hideImage();
        pauseVideo();
        hideVideo();

        showMessage(nothingFound, 1);

        // enableBtns();
      }
    })
    .catch((errCode) => {
      if (page != 1) {
        hidePageLoadingAnimation();
        showPageLoadingError();
        // console.log("error code: " + errCode);
      } else {
        // console.log("error code: " + errCode);

        enableBtns();
        if (errCode == 404) {
          hideLoadingAnimation();
          pauseVideo();
          hideVideo();
          hideImage();

          showMessage(notFound404, 1);
        } else if (errCode > 499 && errCode < 600) {
          hideLoadingAnimation();
          pauseVideo();
          hideVideo();
          hideImage();

          showMessage(problemWithNasaServer, 1);
        } else if (errCode == 400) {
          hideLoadingAnimation();
          pauseVideo();
          hideVideo();
          hideImage();

          showMessage(badResquest400, 1);
        }

        //for no internet connection
        else {
          hideLoadingAnimation();
          pauseVideo();
          hideVideo();
          hideImage();

          showMessage(onErrorMessage, 1);
        }
      }
    });
}

function showResultCards() {
  // console.log("showResultCards()");

  var cardsContainer = document.getElementById("cards-container");
  // var column = document.getElementsByClassName("column");

  //if we have shown all the thumbs from current page and there is a next page
  if (thumbNum == 100 && currentThumbPage < totalPage) {
    currentThumbPage++;
    // console.log("we are here");
    thumbNum = 0;

    //if the page doesn't exist in queryResponse array then download another page using getIvl
    // which will call showResultCards again when the page is downloaded
    if (queryResponse[currentThumbPage - 1] == undefined) {
      showPageLoadingAnimation();
      getIvl(currentThumbPage);
    }
  }
  //if there are thumbs available to load from current page
  else {
    //extra if check. if we are at the end of the page
    // and the user scrolls while the next page is still
    // downloading (getIvl is still working) then what happens is that
    // showResultCards is fired. and this else block executes. we have to prevent
    //  that from happening till the next page is downloaded.
    if (queryResponse[currentThumbPage - 1] != undefined) {
      var nextLimit = thumbNum + 20;

      while (
        thumbNum <
          queryResponse[currentThumbPage - 1].collection.items.length &&
        thumbNum < nextLimit
      ) {
        // console.log("creating card");
        // creating card
        const card = document.createElement("div");
        card.classList.add("card");

        // inserting video icon
        if (selectedMediaType == "video") {
          const videoIcon = document.createElement("span");
          videoIcon.classList.add("material-icons");
          videoIcon.classList.add("md-36");

          videoIcon.classList.add("videoIcon");
          videoIcon.innerText = "play_arrow";
          card.appendChild(videoIcon);
        }

        // putting image inside it
        const image = document.createElement("img");
        image.onerror = () => {
          // image.src = "./assets/nothumbnail.png";
          // image.alt = "Thumbnail not available";
          image.style.display = "none";
          card.classList.add("no-thumbnail");
        };
        var thumbURL = encodeURI(
          queryResponse[currentThumbPage - 1].collection.items[thumbNum]
            .links[0].href
        );
        image.src = thumbURL;
        image.alt = " ";

        card.appendChild(image);

        // stores resultNum Range:[0-totalHits]
        const resultNum = `result-num:${
          (currentThumbPage - 1) * 100 + thumbNum
        }`;
        // adding resultNum as a class to identify each card
        card.classList.add(resultNum);

        // storing information item num and page num in each card
        const page_num = document.createAttribute("data-page-num");
        page_num.value = currentThumbPage;
        const item_num = document.createAttribute("data-item-num");
        item_num.value = thumbNum;
        const result_num = document.createAttribute("data-result-num");
        result_num.value = (currentThumbPage - 1) * 100 + thumbNum;

        card.setAttributeNode(page_num);
        card.setAttributeNode(item_num);
        card.setAttributeNode(result_num);
        // card on click handler
        card.onclick = () => {
          // const id = card.id;
          // const commaPosition = id.lastIndexOf(",");
          // const itemNum = id.slice(0, commaPosition);
          // const pageNum = id.slice(commaPosition + 1);

          // displaying media controls bar on nav bar
          // document
          //   .querySelector(".nav-media-control-bar")
          //   .classList.add("open");
          // revealing nav bar if its hidden
          // document.querySelector(".nav-bar").classList.remove("hidden");

          disableBtns();

          const itemNum = card.getAttribute("data-item-num");
          const pageNum = card.getAttribute("data-page-num");

          hitNum = itemNum;
          currentPage = pageNum;
          // console.log("hitnum:" + hitNum + " currentPage:" + currentPage);
          // showDescription(itemNum, pageNum);
          hideImage();
          hideVideo();
          hideMessage();
          showContentModal();
          showLoadingAnimation();
          // showMessage(loading, 0);
          recordState("card.onclick()", "contentModal");
          fetchMediaUrl(itemNum, pageNum);

          // showNextPrevCards(itemNum, pageNum);
        };

        // title overlay information
        const titleOverlay = document.createElement("div");
        titleOverlay.className = "overlay";

        const title = document.createElement("p");
        title.classList.add("overlay-title");

        // title.innerText =
        //   thumbNum +
        //   ": " +
        //   currentThumbPage +
        //   ": " +
        //   queryResponse[currentThumbPage - 1].collection.items[thumbNum].data[0]
        //     .title;
        title.innerText =
          queryResponse[currentThumbPage - 1].collection.items[
            thumbNum
          ].data[0].title;
        titleOverlay.appendChild(title);
        card.appendChild(titleOverlay);

        // appending card
        cardsContainer.appendChild(card);
        thumbNum++;
      }
    }
  }
  // while(queryResponse[currentThumbPage]==undefined);
}

function removeResults() {
  // hiding change media type radio buttons
  hideMediaTypeRadioButtonsContainer();

  var cardsContainer = document.getElementById("cards-container");
  // deleting cards
  while (cardsContainer.hasChildNodes()) {
    cardsContainer.removeChild(cardsContainer.firstChild);
  }
}

function handleBackButtonClick() {
  // hiding blurred background image of content modal
  // hideBlurredBackground();
  // hideImage();
  // if (mediaType == "video") {
  //   pauseVideo();
  //   hideVideo();
  // }
  // // hiding nav bar of content modal
  // // document.querySelector(".nav-media-control-bar").classList.remove("open");
  // // hiding modal
  // hideContentModalScreen();
  // hideDescription();

  window.history.back();
}

function showContentModal() {
  // const contentModal = document.getElementById("contentModal");
  const contentModal = document.querySelector(".content-modal-container");
  //displaying modal screen
  contentModal.classList.add("open");
  // preventing background scroll
  preventBodyScroll();
  // Get the modal

  //starting key press listeners
  document.addEventListener("keyup", handleArrowKeyPress);
}
function hideContentModalScreen() {
  // allowing body scroll again
  allowBodyScroll();
  // get the modal
  // const contentModal = document.getElementById("contentModal");
  const contentModal = document.querySelector(".content-modal-container");

  //removing event listener of arrow key press
  document.removeEventListener("keyup", handleArrowKeyPress);
  //hiding modal screen
  hideLoadingAnimation();
  hideMediaLoadingAnimation();
  contentModal.classList.remove("open");

  // hiding arrow button container
  hideArrowButtonContainer();
}

function isContentModalOpen() {
  // var modal = document.getElementById("contentModal");
  var modal = document.querySelector(".content-modal-container");
  const opacity = window.getComputedStyle(modal).opacity;
  // console.log(opacity);
  if (opacity != 0) {
    return true;
  } else {
    return false;
  }
}

function showPageLoadingAnimation() {
  document
    .querySelector(".loading-animation-container.page-loading-animation")
    .classList.add("show");
}
function hidePageLoadingAnimation() {
  document
    .querySelector(".loading-animation-container.page-loading-animation")
    .classList.remove("show");
}
function isMediaLoadingAnimationShowing() {
  if (
    document
      .querySelector(".loading-animation-container.media-loading-animation")
      .classList.contains("hide")
  ) {
    return false;
  } else {
    return true;
  }
}
function showMediaLoadingAnimation() {
  document
    .querySelector(".loading-animation-container.media-loading-animation")
    .classList.remove("hide");
}
function hideMediaLoadingAnimation() {
  document
    .querySelector(".loading-animation-container.media-loading-animation")
    .classList.add("hide");
}
function showLoadingAnimation() {
  if (isContentModalOpen()) {
    document
      .querySelector(".loading-animation-container.card-click")
      .classList.remove("hide");
  } else {
    document
      .querySelector(".loading-animation-container")
      .classList.remove("hide");
  }
}

function hideLoadingAnimation() {
  if (isContentModalOpen()) {
    document
      .querySelector(".loading-animation-container.card-click")
      .classList.add("hide");
  } else {
    document
      .querySelector(".loading-animation-container")
      .classList.add("hide");
  }
}

function openNavSearchBar() {
  var navSearchBar = document.querySelector(".nav-search-bar");
  var navSearchBox = document.querySelector("#nav-search-box");
  navSearchBar.classList.add("open");
  navSearchBox.focus();
}
function closeNavSearchBar() {
  var navSearchBar = document.querySelector(".nav-search-bar");
  navSearchBar.classList.remove("open");
}
function preventBodyScroll() {
  // getting current scroll position
  bodyScrollPos = window.scrollY;
  // console.log("bodyScrollPos:" + bodyScrollPos);
  // fixing body position
  document.body.classList.add("modal-open");
  // briging back the body to the bodyScrollPos because when
  // the body position is fixed then we come back to the top of the page
  //  as the top of the body element tries to start from the top of the
  // window

  document.body.style.top = -bodyScrollPos + "px";
}
function allowBodyScroll() {
  // console.log("bodyScrollPos:" + bodyScrollPos);
  // to prevent the hiding of the nav bar due to scrollTo
  document.removeEventListener("scroll", handleScroll);

  document.body.classList.remove("modal-open");
  // window.scrollTo(0, bodyScrollPos);

  // the next setTimeout is to get around with the scrollTop bug. a mysterious bug.so dont touch it.
  // bug: when the user is on the contentModal and refreshes the page.
  //  and then goes back, then we dont end up at the top of the page, instead
  // we end up at the bottom. which is a mystery. why. the next piece of
  // code is to getaround with that bug.
  setTimeout(() => {
    // brings user back to the original position
    document.documentElement.scrollTop = bodyScrollPos;
  }, 100);

  document.body.scrollTop = bodyScrollPos;

  setTimeout(() => {
    document.addEventListener("scroll", handleScroll);
  }, 100);
}
function revealSideBar() {
  var sideBarModal = document.querySelector(".sidebar-menu-modal");

  sideBarModal.classList.add("open");
  preventBodyScroll();
  // document.body.style.top = `-${window.scrollY}px`;
}

function hideSideBar(event) {
  var sideBarModal = document.querySelector(".sidebar-menu-modal");
  if (event.target.classList.contains("sidebar-menu-modal")) {
    sideBarModal.classList.remove("open");
    allowBodyScroll();
  }
}

function blurContentSection() {
  document.querySelector(".media-container").classList.add("blur");
}

function removeBlurFromContentSection() {
  document.querySelector(".media-container").classList.remove("blur");
}

function openFullScreen() {
  const pic = document.querySelector("#pic");
  const vid = document.querySelector("#vid");
  if (vid != undefined) {
    elem = vid;
  } else {
    elem = pic;
  }
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function showMediaTypeRadioButtonsContainer() {
  const elem = document.querySelector(
    ".results-container .media-type-radio-buttons-container"
  );
  elem.classList.add("show");
}
function hideMediaTypeRadioButtonsContainer() {
  const elem = document.querySelector(
    ".results-container .media-type-radio-buttons-container"
  );
  elem.classList.remove("show");
}

// -------------------------------------------------------

function updateStateOfContentModal() {
  const nasa_id = encodeURIComponent(
    queryResponse[currentPage - 1].collection.items[hitNum].data[0].nasa_id
  );
  const state = {
    screen: "contentModal",
    hitNum: hitNum,
    pageNum: currentPage,
    nasa_id: nasa_id,
  };
  const url =
    "index.html?q=" +
    search +
    "&media_type=" +
    selectedMediaType +
    "&hitNum=" +
    hitNum +
    "&pageNum=" +
    currentPage +
    "&show=" +
    nasa_id;
  history.replaceState(state, null, url);
}

// ------------------------------------------------------------------

function updateStateOfResultsScreen() {
  const state = {
    screen: "resultsPage",
    searchString: search,
    media_type: selectedMediaType,
  };
  const url = "index.html?q=" + search + "&media_type=" + selectedMediaType;
  history.replaceState(state, null, url);
}

// ---------------------------------------------------------------------
// document.onload=()=>{
//   recordState("document.onload","homePage");
// };

// ------------------------------------------------------------------------

function recordState(whoCalledMe, screen) {
  // record state of results page
  if (
    (whoCalledMe == "handleRadioButtonChange()" ||
      whoCalledMe == "startSearch()") &&
    screen == "resultsPage"
  ) {
    // checking for inactive media type
    var inactiveMediaType = document.querySelector(".inactive-media-type").id;
    if (inactiveMediaType.includes("video")) {
      inactiveMediaType = "video";
    } else {
      inactiveMediaType = "image";
    }

    const state = {
      screen: "resultsPage",
      searchString: search,
      media_type: selectedMediaType,
      inactiveMediaType: inactiveMediaType,
    };
    const url = "index.html?q=" + search + "&media_type=" + selectedMediaType;
    history.pushState(state, null, url);
  }
  // records state of content modal
  else if (whoCalledMe == "card.onclick()" && screen == "contentModal") {
    const nasa_id = encodeURIComponent(
      queryResponse[currentPage - 1].collection.items[hitNum].data[0].nasa_id
    );

    const state = {
      screen: "contentModal",
      hitNum: hitNum,
      pageNum: currentPage,
      nasa_id: nasa_id,
    };
    const url =
      "index.html?q=" +
      search +
      "&media_type=" +
      selectedMediaType +
      "&hitNum=" +
      hitNum +
      "&pageNum=" +
      currentPage +
      "&show=" +
      nasa_id;
    history.pushState(state, null, url);
  } else if (whoCalledMe == "document.onload" && screen == "homePage") {
  }
  // // records state of results page when media type is changed
  // else if (
  //   whoCalledMe == "handleRadioButtonChange()" &&
  //   screen == "resultsPage"
  // ) {
  //   // alert("i was called");
  //   const state = {
  //     screen: "resultsPage",
  //     searchString: search,
  //     media_type: selectedMediaType,
  //   };
  //   const url =
  //     "index.html?q=" +
  //     search +
  //     "&media_type=" +
  //     selectedMediaType +
  //     "&show=" +
  //     false;
  //   history.pushState(state, null, url);
  // }
  else {
  }
}

// ---------------------------------------------------------------
// when the user pressed reload button

window.onload = () => {
  // check if this was a reload
  var urlParams = new URLSearchParams(window.location.search);

  // checking if the user was on the content modal screen
  if (urlParams.has("show")) {
    disableBtns();

    showContentModal();

    showLoadingAnimation();
    hideHomePageModal();
    showSearchIconOnNavBar();
    showSearchSection();
    showCardsContainer();
    hideMessage();

    const encodedNasa_id = urlParams.get("show");
    hitNum = urlParams.get("hitNum");
    currentPage = urlParams.get("pageNum");

    search = urlParams.get("q");
    // console.log("SEARCH STRING:" + search);
    selectedMediaType = urlParams.get("media_type");
    mediaType = selectedMediaType;

    // showLoadingAnimation();
    // disableBtns();

    downloadPageAndShowMedia(currentPage);
    getIvl(1);

    // some cleanup work
    selectRadioButtons();
    document.querySelector("#nav-search-box").value = search;
    document.querySelector("#nav-search-box-desktop").value = search;

    // disableBtns();
    // showContentModal();
    // showLoadingAnimation();
    // console.log(document.documentElement.scrollTop);
    // document.body.classList.add("modal-open");

    // document.body.scrollTop = 0; // For Safari
    // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    // hitNum = event.state.hitNum;
    // currentPage = event.state.pageNum;
    // fetchMediaUrl(event.state.hitNum, event.state.pageNum);
  } else if (urlParams.has("q") && !urlParams.has("show")) {
    search = urlParams.get("q");

    hideHomePageModal();
    // if home page modal is not open then show search icon
    if (!isHomePageModalOpen()) {
      showSearchIconOnNavBar();
    } else {
      hideSearchIconOnNavBar();
    }

    hideMessage();
    // show search section on nav bar on desktop/ tablet landscape
    showSearchSection();

    showCardsContainer();
    showLoadingAnimation();
    document.addEventListener("scroll", handleScroll);
    disableBtns();

    document.querySelector("#nav-search-box").value = search;
    document.querySelector("#nav-search-box-desktop").value = search;

    selectedMediaType = urlParams.get("media_type");
    if (selectedMediaType == "image") {
      document.querySelector("#image-radio-button-2").checked = true;
    } else {
      document.querySelector("#video-radio-button-2").checked = true;
    }

    getIvl(1);
  } else {
  }
};

// ----------------------------------------------------------------

// when the user clicks on back or next button of the browser, this function  is called

window.onpopstate = (event) => {
  // console.log("i was called");
  if (event.state != null) {
    // for going back from contentModal

    // clicking on next button to go to contentmodal
    if (event.state.screen == "contentModal") {
      // console.log("contentmodal()");
      disableBtns();
      hideImage();
      hideVideo();
      hideMessage();
      showContentModal();
      showLoadingAnimation();
      hitNum = event.state.hitNum;
      currentPage = event.state.pageNum;
      // console.log("hitNum: " + hitNum + " currentPage: " + currentPage);
      downloadPageAndShowMedia(currentPage);
      // fetchMediaUrl(event.state.hitNum, event.state.pageNum);
    }
    // else (event.state.screen == "resultsPage")
    // for resultsPage
    else {
      // if we try to go back from content modal
      if (isContentModalOpen()) {
        // console.log("iscontentmodalopen()");
        hideBlurredBackground();
        hideImage();
        if (mediaType == "video") {
          pauseVideo();
          hideVideo();
        }

        hideContentModalScreen();
        hideDescription();

        // showing cards if the body is not overflowing
        var runloop2 = setInterval(() => {
          // console.log(!isBodyOverflowing() + ":2");

          const totalCardsShown = (currentThumbPage - 1) * 100 + thumbNum;

          if (
            !isBodyOverflowing() &&
            totalCardsShown < totalHits &&
            !isContentModalOpen()
          ) {
            // console.log("calling show result cards");
            // if (!isContentModalOpen()) {
            // console.log("iscontentModalopen ");
            showResultCards();
            // }
          } else {
            // console.log("clearing");
            clearInterval(runloop2);
          }
        }, 200);
      }

      //if we try to go to a results page
      else {
        // console.log("resultspage()");
        // start listening to scroll
        document.addEventListener("scroll", handleScroll);
        hideHomePageModal();
        openNavSearchBar();
        // if home page modal is not open then show search icon
        if (!isHomePageModalOpen()) {
          showSearchIconOnNavBar();
        } else {
          hideSearchIconOnNavBar();
        }

        showSearchSection();
        // revealing nav bar if its hidden
        document.querySelector(".nav-bar").classList.remove("hidden");

        showCardsContainer();
        showLoadingAnimation();

        // putting the search string in nav bar search box
        // if the user used the search box of home screen then we need to fill
        // the search box of nav bar too
        document.querySelector("#nav-search-box").value =
          event.state.searchString;
        document.querySelector("#nav-search-box-desktop").value =
          event.state.searchString;

        hideMessage();
        disableBtns();
        mediaUrls = [];
        queryResponse = [];
        selectedMediaType = event.state.media_type;
        // var changeMediaRadioButtonsOnResultsPage=document.getElementsByName("media-type-2");
        if (selectedMediaType == "image") {
          document.querySelector("#image-radio-button-2").checked = true;
        } else {
          document.querySelector("#video-radio-button-2").checked = true;
        }

        // activating image or video search type
        const inactiveMediaType = event.state.inactiveMediaType;
        if (inactiveMediaType == "image") {
          toggleNavBarMediaTypeToVideo();
        } else {
          toggleNavBarMediaTypeToImage();
        }

        pageReset();
        hitNum = 0;
        thumbNum = 0;
        search = event.state.searchString;
        removeResults();
        getIvl(1);
      }
    }
  }
  // for returning back to home page
  else {
    // console.log("home page()");
    hideCardsContainer();
    // document.removeEventListener("scroll", handleScroll);

    removeResults();

    document.querySelector(".nav-bar").classList.remove("hidden");

    // resetting search box values to empty
    document.getElementById("nav-search-box").value = "";
    document.getElementById("nav-search-box-desktop").value = "";
    document.getElementById("home-page-search-box").value = "";
    // resetting select
    selectedMediaType = "image";
    selectRadioButtons();
    toggleNavBarMediaTypeToImage();

    hideSearchSection();

    // if home page modal is not open then show search icon
    closeNavSearchBar();
    hideSearchIconOnNavBar();

    showHomePageModal();
  }
};

// --------------------------------------------------------------------

function hideHomePageModal() {
  document.querySelector(".home-page-modal").classList.add("hide");
}
function showHomePageModal() {
  document.querySelector(".home-page-modal").classList.remove("hide");
}
function isHomePageModalOpen() {
  if (document.querySelector(".home-page-modal").classList.contains("hide")) {
    return false;
  } else {
    return true;
  }
}

function showCardsContainer() {
  document.querySelector(".cards-container").classList.remove("hide");
}
function hideCardsContainer() {
  document.querySelector(".cards-container").classList.add("hide");
}

function isBodyOverflowing() {
  // console.log(document.documentElement.scrollHeight);
  // console.log(document.documentElement.clientHeight);
  return (
    document.documentElement.scrollHeight >
    document.documentElement.clientHeight
  );
}

function showArrowButtonContainer() {
  document.querySelector(".arrow-button-container").classList.remove("hide");
}
function hideArrowButtonContainer() {
  document.querySelector(".arrow-button-container").classList.add("hide");
}

// page loading error section
function showPageLoadingError() {
  document
    .querySelector(".page-loading-error-message-section")
    .classList.add("show");
}
function hidePageLoadingError() {
  document
    .querySelector(".page-loading-error-message-section")
    .classList.remove("show");
}
function retryLoadingPage() {
  hidePageLoadingError();
  showPageLoadingAnimation();
  getIvl(currentThumbPage);
}

// show search icon on nav bar
function showSearchIconOnNavBar() {
  document.querySelector(".search-icon-container").classList.add("show");
}
// hide search icon on nav bar
function hideSearchIconOnNavBar() {
  document.querySelector(".search-icon-container").classList.remove("show");
}

// code for swipe left and right on touch devices
var initialPositionX;
var initialPositionY;
// var shouldWeLoad = false;
function setInitialPosition(event) {
  // console.log(event);
  initialPositionX = event.touches[0].clientX;
  initialPositionY = event.touches[0].clientY;
  //  document.getElementById("demo").innerHTML = initialPositionX + ", " + initialPositionY;
}
// function signalLoading() {}

function handleSwipe(event) {
  var x = event.touches[0].clientX;
  var y = event.touches[0].clientY;
  // console.log(
  //   "initialPositionX: " +
  //     initialPositionX +
  //     " intialPositionY: " +
  //     initialPositionY +
  //     " x: " +
  //     x +
  //     " y: " +
  //     y
  // );
  if (initialPositionX - x > 40 && Math.abs(initialPositionY - y) < 16) {
    initialPositionX = 0;
    initialPositionY = 0;

    if (!isMediaLoadingAnimationShowing()) {
      nextData();
    }
  } else if (x - initialPositionX > 40 && Math.abs(y - initialPositionY) < 16) {
    initialPositionX = window.innerWidth;
    initialPositionY = window.innerHeight;

    if (!isMediaLoadingAnimationShowing()) {
      prevData();
    }
  } else {
    // do nothing
  }
}
