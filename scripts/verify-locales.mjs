import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "src/app/(de)/de/layout.tsx",
  "src/app/(de)/de/page.tsx",
  "src/app/(de)/de/tools.ts",
  "src/app/(de)/de/analysis.ts",
  "src/app/(en)/en/layout.tsx",
  "src/app/(en)/en/page.tsx",
  "src/app/(en)/en/tools.ts",
  "src/app/(en)/en/analysis.ts",
  "src/app/(nl)/nl/layout.tsx",
  "src/app/(nl)/nl/page.tsx",
  "src/app/(nl)/nl/tools.ts",
  "src/app/(nl)/nl/analysis.ts",
  "src/app/(root)/layout.tsx",
  "src/app/(root)/page.tsx",
  "src/components/qr-scanner-view.tsx",
];

const errors = [];
const source = {};
for (const file of requiredFiles) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) {
    errors.push(`Missing file: ${file}`);
    continue;
  }
  source[file] = fs.readFileSync(absolute, "utf8");
}

const checks = [
  ["src/app/(de)/de/layout.tsx", '<html lang="de">'],
  ["src/app/(en)/en/layout.tsx", '<html lang="en">'],
  ["src/app/(nl)/nl/layout.tsx", '<html lang="nl">'],
  ["src/app/(de)/de/page.tsx", "Digitaler Werkzeugschrank"],
  ["src/app/(en)/en/page.tsx", "Digital Tool Cabinet"],
  ["src/app/(nl)/nl/page.tsx", "Digitale gereedschapskast"],
  ["src/app/(en)/en/page.tsx", 'label: "Analysis"'],
  ["src/app/(de)/de/page.tsx", "Demo-Scan simulieren"],
  ["src/app/(en)/en/page.tsx", "Simulate demo scan"],
  ["src/app/(nl)/nl/page.tsx", "Demo-scan simuleren"],
  ["src/app/(en)/en/page.tsx", "12/08/2026"],
  ["src/app/(en)/en/tools.ts", "303.00 mm"],
  ["src/app/(de)/de/page.tsx", "scan(DEMO_QR_TOOL_ID)"],
  ["src/app/(en)/en/page.tsx", "scan(DEMO_QR_TOOL_ID)"],
  ["src/app/(nl)/nl/page.tsx", "scan(DEMO_QR_TOOL_ID)"],
  ["src/components/qr-scanner-view.tsx", "onScanRef"],
  ["src/components/qr-scanner-view.tsx", "cameraStarting"],
  ["src/components/qr-scanner-view.tsx", "else if (wasPaused)"],
];
for (const [file, needle] of checks) {
  if (!source[file]?.includes(needle)) errors.push(`Missing in ${file}: ${needle}`);
}

const combined = Object.values(source).join("\n");
for (const forbidden of ["function Login(", "loggedIn", "Inloggen", "Uitloggen", "Welkom terug"]) {
  if (combined.includes(forbidden)) errors.push(`Forbidden login text/code remains: ${forbidden}`);
}

const englishSource = [
  source["src/app/(en)/en/page.tsx"] ?? "",
  source["src/app/(en)/en/tools.ts"] ?? "",
  source["src/app/(en)/en/analysis.ts"] ?? "",
].join("\n");
for (const forbidden of ['label: "Analyse"', '.replace(".", ",")']) {
  if (englishSource.includes(forbidden)) errors.push(`German formatting/text remains in English route: ${forbidden}`);
}
const englishTools = source["src/app/(en)/en/tools.ts"] ?? "";
if (/\d,\d/.test(englishTools)) errors.push("Decimal comma remains in English tool data");
if (/\d{2}\.\d{2}\.\d{4}/.test(englishTools)) errors.push("German-style date remains in English tool data");

if (!source["src/components/qr-scanner-view.tsx"]?.includes("}, [restartKey]);")) {
  errors.push("Scanner initialization is not isolated from onScan identity changes");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("German, English and Dutch routes plus scanner checks passed.");
