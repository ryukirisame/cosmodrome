var method = "GET";
const key = "U0PqJ5UprbVQExkXc7ZgsGVfIM7Z1O8Uiv7g2hOO";
var apodUrl = "https://api.nasa.gov/planetary/apod?api_key=" + key + "&date=";
var mode = true;
var date;
var hitNum = 0;
var totalHits = 0;
var queryResponse;
//mediaUrls is an array of urls of a specific hit media
var mediaUrls;
//current url index
var urlNum;

// contains an object with key as quality and value as the index number of the url in mediaUrls
// eg. qualityIndices={"orig":0,"large":1}
var qualityIndices = {};

var currentPage = 1;
var totalPage = 0;
var selectedMediaType;
var mediaType;
//stores the searching string
var search = "";

var nextclicknum = 0;
var prevclicknum = 0;
var nextpageclicknum = 0;
var prevpageclicknum = 0;

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
        if (this.status == 404) {
          reject(this.status);
        }
      }
    };
    req.open(method, url, mode);
    req.send();
  });
}

function enableBtns() {
  document.getElementById("nextBtn").disabled = false;
  document.getElementById("nextPageBtn").disabled = false;
  document.getElementById("prevBtn").disabled = false;
  document.getElementById("prevPageBtn").disabled = false;
  document.getElementById("changeMediaQualityBtn").disabled = false;
  document.getElementById("searchBtn").disabled = false;
  document.getElementsByName("media-type")[0].disabled = false;
  document.getElementsByName("media-type")[1].disabled = false;
  document.getElementById("quality-selector").disabled = false;
}

function disableBtns() {
  document.getElementById("nextBtn").disabled = true;
  document.getElementById("nextPageBtn").disabled = true;
  document.getElementById("prevBtn").disabled = true;
  document.getElementById("prevPageBtn").disabled = true;
  document.getElementById("changeMediaQualityBtn").disabled = true;
  document.getElementById("searchBtn").disabled = true;
  document.getElementsByName("media-type")[0].disabled = true;
  document.getElementsByName("media-type")[1].disabled = true;
  document.getElementById("quality-selector").disabled = true;
}
function showControls() {
  document.getElementById("nextBtn").style.display = "inline";
  document.getElementById("prevBtn").style.display = "inline";
  disableBtns();
  document.getElementById("nextPageBtn").style.display = "inline";
  document.getElementById("prevPageBtn").style.display = "inline";

  document.getElementById("changeMediaQualityBtn").style.display = "inline";
}

function displayVideo() {
  document.getElementById("vid").style.display = "inline-block";
}
function hideVideo() {
  document.getElementById("vid").style.display = "none";
}
function displayImage() {
  document.getElementById("pic").style.display = "inline-block";
}
function hideImage() {
  document.getElementById("pic").style.display = "none";
}
function showPicMessage(picSrc) {
  document.getElementById("pic-message").src = picSrc;
  document.getElementById("pic-message").style.display = "inline-block";
}
function hidePicMessage() {
  //  document.getElementById("pic-message").src="";
  document.getElementById("pic-message").style.display = "none";
}
function listenToMediaChange() {
  var buttons = document.getElementsByName("media-type");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].onchange = () => {
      startSearch();
    };
  }
}
function getSelectedMediaType() {
  var buttons = document.getElementsByName("media-type");
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].checked) {
      selectedMediaType = buttons[i].value;
    }
  }
}
function hitNumReset() {
  hitNum = 0;
}

function pageReset() {
  currentPage = 1;
  totalPage = 0;
}

function calTotalPage() {
  //if there are more than 1 total page
  if (queryResponse.collection.metadata.total_hits > 100) {
    /*formula: first divide total hits by 100. and then multiply the quotient(result of the division) by 100. and then
        check if the total hits is greater than this number or not. if it is greater then add 1 to it.
        example: if there are 515 total hits. then dividing it by 100 we get 5(store this). and now multiplying 5 by 100 we get 500. now 515 
        is greater than 500 so there are 5+1=6 pages in total.*/

    var quotient = parseInt(queryResponse.collection.metadata.total_hits / 100);
    if (queryResponse.collection.metadata.total_hits > quotient * 100) {
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
  if (currentPage + 1 > totalPage) {
    return false;
  } else {
    return true;
  }
}

function isPrevPageAvailable() {
  if (currentPage - 1 < 1) {
    return false;
  } else {
    return true;
  }
}

function showApod(data) {
  //console.log(data);
  document.getElementById("date").innerHTML = data.date;
  document.getElementById("title").innerHTML = data.title;
  document.getElementById("pic").src = data.url;
  document.getElementById("description").innerHTML = data.explanation;
}
/*function getDate() {
    date = document.getElementById("dateText").value;
    sendHttpRequest(method, url + date, mode).then(data => {
        //console.log(data);
        showApod(data);
    });
}
*/

function nextData() {
  disableBtns();
  document.getElementById("vid").pause();
  hitNum++;

  //if hit number exceeds total number of hits in the current page and if there is a next page then transition to next page
  //    but if there is not a next page(eg: first page with less than 100 items, last page with less than 100 items)
  // then hitNum--;

  //if hit number exceeds total number of hits in the CURRENT page
  if (hitNum > queryResponse.collection.items.length - 1) {
    //if next page is available then go to next page
    if (isNextPageAvailable()) {
      hitNum = 0;
      nextPage();
    }
    //if next page is not available then display message
    else {
      hitNum--;
      document.getElementById("message").innerHTML = "This is the last page!";
      enableBtns();
    }
  }
  //else show next data from the current page
  else {
    //document.getElementById("message").innerHTML = "Loading...";
    hideImage();
    hideVideo();
    showPicMessage("loading.jpg");
    // document.getElementById("pic").src = "loading.gif";
    fetchMediaUrl();
  }
}

//tries going to next page. shows error if its already the last page
function nextPage() {
  currentPage++;

  //if the next page does not exist (exceeds total pages)
  if (currentPage > totalPage) {
    document.getElementById("message").innerHTML = "This is the last page!";
    enableBtns();
    currentPage--;
  }
  //if next page exists
  else {
    //        hitNumReset();
    // document.getElementById("message").innerHTML = "Loading...";
    hideImage();
    hideVideo();
    showPicMessage("loading.jpg");
    getIvl(getSearchUrl());
  }
}

function prevData() {
  disableBtns();
  document.getElementById("vid").pause();
  hitNum--;
  // document.getElementById("message").innerHTML = "";
  //if hit number becomes less than 0 then transition to prev page
  if (hitNum < 0) {
    //if previous page is available then go to previous page
    if (isPrevPageAvailable()) {
      hitNum = 99;
      prevPage();
    }
    //else show message and undo changes to hitNum
    else {
      hitNum++;
      document.getElementById("message").innerHTML = "This is the first page!";
      enableBtns();
    }
  }
  //else show previous data from the current page
  else {
    //document.getElementById("message").innerHTML = "Loading...";
    hideImage();
    hideVideo();
    showPicMessage("loading.jpg");
    //document.getElementById("pic").src = "loading.gif";
    fetchMediaUrl();
  }
}
//tries going to previous page. shows error if its the first page
function prevPage() {
  currentPage--;
  document.getElementById("message").innerHTML = "";
  //if the page we are trying to access is less than 1 then throw error
  if (currentPage < 1) {
    document.getElementById("message").innerHTML = "This is the first page!";
    enableBtns();
    //hitNum = 0;
    currentPage++;
  }
  //else reset hit number to 0 and fetch data
  else {
    //        hitNumReset();
    // document.getElementById("message").src = "Loading...";
    hideImage();
    hideVideo();
    showPicMessage("loading.jpg");
    getIvl(getSearchUrl());
  }
}

//returns the file extension of current urlNum (url index) of mediaUrls
function getFileExtension() {
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
    option.value = qualityIndices[key];
    option.text = key;
    select.add(option);
  });
}

//FINDS ALL THE MEDIA QUALITIES AVAILABLE AND THEN STORES IT IN qualityIndices
// IN THE FORMAT qualityIndices={"quality_name":indexOfTheUrl}
function findMediaQualities() {
  var extension, urlStr, firstIndex, lastIndex, qualityName;
  var urlNumBackup = urlNum;
  qualityIndices = {};
  if (mediaType == "video") {
    for (var i = 0; i < mediaUrls.length; i++) {
      urlNum = i;
      //stores the file extension of the current urlNum
      extension = getFileExtension();
      if (extension == ".mp4" || extension == ".ogg" || extension == "mpeg") {
        //extracting quality name. eg: orig
        urlStr = mediaUrls[urlNum].href;
        firstIndex = urlStr.lastIndexOf("~");
        lastIndex = urlStr.lastIndexOf(".");
        qualityName = urlStr.slice(firstIndex + 1, lastIndex);
        qualityName =
          qualityName.charAt(0).toUpperCase() + qualityName.slice(1);
        if (qualityName == "Orig") qualityName = "Original";

        qualityIndices[qualityName] = urlNum;
      }
    }
    console.log(qualityIndices);
  }
  //for image
  else {
    for (var i = 0; i < mediaUrls.length; i++) {
      urlNum = i;
      //stores the file extension of the current urlNum
      extension = getFileExtension();
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
        urlStr = mediaUrls[urlNum].href;
        firstIndex = urlStr.lastIndexOf("~");
        lastIndex = urlStr.lastIndexOf(".");
        qualityName = urlStr.slice(firstIndex + 1, lastIndex);
        qualityName =
          qualityName.charAt(0).toUpperCase() + qualityName.slice(1);
        if (qualityName == "Orig") qualityName = "Original";

        if (qualityName == "Thumb") continue;
        qualityIndices[qualityName] = urlNum;
      }
    }
    console.log(qualityIndices);
  }
  urlNum = urlNumBackup;
}
function showDescription() {
  var descriptiveData = queryResponse.collection.items[hitNum].data[0];
  document.getElementById("cosmic-object-num").innerHTML =
    "Cosmic Object: " + getCurrentCosmicObjectNum() + " / " + totalHits;
  document.getElementById("date").innerHTML = descriptiveData.date_created;
  document.getElementById("title").innerHTML = descriptiveData.title;
  document.getElementById("description").innerHTML =
    descriptiveData.description;
}
//SHOWS THE IVL VIDEO
function showIvlVideo() {
  //showing descriptions
  showDescription();

  var vid = document.getElementById("vid");

  var fileExtension = getFileExtension();
  console.log("url num: " + urlNum + " file extension: " + fileExtension);
  vid.onerror = () => {
    if (urlNum < mediaUrls.length - 1) {
      urlNum++;
      fileExtension = getFileExtension();
      console.log("url num: " + urlNum + " file extension: " + fileExtension);
      while (
        fileExtension != ".mp4" &&
        fileExtension != ".ogg" &&
        fileExtension != ".mpeg"
      ) {
        if (urlNum < mediaUrls.length - 1) {
          urlNum++;
        } else {
          urlNum = 0;
        }
        fileExtension = getFileExtension();
        console.log("url num: " + urlNum + " file extension: " + fileExtension);
      }
      vid.src = mediaUrls[urlNum].href;
    } else {
      urlNum = 0;
      fileExtension = getFileExtension();
      while (
        fileExtension != ".mp4" &&
        fileExtension != ".ogg" &&
        fileExtension != ".mpeg"
      ) {
        if (urlNum < mediaUrls.length - 1) {
          urlNum++;
        } else {
          urlNum = 0;
        }

        fileExtension = getFileExtension();
        console.log("url num: " + urlNum + " file extension: " + fileExtension);
      }
      vid.src = mediaUrls[urlNum].href;
    }
  };
  vid.onloadedmetadata = () => {
    document.getElementById("resolution").innerHTML =
      "Resolution: " + vid.videoWidth + " x " + vid.videoHeight;
    document.getElementById("message").innerHTML = "";

    enableBtns();
  };

  //console.log(mediaUrls[0]);
  if (mediaUrls.length > 0) {
    //checking if the current urlnum contains .json etc to avoid cross origin read blocking (CORB) error
    while (
      fileExtension != ".mp4" &&
      fileExtension != ".ogg" &&
      fileExtension != ".mpeg"
    ) {
      if (urlNum < mediaUrls.length - 1) {
        urlNum++;
      } else {
        urlNum = 0;
      }

      fileExtension = getFileExtension();
      console.log("url num: " + urlNum + " file extension: " + fileExtension);
    }

    vid.src = mediaUrls[urlNum].href;
  } else {
    showPicMessage("404.jpg");
  }
}

function changeMediaQuality() {
  disableBtns();

  if (urlNum < mediaUrls.length - 1) {
    urlNum++;
  } else {
    urlNum = 0;
  }
  // console.log("urlNum: " + urlNum);
  //finding file extension
  var fileExtension = getFileExtension();

  console.log("url num: " + urlNum + " file extension: " + fileExtension);

  if (mediaType == "album") {
  } else if (mediaType == "video") {
    while (
      fileExtension != ".mp4" &&
      fileExtension != ".ogg" &&
      fileExtension != ".mpeg"
    ) {
      if (urlNum < mediaUrls.length - 1) {
        urlNum++;
      } else {
        urlNum = 0;
      }
      fileExtension = getFileExtension();
      console.log("url num: " + urlNum + " file extension: " + fileExtension);
      // console.log(fileExtension);
    }

    var vid = document.getElementById("vid");
    vid.src = mediaUrls[urlNum].href;
  }
  //for image
  else {
    while (
      fileExtension != ".apng" &&
      fileExtension != ".bmp" &&
      fileExtension != ".gif" &&
      fileExtension != ".jpg" &&
      fileExtension != ".jpeg" &&
      fileExtension != ".jfif" &&
      fileExtension != ".pjpeg" &&
      fileExtension != ".pjp" &&
      fileExtension != ".png" &&
      fileExtension != ".svg" &&
      fileExtension != ".webp"
    ) {
      if (urlNum < mediaUrls.length - 1) {
        urlNum++;
      } else {
        urlNum = 0;
      }
      fileExtension = getFileExtension();
      console.log("url num: " + urlNum + " file extension: " + fileExtension);
    }
    var image = document.getElementById("pic");
    image.src = mediaUrls[urlNum].href;
  }
}

function showIvlImage() {
  showDescription();

  var image = document.getElementById("pic");

  var fileExtension = getFileExtension();
  console.log("url num: " + urlNum + " file extension: " + fileExtension);
  image.onerror = () => {
    if (urlNum < mediaUrls.length - 1) {
      urlNum++;
      fileExtension = getFileExtension();
      console.log("url num: " + urlNum + " file extension: " + fileExtension);
      while (
        fileExtension != ".apng" &&
        fileExtension != ".bmp" &&
        fileExtension != ".gif" &&
        fileExtension != ".jpg" &&
        fileExtension != ".jpeg" &&
        fileExtension != ".jfif" &&
        fileExtension != ".pjpeg" &&
        fileExtension != ".pjp" &&
        fileExtension != ".png" &&
        fileExtension != ".svg" &&
        fileExtension != ".webp"
      ) {
        if (urlNum < mediaUrls.length - 1) {
          urlNum++;
        } else {
          urlNum = 0;
        }
        fileExtension = getFileExtension();
        console.log("url num: " + urlNum + " file extension: " + fileExtension);
      }
      image.src = mediaUrls[urlNum].href;
    } else {
      urlNum = 0;
      fileExtension = getFileExtension();
      while (
        fileExtension != ".apng" &&
        fileExtension != ".bmp" &&
        fileExtension != ".gif" &&
        fileExtension != ".jpg" &&
        fileExtension != ".jpeg" &&
        fileExtension != ".jfif" &&
        fileExtension != ".pjpeg" &&
        fileExtension != ".pjp" &&
        fileExtension != ".png" &&
        fileExtension != ".svg" &&
        fileExtension != ".webp"
      ) {
        if (urlNum < mediaUrls.length - 1) {
          urlNum++;
        } else {
          urlNum = 0;
        }
        fileExtension = getFileExtension();
        console.log("url num: " + urlNum + " file extension: " + fileExtension);
      }
      image.src = mediaUrls[urlNum].href;
    }
  };
  image.onload = () => {
    document.getElementById("resolution").innerHTML =
      "Resolution: " + image.naturalWidth + " x " + image.naturalHeight;
    document.getElementById("message").innerHTML = "";
    //       image.height=image.naturalHeight;
    //        image.width=image.naturalWidth;
    enableBtns();
  };

  if (mediaUrls.length > 0) {
    // console.log("we are here2");

    while (
      fileExtension != ".apng" &&
      fileExtension != ".bmp" &&
      fileExtension != ".gif" &&
      fileExtension != ".jpg" &&
      fileExtension != ".jpeg" &&
      fileExtension != ".jfif" &&
      fileExtension != ".pjpeg" &&
      fileExtension != ".pjp" &&
      fileExtension != ".png" &&
      fileExtension != ".svg" &&
      fileExtension != ".webp"
    ) {
      if (urlNum < mediaUrls.length - 1) {
        urlNum++;
      } else {
        urlNum = 0;
      }
      fileExtension = getFileExtension();
      console.log("url num: " + urlNum + " file extension: " + fileExtension);
    }
    image.src = mediaUrls[urlNum].href;
  } else {
    showPicMessage("404.jpg");
  }
}

function getCurrentCosmicObjectNum() {
  return hitNum + 1 + (currentPage - 1) * 100;
}

function showMedia() {
  if (mediaType == "video") {
    hidePicMessage();
    hideImage();
    displayVideo();
    urlNum = 0;
    findMediaQualities();
    createMediaQualityOptions();
    showIvlVideo();
  }
  //checking if the provided hit num contains an album
  else if (mediaType == "album") {
    //                console.log(retriedMediaUrls);
    enableBtns();

    //showing dummy image for now

    showPicMessage("sigh.jpg");

    document.getElementById("cosmic-object-num").innerHTML =
      "Cosmic Object: " + getCurrentCosmicObjectNum();
    +" / " + totalHits;
  }
  //contains image
  else {
    hidePicMessage();
    hideVideo();
    displayImage();
    urlNum = 0;
    findMediaQualities();
    createMediaQualityOptions();
    showIvlImage();
  }
}

function getSearchUrl() {
  const searchUrl =
    "https://images-api.nasa.gov/search?q=" +
    encodeURIComponent(search) +
    "&media_type=" +
    selectedMediaType +
    "&page=" +
    currentPage;
  return searchUrl;
}

//retrives user search input
function startSearch() {
  // document.getElementById("message").innerHTML = "Loading...";
  //get the searching string
  search = document.getElementById("searchBar").value;

  if (search != "") {
    listenToMediaChange();
    hideVideo();
    hideImage();

    showPicMessage("loading.jpg");

    //get selected media type
    getSelectedMediaType();

    pageReset();
    hitNum = 0;
    search = search.trim();
    //getting url and fetching query results (initial data)
    getIvl(getSearchUrl());
    showControls();
  }
}

//fetches media urls of a specific hit and calls showIvl()
function fetchMediaUrl() {
  // alert("we are in fetchMediaUrl");
  var url;

  document.getElementById("vid").pause();
  //checking if the current hit num contains an album then set media_type and prepare the required url
  if (queryResponse.collection.items[hitNum].data[0].album) {
    var album_name = queryResponse.collection.items[hitNum].data[0].album;
    url = "https://images-api.nasa.gov/album/" + album_name + "?page=1";
    mediaType = "album";
  }
  //contains a video or image
  else {
    //getting nasa_id
    var nasa_id = queryResponse.collection.items[hitNum].data[0].nasa_id;
    //appending it to url
    url = "https://images-api.nasa.gov/asset/" + nasa_id;
    //getting media type
    mediaType = queryResponse.collection.items[hitNum].data[0].media_type;
  }

  //sending http request for media links
  sendHttpRequest(method, url, mode)
    .then((fetchedMediaUrls) => {
      console.log(
        "Page:" +
          currentPage +
          " / " +
          totalPage +
          " HitNum: " +
          hitNum +
          " Media type:" +
          mediaType
      );
      console.log(fetchedMediaUrls);
      mediaUrls = fetchedMediaUrls.collection.items;
      // console.log(mediaUrls);
      // alert("we are here");
      showMedia();
    })
    .catch((errCode) => {
      //console.log(err);
      var errMsg;
      if (errCode == 404) {
        //                errMsg =
        //                    "404 The cosmic object you are looking for has disappeard beyond the event horizon.";
        enableBtns();
        showPicMessage("404.jpg");
        //                document.getElementById("message").innerHTML = errMsg;
      }
    });
  //    }
}

//gets Ivl initial data, sets total page and fetches media url
function getIvl(searchUrl) {
  //console.log(search);

  sendHttpRequest(method, searchUrl, mode)
    .then((response) => {
      totalHits = response.collection.metadata.total_hits;
      console.log("Total hits:" + totalHits);
      console.log(response);
      queryResponse = response;

      //if there are hits then we are ready to fetch media
      if (totalHits != 0) {
        //calculating total page number
        calTotalPage();
        //we are ready to fetch media now
        fetchMediaUrl();
      }
      //if there are no hits
      else {
        document.getElementById("message").innerHTML =
          "Sorry! We could not find anything. Perhaps check what you have typed.";
      }
    })
    .catch((errCode) => {
      enableBtns();
      //            document.getElementById("message").innerHTML =
      //                "404 The cosmic object you are looking for has disappeard beyond the event horizon.";
      showPicMessage("404");
    });
}
