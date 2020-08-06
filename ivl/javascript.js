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
  document.getElementById("nextPageBtn").disabled = false;
  document.getElementById("prevBtn").disabled = false;
  document.getElementById("prevPageBtn").disabled = false;
  // document.getElementById("changeMediaQualityBtn").disabled = false;
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
  // document.getElementById("changeMediaQualityBtn").disabled = true;
  document.getElementById("searchBtn").disabled = true;
  document.getElementsByName("media-type")[0].disabled = true;
  document.getElementsByName("media-type")[1].disabled = true;
  document.getElementById("quality-selector").disabled = true;
}
function showControls() {
  document.getElementById("nextBtn").style.display = "inline";
  document.getElementById("prevBtn").style.display = "inline";
  // disableBtns();
  document.getElementById("nextPageBtn").style.display = "inline";
  document.getElementById("prevPageBtn").style.display = "inline";

  // document.getElementById("changeMediaQualityBtn").style.display = "inline";
}

function displayVideo() {
  document.getElementById("vid").style.display = "block";
}
function hideVideo() {
  document.getElementById("vid").style.display = "none";
}
function displayImage() {
  document.getElementById("pic").style.display = "block";
}
function hideImage() {
  document.getElementById("pic").style.display = "none";
}
function showPicMessage(picSrc) {
  document.getElementById("pic-message").src = picSrc;
  document.getElementById("pic-message").style.display = "block";
}
function hidePicMessage() {
  //  document.getElementById("pic-message").src="";
  document.getElementById("pic-message").style.display = "none";
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
        hideVideo();
        hideImage();
        showPicMessage("404.jpg");
      } else if (errCode > 499 && errCode < 600) {
        hideVideo();
        hideImage();
        showPicMessage("serverError.jpg");
      } else if (errCode == 400) {
        hideVideo();
        hideImage();
        showPicMessage("400.jpg");
      }

      //for no internet connection
      else {
        hideVideo();
        hideImage();
        showPicMessage("onerror.jpg");
      }
    });
}
function nextData() {
  disableBtns();
  document.getElementById("vid").pause();
  hitNum++;
  //if hit number exceeds total number of hits in the current page and if there is a next page then transition to next page
  //    but if there is not a next page(eg: first page with less than 100 items, last page with less than 100 items)
  // then hitNum--;

  //if hit number exceeds total number of hits in the CURRENT page
  if (hitNum > queryResponse[currentPage - 1].collection.items.length - 1) {
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
    hideImage();
    hideVideo();
    showPicMessage("loading.jpg");
    // document.getElementById("pic").src = "loading.gif";

    fetchMediaUrl(hitNum, currentPage);
    showDescription(hitNum, currentPage);
  }
}

//tries going to next page. shows error if its already the last page
function nextPage() {
  //if next page exists
  if (isNextPageAvailable()) {
    hideImage();
    hideVideo();
    showPicMessage("loading.jpg");
    currentPage++;
    //if the next page is not downloaded
    if (queryResponse[currentPage - 1] == undefined) {
      downloadNextPage(currentPage);
    } else {
      hitNum = -1;
      console.log("using downloaded page");
      nextData();
    }
  }
  //if the next page does not exist (exceeds total pages)
  else {
    //        hitNumReset();
    // document.getElementById("message").innerHTML = "Loading...";

    document.getElementById("message").innerHTML = "This is the last page!";
    enableBtns();
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
    fetchMediaUrl(hitNum, currentPage);
    showDescription(hitNum, currentPage);
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
  //else  fetch data
  else {
    //        hitNumReset();
    // document.getElementById("message").src = "Loading...";
    hideImage();
    hideVideo();
    showPicMessage("loading.jpg");
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

//SHOWS THE IVL VIDEO
function showIvlVideo() {
  //showing descriptions
  // showDescription();

  var vid = document.getElementById("vid");

  vid.onerror = () => {
    hideVideo();
    hideImage();
    showPicMessage("onerror.jpg");
    enableBtns();
  };
  vid.onloadedmetadata = () => {
    document.getElementById("resolution").innerHTML =
      "Resolution: " + vid.videoWidth + " x " + vid.videoHeight;
    document.getElementById("message").innerHTML = "";

    enableBtns();
  };

  //console.log(mediaUrls[0]);
  if (mediaUrls.length > 0) {
    if (qualityIndices.hasOwnProperty("Large")) {
      document.getElementById("Large").selected = "true";
      vid.src = mediaUrls[qualityIndices["Large"]].href;
      console.log("Quality: Large url num: " + qualityIndices["Large"]);
    } else if (qualityIndices.hasOwnProperty("Medium")) {
      document.getElementById("Medium").selected = true;
      vid.src = mediaUrls[qualityIndices["Medium"]].href;
      console.log("Quality: Medium url num: " + qualityIndices["Medium"]);
    } else if (qualityIndices.hasOwnProperty("Original")) {
      document.getElementById("Original").selected = true;
      vid.src = mediaUrls[qualityIndices["Original"]].href;
      console.log("Quality: Original url num: " + qualityIndices["Original"]);
    } else if (qualityIndices.hasOwnProperty("Small")) {
      document.getElementById("Small").selected = true;
      vid.src = mediaUrls[qualityIndices["Small"]].href;
      console.log("Quality: Preview url num: " + qualityIndices["Small"]);
    } else if (qualityIndices.hasOwnProperty("Preview")) {
      document.getElementById("Preview").selected = true;
      vid.src = mediaUrls[qualityIndices["Preview"]].href;
      console.log("Quality: Small url num: " + qualityIndices["Preview"]);
    } else if (qualityIndices.hasOwnProperty("Mobile")) {
      document.getElementById("Mobile").selected = true;
      vid.src = mediaUrls[qualityIndices["Mobile"]].href;
      console.log("Quality: Mobile url num: " + qualityIndices["Mobile"]);
    } else {
      showPicMessage("404.jpg");
    }
  } else {
    showPicMessage("404.jpg");
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

  // if (mediaType == "album") {
  // } else
  if (mediaType == "video") {
    var vid = document.getElementById("vid");
    vid.src = mediaUrls[qualityIndices[qualityKey]].href;
    console.log(
      "Quality: " + qualityKey + " url num: " + qualityIndices[qualityKey]
    );
  }
  //for image
  else {
    var image = document.getElementById("pic");
    image.src = mediaUrls[qualityIndices[qualityKey]].href;
    // console.log(
    //   "Quality: " + qualityKey + " url num: " + qualityIndices[qualityKey]
    // );
  }
}

function showIvlImage() {
  //  showDescription();

  var image = document.getElementById("pic");

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the image and insert it inside the modal - use its "alt" text as a caption

  modal.style.display = "block";

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  image.onerror = () => {
    hideVideo();
    hideImage();
    showPicMessage("onerror.jpg");
    enableBtns();
  };
  image.onload = () => {
    document.getElementById("resolution").innerHTML =
      "Resolution: " + image.naturalWidth + " x " + image.naturalHeight;
    document.getElementById("message").innerHTML = "";

    enableBtns();
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
      showPicMessage("404.jpg");
    }
  } else {
    showPicMessage("404.jpg");
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
    hidePicMessage();
    hideImage();
    displayVideo();
    // urlNum = 0;
    // listenToQualityChange();
    findMediaQualities();
    createMediaQualityOptions();
    showQualitySelector();
    enableBtns();
    showControls();
    showIvlVideo();
  }
  //checking if the provided hit num contains an album
  // else if (mediaType == "album") {
  //   // enableBtns();

  //   // showPicMessage("sigh.jpg");

  //   // document.getElementById("cosmic-object-num").innerHTML =
  //   //   "Cosmic Object: " + getCurrentCosmicObjectNum();
  //   // +" / " + totalHits;
  //   nextData();
  // }
  //contains image
  else {
    hidePicMessage();
    hideVideo();
    displayImage();
    // urlNum = 0;
    // listenToQualityChange();
    findMediaQualities();
    createMediaQualityOptions();
    showQualitySelector();
    enableBtns();
    showControls();
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

  document.getElementById("vid").pause();
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
        hideVideo();
        hideImage();
        showPicMessage("404.jpg");
      } else if (errCode > 499 && errCode < 600) {
        hideVideo();
        hideImage();
        showPicMessage("serverError.jpg");
      } else if (errCode == 400) {
        hideVideo();
        hideImage();
        showPicMessage("400.jpg");
      }

      //for no internet connection
      else {
        hideVideo();
        hideImage();
        showPicMessage("onerror.jpg");
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
    hideVideo();
    hideDescription();
    hideImage();

    showPicMessage("loading.jpg");

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
        hideImage();
        hideVideo();
        showPicMessage("nothingFound.jpg");
        enableBtns();
      }
    })
    .catch((errCode) => {
      console.log("error code: " + errCode);
      enableBtns();
      if (errCode == 404) {
        hideVideo();
        hideImage();
        showPicMessage("404.jpg");
      } else if (errCode > 499 && errCode < 600) {
        hideVideo();
        hideImage();
        showPicMessage("serverError.jpg");
      } else if (errCode == 400) {
        hideVideo();
        hideImage();
        showPicMessage("400.jpg");
      }

      //for no internet connection
      else {
        hideVideo();
        hideImage();
        showPicMessage("onerror.jpg");
      }
    });
}

function showResultCards() {
  var flexContainer = document.getElementById("flex-container");
  // var column = document.getElementsByClassName("column");

  hidePicMessage();
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
window.addEventListener("scroll", handleScroll);
