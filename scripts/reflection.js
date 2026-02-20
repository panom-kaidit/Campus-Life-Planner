/* ======================================
   REFLECTION.JS
   --------------------------------------
   This file handles:
   - Saving daily reflections
   - Loading reflections by date
   - Navigation between days
   - Reflection history list
   - Streak calculation
   - Exporting reflections
   ====================================== */

/* ==========================
   GLOBAL VARIABLES
   ========================== */

// Key used to store reflections in localStorage
const STORAGE_KEY = "campus_reflections";

// Current selected date
let currentDate = new Date();


/* ==========================
   DATE HELPERS
   ========================== */

// Convert date to YYYY-MM-DD format
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// Display readable date (e.g. Tue Feb 20 2026)
function displayDate(date) {
  return date.toDateString();
}


/* ==========================
   STORAGE FUNCTIONS
   ========================== */

// Load all reflections from localStorage
function loadReflections() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

// Save reflections back to localStorage
function saveReflections(reflections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reflections));
}


/* ==========================
   LOAD REFLECTION FOR DATE
   ========================== */

function loadReflectionForDate(date) {

  const reflections = loadReflections();
  const key = formatDate(date);
  const reflection = reflections[key];

  // Fill form fields safely
  document.getElementById("learned").value = reflection?.learned || "";
  document.getElementById("challenges").value = reflection?.challenges || "";
  document.getElementById("grateful").value = reflection?.grateful || "";
  document.getElementById("additionalNotes").value = reflection?.additionalNotes || "";
  document.getElementById("mood").value = reflection?.mood || "";

  // Update displayed date
  document.getElementById("reflectionDate").textContent = displayDate(date);

  // Show "Today" badge if applicable
  const todayIndicator = document.getElementById("todayIndicator");
  if (formatDate(date) === formatDate(new Date())) {
    todayIndicator.style.display = "inline-block";
  } else {
    todayIndicator.style.display = "none";
  }

  // Change title
  document.getElementById("formTitle").textContent =
    reflection ? "Edit Reflection" : "New Reflection";
}


/* ==========================
   SAVE REFLECTION
   ========================== */

document.getElementById("reflectionForm")
.addEventListener("submit", function (e) {

  e.preventDefault();

  const reflections = loadReflections();
  const key = formatDate(currentDate);

  // Save reflection data
  reflections[key] = {
    learned: document.getElementById("learned").value,
    challenges: document.getElementById("challenges").value,
    grateful: document.getElementById("grateful").value,
    additionalNotes: document.getElementById("additionalNotes").value,
    mood: document.getElementById("mood").value,
    updatedAt: new Date().toISOString()
  };

  saveReflections(reflections);

  alert("Reflection saved successfully!");

  // Refresh history & streak
  renderReflectionHistory();
  updateStreakDisplay();
});


/* ==========================
   NAVIGATION BUTTONS
   ========================== */

document.getElementById("prevDayBtn")
.addEventListener("click", function () {
  currentDate.setDate(currentDate.getDate() - 1);
  loadReflectionForDate(currentDate);
});

document.getElementById("nextDayBtn")
.addEventListener("click", function () {
  currentDate.setDate(currentDate.getDate() + 1);
  loadReflectionForDate(currentDate);
});

document.getElementById("todayBtn")
.addEventListener("click", function () {
  currentDate = new Date();
  loadReflectionForDate(currentDate);
});

/* ==========================
   REFLECTION HISTORY (TABLE VIEW)
   ========================== */

function renderReflectionHistory() {

  const reflections = loadReflections();
  const container = document.getElementById("reflectionHistory");

  const dates = Object.keys(reflections).sort().reverse();

  if (!dates.length) {
    container.innerHTML = "<p>No reflections yet.</p>";
    return;
  }

  // Create table structure
  let tableHTML = `
    <table class="reflection-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Mood</th>
          <th>Learned</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
  `;

  dates.forEach(date => {

    const reflection = reflections[date];

    const learnedText = reflection.learned || "";
    const preview = learnedText.substring(0, 40) + "...";

    const mood = reflection.mood || "—";

    const updated = reflection.updatedAt
      ? new Date(reflection.updatedAt).toLocaleDateString()
      : "—";

    tableHTML += `
      <tr class="history-row" data-date="${date}">
        <td>${date}</td>
        <td>${mood}</td>
        <td>${preview}</td>
        <td>${updated}</td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  container.innerHTML = tableHTML;

  // Add click event to each row
  document.querySelectorAll(".history-row")
    .forEach(row => {
      row.addEventListener("click", function () {
        currentDate = new Date(this.dataset.date);
        loadReflectionForDate(currentDate);
      });
    });
}
/* ==========================
   STREAK CALCULATION
   ========================== */

function calculateStreak() {

  const reflections = loadReflections();
  let streak = 0;
  let current = new Date();

  while (true) {
    const key = formatDate(current);

    if (reflections[key]) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// Update streak on screen
function updateStreakDisplay() {

  const streakElement = document.getElementById("streakCount");
  if (!streakElement) return;

  streakElement.textContent = calculateStreak();
}


/* ==========================
   EXPORT REFLECTIONS
   ========================== */

document.getElementById("exportReflections")
.addEventListener("click", function () {

  const data = JSON.stringify(loadReflections(), null, 2);

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "reflections.json";
  a.click();

  URL.revokeObjectURL(url);
});


/* ==========================
   INITIAL LOAD
   ========================== */

loadReflectionForDate(currentDate);
renderReflectionHistory();
updateStreakDisplay();