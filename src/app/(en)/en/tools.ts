export type ToolStatus = "At customer" | "Being sharpened" | "End of service life";
export type ToolCategory = "Saw blades" | "DP cutters" | "Cutters";

export type HistoryEntry = {
  date: string;
  action: "Resharpened" | "Initial registration" | "Retired";
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
    const dates = ["12/08/2026", "12/06/2026", "18/03/2026", "10/12/2025", "02/09/2025", "16/05/2025", "21/01/2025", "08/10/2024", "17/06/2024", "05/03/2024", "15/11/2023", "30/08/2023", "11/05/2023", "07/02/2023", "18/10/2022"];
    return {
      date: dates[index] ?? "18/10/2022",
      action: "Resharpened",
      details: unit === "Diameter"
        ? [`${unit} before: ${(302.18 + index * 0.31).toFixed(2)} mm`, `${unit} after: ${(301.84 + index * 0.31).toFixed(2)} mm`, `Tooth back removal: ${(0.04 + (index % 2) * 0.01).toFixed(2)} mm`, `Tooth face removal: ${(0.02 + (index % 2) * 0.01).toFixed(2)} mm`]
        : [`Cutting dimension before service: ${(20 - index * 0.06).toFixed(2)} mm`, `Cutting dimension after service: ${(19.94 - index * 0.06).toFixed(2)} mm`, "Cutting edges inspected and polished"],
      result: "Tool ready for use",
    };
  });

export const tools: Tool[] = [
  {
    id: "GW-SB-000184", category: "Saw blades", name: "Roof/hollow tooth circular saw blade", specification: "303 × 3.2 / 2.2 × 30 mm · Z60", status: "At customer", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 7, archived: false,
    originalMeasure: "303.00 mm", currentMeasure: "301.84 mm", totalRemoval: "1.16 mm", lastSharpened: "12/06/2026",
    details: { "Tool type": "Circular saw blade", "Tooth geometry": "Roof/hollow tooth", "Cutting material": "HW", "New diameter": "303.00 mm", "Current diameter": "301.84 mm", "Kerf width": "3.20 mm", "Plate thickness": "2.20 mm", Bore: "30.00 mm", "Number of teeth": "Z60" }, history: history(7),
  },
  {
    id: "GW-SB-000185", category: "Saw blades", name: "Alternate-top-bevel circular saw blade", specification: "350 × 3.5 / 2.5 × 30 mm · Z72", status: "At customer", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 4, archived: false,
    originalMeasure: "350.00 mm", currentMeasure: "349.22 mm", totalRemoval: "0.78 mm", lastSharpened: "12/08/2026",
    details: { "Tool type": "Circular saw blade", "Tooth geometry": "Alternate top bevel", "Cutting material": "HW", "New diameter": "350.00 mm", "Current diameter": "349.22 mm", "Kerf width": "3.50 mm", "Plate thickness": "2.50 mm", Bore: "30.00 mm", "Number of teeth": "Z72" }, history: history(4),
  },
  {
    id: "GW-SB-000186", category: "Saw blades", name: "Triple-chip circular saw blade", specification: "300 × 3.2 / 2.2 × 30 mm · Z96", status: "At customer", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 12, archived: false,
    originalMeasure: "300.00 mm", currentMeasure: "297.74 mm", totalRemoval: "2.26 mm", lastSharpened: "02/09/2025",
    details: { "Tool type": "Circular saw blade", "Tooth geometry": "Triple chip", "Cutting material": "HW", "New diameter": "300.00 mm", "Current diameter": "297.74 mm", "Kerf width": "3.20 mm", "Plate thickness": "2.20 mm", Bore: "30.00 mm", "Number of teeth": "Z96" }, history: history(12),
  },
  {
    id: "GW-SB-000187", category: "Saw blades", name: "Alternate-top-bevel circular saw blade", specification: "250 × 3.2 / 2.2 × 30 mm · Z48", status: "Being sharpened", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 6, archived: false,
    originalMeasure: "250.00 mm", currentMeasure: "248.91 mm", totalRemoval: "1.09 mm", lastSharpened: "18/03/2026",
    details: { "Tool type": "Circular saw blade", "Tooth geometry": "Alternate top bevel", "Cutting material": "HW", "New diameter": "250.00 mm", "Current diameter": "248.91 mm", "Kerf width": "3.20 mm", "Plate thickness": "2.20 mm", Bore: "30.00 mm", "Number of teeth": "Z48" }, history: history(6),
  },
  ...(["GW-DP-000201", "GW-DP-000202", "GW-DP-000203", "GW-DP-000204"] as const).map((id, index): Tool => ({
    id, category: "DP cutters", name: "PCD jointing cutter", specification: `100 × 45.5 mm · Z2+2 · ${index === 3 ? "right" : "left"}`, status: index === 3 ? "Being sharpened" : "At customer", material: "DP/PKD", maxSharpeningCycles: 3, usedSharpeningCycles: [1, 0, 2, 1][index], archived: false,
    originalMeasure: "100.00 mm", currentMeasure: ["99.88 mm", "100.00 mm", "99.61 mm", "99.84 mm"][index], totalRemoval: ["0.12 mm", "0.00 mm", "0.39 mm", "0.16 mm"][index], lastSharpened: ["10/12/2025", "Not yet sharpened", "12/08/2026", "18/03/2026"][index],
    details: { "Tool type": "Jointing cutter", Version: index === 3 ? "right" : "left", "Cutting material": "DP/PKD", Diameter: "100.00 mm", Height: "45.50 mm", "Number of teeth": "Z2+2", Rotation: index === 3 ? "right" : "left" }, history: index === 1 ? [{ date: "04/02/2026", action: "Initial registration", details: ["Tool measured", "QR ID assigned"], result: "New to inventory" }] : history([1, 0, 2, 1][index], "Cutting dimension"),
  })),
  {
    id: "GW-FR-000301", category: "Cutters", name: "Carbide spiral router bit", specification: "Ø 20 × 55 mm · Shank 20 mm · Z2", status: "At customer", material: "HW", maxSharpeningCycles: 8, usedSharpeningCycles: 3, archived: false,
    originalMeasure: "20.00 mm", currentMeasure: "19.78 mm", totalRemoval: "0.22 mm", lastSharpened: "12/08/2026",
    details: { "Tool type": "Spiral router bit", "Cutting material": "HW", Diameter: "20.00 mm", "Current diameter": "19.78 mm", "Cutting length": "55.00 mm", "Overall length": "110.00 mm", "Shank diameter": "20.00 mm", "Number of teeth": "Z2", Rotation: "right" }, history: history(3, "Cutting dimension"),
  },
  {
    id: "GW-SB-000099", category: "Saw blades", name: "Carbide alternate-top-bevel circular saw blade", specification: "300 × 3.2 / 2.2 × 30 mm · Z60", status: "End of service life", material: "HW", maxSharpeningCycles: 15, usedSharpeningCycles: 15, archived: true,
    originalMeasure: "300.00 mm", currentMeasure: "296.86 mm", totalRemoval: "3.14 mm", lastSharpened: "21/01/2025",
    details: { "Tool type": "Circular saw blade", "Tooth geometry": "Alternate top bevel", "Cutting material": "HW", "New diameter": "300.00 mm", "Last diameter": "296.86 mm", "Kerf width": "3.20 mm", "Plate thickness": "2.20 mm", Bore: "30.00 mm", "Number of teeth": "Z60" }, history: [{ date: "22/01/2025", action: "Retired", details: ["Minimum dimension reached", "Further resharpening not approved"], result: "Moved to archive" }, ...history(15)],
  },
];

export const remainingCycles = (tool: Tool) => tool.maxSharpeningCycles - tool.usedSharpeningCycles;
export const remainingPercent = (tool: Tool) => Math.round((remainingCycles(tool) / tool.maxSharpeningCycles) * 100);
export const activeTools = tools.filter((tool) => !tool.archived);
export const archivedTools = tools.filter((tool) => tool.archived);
export const categories: ToolCategory[] = ["Saw blades", "DP cutters", "Cutters"];
