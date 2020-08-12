var API_KEY = "OdR7r0hQ6rqZyotYDkKKychcYrDUQ32tHuI36bhw";
const url = "https://api.nasa.gov/EPIC/api/natural/images?api_key=" + API_KEY + "&date=";
const mode = "true";
const method = "GET";

var sendHttpRequest = (method, url, mode) => {
    const promise = new Promise((resolve, reject) => {

        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.response);
                console.log(data[0]);
                resolve(data);
            }
        }
        req.open(method, url, mode);
        req.send();
    });
    return promise;
}

function update(data) {
    console.log(data);
    document.getElementById("caption").innerHTML = data[0].caption;
   document.getElementById("identifier").innerHTML = data[0].identifier;
    
    
    console.log(data.centroid_coordinates.lat);
    
    //date in yyyy-mm-dd formate
var x=data[0].identifier[0]+data[0].identifier[1]+data[0].identifier[2]+data[0].identifier[3]+"/"+data[0].identifier[4]+data[0].identifier[5]+"/"+data[0].identifier[6]+data[0].identifier[7];
    
   var imgId= document.getElementById("image").innerHTML = data[0].image;
    var imgId2=data[1].image;
    var imgId3=data[2].image;
    var imgId4=data[3].image;
    var imgId5=data[4].image;
    var imgId6=data[5].image;
    var imgId7=data[6].image;
    var imgId8=data[7].image;
    
    var imgUrl="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId+".jpg?api_key="+API_KEY;
    console.log(x);
    
    var imgUrl2="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId2+".jpg?api_key="+API_KEY;
    var imgUrl3="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId3+".jpg?api_key="+API_KEY;
    var imgUrl4="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId4+".jpg?api_key="+API_KEY;
    var imgUrl5="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId5+".jpg?api_key="+API_KEY;
    var imgUrl6="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId6+".jpg?api_key="+API_KEY;
    var imgUrl7="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId7+".jpg?api_key="+API_KEY;
    var imgUrl8="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId8+".jpg?api_key="+API_KEY;
   

    
    document.getElementById("version").innerHTML = data[0].version;
    document.getElementById("pic").src = imgUrl;
    document.getElementById("pic2").src = imgUrl2;
    document.getElementById("pic3").src = imgUrl3;
    document.getElementById("pic4").src = imgUrl4;
    document.getElementById("pic5").src = imgUrl5;
    document.getElementById("pic6").src = imgUrl6;
    document.getElementById("pic7").src = imgUrl7;
    document.getElementById("pic8").src = imgUrl8;
    
    

}
sendHttpRequest(method, url, mode).then(update);
