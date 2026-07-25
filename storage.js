const STORAGE_KEYS = {
    SETTINGS: 'zephyr_user_settings',
    LOGS: 'zephyr_health_logs'
};

function saveSettings(settingsObj) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settingsObj));
}

function loadSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {name: '', reminders: true, theme: 'light'};
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
