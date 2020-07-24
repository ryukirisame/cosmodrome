function fun() {
    return new Promise(function (resolve, reject) {
        
            const error = true;
            if (!error) {
                console.log("Resolved");
                resolve();
            } else {
                console.log("Resolved");
                resolve('sorry');
            }
        
    })
}

fun().then(function(){
    console.log("thanks");
})

