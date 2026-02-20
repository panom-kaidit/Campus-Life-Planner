/* =========================================
   STATE.JS
   -----------------------------------------
   Controls application data (records array)
   ========================================= */

import { saveToStorage, loadFromStorage } from "./storage.js";

/* Load records when page loads */
export let records = loadFromStorage();


/* Add a new record */
export function addRecord(record) {
  records.push(record);
  saveToStorage(records);
}


/* Delete a record */
export function deleteRecord(id) {
  const index = records.findIndex(r => r.id === id);
  if (index !== -1) {
    records.splice(index, 1);
  }
  saveToStorage(records);
}
/* Update existing record */
export function updateRecord(updatedRecord) {
  const index = records.findIndex(r => r.id === updatedRecord.id);
  if (index !== -1) {
    records[index] = updatedRecord;
  }
  saveToStorage(records);
}
