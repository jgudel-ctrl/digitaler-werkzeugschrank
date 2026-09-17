export type AnalysisPeriod = "month" | "3months" | "6months" | "year" | "custom";

export type ServiceMonth = {
  key: string;
  label: string;
  longLabel: string;
  sharpenings: number;
  specialWork: number;
  replacements: number;
  exhausted: number;
  sharpeningCost: number;
  specialCost: number;
  otherCost: number;
};

export const serviceHistory: ServiceMonth[] = [
  { key: "2025-01", label: "Jan", longLabel: "januari 2025", sharpenings: 9, specialWork: 1, replacements: 0, exhausted: 0, sharpeningCost: 610, specialCost: 100, otherCost: 0 },
  { key: "2025-02", label: "Feb", longLabel: "februari 2025", sharpenings: 10, specialWork: 1, replacements: 1, exhausted: 0, sharpeningCost: 640, specialCost: 100, otherCost: 0 },
  { key: "2025-03", label: "Mrt", longLabel: "maart 2025", sharpenings: 8, specialWork: 1, replacements: 0, exhausted: 0, sharpeningCost: 560, specialCost: 130, otherCost: 0 },
  { key: "2025-04", label: "Apr", longLabel: "april 2025", sharpenings: 10, specialWork: 1, replacements: 1, exhausted: 0, sharpeningCost: 650, specialCost: 120, otherCost: 0 },
  { key: "2025-05", label: "Mei", longLabel: "mei 2025", sharpenings: 9, specialWork: 1, replacements: 0, exhausted: 0, sharpeningCost: 590, specialCost: 140, otherCost: 0 },
  { key: "2025-06", label: "Jun", longLabel: "juni 2025", sharpenings: 11, specialWork: 2, replacements: 1, exhausted: 0, sharpeningCost: 700, specialCost: 160, otherCost: 0 },
  { key: "2025-07", label: "Jul", longLabel: "juli 2025", sharpenings: 11, specialWork: 2, replacements: 0, exhausted: 0, sharpeningCost: 720, specialCost: 180, otherCost: 0 },
  { key: "2025-08", label: "Aug", longLabel: "augustus 2025", sharpenings: 8, specialWork: 2, replacements: 1, exhausted: 0, sharpeningCost: 550, specialCost: 300, otherCost: 0 },
  { key: "2025-09", label: "Sep", longLabel: "september 2025", sharpenings: 6, specialWork: 1, replacements: 0, exhausted: 0, sharpeningCost: 390, specialCost: 95, otherCost: 0 },
  { key: "2025-10", label: "Okt", longLabel: "oktober 2025", sharpenings: 8, specialWork: 1, replacements: 1, exhausted: 0, sharpeningCost: 520, specialCost: 110, otherCost: 0 },
  { key: "2025-11", label: "Nov", longLabel: "november 2025", sharpenings: 7, specialWork: 0, replacements: 0, exhausted: 0, sharpeningCost: 455, specialCost: 0, otherCost: 0 },
  { key: "2025-12", label: "Dec", longLabel: "december 2025", sharpenings: 9, specialWork: 2, replacements: 1, exhausted: 0, sharpeningCost: 585, specialCost: 210, otherCost: 0 },
  { key: "2026-01", label: "Jan", longLabel: "januari 2026", sharpenings: 8, specialWork: 1, replacements: 0, exhausted: 0, sharpeningCost: 520, specialCost: 120, otherCost: 0 },
  { key: "2026-02", label: "Feb", longLabel: "februari 2026", sharpenings: 9, specialWork: 1, replacements: 1, exhausted: 0, sharpeningCost: 570, specialCost: 100, otherCost: 0 },
  { key: "2026-03", label: "Mrt", longLabel: "maart 2026", sharpenings: 7, specialWork: 1, replacements: 0, exhausted: 0, sharpeningCost: 455, specialCost: 90, otherCost: 0 },
  { key: "2026-04", label: "Apr", longLabel: "april 2026", sharpenings: 10, specialWork: 2, replacements: 1, exhausted: 0, sharpeningCost: 650, specialCost: 230, otherCost: 0 },
  { key: "2026-05", label: "Mei", longLabel: "mei 2026", sharpenings: 11, specialWork: 1, replacements: 0, exhausted: 0, sharpeningCost: 710, specialCost: 100, otherCost: 0 },
  { key: "2026-06", label: "Jun", longLabel: "juni 2026", sharpenings: 9, specialWork: 2, replacements: 1, exhausted: 0, sharpeningCost: 585, specialCost: 220, otherCost: 0 },
  { key: "2026-07", label: "Jul", longLabel: "juli 2026", sharpenings: 12, specialWork: 1, replacements: 0, exhausted: 0, sharpeningCost: 780, specialCost: 120, otherCost: 0 },
  { key: "2026-08", label: "Aug", longLabel: "augustus 2026", sharpenings: 8, specialWork: 2, replacements: 1, exhausted: 1, sharpeningCost: 550, specialCost: 260, otherCost: 0 },
];

export const periodLabels: Record<AnalysisPeriod, string> = {
  month: "Maand",
  "3months": "3 maanden",
  "6months": "6 maanden",
  year: "Jaar",
  custom: "Periode",
};

export const filterServiceHistory = (period: AnalysisPeriod, from = "2026-01", to = "2026-08") => {
  if (period === "month") return serviceHistory.slice(-1);
  if (period === "3months") return serviceHistory.slice(-3);
  if (period === "6months") return serviceHistory.slice(-6);
  if (period === "year") return serviceHistory.filter((month) => month.key.startsWith("2026-"));
  return serviceHistory.filter((month) => month.key >= from && month.key <= to);
};

export const summarizeServiceHistory = (months: ServiceMonth[]) => months.reduce((total, month) => ({
  sharpenings: total.sharpenings + month.sharpenings,
  specialWork: total.specialWork + month.specialWork,
  replacements: total.replacements + month.replacements,
  exhausted: total.exhausted + month.exhausted,
  sharpeningCost: total.sharpeningCost + month.sharpeningCost,
  specialCost: total.specialCost + month.specialCost,
  otherCost: total.otherCost + month.otherCost,
  totalCost: total.totalCost + month.sharpeningCost + month.specialCost + month.otherCost,
}), { sharpenings: 0, specialWork: 0, replacements: 0, exhausted: 0, sharpeningCost: 0, specialCost: 0, otherCost: 0, totalCost: 0 });

export const yearToDateSummary = summarizeServiceHistory(serviceHistory.filter((month) => month.key.startsWith("2026-")));
