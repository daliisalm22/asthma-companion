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

const navButtons = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".view");

navButtons.forEach(navButton => {
    navButton.addEventListener("click", () => {
        navButtons.forEach(btn => btn.classList.remove("active"));
        views.forEach(view => view.classList.remove("active"));

        navButton.classList.add("active");
        const targetViewId = navButton.getAttribute("data-target");
        const targetView = document.getElementById(targetViewId);

        if (targetView) {
            targetView.classList.add("active");
        }
    });
});

const attackCard = document.querySelector(".dash-card.attack-card");
if (attackCard) {
    attackCard.addEventListener("click", () => {
        const attackNavBtn = document.querySelector('.nav-btn[data-target="view-attack"]');
        if (attackNavBtn) {
            attackNavBtn.click();
        }
    });
}


const logControllerBtn = document.getElementById("log-controller")
const logRelieverBtn = document.getElementById("log-reliever");
const medStatusText = document.getElementById("med-status");
const symptomBtns = document.querySelectorAll(".symptom-btn");
const triggerAttackBtn = document.getElementById("trigger-attack-mode");

if (logControllerBtn){
    logControllerBtn.addEventListener("click", () => {
        medStatusText.textContent = "PREVENTER TAKEN TODAY";
        medStatusText.style.color = "#006726";
    });
}

symptomBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        symptomBtns.exports = symptomBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

if (triggerAttackBtn) {
    triggerAttackBtn.addEventListener("click", () => {
        const attackNavBtn = document.querySelector('.nav-btn[data-target="view-attack"]');
        if (attackNavBtn) {
            attackNavBtn.click();
        }
    });
}

const exitAttackBtn = document.getElementById("exit-attack-btn");

if(exitAttackBtn) {
    exitAttackBtn.addEventListener("click", () => {
        const dashboardNavBtn = document.querySelector('.nav-btn[data-target="view-home"]');
        if (dashboardNavBtn) {
            dashboardNavBtn.click();
        }
    });
}
