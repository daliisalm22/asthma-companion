let currentDate = new Date();

function renderCalendar(){
    const grid = document.getElementById("calendar-grid");
    const monthYearDisplay = document.getElementById("month-year-display");

    if (!grid || !monthYearDisplay) return;
    
    grid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Decemeber"];
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    let firstDayIndex = new Date(year, month, 1).getDay();
    firstDayIndex = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;
    const totalDays = new Date(year, month + 1, 0).getDate();
    const allLogs = typeof loadAllLogs === 'function' ? loadAllLogs() : {};

    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("calendar-day", "empty");
        grid.appendChild(emptyCell);
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("calendar-day");
        dayCell.textContent = day;

        const formattedMonth = String(month + 1).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

        const today = new Date();
        if (day === today.getDate() && month == today.getMonth() && year === today.getFullYear()){
            dayCell.classList.add("today");
        }

        if (allLogs[dateStr]) {
            dayCell.classList.add("has-log");
        }

        dayCell.addEventListener("click", () => {
            openDayModal(dateStr, allLogs[dateStr]);
        });

        grid.append(dayCell);
    }
}

const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

if(prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

function openDayModal(dateStr, logData){
    const modal = document.getElementById("day-modal");
    const title = document.getElementById("modal-date-title");
    const details = document.getElementById("modal-log-details");

    if (!modal) return;

    title.textContent = `Log for ${dateStr}`;
    if (logData) {
        details.innerHTML = `
            <p><strong>controller taken:</strong> ${logData.controllerTaken ? 'yes' : 'no'}</p>
            <p><strong>Time:</strong> ${logData.timestamp || 'N/A'}</p>
        `;
    }
    else {
        details.textContent = "no data recorded for this day.";
    }

    modal.classList.remove("hidden");
}

const closeModalBtn = document.getElementById("close-modal-btn");
if (closeModalBtn){
    closeModalBtn.addEventListener("click", () => {
        document.getElementById("day-modal").classList.add("hidden");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderCalendar();
});