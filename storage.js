const STORAGE_KEYS = {
    SETTINGS: 'zephyr_user_settings',
    LOGS: 'zephyr_health_logs'
};

function saveSettings(settingsObj) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settingsObj));
}

function loadSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
}


function saveLog(dateString, logData) {
    const allLogs = loadAllLogs()
    allLogs[dateString] = logData;
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(allLogs));
}

function loadAllLogs(){
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : {};
}

function loadLogForDate(dateString) {
    const allLogs = loadAllLogs();
    return allLogs[dateString] || null;
}

function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function logControllerToday(){
    const dateStr = getTodayDateString();
    const log = loadLogForDate(dateStr) || { controllerTaken: false, relieverUsed: false, symptom: null};
    log.controllerTaken = true;
    saveLog(dateStr, log);
    if (typeof renderCalendar === 'function') renderCalendar();
}

function logRelieverToday(){
    const dateStr = getTodayDateString();
    const log = loadLogForDate(dateStr) || { controllerTaken: false, relieverUsed: false, symptom: null};
    log.relieverUsed = true;
    saveLog(dateStr, log);
    if (typeof renderCalendar === 'function') renderCalendar();
}

function logSymptomToday(level){
    const dateStr = getTodayDateString();
    const log = loadLogForDate(dateStr) || { controllerTaken: false, relieverUsed: false, symptom: null};
    log.symptom = level;
    saveLog(dateStr, log);
    if (typeof renderCalendar === 'function') renderCalendar();
}

document.addEventListener('DOMContentLoaded', () => {
    const setupForm = document.getElementById('setup-form');
    const onboardingScreen = document.getElementById('onboarding-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const appScreen = document.getElementById('app-screen');
    const resetBtn = document.getElementById('reset-data-btn');
    const profileInfoDisplay = document.getElementById('settings-profile-info');
    const settingsNavBtn = document.getElementById('nav-settings-btn');
    const usePreventer = document.getElementById('use-preventer');
    const preventerInput = document.getElementById('preventer-name');
    if (usePreventer && preventerInput) {
        preventerInput.style.display = 'none';
        usePreventer.addEventListener('change', (e) => {
            preventerInput.style.display = e.target.checked ? 'block' : 'none';
        });
    }

    const useRescue = document.getElementById('use-rescue');
    const relieverInput = document.getElementById('reliever-name');
    if (useRescue) {
        relieverInput.style.display = 'none';
        useRescue.addEventListener('change', (e) => {
            relieverInput.style.display = e.target.checked ? 'block' : 'none';
        });
    }

    const logControllerBtn = document.getElementById('log-controller');
    if (logControllerBtn) {
        logControllerBtn.addEventListener('click', () => {
            logControllerToday();
            alert('preventer logged for today!! :)');
        });
    }

    const logRelieverBtn = document.getElementById('log-reliever');
    if (logRelieverBtn) {
        logRelieverBtn.addEventListener('click', () => {
            logRelieverToday();
            alert('rescue inhaler logged!');
        });
    }

    document.querySelectorAll('.symptom-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const level = e.target.getAttribute('data-level');
            logSymptomToday(level);
            alert(`symptom recorded: ${level}`);
        });
    });

    const savedData = loadSettings();

    if (loadingScreen) {
        loadingScreen.classList.add('active');
        loadingScreen.style.display = "flex";
    }

    if (onboardingScreen) {
        onboardingScreen.classList.remove('active');
        onboardingScreen.style.display = 'none';
    }

    if (appScreen) {
        appScreen.classList.remove('active');
        appScreen.style.display = 'none';
    }

    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
            loadingScreen.style.display = 'none';
        }
        if (savedData && savedData.asthmaType) {
            if (appScreen) {
                appScreen.classList.add('active');
                appScreen.style.display = 'block';
            }
            populateSettings(savedData);
        }
        else {
            if (onboardingScreen) {
                onboardingScreen.classList.add('active');
                onboardingScreen.style.display = 'block';
            }
        }
    }, 2000);

    if (settingsNavBtn) {
        settingsNavBtn.addEventListener('click', () => {
            const currentData = loadSettings();
            if (currentData) {
                populateSettings(currentData);
            }
        });
    }


    if (setupForm) {
        setupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const asthmaType = document.querySelector('input[name="asthma-type"]:checked')?.value || 'not specified';
            const hasPreventer = usePreventer?.checked || false;
            const preventerName = preventerInput?.value || 'None';
            const hasRescue = useRescue?.checked || false;
            const relieverName = relieverInput?.value || 'None';

            const userData = {
                asthmaType,
                hasPreventer,
                preventerName: hasPreventer ? preventerName : 'None',
                hasRescue,
                relieverName: hasRescue ? relieverName : 'None'
            };

            saveSettings(userData);
            if (onboardingScreen){
                onboardingScreen.classList.remove('active');
                onboardingScreen.style.display = 'none';
            }

            if (appScreen){
                appScreen.classList.add('active');
                appScreen.style.display = 'block';
            }
            populateSettings(userData);
        });
    }

    function populateSettings(data){
        if (!profileInfoDisplay) return;
        profileInfoDisplay.innerHTML = `
            <b>Asthma Type:</b> ${data.asthmaType}<br>
            <b>Preventer:</b> ${data.hasPreventer ? data.preventerName : 'None'}<br>
            <b>Rescue Inhaler:</b> ${data.hasRescue ? data.relieverName : 'None'}
        `;
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('are you sure you want to reset all data and restart setup?')){
                localStorage.clear();
                location.reload();
            }
        });
    }

});
