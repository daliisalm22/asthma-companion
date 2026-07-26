let currentDate = new Date();

function renderCalendar(){
    const grid = document.getElementById("calendar-grid");
    const monthYearDisplay = document.getElementById("month-year-display");

    if (!grid || !monthYearDisplay) return;
    
    grid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
            dayCell.classList.add("selected");
        }

        if (allLogs[dateStr]) {
            dayCell.classList.add("has-log");
        }
        const dayTriggers = typeof getTriggersForDate === 'function' ? getTriggersForDate(dateStr) : [];
        if (dayTriggers.length > 0) {
            dayCell.classList.add("has-log");
            const triggerBadge = document.createElement("span");
            triggerBadge.className = "calendar-trigger-badge";
            triggerBadge.textContent = "";
            triggerBadge.title = `Triggers: ${dayTriggers.join(', ')}`;
            dayCell.appendChild(triggerBadge);
        }

        dayCell.addEventListener("click", () => {
            document.querySelectorAll('.calendar-day').forEach(cell => {
                cell.classList.remove('selected');
            });
            dayCell.classList.add('selected');
            openDayModal(dateStr, allLogs[dateStr], dayTriggers);
        });

        grid.append(dayCell);
    }

    const now = new Date();
    const curMonth = String(now.getMonth() + 1). padStart(2, '0');
    const curDay = String(now.getDate()).padStart(2, '0');
    const todayStr = `${now.getFullYear()}-${curMonth}-${curDay}`;
    const todayTriggers = typeof getTriggersForDate === 'function' ? getTriggersForDate(todayStr) : [];

    if (year === now.getFullYear() && month === now.getMonth()) {
        const allCells = grid.querySelectorAll('.calendar-day:not(.empty');
        allCells.forEach(cell => {
            if (cell.textContent == now.getDate()) {
                cell.classList.add('selected');
            }
        });
        openDayModal(todayStr, allLogs[todayStr], todayTriggers);
    }
    else{
        openDayModal(todayStr, allLogs[todayStr], todayTriggers);
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

function openDayModal(dateStr, logData, triggersData){
    const title = document.getElementById("modal-date-title");
    const details = document.getElementById("modal-log-details");

    if (title){
        title.textContent = `log for ${dateStr}`;
    }

    if (details){
        const hasLog = logData || (triggersData && triggersData.length > 0);
        if (hasLog) {
            const controller = logData && logData.controllerTaken ? 'yes' : 'no';
            const reliever = logData && logData.relieverUsed ? 'yes' : 'no';
            const symptom = logData && logData.symptom ? logData.symptom : 'none recorded';
            const triggersFormatted = (triggersData && triggersData.length > 0) ? triggersData.join(', ') : 'none logged';

            details.innerHTML = `
                <b>Controller Taken:</b> ${controller}<br>
                <b>Rescue Inhaler Used:</b> ${reliever}<br>
                <b>Symptoms:</b> ${symptom}<br>
                <b>Triggers:</b> ${triggersFormatted}
            `;
        }
        else {
            details.textContent = "no data recorded for this day.";
        } 
    }
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