function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportIssuesJSON(issues) {
  const json = JSON.stringify(issues, null, 2);
  downloadBlob(`issues_${new Date().toISOString().slice(0, 10)}.json`, json, "application/json");
}

function csvEscape(v) {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/"/g, '""');
  return `"${s}"`;
}

export function exportIssuesCSV(issues) {
  const headers = [
    "title",
    "description",
    "status",
    "priority",
    "severity",
    "assignedTo",
    "createdAt",
    "updatedAt",
  ];

  const rows = [
    headers.join(","),
    ...issues.map((it) =>
      headers
        .map((h) => {
          const val = it[h];
          return csvEscape(val);
        })
        .join(",")
    ),
  ];

  const csv = rows.join("\n");
  downloadBlob(`issues_${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv");
}
