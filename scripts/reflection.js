/* ======================================
   GLOBAL VARIABLES
====================================== */

const STORAGE_KEY = "campus_reflections";
let currentDate = new Date();

/* ======================================
   DATE HELPERS
====================================== */

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function displayDate(date) {
  return date.toDateString();
}

/* ======================================
   STORAGE FUNCTIONS
====================================== */

function loadReflections() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function saveReflections(reflections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reflections));
}

/* ======================================
   STREAK CALCULATION (SAFE FOR ALL PAGES)
====================================== */

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

/* ======================================
   EXPORT FOR OTHER FILES
====================================== */

export function getReflectionStreak() {
  return calculateStreak();
}

/* ======================================
   ONLY RUN BELOW IF REFLECTION PAGE EXISTS
====================================== */

const reflectionPage = document.getElementById("reflectionForm");

if (reflectionPage) {

  function loadReflectionForDate(date) {
    const reflections = loadReflections();
    const key = formatDate(date);
    const reflection = reflections[key];

    document.getElementById("learned").value = reflection?.learned || "";
    document.getElementById("challenges").value = reflection?.challenges || "";
    document.getElementById("grateful").value = reflection?.grateful || "";
    document.getElementById("additionalNotes").value = reflection?.additionalNotes || "";
    document.getElementById("mood").value = reflection?.mood || "";

    document.getElementById("reflectionDate").textContent = displayDate(date);

    const todayIndicator = document.getElementById("todayIndicator");
    todayIndicator.style.display =
      formatDate(date) === formatDate(new Date())
        ? "inline-block"
        : "none";

    document.getElementById("formTitle").textContent =
      reflection ? "Edit Reflection" : "New Reflection";
  }

  reflectionPage.addEventListener("submit", function (e) {
    e.preventDefault();

    const reflections = loadReflections();
    const key = formatDate(currentDate);

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

    renderReflectionHistory();
    updateStreakDisplay();
  });

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

  function renderReflectionHistory() {
    const reflections = loadReflections();
    const container = document.getElementById("reflectionHistory");

    const dates = Object.keys(reflections).sort().reverse();

    if (!dates.length) {
      container.innerHTML = "<p>No reflections yet.</p>";
      return;
    }

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

      tableHTML += `
        <tr class="history-row" data-date="${date}">
          <td>${date}</td>
          <td>${reflection.mood || "—"}</td>
          <td>${(reflection.learned || "").substring(0, 40)}...</td>
          <td>${reflection.updatedAt
            ? new Date(reflection.updatedAt).toLocaleDateString()
            : "—"}</td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;

    document.querySelectorAll(".history-row")
      .forEach(row => {
        row.addEventListener("click", function () {
          currentDate = new Date(this.dataset.date);
          loadReflectionForDate(currentDate);
        });
      });
  }

  function updateStreakDisplay() {
    const streakElement = document.getElementById("streakCount");
    if (streakElement) {
      streakElement.textContent = calculateStreak();
    }
  }

  loadReflectionForDate(currentDate);
  renderReflectionHistory();
  updateStreakDisplay();
}