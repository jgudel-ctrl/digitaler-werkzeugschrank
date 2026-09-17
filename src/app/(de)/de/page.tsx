"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive, ArrowRight, BarChart3, CalendarDays, Check, ChevronDown, CircleAlert, CircleCheck,
  Clock3, Eye, Gauge, History, Home, Info,
  MapPin, Menu, PackageCheck, QrCode, Search, ShieldCheck,
  Sparkles, ToolCase, TrendingDown, TrendingUp, UserRound, WalletCards, Wrench, X, XCircle,
} from "lucide-react";
import {
  Area, AreaChart, Bar, CartesianGrid, Cell, ComposedChart, Legend, Line,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { QrScannerView } from "@/components/qr-scanner-view";
import styles from "../../werkzeugschrank.module.css";
import {
  AnalysisPeriod, filterServiceHistory, periodLabels, serviceHistory, summarizeServiceHistory,
} from "./analysis";
import {
  activeTools, archivedTools, categories, remainingCycles, remainingPercent,
  Tool, tools,
} from "./tools";

type View = "overview" | "tools" | "analysis" | "archive" | "profile";
type ScanState = "idle" | "success" | "error";

const DEMO_QR_TOOL_ID = "GW-SB-000184";

const statusIcon = (status: Tool["status"]) =>
  status === "Beim Kunden" ? <CircleCheck size={15} /> : status === "Beim Schärfen" ? <Clock3 size={15} /> : <Archive size={15} />;

const reserve = (tool: Tool) => {
  const left = remainingCycles(tool);
  const percent = remainingPercent(tool);
  if (tool.archived) return { label: "Lebensdauer erreicht", tone: "archived", icon: <Archive size={15} /> };
  if (left <= 1 || percent <= 15) return { label: "Kritische Reserve", tone: "critical", icon: <CircleAlert size={15} /> };
  if (percent <= 30) return { label: "Geringe Reserve", tone: "low", icon: <CircleAlert size={15} /> };
  return { label: "Gute Reserve", tone: "good", icon: <CircleCheck size={15} /> };
};

function ToolCard({ tool, onOpen }: { tool: Tool; onOpen: (tool: Tool) => void }) {
  const life = remainingPercent(tool);
  const reserveState = reserve(tool);
  return (
    <motion.button layout whileTap={{ scale: 0.985 }} className={`${styles.toolCard} ${styles[reserveState.tone]}`} onClick={() => onOpen(tool)}>
      <div className={styles.toolTop}>
        <div className={styles.toolGlyph}>{tool.category === "Sägeblätter" ? <Gauge /> : <Wrench />}</div>
        <div className={styles.toolIdentity}><h3>{tool.name}</h3><p>{tool.specification}</p></div>
        <ChevronDown className={styles.cardChevron} size={20} />
      </div>
      <div className={styles.toolMeta}>
        <code>{tool.id}</code>
        <span className={`${styles.status} ${tool.status === "Beim Kunden" ? styles.customer : tool.status === "Beim Schärfen" ? styles.service : styles.done}`}>{statusIcon(tool.status)} {tool.status}</span>
      </div>
      <div className={styles.lifeRow}>
        <div><strong>{tool.usedSharpeningCycles} / {tool.maxSharpeningCycles}</strong><span>Schärfzyklen verwendet</span></div>
        <div className={styles.lifeRight}><strong>{remainingCycles(tool)}</strong><span>verbleibend</span></div>
      </div>
      <div className={styles.progressTrack}><motion.i initial={{ width: 0 }} animate={{ width: `${life}%` }} transition={{ duration: .7, ease: [0.22, 1, .36, 1] }} /></div>
      <div className={styles.reserveRow}><span>{reserveState.icon}{reserveState.label} · {life} % Restlebensdauer</span><b>Werkzeugpass <ArrowRight size={15} /></b></div>
    </motion.button>
  );
}

function DetailSheet({ tool, onClose }: { tool: Tool | null; onClose: () => void }) {
  useEffect(() => {
    const key = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <AnimatePresence>
      {tool && <motion.div className={styles.modalBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <motion.article role="dialog" aria-modal="true" aria-labelledby="detail-title" className={styles.detailSheet} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 340 }}>
          <div className={styles.sheetHandle} />
          <header className={styles.detailHeader}>
            <div className={styles.detailHeadTop}><span className={`${styles.status} ${tool.status === "Beim Kunden" ? styles.customer : tool.status === "Beim Schärfen" ? styles.service : styles.done}`}>{statusIcon(tool.status)} {tool.status}</span><button className={styles.iconButton} onClick={onClose} aria-label="Detail schließen"><X /></button></div>
            <div className={styles.detailTitleRow}><div className={styles.bigGlyph}>{tool.category === "Sägeblätter" ? <Gauge /> : <Wrench />}</div><div><h2 id="detail-title">{tool.name}</h2><p>{tool.specification}</p><code>{tool.id}</code></div></div>
            <div className={`${styles.lifeHero} ${styles[reserve(tool).tone]}`}>
              <div><span>{reserve(tool).icon} {reserve(tool).label}</span><strong>{remainingPercent(tool)}<small>%</small></strong><p>geschätzte Restlebensdauer</p></div>
              <div className={styles.lifeHeroFacts}><span><b>{tool.usedSharpeningCycles}</b> verwendet</span><span><b>{remainingCycles(tool)}</b> verbleibend</span><span><b>{tool.maxSharpeningCycles}</b> maximal</span></div>
              <div className={styles.progressTrack}><i style={{ width: `${remainingPercent(tool)}%` }} /></div>
            </div>
          </header>
          <div className={styles.detailBody}>
            <section className={styles.measureBand}>
              <div><span>Ursprungsmaß</span><strong>{tool.originalMeasure}</strong></div><ArrowRight /><div><span>Aktuelles Maß</span><strong>{tool.currentMeasure}</strong></div><div><span>Gesamtabtrag</span><strong>{tool.totalRemoval}</strong></div>
            </section>
            <section className={styles.detailSection}><div className={styles.sectionTitle}><div><h3>Technische Daten</h3><p>Vollständige Werkzeugparameter</p></div><Info size={20} /></div><dl className={styles.techGrid}>{Object.entries(tool.details).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
            <section className={styles.detailSection}><div className={styles.sectionTitle}><div><h3>Schärfhistorie</h3><p>{tool.history.length} dokumentierte Ereignisse · zuletzt {tool.lastSharpened}</p></div><History size={20} /></div><div className={styles.timeline}>{tool.history.map((entry, index) => <article key={`${entry.date}-${index}`}><i className={entry.action === "Ausgemustert" ? styles.timelineArchive : ""}>{entry.action === "Ausgemustert" ? <Archive size={15} /> : <Check size={15} />}</i><div><time>{entry.date}</time><h4>{entry.action}</h4><ul>{entry.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>{entry.result && <p><CircleCheck size={15} /> {entry.result}</p>}</div></article>)}</div></section>
          </div>
        </motion.article>
      </motion.div>}
    </AnimatePresence>
  );
}

function Scanner({ open, onClose, onOpen }: { open: boolean; onClose: () => void; onOpen: (tool: Tool) => void }) {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const timerRef = useRef<number | null>(null);
  const clearOpenTimer = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);
  const close = useCallback(() => {
    clearOpenTimer();
    setScanState("idle");
    onClose();
  }, [clearOpenTimer, onClose]);
  const scan = useCallback((rawCode: string) => {
    const code = rawCode.trim();
    const found = code === DEMO_QR_TOOL_ID ? tools.find((tool) => tool.id === code) : undefined;
    clearOpenTimer();
    if (!found) return setScanState("error");
    setScanState("success");
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setScanState("idle");
      onClose();
      onOpen(found);
    }, 850);
  }, [clearOpenTimer, onClose, onOpen]);
  useEffect(() => clearOpenTimer, [clearOpenTimer]);
  return <AnimatePresence>{open && <motion.div className={styles.scannerOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.section role="dialog" aria-modal="true" aria-label="QR-Code-Scanner" className={styles.scanner} initial={{ scale: .96 }} animate={{ scale: 1 }} exit={{ scale: .96 }}>
      <header><div><span className={styles.scannerIcon}><QrCode /></span><div><h2>Werkzeug scannen</h2><p>QR-Code am Werkzeug scannen</p></div></div><button onClick={close} aria-label="Scanner schließen"><X /></button></header>
      <div className={`${styles.scanViewport} ${scanState === "success" ? styles.scanSuccess : scanState === "error" ? styles.scanError : ""}`}>
        <div className={styles.scanCorners}><i /><i /><i /><i /></div>
        {scanState === "success" ? <div className={styles.scanMessage}><span><Check /></span><strong>Werkzeug erkannt</strong><code>{DEMO_QR_TOOL_ID}</code><small>Werkzeugpass wird geöffnet</small></div> : scanState === "error" ? <div className={styles.scanMessage}><span><XCircle /></span><strong>Dieser QR-Code ist nicht gültig</strong><small>Bitte den QR-Code für {DEMO_QR_TOOL_ID} verwenden</small></div> : <><div className={styles.cameraFrame}><QrScannerView onScan={scan} labels={{ cameraStarting: "Kamera wird gestartet …", cameraUnavailable: "Kamera nicht verfügbar. Bitte Kamerazugriff erlauben.", retryCamera: "Kamera erneut starten" }} /></div><span className={styles.scanLine} /><p>QR-Code innerhalb des Rahmens positionieren</p></>}
      </div>
      <div className={styles.scannerControls}>
        <p><QrCode size={18} /> Demo-Werkzeug <strong>{DEMO_QR_TOOL_ID}</strong></p>
        <button className={styles.simulateButton} onClick={() => scan(DEMO_QR_TOOL_ID)} disabled={scanState === "success"}><QrCode size={18} /> Demo-Scan simulieren</button>
        {scanState === "error" && <button className={styles.retryButton} onClick={() => setScanState("idle")}>Erneut versuchen</button>}
      </div>
    </motion.section>
  </motion.div>}</AnimatePresence>;
}

function Dashboard({ onNavigate, onOpen }: { onNavigate: (view: View) => void; onOpen: (tool: Tool) => void }) {
  const totals = useMemo(() => ({
    customer: tools.filter((tool) => tool.status === "Beim Kunden").length,
    service: tools.filter((tool) => tool.status === "Beim Schärfen").length,
    archive: archivedTools.length,
    sharpenings: tools.reduce((sum, tool) => sum + tool.usedSharpeningCycles, 0),
    avgCycles: (activeTools.reduce((sum, tool) => sum + remainingCycles(tool), 0) / activeTools.length).toFixed(1).replace(".", ","),
    avgLife: Math.round(activeTools.reduce((sum, tool) => sum + remainingPercent(tool), 0) / activeTools.length),
  }), []);
  const critical = activeTools.filter((tool) => reserve(tool).tone === "low" || reserve(tool).tone === "critical");
  const mainKpis = [
    { value: tools.length, label: "Werkzeuge gesamt", detail: "Vollständiger Bestand", icon: <ToolCase />, tone: "coral" },
    { value: totals.customer, label: "Beim Kunden", detail: "Vor Ort verfügbar", icon: <PackageCheck />, tone: "green" },
    { value: totals.service, label: "Beim Schärfen", detail: "Aktuell bei Gudel", icon: <Sparkles />, tone: "amber" },
    { value: totals.archive, label: "Im Archiv", detail: "Lebensdauer erreicht", icon: <Archive />, tone: "slate" },
  ];
  return <>
    <section className={styles.hero}>
      <div><p>Guten Morgen, Holzwerk Muster GmbH</p><h1>Digitaler<br /><span>Werkzeugschrank</span></h1><p className={styles.heroCopy}>Alle Werkzeuge, Schärfzyklen und technischen Daten – zentral in einem digitalen Werkzeugpass.</p></div>
      <button className={styles.heroAction} onClick={() => onNavigate("tools")}><span><Eye /></span><div><strong>Bestand ansehen</strong><small>9 aktive Werkzeuge</small></div><ArrowRight /></button>
      <div className={styles.heroOrbit} aria-hidden="true"><Gauge /><span>GW-SB</span><i /></div>
    </section>
    <section className={styles.kpiGrid}>{mainKpis.map((kpi, index) => <motion.button key={kpi.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .07 }} className={`${styles.kpi} ${styles[kpi.tone]}`} onClick={() => onNavigate(kpi.label === "Im Archiv" ? "archive" : kpi.label === "Werkzeuge gesamt" ? "tools" : "tools")}><span>{kpi.icon}</span><strong>{kpi.value}</strong><div><b>{kpi.label}</b><small>{kpi.detail}</small></div></motion.button>)}</section>
    <section className={styles.insightStrip}>
      <div><Gauge /><span><b>{totals.avgCycles}</b> Ø Zyklen übrig</span></div><div><ShieldCheck /><span><b>{totals.avgLife} %</b> Ø Restlebensdauer</span></div><div><History /><span><b>{totals.sharpenings}</b> Schärfungen gesamt</span></div><div><Clock3 /><span><b>12.08.2026</b> Letzte Schärfung</span></div>
    </section>
    <section className={styles.dashboardGrid}>
      <div className={styles.sectionBlock}><div className={styles.sectionHeading}><div><h2>Bestand nach Gruppen</h2><p>Status der aktiven Werkzeuge</p></div><button onClick={() => onNavigate("tools")}>Alle anzeigen <ArrowRight /></button></div><div className={styles.groupRows}>{categories.map((category) => { const group = activeTools.filter((tool) => tool.category === category); return <button key={category} onClick={() => onNavigate("tools")}><span className={styles.groupIcon}>{category === "Sägeblätter" ? <Gauge /> : <Wrench />}</span><div><strong>{category}</strong><small>{group.length} Werkzeuge · {group.filter((tool) => tool.status === "Beim Schärfen").length} beim Schärfen</small></div><div className={styles.groupMini}>{group.map((tool) => <i key={tool.id} className={tool.status === "Beim Schärfen" ? styles.miniService : remainingCycles(tool) <= 3 ? styles.miniCritical : ""} />)}</div><ArrowRight /></button>; })}</div></div>
      <div className={`${styles.sectionBlock} ${styles.criticalBlock}`}><div className={styles.sectionHeading}><div><h2>Reserve im Blick</h2><p>{critical.length} Werkzeuge mit geringer oder kritischer Reserve</p></div><CircleAlert /></div><div className={styles.criticalList}>{critical.map((tool) => <button key={tool.id} onClick={() => onOpen(tool)}><div><strong>{tool.name}</strong><code>{tool.id}</code></div><span><b>{remainingCycles(tool)}</b> Zyklen</span><ArrowRight /></button>)}</div></div>
    </section>
  </>;
}

function ToolList({ onOpen }: { onOpen: (tool: Tool) => void }) {
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ "Sägeblätter": true, "DP-Fräser": true, "Fräser": true });
  const filtered = activeTools.filter((tool) => `${tool.name} ${tool.id} ${tool.specification}`.toLowerCase().includes(query.toLowerCase()));
  return <section className={styles.pageSection}>
    <div className={styles.pageTitle}><div><h1>Meine Werkzeuge</h1><p>{activeTools.length} aktive Werkzeugpässe</p></div><span><ToolCase /></span></div>
    <label className={styles.search}><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Werkzeug, Maß oder ID suchen" /></label>
    {categories.map((category) => { const group = filtered.filter((tool) => tool.category === category); const open = openGroups[category]; return <section className={styles.category} key={category}><button className={styles.categoryHead} onClick={() => setOpenGroups((current) => ({ ...current, [category]: !open }))}><span className={styles.groupIcon}>{category === "Sägeblätter" ? <Gauge /> : <Wrench />}</span><div><h2>{category}</h2><p>{group.length} Werkzeuge · {group.filter((tool) => tool.status === "Beim Kunden").length} beim Kunden · {group.filter((tool) => tool.status === "Beim Schärfen").length} beim Schärfen</p></div><ChevronDown className={open ? styles.rotated : ""} /></button><AnimatePresence initial={false}>{open && <motion.div className={styles.toolGrid} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{group.length ? group.map((tool) => <ToolCard key={tool.id} tool={tool} onOpen={onOpen} />) : <div className={styles.empty}><Search /><h3>Keine Werkzeuge gefunden</h3><p>Suchbegriff ändern oder zurücksetzen.</p></div>}</motion.div>}</AnimatePresence></section>; })}
  </section>;
}

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function AnalysisView() {
  const [period, setPeriod] = useState<AnalysisPeriod>("year");
  const [from, setFrom] = useState("2026-01");
  const [to, setTo] = useState("2026-08");
  const months = useMemo(() => filterServiceHistory(period, from, to), [period, from, to]);
  const summary = useMemo(() => summarizeServiceHistory(months), [months]);
  const year = useMemo(() => summarizeServiceHistory(filterServiceHistory("year")), []);
  const currentMonth = useMemo(() => summarizeServiceHistory(filterServiceHistory("month")), []);
  const previousMonths = useMemo(() => {
    const firstIndex = serviceHistory.findIndex((month) => month.key === months[0]?.key);
    return serviceHistory.slice(Math.max(0, firstIndex - months.length), firstIndex);
  }, [months]);
  const previous = useMemo(() => summarizeServiceHistory(previousMonths), [previousMonths]);
  const costDelta = previous.totalCost ? Math.round(((summary.totalCost - previous.totalCost) / previous.totalCost) * 100) : 0;
  const avgTool = Math.round(year.totalCost / tools.length);
  const avgSharpening = Math.round(year.sharpeningCost / year.sharpenings);
  const periodTitle = period === "custom" ? `${from.replace("-", ".")}–${to.replace("-", ".")}` : periodLabels[period];
  const costSplit = [
    { name: "Schärfen", value: summary.sharpeningCost, color: "#FF6B6D" },
    { name: "Sonderarbeiten", value: summary.specialCost, color: "#4ECDC4" },
    { name: "Sonstige", value: summary.otherCost, color: "#868E96" },
  ];
  const kpis = [
    { label: "Schärfkosten August", value: euro.format(currentMonth.sharpeningCost), detail: "aktueller Monat", icon: <Sparkles /> },
    { label: "Schärfkosten 2026", value: euro.format(year.sharpeningCost), detail: "Januar bis August", icon: <TrendingUp /> },
    { label: "Sonderarbeitskosten", value: euro.format(year.specialCost), detail: "11 Sonderarbeiten", icon: <Wrench /> },
    { label: "Werkzeugservice gesamt", value: euro.format(year.totalCost), detail: "reine Dummy-Daten", icon: <WalletCards /> },
    { label: "Ø Kosten pro Werkzeug", value: euro.format(avgTool), detail: "bei 10 Werkzeugen", icon: <ToolCase /> },
    { label: "Ø Kosten pro Schärfung", value: euro.format(avgSharpening), detail: "ohne Sonderarbeiten", icon: <Gauge /> },
  ];
  return <section className={`${styles.pageSection} ${styles.analysisPage}`}>
    <div className={styles.analysisHeader}>
      <div><h1>Analyse</h1><p>Werkzeugnutzung, Serviceereignisse und Kosten im Zeitverlauf</p></div>
      <span><BarChart3 /></span>
    </div>
    <div className={styles.analysisHero}>
      <div className={styles.analysisHeroCopy}><p>2026 bisher</p><strong>{year.sharpenings}</strong><span>Schärfungen</span></div>
      <div className={styles.analysisHeroFacts}><div><b>{year.specialWork}</b><span>Sonderarbeiten</span></div><div><b>{euro.format(year.totalCost)}</b><span>Gesamtkosten</span></div><div><b>4</b><span>Werkzeuge neu / ersetzt</span></div></div>
      <div className={styles.analysisPulse} aria-hidden="true"><BarChart3 /><i /><i /><i /><i /></div>
    </div>
    <div className={styles.periodPanel}>
      <div className={styles.periodHeading}><div><h2>Zeitraum auswählen</h2><p>Alle Diagramme reagieren auf den Filter</p></div><CalendarDays /></div>
      <div className={styles.periodTabs} role="group" aria-label="Analysezeitraum">{(Object.keys(periodLabels) as AnalysisPeriod[]).map((key) => <button key={key} className={period === key ? styles.periodActive : ""} onClick={() => setPeriod(key)}>{periodLabels[key]}</button>)}</div>
      <AnimatePresence initial={false}>{period === "custom" && <motion.div className={styles.customPeriod} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}><label><span>Von</span><input type="month" value={from} min="2025-01" max={to} onChange={(event) => setFrom(event.target.value)} /></label><ArrowRight /><label><span>Bis</span><input type="month" value={to} min={from} max="2026-08" onChange={(event) => setTo(event.target.value)} /></label></motion.div>}</AnimatePresence>
    </div>
    <section className={styles.analysisKpis}>{kpis.map((kpi, index) => <motion.article key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }}><span>{kpi.icon}</span><div><small>{kpi.label}</small><strong>{kpi.value}</strong><p>{kpi.detail}</p></div></motion.article>)}</section>
    <section className={styles.chartFeature}>
      <div className={styles.chartHeading}><div><h2>Serviceereignisse</h2><p>{periodTitle} · Schärfungen und Sonderarbeiten</p></div><div className={`${styles.comparisonBadge} ${costDelta <= 0 ? styles.comparisonGood : ""}`}>{costDelta <= 0 ? <TrendingDown /> : <TrendingUp />}<span><b>{Math.abs(costDelta)} %</b> Kosten zum Vorzeitraum</span></div></div>
      <div className={styles.mainChart} role="img" aria-label="Diagramm der Schärfungen und Sonderarbeiten im gewählten Zeitraum"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={months} margin={{ top: 12, right: 2, left: -28, bottom: 0 }}><CartesianGrid stroke="#EAECEF" vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#7A828E", fontSize: 11 }} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#7A828E", fontSize: 10 }} /><Tooltip contentStyle={{ border: 0, borderRadius: 12, boxShadow: "0 14px 36px rgba(30,35,48,.16)", fontSize: 12 }} /><Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 12 }} /><Bar dataKey="sharpenings" name="Schärfungen" fill="#FF6B6D" radius={[6, 6, 2, 2]} maxBarSize={36} /><Line dataKey="specialWork" name="Sonderarbeiten" type="monotone" stroke="#232734" strokeWidth={3} dot={{ fill: "#4ECDC4", stroke: "#232734", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} /></ComposedChart></ResponsiveContainer></div>
      <div className={styles.chartSummary}><div><b>{summary.sharpenings}</b><span>Schärfungen</span></div><div><b>{summary.specialWork}</b><span>Sonderarbeiten</span></div><div><b>{summary.replacements}</b><span>neu / ersetzt</span></div><div><b>{summary.exhausted}</b><span>aufgebraucht</span></div></div>
    </section>
    <div className={styles.analysisGrid}>
      <section className={styles.costChartCard}><div className={styles.chartHeading}><div><h2>Kostenentwicklung</h2><p>Monatliche Werkzeugservicekosten</p></div><strong>{euro.format(summary.totalCost)}</strong></div><div className={styles.costChart}><ResponsiveContainer width="100%" height="100%"><AreaChart data={months} margin={{ top: 15, right: 5, left: -18, bottom: 0 }}><defs><linearGradient id="costFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF6B6D" stopOpacity={.34} /><stop offset="100%" stopColor="#FF6B6D" stopOpacity={.02} /></linearGradient></defs><CartesianGrid stroke="#EAECEF" vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#7A828E", fontSize: 10 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: "#7A828E", fontSize: 9 }} /><Tooltip contentStyle={{ border: 0, borderRadius: 12, boxShadow: "0 14px 36px rgba(30,35,48,.16)", fontSize: 12 }} /><Area type="monotone" dataKey={(row) => row.sharpeningCost + row.specialCost + row.otherCost} name="Gesamtkosten" stroke="#FF6B6D" strokeWidth={3} fill="url(#costFill)" /></AreaChart></ResponsiveContainer></div></section>
      <section className={styles.costSplitCard}><div className={styles.chartHeading}><div><h2>Kostenaufteilung</h2><p>Nach Leistungsart</p></div></div><div className={styles.splitLayout}><div className={styles.pieChart}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={costSplit} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={3} stroke="none" animationDuration={700}>{costSplit.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={{ border: 0, borderRadius: 12, boxShadow: "0 14px 36px rgba(30,35,48,.16)", fontSize: 12 }} /></PieChart></ResponsiveContainer><div><strong>{euro.format(summary.totalCost)}</strong><span>gesamt</span></div></div><div className={styles.costLegend}>{costSplit.map((entry) => <div key={entry.name}><i style={{ background: entry.color }} /><span>{entry.name}</span><b>{euro.format(entry.value)}</b></div>)}</div></div></section>
    </div>
    <section className={styles.eventTimeline}><div className={styles.chartHeading}><div><h2>Zeitstrahl</h2><p>Monatliche Ereignisse im Detail</p></div></div><div>{[...months].reverse().map((month) => <article key={month.key}><time>{month.longLabel}</time><span><Sparkles /> <b>{month.sharpenings}</b> Schärfungen</span><span><Wrench /> <b>{month.specialWork}</b> Sonderarbeiten</span><span><ToolCase /> <b>{month.replacements}</b> neu / ersetzt</span>{month.exhausted > 0 && <span className={styles.eventCritical}><Archive /> <b>{month.exhausted}</b> aufgebraucht</span>}</article>)}</div></section>
    <p className={styles.dummyNotice}><Info /> Alle Werte im Analysebereich sind strukturierte Dummy-Daten für die Präsentation.</p>
  </section>;
}

function ArchiveView({ onOpen }: { onOpen: (tool: Tool) => void }) {
  return <section className={styles.pageSection}><div className={styles.pageTitle}><div><h1>Archivierte Werkzeuge</h1><p>{archivedTools.length} Werkzeug mit erreichter Lebensdauer</p></div><span className={styles.archiveTitle}><Archive /></span></div><div className={styles.archiveNotice}><Info /><div><strong>Historie bleibt erhalten</strong><p>Archivierte Werkzeuge sind nicht mehr im aktiven Bestand, ihr vollständiger Werkzeugpass bleibt jedoch einsehbar.</p></div></div><div className={styles.toolGrid}>{archivedTools.map((tool) => <ToolCard key={tool.id} tool={tool} onOpen={onOpen} />)}</div></section>;
}

function ProfileView() {
  return <section className={styles.pageSection}><div className={styles.pageTitle}><div><h1>Profil</h1><p>Kundenzugang und Portal-Informationen</p></div><span><UserRound /></span></div><div className={styles.profilePanel}><div className={styles.avatar}>HM</div><div><h2>Holzwerk Muster GmbH</h2><p>kunde@gudel-werkzeuge.de</p><span><ShieldCheck /> Demo-Kundenzugang</span></div></div><div className={styles.profileFacts}><div><MapPin /><span><small>Kundenstandort</small><b>Bochum, Deutschland</b></span></div><div><ToolCase /><span><small>Werkzeugbestand</small><b>10 digitale Werkzeugpässe</b></span></div></div></section>;
}

export default function WerkzeugschrankPage() {
  const [view, setView] = useState<View>("overview");
  const [detail, setDetail] = useState<Tool | null>(null);
  const [scanner, setScanner] = useState(false);
  const navigate = (next: View) => { setView(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const nav = [
    { id: "overview" as View, label: "Übersicht", icon: <Home /> },
    { id: "tools" as View, label: "Werkzeuge", icon: <ToolCase /> },
    { id: "analysis" as View, label: "Analyse", icon: <BarChart3 /> },
    { id: "archive" as View, label: "Archiv", icon: <Archive /> },
    { id: "profile" as View, label: "Profil", icon: <UserRound /> },
  ];
  const mobileNav = nav.filter((item) => item.id !== "profile");
  return <div className={styles.appShell}>
    <header className={styles.topbar}><button className={styles.brand} onClick={() => navigate("overview")}><span><Image src="/digitaler-werkzeugschrank/logo.svg" alt="TMS" width={44} height={44} /></span><div><strong>Digitaler Werkzeugschrank</strong><small>Gudel Werkzeuge</small></div></button><div className={styles.topActions}><button aria-label="Menü"><Menu /></button><button className={styles.account} onClick={() => navigate("profile")}><span>HM</span><div><strong>Holzwerk Muster</strong><small>Kundenportal</small></div></button></div></header>
    <aside className={styles.sidebar}><div className={styles.sideLogo}><Image src="/digitaler-werkzeugschrank/logo.svg" alt="TMS" width={50} height={50} /></div><nav>{nav.map((item) => <button key={item.id} className={view === item.id ? styles.activeNav : ""} onClick={() => navigate(item.id)}>{item.icon}<span>{item.label}</span></button>)}</nav><button className={styles.sideScan} onClick={() => setScanner(true)}><QrCode /><span>Scannen</span></button></aside>
    <main className={styles.main}>{view === "overview" && <Dashboard onNavigate={navigate} onOpen={setDetail} />}{view === "tools" && <ToolList onOpen={setDetail} />}{view === "analysis" && <AnalysisView />}{view === "archive" && <ArchiveView onOpen={setDetail} />}{view === "profile" && <ProfileView />}</main>
    <nav className={styles.bottomNav}>{mobileNav.slice(0, 2).map((item) => <button key={item.id} className={view === item.id ? styles.activeNav : ""} onClick={() => navigate(item.id)}>{item.icon}<span>{item.label}</span></button>)}<button className={styles.centerScan} onClick={() => setScanner(true)}><span><QrCode /></span><b>Scannen</b></button>{mobileNav.slice(2).map((item) => <button key={item.id} className={view === item.id ? styles.activeNav : ""} onClick={() => navigate(item.id)}>{item.icon}<span>{item.label}</span></button>)}</nav>
    <DetailSheet tool={detail} onClose={() => setDetail(null)} />
    <Scanner open={scanner} onClose={() => setScanner(false)} onOpen={setDetail} />
  </div>;
}
