import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/tools.ts",
  "src/app/analysis.ts",
  "src/components/qr-scanner-view.tsx",
];
const source = Object.fromEntries(files.map((file) => [file, fs.readFileSync(path.join(root, file), "utf8")]));
const combined = Object.values(source).join("\n");

const required = [
  ["src/app/layout.tsx", '<html lang="nl">'],
  ["src/app/page.tsx", 'new Intl.NumberFormat("nl-NL"'],
  ["src/app/page.tsx", "Digitale gereedschapskast"],
  ["src/app/page.tsx", "Welkom terug"],
  ["src/app/page.tsx", "Mijn gereedschappen"],
  ["src/app/page.tsx", "Slijphistorie"],
  ["src/components/qr-scanner-view.tsx", "Camera wordt gestart"],
];

const forbidden = [
  "Digitaler Werkzeugschrank",
  "Willkommen zurück",
  "Meine Werkzeuge",
  "Schärfhistorie",
  "Beim Kunden",
  "Beim Schärfen",
  "Lebensdauer erreicht",
  "Kamera wird gestartet",
  "de-DE",
];

const errors = [];
for (const [file, text] of required) {
  if (!source[file].includes(text)) errors.push(`Ontbreekt in ${file}: ${text}`);
}
for (const text of forbidden) {
  if (combined.includes(text)) errors.push(`Duitse UI-tekst nog aanwezig: ${text}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Nederlandse taalcontrole geslaagd.");
