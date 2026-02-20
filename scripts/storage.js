/* =========================================
   STORAGE.JS
   -----------------------------------------
   Handles saving and loading from localStorage
   ========================================= */

const STORAGE_KEY = "campus_records";

/* Save records to localStorage */
export function saveToStorage(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/* Load records from localStorage */
export function loadFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
}
