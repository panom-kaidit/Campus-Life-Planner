export function calculateStats(records) {
  const totalTasks = records.length;

  const totalDuration = records.reduce((sum, r) => sum + Number(r.duration), 0);

  const tagCount = {};
  records.forEach((r) => {
    tagCount[r.tag] = (tagCount[r.tag] || 0) + 1;
  });

  const topTag =
    Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const today = new Date();
  const next7 = new Date();
  next7.setDate(today.getDate() + 7);

  const next7Days = records.filter((r) => {
    if (!r.dueDate) return false;
    const due = new Date(r.dueDate);
    return due >= today && due <= next7;
  }).length;

  return { totalTasks, totalDuration, topTag, next7Days };
}
