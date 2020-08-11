 //        splash effect script
 const buttonsSplashEffect = document.querySelectorAll('.splash-effect');

 buttonsSplashEffect.forEach(btn => {
     btn.addEventListener('click', function(e) {

         var elem = btn.getBoundingClientRect();
         var x = e.clientX - elem.left;
         var y = e.clientY - elem.top;


         let ripple = document.createElement('div');
         ripple.classList.add("splash-effect-ripple");

         ripple.style.left = x + 'px';
         ripple.style.top = y + 'px';
         this.appendChild(ripple);

         setTimeout(() => {
             ripple.remove()
         }, 1000);

     });

 });


 //        buttons background effect script

 const buttonsBackgroundEffect = document.querySelectorAll('.button-background-color-splash');

 buttonsBackgroundEffect.forEach(btn => {
     btn.addEventListener("mouseenter", (event) => {


         var elem = btn.getBoundingClientRect();
         var x = event.clientX - elem.left;
         var y = event.clientY - elem.top;

         let background = document.createElement('div');
         background.classList.add("button-background-color");
         background.style.left = x + 'px';
         background.style.top = y + 'px';

         event.target.insertBefore(background, event.target.firstChild);


     });

     btn.addEventListener("mouseleave", (event) => {


         var item = document.querySelector(".button-background-color");
         item.parentNode.removeChild(item);


     });

 });