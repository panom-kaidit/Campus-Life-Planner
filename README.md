 Campus Life Planner
A responsive, accessible, and modular web application built with Vanilla HTML, CSS, and JavaScript to help students manage daily tasks and reflect on personal growth.
 Live App (GitHub Pages):
https://panom-kaidit.github.io/Campus-Life-Planner/
 2–3 Minute Demo Video:
https://youtu.be/PbBwf2-MIAM

 Chosen Theme
Campus Life Planner
This app helps students:
Plan and track daily tasks/events
Monitor time spent on activities
Reflect on personal growth
Analyze weekly productivity

 Features List
 Dashboard
Weekly activity summary
Task duration tracking
Visual overview of productivity
 Records Page
Table-based responsive layout
Displays all tasks/events
Shows description, duration, tags, and timestamps
Search and filtering support
 Add Task
Create new tasks with:
Description
Duration (hours)
Tags
Client-side validation
Unique ID generation
Timestamps for created records
 Daily Reflection
Date navigation (Previous / Next / Today)
Reflection prompts:
What I learned
Challenges faced
Gratitude
Mood selection
Additional notes
Streak counter
Reflection history (table format)
Export reflections feature
 Settings
Local storage management
Theme persistence
Data export/import (JSON)
 Data Persistence
Uses localStorage
Modular storage logic
Records automatically saved and loaded
 Responsive Design
Mobile-first approach
Scrollable tables
Adaptive layout

🧩 Data Model
Each task record:
{
 id: "rec_0001",
 description: "Study JavaScript",
 duration: 2,
 tags: ["study", "coding"],
 createdAt: "2026-02-19T10:30:00Z"
}
Each reflection:
{
 id: "ref_0001",
 date: "2026-02-19",
 learned: "...",
 challenges: "...",
 grateful: "...",
 mood: " Great",
 additionalNotes: "...",
 createdAt: "2026-02-19T21:00:00Z"
}

 Regex Catalog
The following regex patterns are used for validation and formatting:
Purpose
Pattern
Example
Unique ID format
^rec_\d{4}$
rec_0001
Reflection ID
^ref_\d{4}$
ref_0002
Hours (1–24)
`^(?:[1-9]
1\d
Tags (comma separated words)
^[a-zA-Z0-9,\s]+$
study, coding
Date format
^\d{4}-\d{2}-\d{2}$
2026-02-19

Example usage:
/^[a-zA-Z0-9,\s]+$/.test("study, coding")

 Keyboard Map
Key
Action
Enter
Submit form
Tab
Navigate form fields
Arrow Left
Previous reflection date
Arrow Right
Next reflection date
Esc
Clear form (if implemented)

All interactive elements are keyboard accessible.

 Accessibility (a11y) Notes
Semantic HTML structure (header, nav, main, section)
Proper <label> association with form fields
Focus states for buttons and inputs
Sufficient color contrast
Responsive text scaling
Table headers use <thead> and <th>
Navigation is fully keyboard navigable

 How to Run Tests
This project uses manual functional testing:
1️⃣ Clone the Repository
git clone https://github.com/panom-kaidit/Campus-Life-Planner.git
2️⃣ Open in Browser
Open index.html in your browser
OR use VS Code Live Server.
3️⃣ Test Core Features
Add new task → Verify it appears on Records page
Refresh page → Confirm data persists
Add reflection → Verify streak updates
Export data → Confirm JSON file downloads
Resize browser → Confirm responsiveness
Test keyboard navigation

 Project Structure
Campus-Life-Planner/
│
├── index.html
├── records.html
├── add.html
├── reflection.html
├── settings.html
│
├── styles/
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── responsive.css
│   └── reflection.css
│
├── scripts/
│   ├── state.js
│   ├── storage.js
│   ├── dashboard.js
│   ├── reflection.js
│   ├── settings.js
│
└── README.md

 Technologies Used
HTML5
CSS3 (Glassmorphism UI)
Vanilla JavaScript (ES Modules)
LocalStorage API
GitHub Pages (Deployment)

 Deployment
Hosted using GitHub Pages:
https://panom-kaidit.github.io/Campus-Life-Planner/

 Future Improvements
Mood analytics chart
Calendar view for reflections
Drag-and-drop task ordering
Dark mode toggle
Automated unit testing

 Author
Developed as part of a web development project.
@panom-kaidit
