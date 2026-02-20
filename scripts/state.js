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

  records = records.filter(function (record) {
    return record.id !== id;
  });

  saveToStorage(records);
}
/* Update existing record */
export function updateRecord(updatedRecord) {

  records = records.map(function (record) {

    if (record.id === updatedRecord.id) {
      return updatedRecord;
    }

    return record;
  });

  saveToStorage(records);
}
