//starting button splash effect listener
listenToButtonClickForSplashEffect();
function listenToButtonClickForSplashEffect() {
    const buttons = document.querySelectorAll(".splash-effect");

    buttons.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            if (btn.classList.contains("splash-effect")) {
                var elem = btn.getBoundingClientRect();
                var x = e.clientX - elem.left;
                var y = e.clientY - elem.top;

                let ripple = document.createElement("span");
                ripple.classList.add("ripple");
                ripple.style.left = x + "px";
                ripple.style.top = y + "px";
                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 750);
            }

            // }
        });
    });
}