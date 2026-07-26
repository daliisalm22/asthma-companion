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

        if (targetViewId === "view-attack") {
            startLiquidBreathing();
        }
        else{
            stopLiquidBreathing();
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

let breathingIntervalId = null;

function startLiquidBreathing(){
    const instructionEl = document.getElementById("breath-instruction");
    if(!instructionEl) return;

    const totalDurationMs = 8000;

    function runCycle(){
        instructionEl.textContent = "breathe in slowly...";

        setTimeout(() => {
            instructionEl.textContent = "hold...";
        }, totalDurationMs * 0.375);

        setTimeout(() => {
            instructionEl.textContent = "breathe out gently...";
        }, totalDurationMs * 0.625);
    }

    if (breathingIntervalId) clearInterval(breathingIntervalId);
    runCycle();
    breathingIntervalId = setInterval(runCycle, totalDurationMs);
}

function stopLiquidBreathing() {
    if (breathingIntervalId){
        clearInterval(breathingIntervalId);
        breathingIntervalId = null;
    }
}

const editDashboardBtn = document.getElementById("edit-dashboard-btn");
const dashboardGrid = document.getElementById("dashboard-grid");
const dashboardInstructions = document.getElementById("dashboard-instructions");

let isEditingDashboard = false;
let selectedForSwap = null;

function saveCardOrder() {
    if (!dashboardGrid) return;
    const cards = Array.from(dashboardGrid.querySelectorAll(".dash-card"));
    const cardClasses = cards.map(card => {
        if (card.classList.contains("attack-card")) return "attack-card";
        if (card.querySelector("h3")) return card.querySelector("h3").textContent;
        return "card";
    });
    localStorage.setItem("dashboard_card_order", JSON.stringify(cardClasses));
}

function loadCardOrder(){
    if (!dashboardGrid) return;
    const savedOrder = JSON.parse(localStorage.getItem("dashboard_card_order"));
    if(!savedOrder) return;

    const cards = Array.from(dashboardGrid.querySelectorAll(".dash-card"));

    savedOrder.forEach(identifier => {
        const cardToMove = cards.find(card => {
            if (identifier === "attack-card") return card.classList.contains("attack-card");
            const h3 = card.querySelector("h3");
            return h3 && h3.textContent == identifier;
        });
        if (cardToMove) {
            dashboardGrid.appendChild(cardToMove);
        }
    });
}

loadCardOrder();

if (editDashboardBtn && dashboardGrid) {
    editDashboardBtn.addEventListener("click", () => {
        isEditingDashboard = !isEditingDashboard;
        dashboardGrid.classList.toggle("is-editing", isEditingDashboard);
        editDashboardBtn.textContent = isEditingDashboard ? "Done" : "Edit";

        if (dashboardInstructions){
            dashboardInstructions.style.display = isEditingDashboard ? "block" : "none";
        }

        if (!isEditingDashboard && selectedForSwap) {
            selectedForSwap.style.outline = "";
            selectedForSwap = null;
        }
    });

    dashboardGrid.addEventListener("click", (e) => {
        if (!isEditingDashboard) return;
        const card = e.target.closest(".dash-card");

        if(!card || card.classList.contains("attack-card")) return;

        if(!selectedForSwap){
            selectedForSwap = card;
            card.style.outline = "3px dashed #ffffff";
            card.style.outlineOffset = "4px";
        }
        else if (selectedForSwap == card) {
            card.style.outline = "";
            selectedForSwap = null;
        }
        else{
            const temp = document.createElement("div");
            dashboardGrid.insertBefore(temp, card);
            dashboardGrid.insertBefore(card, selectedForSwap);
            dashboardGrid.insertBefore(selectedForSwap, temp);
            temp.remove();

            selectedForSwap.style.outline = "";
            selectedForSwap = null;

            saveCardOrder();
        }
    });
}
