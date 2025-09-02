// utils/exportUtils.ts
import * as XLSX from "xlsx";

// ---- CSV Export ----
export function exportToCSV(data: any[], filename: string) {
  if (!data || !data.length) return;

  const separator = ",";
  const keys = Object.keys(data[0]);

  const csvContent =
    keys.join(separator) +
    "\n" +
    data
      .map((row) =>
        keys
          .map((key) => {
            let cell = row[key] ?? "";
            cell = cell instanceof Object ? JSON.stringify(cell) : cell;
            return `"${cell.toString().replace(/"/g, '""')}"`; // Escape quotes
          })
          .join(separator),
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

// ---- XLSX Export ----
export function exportToXLSX(data: any[], filename: string) {
  if (!data || !data.length) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
