let loader = document.getElementById("loading-screen");
let onboardingScreen = document.getElementById("onboarding-screen");

setTimeout(function(){
    loader.classList.remove("active");
    onboardingScreen.classList.add("active");
}, 2000);

let setupForm = document.getElementById("setup-form");
let appScreen = document.getElementById("app-screen");

setupForm.addEventListener("submit", function(event) {
    event.preventDefault();
    onboardingScreen.classList.remove("active");
    appScreen.classList.add("active");
})