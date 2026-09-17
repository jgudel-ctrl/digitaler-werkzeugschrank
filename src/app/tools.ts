export type ToolStatus = "Bij de klant" | "Wordt geslepen" | "Levensduur bereikt";
export type ToolCategory = "Zaagbladen" | "DP-frezen" | "Frezen";

export type HistoryEntry = {
  date: string;
  action: "Nageslepen" | "Eerste registratie" | "Afgekeurd";
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

const history = (count: number, unit = "Diameter") =>
  Array.from({ length: count }, (_, index): HistoryEntry => {
    const dates = ["12.08.2026", "12.06.2026", "18.03.2026", "10.12.2025", "02.09.2025", "16.05.2025", "21.01.2025", "08.10.2024", "17.06.2024", "05.03.2024", "15.11.2023", "30.08.2023", "11.05.2023", "07.02.2023", "18.10.2022"];
    return {
      date: dates[index] ?? "18.10.2022",
      action: "Nageslepen",
      details: unit === "Diameter"
        ? [`${unit} vóór bewerking: ${(302.18 + index * 0.31).toFixed(2).replace(".", ",")} mm`, `${unit} na bewerking: ${(301.84 + index * 0.31).toFixed(2).replace(".", ",")} mm`, `Afname tandrug: ${(0.04 + (index % 2) * 0.01).toFixed(2).replace(".", ",")} mm`, `Afname tandborst: ${(0.02 + (index % 2) * 0.01).toFixed(2).replace(".", ",")} mm`]
        : [`Snijmaat vóór bewerking: ${(20 - index * 0.06).toFixed(2).replace(".", ",")} mm`, `Snijmaat na bewerking: ${(19.94 - index * 0.06).toFixed(2).replace(".", ",")} mm`, "Snijkanten gecontroleerd en gepolijst"],
      result: "Gereedschap gebruiksklaar",
    };
  });

export const tools: Tool[] = [
  {
    id: "GW-SB-000184", category: "Zaagbladen", name: "Cirkelzaagblad met dak- en holtand", specification: "303 × 3,2 / 2,2 × 30 mm · Z60", status: "Bij de klant", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 7, archived: false,
    originalMeasure: "303,00 mm", currentMeasure: "301,84 mm", totalRemoval: "1,16 mm", lastSharpened: "12.06.2026",
    details: { Gereedschapstype: "Cirkelzaagblad", Tandvorm: "Dak- en holtand", Snijmateriaal: "HW", "Nieuwe diameter": "303,00 mm", "Huidige diameter": "301,84 mm", Zaagbreedte: "3,20 mm", Bladdikte: "2,20 mm", Asgat: "30,00 mm", "Aantal tanden": "Z60" }, history: history(7),
  },
  {
    id: "GW-SB-000185", category: "Zaagbladen", name: "Cirkelzaagblad met wisseltand", specification: "350 × 3,5 / 2,5 × 30 mm · Z72", status: "Bij de klant", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 4, archived: false,
    originalMeasure: "350,00 mm", currentMeasure: "349,22 mm", totalRemoval: "0,78 mm", lastSharpened: "12.08.2026",
    details: { Gereedschapstype: "Cirkelzaagblad", Tandvorm: "Wisseltand", Snijmateriaal: "HW", "Nieuwe diameter": "350,00 mm", "Huidige diameter": "349,22 mm", Zaagbreedte: "3,50 mm", Bladdikte: "2,50 mm", Asgat: "30,00 mm", "Aantal tanden": "Z72" }, history: history(4),
  },
  {
    id: "GW-SB-000186", category: "Zaagbladen", name: "Cirkelzaagblad met trapezium-vlaktand", specification: "300 × 3,2 / 2,2 × 30 mm · Z96", status: "Bij de klant", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 12, archived: false,
    originalMeasure: "300,00 mm", currentMeasure: "297,74 mm", totalRemoval: "2,26 mm", lastSharpened: "02.09.2025",
    details: { Gereedschapstype: "Cirkelzaagblad", Tandvorm: "Trapezium-vlaktand", Snijmateriaal: "HW", "Nieuwe diameter": "300,00 mm", "Huidige diameter": "297,74 mm", Zaagbreedte: "3,20 mm", Bladdikte: "2,20 mm", Asgat: "30,00 mm", "Aantal tanden": "Z96" }, history: history(12),
  },
  {
    id: "GW-SB-000187", category: "Zaagbladen", name: "Cirkelzaagblad met wisseltand", specification: "250 × 3,2 / 2,2 × 30 mm · Z48", status: "Wordt geslepen", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 6, archived: false,
    originalMeasure: "250,00 mm", currentMeasure: "248,91 mm", totalRemoval: "1,09 mm", lastSharpened: "18.03.2026",
    details: { Gereedschapstype: "Cirkelzaagblad", Tandvorm: "Wisseltand", Snijmateriaal: "HW", "Nieuwe diameter": "250,00 mm", "Huidige diameter": "248,91 mm", Zaagbreedte: "3,20 mm", Bladdikte: "2,20 mm", Asgat: "30,00 mm", "Aantal tanden": "Z48" }, history: history(6),
  },
  ...(["GW-DP-000201", "GW-DP-000202", "GW-DP-000203", "GW-DP-000204"] as const).map((id, index): Tool => ({
    id, category: "DP-frezen", name: "DP-voegfrees", specification: `100 × 45,5 mm · Z2+2 · ${index === 3 ? "rechts" : "links"}`, status: index === 3 ? "Wordt geslepen" : "Bij de klant", material: "DP/PKD", maxSharpeningCycles: 3, usedSharpeningCycles: [1, 0, 2, 1][index], archived: false,
    originalMeasure: "100,00 mm", currentMeasure: ["99,88 mm", "100,00 mm", "99,61 mm", "99,84 mm"][index], totalRemoval: ["0,12 mm", "0,00 mm", "0,39 mm", "0,16 mm"][index], lastSharpened: ["10.12.2025", "Nog niet geslepen", "12.08.2026", "18.03.2026"][index],
    details: { Gereedschapstype: "Voegfrees", Uitvoering: index === 3 ? "rechts" : "links", Snijmateriaal: "DP/PKD", Diameter: "100,00 mm", Hoogte: "45,50 mm", "Aantal tanden": "Z2+2", Draairichting: index === 3 ? "rechts" : "links" }, history: index === 1 ? [{ date: "04.02.2026", action: "Eerste registratie", details: ["Gereedschap opgemeten", "QR-ID toegewezen"], result: "Nieuw in de voorraad" }] : history([1, 0, 2, 1][index], "Snijmaat"),
  })),
  {
    id: "GW-FR-000301", category: "Frezen", name: "HW-spiraalgroeffrees", specification: "Ø 20 × 55 mm · Schacht 20 mm · Z2", status: "Bij de klant", material: "HW", maxSharpeningCycles: 8, usedSharpeningCycles: 3, archived: false,
    originalMeasure: "20,00 mm", currentMeasure: "19,78 mm", totalRemoval: "0,22 mm", lastSharpened: "12.08.2026",
    details: { Gereedschapstype: "Spiraalgroeffrees", Snijmateriaal: "HW", Diameter: "20,00 mm", "Huidige diameter": "19,78 mm", "Nuttige lengte": "55,00 mm", "Totale lengte": "110,00 mm", Schachtdiameter: "20,00 mm", "Aantal tanden": "Z2", Draairichting: "rechts" }, history: history(3, "Snijmaat"),
  },
  {
    id: "GW-SB-000099", category: "Zaagbladen", name: "HW-cirkelzaagblad met wisseltand", specification: "300 × 3,2 / 2,2 × 30 mm · Z60", status: "Levensduur bereikt", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 15, archived: true,
    originalMeasure: "300,00 mm", currentMeasure: "296,86 mm", totalRemoval: "3,14 mm", lastSharpened: "21.01.2025",
    details: { Gereedschapstype: "Cirkelzaagblad", Tandvorm: "Wisseltand", Snijmateriaal: "HW", "Nieuwe diameter": "300,00 mm", "Laatste diameter": "296,86 mm", Zaagbreedte: "3,20 mm", Bladdikte: "2,20 mm", Asgat: "30,00 mm", "Aantal tanden": "Z60" }, history: [{ date: "22.01.2025", action: "Afgekeurd", details: ["Minimummaat bereikt", "Verder naslijpen niet toegestaan"], result: "Naar het archief verplaatst" }, ...history(15)],
  },
];

export const remainingCycles = (tool: Tool) => tool.maxSharpeningCycles - tool.usedSharpeningCycles;
export const remainingPercent = (tool: Tool) => Math.round((remainingCycles(tool) / tool.maxSharpeningCycles) * 100);
export const activeTools = tools.filter((tool) => !tool.archived);
export const archivedTools = tools.filter((tool) => tool.archived);
export const categories: ToolCategory[] = ["Zaagbladen", "DP-frezen", "Frezen"];
