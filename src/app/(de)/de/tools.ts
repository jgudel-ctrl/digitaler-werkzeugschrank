export type ToolStatus = "Beim Kunden" | "Beim Schärfen" | "Lebensdauer erreicht";
export type ToolCategory = "Sägeblätter" | "DP-Fräser" | "Fräser";

export type HistoryEntry = {
  date: string;
  action: "Nachgeschärft" | "Erstaufnahme" | "Ausgemustert";
  details: string[];
  result?: string;
};

export type Tool = {
  id: string;
  category: ToolCategory;
  name: string;
  specification: string;
  status: ToolStatus;
  material: string;
  details: Record<string, string>;
  maxSharpeningCycles: number;
  usedSharpeningCycles: number;
  originalMeasure: string;
  currentMeasure: string;
  totalRemoval: string;
  lastSharpened: string;
  archived: boolean;
  history: HistoryEntry[];
};

const history = (count: number, unit = "Durchmesser") =>
  Array.from({ length: count }, (_, index): HistoryEntry => {
    const dates = ["12.08.2026", "12.06.2026", "18.03.2026", "10.12.2025", "02.09.2025", "16.05.2025", "21.01.2025", "08.10.2024", "17.06.2024", "05.03.2024", "15.11.2023", "30.08.2023", "11.05.2023", "07.02.2023", "18.10.2022"];
    return {
      date: dates[index] ?? "18.10.2022",
      action: "Nachgeschärft",
      details: unit === "Durchmesser"
        ? [`${unit} vorher: ${(302.18 + index * 0.31).toFixed(2).replace(".", ",")} mm`, `${unit} nachher: ${(301.84 + index * 0.31).toFixed(2).replace(".", ",")} mm`, `Zahnrücken-Abtrag: ${(0.04 + (index % 2) * 0.01).toFixed(2).replace(".", ",")} mm`, `Zahnbrust-Abtrag: ${(0.02 + (index % 2) * 0.01).toFixed(2).replace(".", ",")} mm`]
        : [`Schneidenmaß vor Bearbeitung: ${(20 - index * 0.06).toFixed(2).replace(".", ",")} mm`, `Schneidenmaß nach Bearbeitung: ${(19.94 - index * 0.06).toFixed(2).replace(".", ",")} mm`, "Schneiden kontrolliert und poliert"],
      result: "Werkzeug einsatzbereit",
    };
  });

export const tools: Tool[] = [
  {
    id: "GW-SB-000184", category: "Sägeblätter", name: "Dachzahn-Hohlzahn Kreissägeblatt", specification: "303 × 3,2 / 2,2 × 30 mm · Z60", status: "Beim Kunden", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 7, archived: false,
    originalMeasure: "303,00 mm", currentMeasure: "301,84 mm", totalRemoval: "1,16 mm", lastSharpened: "12.06.2026",
    details: { Werkzeugart: "Kreissägeblatt", Zahnform: "Dachzahn-Hohlzahn", Schneidstoff: "HW", "Durchmesser neu": "303,00 mm", "Aktueller Durchmesser": "301,84 mm", Schnittbreite: "3,20 mm", Stammblattdicke: "2,20 mm", Bohrung: "30,00 mm", Zähnezahl: "Z60" }, history: history(7),
  },
  {
    id: "GW-SB-000185", category: "Sägeblätter", name: "Wechselzahn Kreissägeblatt", specification: "350 × 3,5 / 2,5 × 30 mm · Z72", status: "Beim Kunden", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 4, archived: false,
    originalMeasure: "350,00 mm", currentMeasure: "349,22 mm", totalRemoval: "0,78 mm", lastSharpened: "12.08.2026",
    details: { Werkzeugart: "Kreissägeblatt", Zahnform: "Wechselzahn", Schneidstoff: "HW", "Durchmesser neu": "350,00 mm", "Aktueller Durchmesser": "349,22 mm", Schnittbreite: "3,50 mm", Stammblattdicke: "2,50 mm", Bohrung: "30,00 mm", Zähnezahl: "Z72" }, history: history(4),
  },
  {
    id: "GW-SB-000186", category: "Sägeblätter", name: "Trapez-Flachzahn Kreissägeblatt", specification: "300 × 3,2 / 2,2 × 30 mm · Z96", status: "Beim Kunden", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 12, archived: false,
    originalMeasure: "300,00 mm", currentMeasure: "297,74 mm", totalRemoval: "2,26 mm", lastSharpened: "02.09.2025",
    details: { Werkzeugart: "Kreissägeblatt", Zahnform: "Trapez-Flachzahn", Schneidstoff: "HW", "Durchmesser neu": "300,00 mm", "Aktueller Durchmesser": "297,74 mm", Schnittbreite: "3,20 mm", Stammblattdicke: "2,20 mm", Bohrung: "30,00 mm", Zähnezahl: "Z96" }, history: history(12),
  },
  {
    id: "GW-SB-000187", category: "Sägeblätter", name: "Wechselzahn Kreissägeblatt", specification: "250 × 3,2 / 2,2 × 30 mm · Z48", status: "Beim Schärfen", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 6, archived: false,
    originalMeasure: "250,00 mm", currentMeasure: "248,91 mm", totalRemoval: "1,09 mm", lastSharpened: "18.03.2026",
    details: { Werkzeugart: "Kreissägeblatt", Zahnform: "Wechselzahn", Schneidstoff: "HW", "Durchmesser neu": "250,00 mm", "Aktueller Durchmesser": "248,91 mm", Schnittbreite: "3,20 mm", Stammblattdicke: "2,20 mm", Bohrung: "30,00 mm", Zähnezahl: "Z48" }, history: history(6),
  },
  ...(["GW-DP-000201", "GW-DP-000202", "GW-DP-000203", "GW-DP-000204"] as const).map((id, index): Tool => ({
    id, category: "DP-Fräser", name: "DP-Fügefräser", specification: `100 × 45,5 mm · Z2+2 · ${index === 3 ? "rechts" : "links"}`, status: index === 3 ? "Beim Schärfen" : "Beim Kunden", material: "DP/PKD", maxSharpeningCycles: 3, usedSharpeningCycles: [1, 0, 2, 1][index], archived: false,
    originalMeasure: "100,00 mm", currentMeasure: ["99,88 mm", "100,00 mm", "99,61 mm", "99,84 mm"][index], totalRemoval: ["0,12 mm", "0,00 mm", "0,39 mm", "0,16 mm"][index], lastSharpened: ["10.12.2025", "Noch nicht geschärft", "12.08.2026", "18.03.2026"][index],
    details: { Werkzeugart: "Fügefräser", Ausführung: index === 3 ? "rechts" : "links", Schneidstoff: "DP/PKD", Durchmesser: "100,00 mm", Höhe: "45,50 mm", Zähnezahl: "Z2+2", Drehrichtung: index === 3 ? "rechts" : "links" }, history: index === 1 ? [{ date: "04.02.2026", action: "Erstaufnahme", details: ["Werkzeug vermessen", "QR-ID zugeordnet"], result: "Neu im Bestand" }] : history([1, 0, 2, 1][index], "Schneidenmaß"),
  })),
  {
    id: "GW-FR-000301", category: "Fräser", name: "HW-Spiralnutfräser", specification: "Ø 20 × 55 mm · Schaft 20 mm · Z2", status: "Beim Kunden", material: "HW", maxSharpeningCycles: 8, usedSharpeningCycles: 3, archived: false,
    originalMeasure: "20,00 mm", currentMeasure: "19,78 mm", totalRemoval: "0,22 mm", lastSharpened: "12.08.2026",
    details: { Werkzeugart: "Spiralnutfräser", Schneidstoff: "HW", Durchmesser: "20,00 mm", "Aktueller Durchmesser": "19,78 mm", Nutzlänge: "55,00 mm", Gesamtlänge: "110,00 mm", Schaftdurchmesser: "20,00 mm", Zähnezahl: "Z2", Drehrichtung: "rechts" }, history: history(3, "Schneidenmaß"),
  },
  {
    id: "GW-SB-000099", category: "Sägeblätter", name: "HW-Kreissägeblatt Wechselzahn", specification: "300 × 3,2 / 2,2 × 30 mm · Z60", status: "Lebensdauer erreicht", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 15, archived: true,
    originalMeasure: "300,00 mm", currentMeasure: "296,86 mm", totalRemoval: "3,14 mm", lastSharpened: "21.01.2025",
    details: { Werkzeugart: "Kreissägeblatt", Zahnform: "Wechselzahn", Schneidstoff: "HW", "Durchmesser neu": "300,00 mm", "Letzter Durchmesser": "296,86 mm", Schnittbreite: "3,20 mm", Stammblattdicke: "2,20 mm", Bohrung: "30,00 mm", Zähnezahl: "Z60" }, history: [{ date: "22.01.2025", action: "Ausgemustert", details: ["Mindestmaß erreicht", "Weitere Nachschärfung nicht freigegeben"], result: "In das Archiv verschoben" }, ...history(15)],
  },
];

export const remainingCycles = (tool: Tool) => tool.maxSharpeningCycles - tool.usedSharpeningCycles;
export const remainingPercent = (tool: Tool) => Math.round((remainingCycles(tool) / tool.maxSharpeningCycles) * 100);
export const activeTools = tools.filter((tool) => !tool.archived);
export const archivedTools = tools.filter((tool) => tool.archived);
export const categories: ToolCategory[] = ["Sägeblätter", "DP-Fräser", "Fräser"];
