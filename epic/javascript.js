const API_KEY="qMEzVucHSomqcUrLNUcSPyGN59TqMUZdcd1SjKcf";
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
    
    //date in yyyy-mm-dd formate
var x=data[0].identifier[0]+data[0].identifier[1]+data[0].identifier[2]+data[0].identifier[3]+"/"+data[0].identifier[4]+data[0].identifier[5]+"/"+data[0].identifier[6]+data[0].identifier[7];
    var imgId1=data[0].image;
    var imgId2=data[1].image;
    var imgId3=data[2].image;
    var imgId4=data[3].image;
    var imgId5=data[4].image;
    var imgId6=data[5].image;
    var imgId7=data[6].image;
    var imgId8=data[7].image;
    var imgId9=data[8].image;
    var imgId10=data[9].image;
    var imgId11=data[10].image;
    var imgId12=data[11].image;
    var imgId13=data[12].image;
    var imgId14=data[13].image;
    var imgId15=data[14].image;
    var imgId16=data[15].image;
    
    var imgUrl1="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId1+".jpg?api_key="+API_KEY;
    console.log(x);
    var imgUrl2="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId2+".jpg?api_key="+API_KEY;
    var imgUrl3="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId3+".jpg?api_key="+API_KEY;
    var imgUrl4="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId4+".jpg?api_key="+API_KEY;
    var imgUrl5="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId5+".jpg?api_key="+API_KEY;
    var imgUrl6="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId6+".jpg?api_key="+API_KEY;
    var imgUrl7="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId7+".jpg?api_key="+API_KEY;
    var imgUrl8="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId8+".jpg?api_key="+API_KEY;
    var imgUrl9="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId9+".jpg?api_key="+API_KEY;
    var imgUrl10="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId10+".jpg?api_key="+API_KEY;
    var imgUrl11="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId11+".jpg?api_key="+API_KEY;
    var imgUrl12="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId12+".jpg?api_key="+API_KEY;
    var imgUrl13="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId13+".jpg?api_key="+API_KEY;
    var imgUrl14="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId14+".jpg?api_key="+API_KEY;
    var imgUrl15="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId15+".jpg?api_key="+API_KEY;
    var imgUrl16="https://api.nasa.gov/EPIC/archive/natural/"+x+"/jpg/"+imgId16+".jpg?api_key="+API_KEY;
    document.getElementById("pic1").src = imgUrl1;
    document.getElementById("pic2").src = imgUrl2;
    document.getElementById("pic3").src = imgUrl3;
    document.getElementById("pic4").src = imgUrl4;
    document.getElementById("pic5").src = imgUrl5;
    document.getElementById("pic6").src = imgUrl6;
    document.getElementById("pic7").src = imgUrl7;
    document.getElementById("pic8").src = imgUrl8;
    document.getElementById("pic9").src = imgUrl9;
    document.getElementById("pic10").src = imgUrl10;
    document.getElementById("pic11").src = imgUrl11;
    document.getElementById("pic12").src = imgUrl12;
    document.getElementById("pic13").src = imgUrl13;
    document.getElementById("pic14").src = imgUrl14;
    document.getElementById("pic15").src = imgUrl15;
    document.getElementById("pic16").src = imgUrl16;
    
    

}
sendHttpRequest(method, url, mode).then(update);

var i=1;
function next()
{
    if(i==16)
    {
        document.getElementById('pic16').style.display="none";
        document.getElementById('pic1').style.display="block";
        i=1;
         

    }
    else
    {
        var pic="pic"+String(i);
    document.getElementById(pic).style.display="none";
    pic="pic"+String(i+1);
    document.getElementById(pic).style.display="block";
    i++;
    }
    
}
function prev()
{
    if(i==1)
    {
        document.getElementById('pic1').style.display="none";
        document.getElementById('pic16').style.display="block";
        i=16;
         

    }
    else
    {
        var pic="pic"+String(i);
    document.getElementById(pic).style.display="none";
    pic="pic"+String(i-1);
    document.getElementById(pic).style.display="block";
    i--;
    }
}

