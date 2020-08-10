var method = "GET";
const key = "U0PqJ5UprbVQExkXc7ZgsGVfIM7Z1O8Uiv7g2hOO";

var mode = true;

var hitNum = 0;
var totalHits = 0;
//contains initial search response
var queryResponse = [];
//mediaUrls is an array of urls of a specific hit media
var mediaUrls;

// contains an object with key as quality and value as the index number of the url in mediaUrls
// eg. qualityIndices={"orig":0,"large":1}
var qualityIndices = {};

var currentPage = 1;

var totalPage = 0;
//the selected media type from radio button
var selectedMediaType;
//media type of the current hit num
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

var notFound404 =
  "404. The cosmic object you are looking for has disappeared beyond the event horizon.";

var badResquest400 =
  "400. Bad Request. The server could not understand the request due to invalid syntax.";

var problemWithNasaServer =
  "There is some problem with NASA servers.\nPlease try again later.";

var nothingFound =
  "Sorry, we could not find anything,\nperhaps check what you have typed.";

var onErrorMessage =
  "Error. Check your internet connection\n or change media quality.";

var lastPage = "This is the last item!";
var firstPage = "This is the first item!";

window.addEventListener("scroll", handleScroll);
window.onresize = handleWindowResize;
window.onload = () => {
  //listening to enter key press
  startListeningToEnterKeyPress();

  //starting button splash effect listeners
  listenToButtonClickForSplashEffect();
};
function startListeningToEnterKeyPress() {
  var searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("keyup", (event) => {
    var char = event.keyCode;
    // console.log("char code:" + char);
    if (char == 13) {
      startSearch();
    }
  });
}

function listenToButtonClickForSplashEffect() {
  const buttons = document.querySelectorAll(".splash-effect");

  buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      // console.log("i was executed");
      var elem = btn.getBoundingClientRect();
      var x = e.clientX - elem.left;
      var y = e.clientY - elem.top;

      let ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 1000);
    });
  });
}
function handleArrowKeyPress(event) {
  var char = event.keyCode;
  console.log("key pressed: " + char);
  if (char == 37) {
    if (document.getElementById("prevBtn").disabled == false) {
      prevData();
    }
  }
  if (char == 39) {
    if (document.getElementById("nextBtn").disabled == false) {
      nextData();
    }
  }
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
        } else reject(this.status);
      }
    };
    req.open(method, url, mode);
    req.send();
  });
}

function enableBtns() {
  document.getElementById("nextBtn").disabled = false;

  // document.getElementById("nextPageBtn").disabled = false;
  document.getElementById("prevBtn").disabled = false;

  // document.getElementById("prevPageBtn").disabled = false;
  // document.getElementById("changeMediaQualityBtn").disabled = false;
  document.getElementById("searchBtn").disabled = false;
  document.getElementsByName("media-type")[0].disabled = false;
  document.getElementsByName("media-type")[1].disabled = false;
  document.getElementById("quality-selector").disabled = false;
}

function disableBtns() {
  document.getElementById("nextBtn").disabled = true;

  // document.getElementById("nextPageBtn").disabled = true;
  document.getElementById("prevBtn").disabled = true;

  // document.getElementById("prevPageBtn").disabled = true;
  // document.getElementById("changeMediaQualityBtn").disabled = true;
  document.getElementById("searchBtn").disabled = true;
  document.getElementsByName("media-type")[0].disabled = true;
  document.getElementsByName("media-type")[1].disabled = true;
  document.getElementById("quality-selector").disabled = true;
}
function showControls() {
  document.getElementById("nextBtn").style.display = "inline-block";
  document.getElementById("prevBtn").style.display = "inline-block";
  // disableBtns();
  // document.getElementById("nextPageBtn").style.display = "inline-block";
  // document.getElementById("prevPageBtn").style.display = "inline-block";

  // document.getElementById("changeMediaQualityBtn").style.display = "inline";
}

function displayVideo() {
  var vid = document.getElementById("vid");
  if (vid != undefined) vid.style.display = "inline-block";
}

function createVideoElement(url) {
  var contentSectionWidth = window.innerWidth;
  var contentSectionHeight = window.innerHeight * 0.9;

  // console.log("screen height: " + imageHeight + " scren width: " + imageWidth);
  // console.log(
  //   "window height: " +
  //     contentSectionHeight +
  //     " window width: " +
  //     contentSectionWidth
  // );

  var videoContainer = document.getElementById("videoContainer");
  var vid = document.createElement("video");
  // var source = document.createElement("source");

  vid.id = "vid";
  vid.className = "modal-content";
  vid.autoplay = true;
  vid.controls = true;
  vid.style.display = "none";
  // vid.style.width = "100%";
  vid.style.maxHeight = contentSectionHeight * 0.95;
  vid.style.maxWidth = contentSectionWidth * 0.9;
  // source.type = "video/mp4";
  // source.src = "";

  videoContainer.appendChild(vid);
  stopPreviousIvlVideoListeners();
  startIvlVideoListeners();
  vid.src = url;
}

function hideVideo() {
  var vid = document.getElementById("vid");

  // if there exists a video element with id="vid"
  if (vid != undefined) {
    var videoContainer = document.getElementById("videoContainer");
    vid.style.display = "none";
    stopPreviousIvlVideoListeners();
    videoContainer.removeChild(vid);
  }
}
function pauseVideo() {
  var vid = document.getElementById("vid");
  // if there exists a video element with id="vid".
  if (vid != undefined) {
    vid.pause();
    vid.currentTime = 0;
    vid.src = "";
    vid.load();
  }
}
function displayImage() {
  document.getElementById("pic").style.display = "inline-block";
}
function hideImage() {
  console.log("hiding image");
  document.getElementById("pic").style.display = "none";
}
function showMessage(messageString, messageBoxNum) {
  //boxNum=0 means the message box inside modal screen
  // boxNum=1 means the message box outside the modal screen

  var messageBoxInsideModal = document.getElementById("messageInsideModal");
  var messageBox = document.getElementById("message");
  console.log(messageString);
  // message inside modal box
  if (messageBoxNum == 0) {
    messageBoxInsideModal.innerHTML = messageString;
    // messageBox.style.display = "none";
    messageBoxInsideModal.style.display = "inline";
  }
  //message outside modal box
  if (messageBoxNum == 1) {
    messageBox.innerHTML = messageString;
    // messageBoxInsideModal.style.display = "none";
    messageBox.style.display = "inline";
  }
}
function hideMessage() {
  document.getElementById("messageInsideModal").style.display = "none";
  document.getElementById("message").style.display = "none";
}
function showQualitySelector() {
  document.getElementById("quality-selector").style.display = "inline-block";
}
function hideQualitySelector() {
  document.getElementById("quality-selector").style.display = "none";
}
// function listenToMediaChange() {
//   var buttons = document.getElementsByName("media-type");
//   for (var i = 0; i < buttons.length; i++) {
//     buttons[i].onchange = () => {

//       startSearch();
//     };
//   }
// }
function getSelectedMediaType() {
  var buttons = document.getElementsByName("media-type");
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].checked) {
      selectedMediaType = buttons[i].value;
      break;
    }
  }
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
      //alert(totalPage);
    }
    //if there are 100x total hits.eg: 500
    else {
      totalPage = quotient;
      // alert(totalPage);
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
function downloadNextPage(page) {
  var searchUrl = calSearchUrl(page);

  sendHttpRequest(method, searchUrl, mode)
    .then((response) => {
      console.log("new page downloaded");
      console.log(response);
      //storing new page in queryResponse
      queryResponse[page - 1] = response;
      hitNum = -1;
      nextData();
    })
    .catch((errCode) => {
      console.log("error code: " + errCode);
      enableBtns();
      if (errCode == 404) {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isModalScreenOpen()) {
          showMessage(notFound404, 0);
        } else {
          showMessage(notFound404, 1);
        }
      } else if (errCode > 499 && errCode < 600) {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isModalScreenOpen()) {
          showMessage(problemWithNasaServer, 0);
        } else {
          showMessage(problemWithNasaServer, 1);
        }
      } else if (errCode == 400) {
        pauseVideo();
        hideVideo();
        hideImage();
        if (isModalScreenOpen()) {
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
        if (isModalScreenOpen()) {
          showMessage(onErrorMessage, 0);
        } else {
          showMessage(onErrorMessage, 1);
        }
      }
    });
}
function nextData() {
  disableBtns();
  pauseVideo();
  hideVideo();
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
    }
  }
  //else show next data from the current page
  else {
    hideImage();
    pauseVideo();
    hideVideo();
    hideMessage();
    showLoadingAnimation();
    // showMessage(loading, 0);
    // document.getElementById("pic").src = "loading.gif";

    showModalScreen();
    fetchMediaUrl(hitNum, currentPage);
    showDescription(hitNum, currentPage);
  }
}

//tries going to next page. shows error if its already the last page
function nextPage() {
  //if next page exists
  if (isNextPageAvailable()) {
    hideImage();
    pauseVideo();
    hideVideo();
    showLoadingAnimation();
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
    //        hitNumReset();
    // document.getElementById("message").innerHTML = "Loading...";

    showMessage(lastPage, 0);

    enableBtns();
  }
}

function prevData() {
  disableBtns();
  pauseVideo();
  hideVideo();
  hitNum--;
  // document.getElementById("message").innerHTML = "";
  //if hit number becomes less than 0 then transition to prev page
  if (hitNum < 0) {
    //if previous page is available then go to previous page
    if (isPrevPageAvailable()) {
      prevPage();
    }
    //else show message and undo changes to hitNum
    else {
      hitNum++;
      showMessage(firstPage, 0);

      enableBtns();
    }
  }
  //else show previous data from the current page
  else {
    //document.getElementById("message").innerHTML = "Loading...";
    hideImage();
    pauseVideo();
    hideVideo();
    showLoadingAnimation();
    // showMessage(loading, 0);
    //document.getElementById("pic").src = "loading.gif";
    fetchMediaUrl(hitNum, currentPage);
    showDescription(hitNum, currentPage);
  }
}
//tries going to previous page. shows error if its  first page
function prevPage() {
  currentPage--;
  // document.getElementById("message").innerHTML = "";
  //if the page we are trying to access is less than 1 then throw error
  if (currentPage < 1) {
    showMessage(firstPage, 0);
    enableBtns();
    //hitNum = 0;
    currentPage++;
  }
  //else  fetch data
  else {
    //        hitNumReset();
    // document.getElementById("message").src = "Loading...";
    hideImage();
    pauseVideo();
    hideVideo();
    showLoadingAnimation();
    // showMessage(loading, 0);
    hitNum = 100;
    prevData();
  }
}

//returns the file extension of current urlNum (url index) of mediaUrls
function getFileExtension(urlNum) {
  var urlStr = mediaUrls[urlNum].href;
  var lastIndex = urlStr.lastIndexOf(".");
  var extension = urlStr.slice(lastIndex);
  return extension;
}

//CREATES QUALITY OPTIONS (SELECT)
function createMediaQualityOptions() {
  const select = document.getElementById("quality-selector");
  //contains all the keys inside qualityIndices
  const keys = Object.keys(qualityIndices);
  //console.log(keys);

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
  //console.log(select.value);
  // for (var i = 0; i < select.length; i++) {
  //   console.log(select[i]);
  // }
}

//FINDS ALL THE MEDIA QUALITIES AVAILABLE AND THEN STORES IT IN qualityIndices
// IN THE FORMAT qualityIndices={"quality_name":indexOfTheUrl}
function findMediaQualities() {
  var extension, urlStr, firstIndex, lastIndex, qualityName;

  qualityIndices = {};
  if (mediaType == "video") {
    for (var i = 0; i < mediaUrls.length; i++) {
      //stores the file extension of the current urlNum
      extension = getFileExtension(i);
      if (extension == ".mp4" || extension == ".ogg" || extension == "mpeg") {
        //extracting quality name. eg: orig
        urlStr = mediaUrls[i].href;
        firstIndex = urlStr.lastIndexOf("~");
        lastIndex = urlStr.lastIndexOf(".");
        qualityName = urlStr.slice(firstIndex + 1, lastIndex);
        qualityName =
          qualityName.charAt(0).toUpperCase() + qualityName.slice(1);
        if (qualityName == "Orig") qualityName = "Original";

        qualityIndices[qualityName] = i;
      }
    }
    console.log("qualityIndices:");
    console.log(qualityIndices);
  }
  //for image
  else {
    for (var i = 0; i < mediaUrls.length; i++) {
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
        urlStr = mediaUrls[i].href;
        firstIndex = urlStr.lastIndexOf("~");
        lastIndex = urlStr.lastIndexOf(".");
        qualityName = urlStr.slice(firstIndex + 1, lastIndex);
        qualityName =
          qualityName.charAt(0).toUpperCase() + qualityName.slice(1);
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

  hideLoadingAnimation();
  // console.log("i was fired");
  showMessage(onErrorMessage, 0);

  enableBtns();
}
function handleVideoLoadedMetaData() {
  document.getElementById("resolution").innerHTML =
    "Resolution: " + vid.videoWidth + " x " + vid.videoHeight;
  document.getElementById("message").innerHTML = "";
  hideLoadingAnimation();
  enableBtns();
}
function stopPreviousIvlVideoListeners() {
  var vid = document.getElementById("vid");
  vid.removeEventListener("error", handleVideoLoadingError);
  vid.removeEventListener("loadedmetadata", handleVideoLoadedMetaData);
}
function startIvlVideoListeners() {
  var vid = document.getElementById("vid");

  vid.addEventListener("error", handleVideoLoadingError);
  vid.addEventListener("loadedmetadata", handleVideoLoadedMetaData);
}
//SHOWS THE IVL VIDEO
function showIvlVideo() {
  //console.log(mediaUrls[0]);

  if (mediaUrls.length > 0) {
    if (qualityIndices.hasOwnProperty("Large")) {
      document.getElementById("Large").selected = "true";
      hideMessage();
      hideLoadingAnimation();
      // vid.src = mediaUrls[qualityIndices["Large"]].href;
      createVideoElement(mediaUrls[qualityIndices["Large"]].href);
      displayVideo();
      console.log("Quality: Large url num: " + qualityIndices["Large"]);
    } else if (qualityIndices.hasOwnProperty("Medium")) {
      document.getElementById("Medium").selected = true;
      hideMessage();
      hideLoadingAnimation();
      // vid.src = mediaUrls[qualityIndices["Medium"]].href;
      createVideoElement(mediaUrls[qualityIndices["Medium"]].href);
      displayVideo();

      console.log("Quality: Medium url num: " + qualityIndices["Medium"]);
    } else if (qualityIndices.hasOwnProperty("Original")) {
      document.getElementById("Original").selected = true;
      hideMessage();
      hideLoadingAnimation();
      // vid.src = mediaUrls[qualityIndices["Original"]].href;
      createVideoElement(mediaUrls[qualityIndices["Original"]].href);
      displayVideo();

      console.log("Quality: Original url num: " + qualityIndices["Original"]);
    } else if (qualityIndices.hasOwnProperty("Small")) {
      document.getElementById("Small").selected = true;
      hideMessage();
      hideLoadingAnimation();
      // vid.src = mediaUrls[qualityIndices["Small"]].href;
      createVideoElement(mediaUrls[qualityIndices["Small"]].href);
      displayVideo();

      console.log("Quality: Preview url num: " + qualityIndices["Small"]);
    } else if (qualityIndices.hasOwnProperty("Preview")) {
      document.getElementById("Preview").selected = true;
      hideMessage();
      hideLoadingAnimation();
      // vid.src = mediaUrls[qualityIndices["Preview"]].href;
      createVideoElement(mediaUrls[qualityIndices["Preview"]].href);
      displayVideo();

      console.log("Quality: Small url num: " + qualityIndices["Preview"]);
    } else if (qualityIndices.hasOwnProperty("Mobile")) {
      document.getElementById("Mobile").selected = true;
      hideMessage();
      hideLoadingAnimation();
      // vid.src = mediaUrls[qualityIndices["Mobile"]].href;
      createVideoElement(mediaUrls[qualityIndices["Mobile"]].href);
      displayVideo();

      console.log("Quality: Mobile url num: " + qualityIndices["Mobile"]);
    } else {
      showMessage(notFound404, 0);
    }
  } else {
    showMessage(notFound404, 0);
  }
}

// function listenToQualityChange() {
//   var quality = document.getElementById("quality-selector");
//   quality.onchange = () => {
//     //alert("we are in listentoqualitychange");
//     changeMediaQuality(document.getElementById("quality-selector").value);
//   };
// }
function changeMediaQuality(qualityKey) {
  disableBtns();
  hideMessage();

  // if (mediaType == "album") {
  // } else
  if (mediaType == "video") {
    pauseVideo();
    // hideVideo();
    // showLoadingAnimation();

    var vid = document.getElementById("vid");
    vid.src = mediaUrls[qualityIndices[qualityKey]].href;
    enableBtns();
    // console.log(
    //   "Quality: " + qualityKey + " url num: " + qualityIndices[qualityKey]
    // );
  }
  //for image
  else {
    hideImage();
    showLoadingAnimation();
    var image = document.getElementById("pic");
    image.src = mediaUrls[qualityIndices[qualityKey]].href;
    enableBtns();
    // console.log(
    //   "Quality: " + qualityKey + " url num: " + qualityIndices[qualityKey]
    // );
  }
}
function handleWindowResize() {
  //for video
  if (mediaType == "video") {
    var video = document.getElementById("vid");
    if (video != undefined) {
      var contentSectionWidth = window.innerWidth;
      var contentSectionHeight = window.innerHeight * 0.9;
      video.style.maxHeight = contentSectionHeight * 0.95;
      video.style.maxWidth = contentSectionWidth * 0.9;
    }
  }

  //for image
  if (mediaType == "image") {
    var image = document.getElementById("pic");
    var contentSectionWidth = window.innerWidth;
    var contentSectionHeight = window.innerHeight * 0.9;
    image.style.maxHeight = contentSectionHeight * 0.95;
    image.style.maxWidth = contentSectionWidth * 0.9;
  }
}
function showIvlImage() {
  //  showDescription();
  // var imageHeight = screen.height;
  // var imageWidth = screen.width;

  var contentSectionWidth = window.innerWidth;
  var contentSectionHeight = window.innerHeight * 0.9;

  // console.log("screen height: " + imageHeight + " scren width: " + imageWidth);
  // console.log(
  //   "window height: " +
  //     contentSectionHeight +
  //     " window width: " +
  //     contentSectionWidth
  // );

  var image = document.getElementById("pic");
  image.style.maxHeight = contentSectionHeight * 0.95;
  image.style.maxWidth = contentSectionWidth * 0.9;

  // var contentSection = document.getElementsByClassName("content-section");
  //  var contentSectionHeight = contentSection[0].style.height;
  // console.log(contentSection);
  // image.style.maxHeight = contentSectionHeight * 0.9;
  // image.style.maxHeight = imageHeight;
  // image.style.maxWidth = imageWidth;

  image.onerror = () => {
    pauseVideo();
    hideVideo();
    hideImage();
    hideLoadingAnimation();
    showMessage(onErrorMessage, 0);
    // enableBtns();
  };
  image.onload = () => {
    document.getElementById("resolution").innerHTML =
      "Resolution: " + image.naturalWidth + " x " + image.naturalHeight;
    document.getElementById("message").innerHTML = "";
    // rePositionImage();
    hideMessage();
    hideLoadingAnimation();

    displayImage();
    // enableBtns();
  };

  if (mediaUrls.length > 0) {
    if (qualityIndices.hasOwnProperty("Large")) {
      document.getElementById("Large").selected = "true";

      image.src = mediaUrls[qualityIndices["Large"]].href;

      // console.log("Quality: Large url num: " + qualityIndices["Large"]);
    } else if (qualityIndices.hasOwnProperty("Original")) {
      document.getElementById("Original").selected = true;

      image.src = mediaUrls[qualityIndices["Original"]].href;

      // console.log("Quality: Original url num: " + qualityIndices["Original"]);
    } else if (qualityIndices.hasOwnProperty("Medium")) {
      document.getElementById("Medium").selected = true;

      image.src = mediaUrls[qualityIndices["Medium"]].href;

      // console.log("Quality: Medium url num: " + qualityIndices["Medium"]);
    } else if (qualityIndices.hasOwnProperty("Small")) {
      document.getElementById("Small").selected = true;

      image.src = mediaUrls[qualityIndices["Small"]].href;

      // console.log("Quality: Preview url num: " + qualityIndices["Small"]);
    } else {
      showMessage(notFound404, 0);
    }
  } else {
    showMessage(notFound404, 0);
  }
}

function getCurrentCosmicObjectNum(itemNum, pageNum) {
  // console.log(
  //   "itemnum receievd: " + itemNum + " pageNum receieved: " + pageNum
  // );
  pageNum--;
  itemNum++;
  var cosmicObjectNum = itemNum + pageNum * 100;
  // console.log(cosmicObjectNum);
  return cosmicObjectNum;
}

function showMedia() {
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
function hideDescription() {
  document.getElementById("date").style.display = "none";
  document.getElementById("cosmic-object-num").style.display = "none";
  document.getElementById("title").style.display = "none";
  document.getElementById("description").style.display = "none";
  document.getElementById("resolution").style.display = "none";
}
function showDescription(itemNum, pageNum) {
  var descriptiveData =
    queryResponse[pageNum - 1].collection.items[itemNum].data[0];
  document.getElementById("cosmic-object-num").innerHTML =
    "Cosmic Object: " +
    getCurrentCosmicObjectNum(itemNum, pageNum) +
    " / " +
    totalHits;
  document.getElementById("date").innerHTML =
    "Date: " + descriptiveData.date_created;
  document.getElementById("title").innerHTML =
    "Title: " + descriptiveData.title;
  document.getElementById("description").innerHTML =
    "Description: " + descriptiveData.description;

  document.getElementById("date").style.display = "block";
  document.getElementById("cosmic-object-num").style.display = "block";
  document.getElementById("title").style.display = "block";
  document.getElementById("description").style.display = "block";
  document.getElementById("resolution").style.display = "block";
}

//fetches media urls of a specific hit and calls showIvl()
function fetchMediaUrl(itemNum, pageNum) {
  // console.log("itemNum: " + itemNum + " " + "pageNum: " + pageNum);

  var url;

  //checking if the current hit num contains an album then set media_type and prepare the required url
  // if (queryResponse.collection.items[hitNum].data[0].album) {
  //   var album_name = queryResponse.collection.items[hitNum].data[0].album;
  //   url = "https://images-api.nasa.gov/album/" + album_name + "?page=1";
  //   mediaType = "album";
  // }
  //contains a video or image
  // else {
  //getting nasa_id
  var nasa_id =
    queryResponse[pageNum - 1].collection.items[itemNum].data[0].nasa_id;
  //appending it to url
  url = "https://images-api.nasa.gov/asset/" + nasa_id;
  //getting media type
  mediaType =
    queryResponse[pageNum - 1].collection.items[itemNum].data[0].media_type;
  // }

  //sending http request for media links
  sendHttpRequest(method, url, mode)
    .then((fetchedMediaUrls) => {
      console.log(
        "Page:" +
          pageNum +
          " / " +
          totalPage +
          " HitNum: " +
          itemNum +
          " Media type:" +
          mediaType
      );

      mediaUrls = fetchedMediaUrls.collection.items;
      // console.log(mediaUrls);
      // showDescription(itemNum, pageNum);

      showMedia();
    })
    .catch((errCode) => {
      console.log("error code: " + errCode);

      enableBtns();
      if (errCode == 404) {
        pauseVideo();
        hideVideo();
        hideImage();

        hideLoadingAnimation();
        showMessage(notFound404, 0);
      } else if (errCode > 499 && errCode < 600) {
        pauseVideo();
        hideVideo();
        hideImage();

        hideLoadingAnimation();
        showMessage(problemWithNasaServer, 0);
      } else if (errCode == 400) {
        pauseVideo();
        hideVideo();
        hideImage();

        hideLoadingAnimation();
        showMessage(badResquest400, 0);
      }

      //for no internet connection
      else {
        pauseVideo();
        hideVideo();
        hideImage();

        hideLoadingAnimation();

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
function startSearch() {
  // document.getElementById("message").innerHTML = "Loading...";
  //get the searching string
  search = document.getElementById("searchBar").value;

  if (search != "") {
    // listenToMediaChange();
    disableBtns();
    pauseVideo();
    hideVideo();
    hideDescription();
    hideImage();

    // showLoadingAnimation();
    // showMessage(loading, 0);

    queryResponse = [];

    //get selected media type
    getSelectedMediaType();

    pageReset();
    hitNum = 0;
    thumbNum = 0;
    search = search.trim();
    removeCards();
    //getting url and fetching query results (initial data)
    getIvl(1);
  }
}

//gets Ivl initial data, sets total page and fetches media url
function getIvl(page) {
  //console.log(search);
  var searchUrl = calSearchUrl(page);
  // console.log(searchURL);
  sendHttpRequest(method, searchUrl, mode)
    .then((response) => {
      totalHits = response.collection.metadata.total_hits;
      console.log("Total hits:" + totalHits);
      console.log(response);
      queryResponse[page - 1] = response;

      //if there are hits then we are ready to fetch media
      if (totalHits != 0) {
        //calculating total page number
        calTotalPage();

        showResultCards();
      }
      //if there are no hits
      else {
        hideLoadingAnimation();
        hideImage();
        pauseVideo();
        hideVideo();

        showMessage(nothingFound, 1);
        enableBtns();
      }
    })
    .catch((errCode) => {
      console.log("error code: " + errCode);
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
    });
}

function showResultCards() {
  var flexContainer = document.getElementById("flex-container");
  // var column = document.getElementsByClassName("column");

  //if we have shown all the thumbs from current page and there is a next page
  if (thumbNum == 100 && currentThumbPage < totalPage) {
    currentThumbPage++;

    thumbNum = 0;

    //if the page doesn't exist in queryResponse array then download another page using getIvl
    // which will call showResultCards again when the page is downloaded
    if (queryResponse[currentThumbPage - 1] == undefined) {
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
        // console.log(thumbNum);
        const card = document.createElement("div");
        card.className = "card";
        card.id = thumbNum + "," + currentThumbPage;
        card.onclick = () => {
          const id = card.id;
          const commaPosition = id.lastIndexOf(",");
          const itemNum = id.slice(0, commaPosition);
          const pageNum = id.slice(commaPosition + 1);
          hitNum = itemNum;
          currentPage = pageNum;
          showDescription(itemNum, pageNum);
          hideImage();
          hideVideo();
          hideMessage();
          showModalScreen();
          showLoadingAnimation();
          // showMessage(loading, 0);
          fetchMediaUrl(itemNum, pageNum);
        };

        const titleOverlay = document.createElement("div");
        titleOverlay.className = "overlay";
        titleOverlay.innerHTML =
          thumbNum +
          ": " +
          currentThumbPage +
          ": " +
          queryResponse[currentThumbPage - 1].collection.items[thumbNum].data[0]
            .title;

        var thumbURL = encodeURI(
          queryResponse[currentThumbPage - 1].collection.items[thumbNum]
            .links[0].href
        );

        card.style.backgroundImage = `url(${thumbURL})`;

        card.style.backgroundSize = "cover";

        card.appendChild(titleOverlay);

        flexContainer.appendChild(card);
        thumbNum++;
      }
      enableBtns();
    }
  }
  // while(queryResponse[currentThumbPage]==undefined);
}

function removeCards() {
  var flexContainer = document.getElementById("flex-container");
  while (flexContainer.hasChildNodes()) {
    flexContainer.removeChild(flexContainer.firstChild);
  }
}
function handleScroll() {
  // console.log(window.scrollY+window.innerHeight);
  // console.log(document.documentElement.scrollHeight);
  if (
    window.scrollY + window.innerHeight + 75 >=
    document.documentElement.scrollHeight
  ) {
    showResultCards();
  }
}

function handleCloseButtonClick() {
  if (mediaType == "video") {
    pauseVideo();
    hideVideo();
  }

  hideModalSreen();
}

function showModalScreen() {
  // Get the modal
  var modal = document.getElementById("myModal");
  //displaying modal screen
  modal.style.display = "block";
  //starting key press listeners
  document.addEventListener("keyup", handleArrowKeyPress);
}
function hideModalSreen() {
  var modal = document.getElementById("myModal");
  //removing event listener of arrow key press
  document.removeEventListener("keyup", handleArrowKeyPress);
  //hiding modal screen
  modal.style.display = "none";
}
function isModalScreenOpen() {
  var modal = document.getElementById("myModal");
  if (modal.style.display == "block") {
    return true;
  } else return false;
}

function showLoadingAnimation() {
  var ripple = document.getElementById("loading-animation");

  loadingAnimationSetTimeOut = setTimeout(function () {
    ripple.style.display = "inline-block";
  }, 250);
}
function hideLoadingAnimation() {
  var ripple = document.getElementById("loading-animation");
  clearTimeout(loadingAnimationSetTimeOut);
  ripple.style.display = "none";
}
