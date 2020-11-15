
// global varaiable declaration 
var API_KEY = "W7Mwk82A7efr3ILdF3HfeLd2NmjPkpUWvvaeQ3gS";
var method = "GET";
var mode = true;
var date;
var url;
var itemNumToDownload;
var currentItemNumber;
var data;
var today;
//function declaration for hidinng buttons before date selection default buttons are hidden
function hideButton()
{
    var x=document.getElementById("btn");
    x.style.display="none";
}


// function declaration for showing button after date selection
function showButton()
{
    var x=document.getElementById("btn");
    x.style.display="inline";
}


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
    var dd = String(today.getDate() - 12).padStart(2, '0');
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

  var sa=parseFloat(data[itemNum].sun_j2000_position.x);
  var sb=parseFloat(data[itemNum].sun_j2000_position.y);
  var sc=parseFloat(data[itemNum].sun_j2000_position.z);


  var la=parseFloat(data[itemNum].lunar_j2000_position.x);
  var lb=parseFloat(data[itemNum].lunar_j2000_position.y);
  var lc=parseFloat(data[itemNum].lunar_j2000_position.z);

  
  var da=parseFloat(data[itemNum].dscovr_j2000_position.x);
  var db=parseFloat(data[itemNum].dscovr_j2000_position.y);
  var dc=parseFloat(data[itemNum].dscovr_j2000_position.z);

  var dis_sun=distance_calculate(sa,sb,sc,da,db,dc);
  console.log(dis_sun);
  
  var dis_moon=distance_calculate(la,lb,lc,da,db,dc)
  


    document.getElementById('txtdt').innerHTML=data[itemNum].date;
    // document.getElementById('caption').innerHTML=data[itemNum].caption;
   // document.getElementById('txt_image').innerHTML=data[itemNum].image;
    document.getElementById('txtlat').innerHTML=data[itemNum].centroid_coordinates.lat;
    document.getElementById('txtlon').innerHTML=data[itemNum].centroid_coordinates.lon;
    // document.getElementById('txtcor').innerHTML=data[itemNum].centroid_coordinates.lon;
    // document.getElementById('txtdscovr').innerHTML=a1+b1+c1;
    // document.getElementById('txtlunar').innerHTML=data[itemNum].centroid_coordinates.lon;
    // document.getElementById('txtsun').innerHTML=data[itemNum].centroid_coordinates.lon;
    // document.getElementById('txtaq').innerHTML=data[itemNum].centroid_coordinates.lon;
    



  document.getElementById('txtdts').innerText=dis_sun+" KM";
  document.getElementById('txtdtm').innerText=dis_moon+" KM";


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



function setMax()
{
    var cd=curDay();
    var input=document.getElementById('date');
    input.setAttribute("max",this.value);
    input.max=cd;
    
    

    input.setAttribute("value",this.value);
    input.value=cd;
    
}

setMax();



function distance_calculate(x1,y1,z1,x2,y2,z2){
    var f1=x2-x1;
    var f2=y2-y1;
    var f3=z2-z1;
    var fal=f1*f1+f2*f2+f3*f3;
    var dis=Math.sqrt(fal);
    return dis.toPrecision(12);
    }


    getPic();



    


    function checkButton(currentItemNumber,itemNumToDownload){
        
            document.getElementById('btn_rg').style.display="none";
        

        
    }
    
