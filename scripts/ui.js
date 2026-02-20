import { records } from "./state.js";
import { highlight } from "./search.js";
import { calculateStats } from "./stats.js";

export function renderRecords(searchRegex = null) {

  let filtered = records;

  if (searchRegex) {
    filtered = records.filter(r =>
      searchRegex.test(r.title) ||
      searchRegex.test(r.tag)
    );
  }

  const container = document.getElementById("records-container");

  if (!filtered.length) {
    container.innerHTML = "<p>No tasks found.</p>";
    return;
  }

  container.innerHTML = `
  <table>
    <thead>
      <tr>
        <th>Type</th>
        <th>Title</th>
        <th>Duration</th>
        <th>Date</th>
        <th>Details</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${filtered.map(r => {

        let details = "";

        if (r.type === "assignment") {
          details = `Course: ${r.extra?.courseCode || ""}`;
        }

        if (r.type === "schedule") {
          details = `
            Day: ${r.extra?.day || ""}<br>
            ${r.extra?.start || ""} - ${r.extra?.end || ""}
          `;
        }

        if (r.type === "event") {
          details = `
            ${r.extra?.start || ""} - ${r.extra?.end || ""}
          `;
        }

        if (r.type === "class") {
          details = `
            Instructor: ${r.extra?.instructor || ""}<br>
            Room: ${r.extra?.room || ""}
          `;
        }

        if (!r.type || r.type === "quick") {
          details = `Tag: ${r.tag}`;
        }

        return `
        <tr>
          <td><span class="badge">${r.type || "quick"}</span></td>
          <td>${highlight(r.title, searchRegex)}</td>
          <td>${r.duration || 0}</td>
          <td>${r.dueDate || "-"}</td>
          <td>${details}</td>
          <td>
            <button class="edit-btn" data-id="${r.id}">Edit</button>
            <button class="delete-btn" data-id="${r.id}">Delete</button>
          </td>
        </tr>
        `;
      }).join("")}
    </tbody>
  </table>`;
}
export function renderDashboard(records,unit="minutes",cap=null){

  const stats = calculateStats(records);

  document.getElementById("stat-total")
    .textContent = stats.totalTasks;

  document.getElementById("stat-duration")
    .textContent =
      unit==="hours"
        ? (stats.totalDuration/60).toFixed(2)+" hrs"
        : stats.totalDuration+" min";

  document.getElementById("stat-top-tag")
    .textContent = stats.topTag;

  document.getElementById("stat-trend")
    .textContent = stats.next7Days;

  const fill = document.getElementById("trend-fill");
  fill.style.width =
    Math.min(stats.next7Days*10,100)+"%";

  const capMsg =
    document.getElementById("cap-message");

  if(!cap){
    capMsg.textContent="";
    return;
  }

  if(stats.totalDuration>cap){
    capMsg.textContent=
      "You exceeded your weekly cap!";
  }else{
    capMsg.textContent=
      "Remaining: "+(cap-stats.totalDuration);
  }
}

// 🔹 Sort records based on dropdown selection
export function sortRecords(type) {

  const [field, direction] = type.split("-");

  records.sort((a, b) => {

    if (field === "title") {
      return direction === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }

    if (field === "date") {
    return direction === "asc"
        ? new Date(a.dueDate || 0) - new Date(b.dueDate || 0)
        : new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
    }

    if (field === "duration") {
      return direction === "asc"
        ? a.duration - b.duration
        : b.duration - a.duration;
    }

    return 0;
  });
}

