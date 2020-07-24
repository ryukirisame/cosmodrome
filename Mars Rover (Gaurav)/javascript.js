var method = "GET";
var imgDate = "2015-02-02"
var url = "https://api.nasa.gov/mars-photos/api/v1/rovers/Curiosity/photos?earth_date="+imgDate+"&camera=FHAZ&api_key=21760btk212aupCr25Qmmc1jK6yVyMc7Fin6bM8A"
var mode = true;


function sendHttpRequest(method,url,mode) {
    return new Promise((resolve, reject) =>{
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {

            if(this.readyState == 4 && this.status == 200)
            {
                var data = JSON.parse(this.response);
                resolve(data);
                console.log(data);
            }
            else if(this.status == 404)
            {
                reject(this.status);
            }
        };
        req.open(method,url,mode);
        req.send();
    });  
}

sendHttpRequest(method,url,mode).then(function(){
    console.log("Resolved");

}).catch(function(){
    console.log("you did very wrong sir !");
})













// var req = new XMLHttpRequest();
// req.open(method,url,mode);
// req.send();


// req.addEventListener("load",function()
// {
//     if(this.readyState == 4 && this.status == 200)
//     {
//         var data = JSON.parse(this.response);
//         console.log(data);
//     }
// })

// function sendHttpRequest(method,url,mode)
// {
//     return new Promise((resolve,reject) =>{
//         var req = new XMLHttpRequest();
//         req.open(method,url,mode);
//         req.onreadystatechange = function (){
//             if(this.readyState == 4 && this.status == 200)
//             {
//                 var data = JSON.parse(this.response);
//                 resolve(data);
//                 //console.log(data);
//             }
//             // else
//             // {
//             //     console.log("sorry can't do anything");
//             //     reject('Sorry');
//             // }
//         };
      
//         req.send();
//     });
// }

// sendHttpRequest().then(function(){
//     console.log("done");
// }).catch(function(){
//     console.log("what is this");
// })




// req.addEventListener("load",function()
// {
//     if(req.readyState == 4 && req.status == 200)
//     {
//         var response = JSON.parse(req.responseText);
//         console.log(response.photos[0].img_src);
//         var Image = document.getElementById("pic").src = response.photos[0].img_src;
//         console.log(response.photos[0].camera.name);


//     }
// })
