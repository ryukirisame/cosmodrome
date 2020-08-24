  
      var loadingAnimationSetTimeOut;
      
      
      // body scroll position when a modal is opened
      var bodyScrollPos;
      
      window.addEventListener("scroll", handleScroll);
      
      const navBar = document.querySelector(".nav-bar");
      var prevScrollPos = window.pageYOffset;
      
      function handleScroll() {
        // console.log(window.pageYOffset);
        // console.log(window.scrollY+window.innerHeight);
        // console.log(document.documentElement.scrollHeight);
      
        // code for infinite scroll
        if (
          window.scrollY + window.innerHeight + 75 >=
          document.documentElement.scrollHeight
        ) {
        
        }
      
        // code for hiding and showing the nav bar on page scroll
        // hide the nav bar only when the user has scrolled atleast 64px
        //  from the top. so that there is no white space shown when the
        // nav bar hides itself
        if (window.scrollY >= 360) {
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
          }
      
          prevScrollPos = currentScrollPos;
        }
      }
      
      // code ends
      
      window.onload = () => {
        // to get viewport dimensions
        getViewportDimensions();
        //listening to enter key press
        startListeningToEnterKeyPress();
      
        //starting button splash effect listener
        listenToButtonClickForSplashEffect();
      
        // starting button background fill effect listener
        listenToButtonHoverForBackgroundFillEffect();
      };
      
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
          // console.log(vh);
          // console.log(vw);
          document.documentElement.style.setProperty("--vh", `${vh}px`);
          document.documentElement.style.setProperty("--vw", `${vw}px`);
        });
      }
      
      function startListeningToEnterKeyPress() {
        const navBarSearchBox = document.getElementById("nav-search-box"); 
      }
      function listenToButtonHoverForBackgroundFillEffect() {
        const buttonsBackgroundEffect = document.querySelectorAll(
          ".button-background-color-splash"
        );
      
        buttonsBackgroundEffect.forEach((btn) => {
          btn.addEventListener("mouseenter", (event) => {
            // console.log("mouse enter was fired");
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
            // console.log("mouseleave was fired");
            var item = document.querySelector(".button-background-color");
      
            item.parentNode.removeChild(item);
          });
        });
      }
      function listenToButtonClickForSplashEffect() {
        const buttons = document.querySelectorAll(".splash-effect");
      
        buttons.forEach((btn) => {
          btn.addEventListener("click", function (e) {
            // console.log(btn.disabled);
            // if (btn.disabled == false) {
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
            }, 700);
            // }
          });
        });
      }
      
      
      function showModalScreen() {
        // preventing background scroll
        preventBodyScroll();
        // Get the modal
        var contentModal = document.getElementById("contentModal");
        //displaying modal screen
        contentModal.classList.add("open");
        //starting key press listeners
        document.addEventListener("keyup", handleArrowKeyPress);
      }
      function hideModalSreen() {
        // allowing body scroll again
        allowBodyScroll();
        // get the modal
        var contentModal = document.getElementById("contentModal");
        //removing event listener of arrow key press
        document.removeEventListener("keyup", handleArrowKeyPress);
        //hiding modal screen
        contentModal.classList.remove("open");
      }
      function isModalScreenOpen() {
        var modal = document.getElementById("contentModal");
        if (modal.style.opacity != 0) {
          return true;
        } else return false;
      }
      
    
      
      function preventBodyScroll() {
        // getting current scroll position
        bodyScrollPos = window.scrollY;
      
        // fixing body position
        document.body.classList.add("modal-open");
        // briging back the body to the bodyScrollPos because when
        // the body position is fixed then we come back to the top of the page
        //  as the top of the body element tries to start from the top of the
        // window
        document.body.style.top = -bodyScrollPos + "px";
      }
      function allowBodyScroll() {
        // to prevent the hiding of the nav bar due to scrollTo
        window.removeEventListener("scroll", handleScroll);
      
        document.body.classList.remove("modal-open");
        window.scrollTo(0, bodyScrollPos);
        setTimeout(() => {
          window.addEventListener("scroll", handleScroll);
        }, 1000);
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
      






      
// global varaiable declaration 
var API_KEY = "qMEzVucHSomqcUrLNUcSPyGN59TqMUZdcd1SjKcf";
var method = "GET";
var mode = true;
var date;
var url;
var itemNumToDownload;
var currentItemNumber;
var data="2020/08/03";
var today;
getPic();
//function declaration for hidinng buttons before date selection default buttons are hidden
// function hideButton()
// {
//     var x=document.getElementById("btn");
//     x.style.display="none";
// }
// hideButton();


// function declaration for showing button after date selection
// function showButton()
// {
//     var x=document.getElementById("btn");
//     x.style.display="inline";
// }


//function for sending request 
function sendHttpRequest(method, url, mode) {

    const promise = new Promise((resolve, reject) => {

        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.response);

                resolve(data);
            }
        }
        req.open(method, url, mode);
        req.send();
    });
    return promise;

}

function curDay(){
    today = new Date();
    var dd = String(today.getDate() - 2).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = yyyy + '-' + mm + '-' + dd;
    date = document.getElementById('date');
    date.max = today;
    return today;
    
    }

/*for getting date through input tag*/
function getDate() {
    
    date = document.getElementById('date').value;
    
   
}



/*url for sending request*/
function getUrl() {
    url = "https://api.nasa.gov/EPIC/api/natural/date/" + date + "?api_key=" + API_KEY;
}

/* sending request */
function getPic() {

    stopDownloadingPic();
    getDate();
    getUrl();

    console.log(url);
    sendHttpRequest(method, url, mode).then((response) => {
        console.log(response);
        data = response;

        //        set the pic src 

        showPic(0);

        //        starting pic download
        itemNumToDownload = 1;
        downloadPic();


    });

}


/*storing all pic of choosen date */
function downloadPic() {
    // showButton();
    console.log("itemNum Downloading: " + itemNumToDownload);
    var hiddenImage = document.getElementById("hidden-image");

    hiddenImage.addEventListener("load", downloadNextPic);

    var cdate = changeFormate(date);
    var img_url = "https://api.nasa.gov/EPIC/archive/natural/" + cdate + "/png/" + data[itemNumToDownload].image + ".png?api_key=" + API_KEY;

    hiddenImage.src = img_url;
}

function downloadNextPic() {
    itemNumToDownload++;
    if (itemNumToDownload < data.length) {

        downloadPic();
    }
}

function stopDownloadingPic() {
    var hiddenImage = document.getElementById("hidden-image");
    hiddenImage.removeEventListener("load", downloadNextPic);

}


// shows the pic of the provided itemNum. we have to provide. it.
function showPic(itemNum) {

    currentItemNumber = itemNum;
    console.log("current item num: " + currentItemNumber);

    //    var details = data[itemNum].image;
    //    console.log(data[itemNum].identifier);
    var cdate = changeFormate(date);
    var img_url = "https://api.nasa.gov/EPIC/archive/natural/" + cdate + "/png/" + data[itemNum].image + ".png?api_key=" + API_KEY;
    document.getElementById('pic').src = img_url;
    // document.getElementById('txtdt').innerHTML=data[itemNum].date;
    // document.getElementById('caption').innerHTML=data[itemNum].caption;
    // document.getElementById('txt_image').innerHTML=data[itemNum].image;
    // document.getElementById('txtlat').innerHTML=data[itemNum].centroid_coordinates.lat;
    // document.getElementById('txtlon').innerHTML=data[itemNum].centroid_coordinates.lon;

  }

function prev() {
    if (currentItemNumber - 1 < 0) {
        currentItemNumber = data.length - 1;
        showPic(currentItemNumber);
    } else {
        currentItemNumber--;
        showPic(currentItemNumber);
    }
}

/*for displaying next pic of choosen date */
function next() {
    if (currentItemNumber + 1 > data.length) {
        currentItemNumber = 0;
        showPic(currentItemNumber);
    } else {
        currentItemNumber++;
        showPic(currentItemNumber);
    }
}

/*changing formate of date to yyyy-mm-dd to yyyy/mm/dd */
function changeFormate(x) {
    var year = x.substring(0, 4);
    var month = x.substring(5, 7);
    var day = x.substring(8, 10);
    var nd = year + "/" + month + "/" + day;
    return nd
}

/* getting current date */



// function setMax()
// {
//     var cd=curDay();
//     console.log(cd);
//     var input=document.getElementById('date');
//     // input.setAttribute("max",this.value);
//     // input.max=cd;
    
// }






