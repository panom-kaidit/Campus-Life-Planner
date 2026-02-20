// Import necessary functions
import { getReflectionStreak } from "./reflection.js";
import { addRecord, deleteRecord, updateRecord, records } from "./state.js";
import { renderRecords, renderDashboard, sortRecords } from "./ui.js";
import { compileRegex } from "./search.js";
import {
  validateTitle,
  validateDuration,
  validateDate,
  validateTag,
} from "./validators.js";
import { loadSettings, saveSettings } from "./settings.js";
import { saveToStorage } from "./storage.js";

/* ================= ADD PAGE DROPDOWN ================= */

const taskType = document.getElementById("taskType");
const sections = document.querySelectorAll(".task-section");
const defaultTask = document.getElementById("defaultTask");

if (taskType) {
  // Initial state on page load
  sections.forEach(section => {
    section.style.display = "none";
  });
  if (defaultTask) defaultTask.style.display = "block";

  // When dropdown changes
  taskType.addEventListener("change", () => {
    // Hide everything first
    sections.forEach(section => {
      section.style.display = "none";
    });

    // If nothing selected → show quick add
    if (!taskType.value) {
      if (defaultTask) defaultTask.style.display = "block";
      return;
    }

    // Hide quick add
    if (defaultTask) defaultTask.style.display = "none";

    // Show selected section
    const selected = document.getElementById(taskType.value + "-section");
    if (selected) {
      selected.style.display = "block";
    }
  });
}
// Load settings from localStorage
let settings = loadSettings();

// ---------------- DASHBOARD PAGE ----------------
if (document.getElementById("stat-total")) {
  renderDashboard(records, settings.unit, settings.cap);

  const streakEl = document.getElementById("streakCount");
  if (streakEl && typeof getReflectionStreak === "function") {
    streakEl.textContent = getReflectionStreak();
  }
}

// ---------------- RECORDS PAGE ----------------
if (document.getElementById("records-container")) {
  renderRecords();
  // EXPORT TASKS
  const exportBtn = document.getElementById("export-btn");

  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      const dataStr = JSON.stringify(records, null, 2);

      const blob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "campus_tasks.json";
      a.click();

      URL.revokeObjectURL(url);
    });
  }
  // IMPORT TASKS
  const importFile = document.getElementById("import-file");

  if (importFile) {
    importFile.addEventListener("change", function (event) {
      const file = event.target.files[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = function (e) {
        try {
          const importedData = JSON.parse(e.target.result);

          if (!Array.isArray(importedData)) {
            alert("Invalid JSON format!");
            return;
          }

          // Merge imported records
          importedData.forEach(function (record) {
            if (
              record.id &&
              record.title &&
              record.duration &&
              record.tag &&
              record.dueDate
            ) {
              records.push(record);
            }
          });

          saveToStorage(records);
          renderRecords();

          alert("Tasks imported successfully!");
        } catch (error) {
          alert("Invalid JSON file!");
        }
      };

      reader.readAsText(file);
    });
  }

  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");

  // Live search
  searchInput.addEventListener("input", function () {
    const regex = compileRegex(searchInput.value);
    renderRecords(regex);
  });

  // Sorting
  sortSelect.addEventListener("change", function () {
    sortRecords(sortSelect.value);
    saveToStorage(records);
    renderRecords();
  });

  // Delete button and aedit button
  document
    .getElementById("records-container")
    .addEventListener("click", function (e) {
      const id = e.target.dataset.id;

      if (e.target.classList.contains("delete-btn")) {
        deleteRecord(id);
        renderRecords();
      }

      if (e.target.classList.contains("edit-btn")) {
        const record = records.find(function (r) {
          return r.id === id;
        });

        if (record) {
          // Save record to localStorage temporarily
          localStorage.setItem("editing_record", JSON.stringify(record));
          window.location.href = "add.html";
        }
      }
    });
}

// ---------------- ADD PAGE ----------------
const form = document.getElementById("task-form");

if (form) {
  const editingData = localStorage.getItem("editing_record");
  let editingRecord = null;

  if (editingData) {
    editingRecord = JSON.parse(editingData);

    // Prefill form
    document.getElementById("title").value = editingRecord.title;
    document.getElementById("duration").value = editingRecord.duration;
    document.getElementById("tag").value = editingRecord.tag;
    document.getElementById("dueDate").value = editingRecord.dueDate;

    form.querySelector("button").textContent = "Update Task";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const duration = document.getElementById("duration").value.trim();
    const tag = document.getElementById("tag").value.trim();
    const dueDate = document.getElementById("dueDate").value;

    const titleError = validateTitle(title);
    const durationError = validateDuration(duration);
    const tagError = validateTag(tag);
    const dateError = validateDate(dueDate);

    document.getElementById("title-error").textContent = titleError;
    document.getElementById("duration-error").textContent = durationError;
    document.getElementById("tag-error").textContent = tagError;
    document.getElementById("date-error").textContent = dateError;

    if (titleError || durationError || tagError || dateError) {
      return;
    }

    if (editingRecord) {
      updateRecord({
        id: editingRecord.id,
        title: title,
        duration: Number(duration),
        tag: tag,
        dueDate: dueDate,
        createdAt: editingRecord.createdAt,
        updatedAt: new Date().toISOString(),
      });

      localStorage.removeItem("editing_record");

      alert("Task updated successfully!");
      window.location.href = "records.html";
    } else {
      addRecord({
        id: "rec_" + Date.now(),
        title: title,
        duration: Number(duration),
        tag: tag,
        dueDate: dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      alert("Task added successfully!");
      window.location.href = "index.html";
    }
  });
}

// ---------------- SETTINGS PAGE ----------------
const unitToggle = document.getElementById("unit-toggle");
const capInput = document.getElementById("cap");

if (unitToggle) {
  unitToggle.value = settings.unit;

  unitToggle.addEventListener("change", function () {
    settings.unit = unitToggle.value;
    saveSettings(settings);
  });
}

if (capInput) {
  capInput.value = settings.cap || "";

  capInput.addEventListener("input", function () {
    settings.cap = capInput.value ? Number(capInput.value) : null;
    saveSettings(settings);
  });
}

// ---------------- ASSIGNMENT FORM ----------------
const assignmentForm = document.getElementById("assignment-form");

if (assignmentForm) {
  assignmentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("assignment-title").value.trim();
    const course = document.getElementById("assignment-course").value.trim();
    const dueDate = document.getElementById("assignment-date").value;

    if (!title || !course || !dueDate) {
      alert("Please fill all fields.");
      return;
    }

    addRecord({
      id: "rec_" + Date.now(),
      type: "assignment",
      title: title,
      duration: 0,
      tag: "Assignment",
      dueDate: dueDate,
      extra: {
        courseCode: course
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
      alert("Assignment added!");
      assignmentForm.reset();
      renderTodayUpcomingFromRecords();
      renderDashboard(records, settings.unit, settings.cap);
  });
}

const scheduleForm = document.getElementById("schedule-form");

if (scheduleForm) {
  scheduleForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("schedule-title").value.trim();
    const day = document.getElementById("schedule-day").value;
    const start = document.getElementById("schedule-start").value;
    const end = document.getElementById("schedule-end").value;

    if (!title || !day || !start || !end) {
      alert("Please fill all fields.");
      return;
    }

    addRecord({
      id: "rec_" + Date.now(),
      type: "schedule",
      title: title,
      duration: 0,
      tag: "Schedule",
      dueDate: "",
      extra: {
        day,
        start,
        end
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    alert("schedule added!");
    scheduleForm.reset();
    renderTodayUpcomingFromRecords();
    renderDashboard(records, settings.unit, settings.cap);
  });
}

const eventForm = document.getElementById("event-form");

if (eventForm) {
  eventForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("event-title").value.trim();
    const date = document.getElementById("event-date").value;
    const start = document.getElementById("event-start").value;
    const end = document.getElementById("event-end").value;

    if (!title || !date || !start || !end) {
      alert("Please fill all fields.");
      return;
    }

    addRecord({
      id: "rec_" + Date.now(),
      type: "event",
      title: title,
      duration: 0,
      tag: "Event",
      dueDate: date,
      extra: {
        start,
        end
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    alert("event added!");
    eventForm.reset();
    renderTodayUpcomingFromRecords();
    renderDashboard(records, settings.unit, settings.cap);
  });
}

const classForm = document.getElementById("class-form");

if (classForm) {
  classForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("class-name").value.trim();
    const instructor = document.getElementById("class-instructor").value.trim();
    const room = document.getElementById("class-room").value.trim();

    if (!name || !instructor || !room) {
      alert("Please fill all fields.");
      return;
    }

    addRecord({
      id: "rec_" + Date.now(),
      type: "class",
      title: name,
      duration: 0,
      tag: "Class",
      dueDate: "",
      extra: {
        instructor,
        room
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    alert("class added!");
    classForm.reset()
    renderTodayUpcomingFromRecords();
    renderDashboard(records, settings.unit, settings.cap);
  });
}

/* =====================================
   DASHBOARD TODAY UPCOMING (FIXED)
===================================== */

function isToday(dateString) {
  const today = new Date().toISOString().split("T")[0];
  return dateString === today;
}

function renderTodayUpcomingFromRecords() {

  // Only run on dashboard
  if (!document.getElementById("today-assignments")) return;

  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  const todayDayName = today.toLocaleDateString("en-US", { weekday: "long" });

  const assignmentsContainer = document.getElementById("today-assignments");
  const classesContainer = document.getElementById("today-classes");
  const eventsContainer = document.getElementById("today-events");

  assignmentsContainer.innerHTML = "";
  classesContainer.innerHTML = "";
  eventsContainer.innerHTML = "";

  const now = new Date();

  // FILTER ASSIGNMENTS (by dueDate)
  const assignments = records.filter(record =>
    record.type === "assignment" &&
    record.dueDate === todayDate
  );

  // FILTER EVENTS (by dueDate and time)
  const events = records.filter(record =>
    record.type === "event" &&
    record.dueDate === todayDate
  );

  // FILTER SCHEDULE (by day of week)
  const schedules = records.filter(record =>
    record.type === "schedule" &&
    record.extra?.day === todayDayName
  );

  // FILTER CLASSES (no date system yet, so show all)
  const classes = records.filter(record =>
    record.type === "class"
  );

  /* ---------- DISPLAY FUNCTION ---------- */

  function display(container, list, formatter) {
    if (!list.length) {
      container.innerHTML = "<p>No upcoming items.</p>";
      return;
    }

    container.innerHTML = list.map(formatter).join("");
  }

  /* ---------- DISPLAY ASSIGNMENTS ---------- */

  display(assignmentsContainer, assignments, record => `
    <div class="upcoming-item">
      <strong>${record.title}</strong><br>
      <small>Course: ${record.extra?.courseCode || "-"}</small><br>
      <small>Due: ${record.dueDate}</small>
    </div>
  `);

  /* ---------- DISPLAY EVENTS ---------- */

  display(eventsContainer, events, record => `
    <div class="upcoming-item">
      <strong>${record.title}</strong><br>
      <small>${record.extra?.start || ""} - ${record.extra?.end || ""}</small><br>
      <small>Date: ${record.dueDate}</small>
    </div>
  `);

  /* ---------- DISPLAY SCHEDULE ---------- */

  display(classesContainer, schedules, record => `
    <div class="upcoming-item">
      <strong>${record.title}</strong><br>
      <small>${record.extra?.start} - ${record.extra?.end}</small><br>
      <small>Day: ${record.extra?.day}</small>
    </div>
  `);

}

renderTodayUpcomingFromRecords();