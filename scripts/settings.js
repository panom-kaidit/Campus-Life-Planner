/* =========================================
   SETTINGS.JS
   -----------------------------------------
   Saves user settings
   ========================================= */

const SETTINGS_KEY = "campus_settings";

/* Load settings */
export function loadSettings() {
  const data = localStorage.getItem(SETTINGS_KEY);

  if (data) {
    return JSON.parse(data);
  }

  return {
    unit: "minutes",
    cap: null
  };
}

/* Save settings */
export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
