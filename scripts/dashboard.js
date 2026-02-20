/* ========================================
   DASHBOARD LOGIC
   Beginner friendly version
======================================== */

/* Show current date */
const dateElement = document.getElementById("currentDate");
const today = new Date();
dateElement.textContent = today.toDateString();

/* Get stored data */
const classes = JSON.parse(localStorage.getItem("campus_records")) || [];
const reflections = JSON.parse(localStorage.getItem("campus_reflections")) || {};
const diary = JSON.parse(localStorage.getItem("campus_diary")) || [];

/* -------------------------
   TODAY'S CLASSES
-------------------------- */

const todayString = today.toISOString().split("T")[0];

const todayClasses = classes.filter(cls =>
  cls.type === "class" &&
  cls.dueDate === todayString
);
document.getElementById("todayClassCount").textContent = todayClasses.length;

const todayClassesContainer = document.getElementById("todayClasses");

if (todayClasses.length > 0) {
    todayClassesContainer.innerHTML = "";

    todayClasses.forEach(cls => {
        const p = document.createElement("p");
        p.textContent = cls.title;
        todayClassesContainer.appendChild(p);
    });
}

/* -------------------------
   REFLECTION STATUS
-------------------------- */

if (reflections[todayString]) {
    document.getElementById("reflectionStatus").textContent = "Completed";

    document.getElementById("reflectionPreview").innerHTML =
        "<p>Reflection saved for today ✔</p>";
}

/* -------------------------
   DIARY
-------------------------- */

document.getElementById("diaryCount").textContent = diary.length;
document.getElementById("totalDiaryEntries").textContent = diary.length;

/* -------------------------
   TOTAL CLASSES
-------------------------- */

document.getElementById("totalClasses").textContent = classes.length;

/* -------------------------
   REFLECTIONS THIS WEEK
-------------------------- */

let weekCount = 0;

for (let key in reflections) {
    const reflectionDate = new Date(key);
    const diff = (today - reflectionDate) / (1000 * 60 * 60 * 24);

    if (diff <= 7 && diff >= 0) {
        weekCount++;
    }
}

document.getElementById("weekReflections").textContent = weekCount;

/* -------------------------
   SIMPLE STREAK COUNT
-------------------------- */

let streak = 0;
let checkDate = new Date();

while (true) {
    const key = checkDate.toISOString().split("T")[0];

    if (reflections[key]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
    } else {
        break;
    }
}

document.getElementById("reflectionStreak").textContent = streak;
