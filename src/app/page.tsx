"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive, ArrowRight, Check, ChevronDown, CircleAlert, CircleCheck,
  Clock3, Eye, Gauge, History, Home, Info, KeyRound, LogOut, Mail,
  MapPin, Menu, PackageCheck, QrCode, ScanLine, Search, ShieldCheck,
  Sparkles, ToolCase, UserRound, Wrench, X, XCircle,
} from "lucide-react";
import styles from "./werkzeugschrank.module.css";
import {
  activeTools, archivedTools, categories, remainingCycles, remainingPercent,
  Tool, tools,
} from "./tools";

type View = "overview" | "tools" | "archive" | "profile";
type ScanState = "idle" | "scanning" | "success" | "error";

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

function Login({ onLogin }: { onLogin: () => void }) {
  const [busy, setBusy] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    window.setTimeout(onLogin, 650);
  };
  return (
    <main className={styles.loginPage}>
      <div className={styles.loginHalo} aria-hidden="true" />
      <section className={styles.loginCard} aria-labelledby="login-title">
        <div className={styles.loginBrand}>
          <div className={styles.logoPlate}><Image src="/digitaler-werkzeugschrank/logo.svg" alt="TMS" width={92} height={92} priority /></div>
          <div>
            <p>Gudel Werkzeuge</p>
            <h1 id="login-title">Digitaler<br />Werkzeugschrank</h1>
          </div>
          <div className={styles.loginPreview} aria-hidden="true">
            <span><QrCode size={23} /></span>
            <div><strong>10</strong><small>Werkzeugpässe</small></div>
            <div className={styles.previewBars}><i /><i /><i /></div>
          </div>
        </div>
        <form className={styles.loginForm} onSubmit={submit}>
          <div className={styles.loginIntro}>
            <h2>Willkommen zurück</h2>
            <p>Ihr Werkzeugbestand. Jederzeit griffbereit.</p>
          </div>
          <label><span>E-Mail</span><div className={styles.inputWrap}><Mail size={18} /><input type="email" defaultValue="kunde@gudel-werkzeuge.de" required /></div></label>
          <label><span>Passwort</span><div className={styles.inputWrap}><KeyRound size={18} /><input type="password" defaultValue="werkzeugschrank" required /></div></label>
          <button className={styles.primaryButton} type="submit" disabled={busy}>
            {busy ? <><span className={styles.spinner} /> Werkzeugschrank wird geöffnet</> : <>Anmelden <ArrowRight size={18} /></>}
          </button>
          <p className={styles.demoHint}><ShieldCheck size={16} /> Geschützter Demo-Zugang · Keine Echtdaten</p>
        </form>
      </section>
    </main>
  );
}

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
  const [selected, setSelected] = useState("GW-SB-000184");
  const close = () => { setScanState("idle"); onClose(); };
  const scan = () => {
    setScanState("scanning");
    window.setTimeout(() => {
      const found = tools.find((tool) => tool.id === selected);
      if (!found) return setScanState("error");
      setScanState("success");
      window.setTimeout(() => { close(); onOpen(found); }, 850);
    }, 1150);
  };
  return <AnimatePresence>{open && <motion.div className={styles.scannerOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.section role="dialog" aria-modal="true" aria-label="QR-Code Scanner" className={styles.scanner} initial={{ scale: .96 }} animate={{ scale: 1 }} exit={{ scale: .96 }}>
      <header><div><span className={styles.scannerIcon}><QrCode /></span><div><h2>Werkzeug scannen</h2><p>QR-Code am Werkzeug scannen</p></div></div><button onClick={close} aria-label="Scanner schließen"><X /></button></header>
      <div className={`${styles.scanViewport} ${scanState === "success" ? styles.scanSuccess : scanState === "error" ? styles.scanError : ""}`}>
        <div className={styles.scanCorners}><i /><i /><i /><i /></div>
        {scanState === "success" ? <div className={styles.scanMessage}><span><Check /></span><strong>Werkzeug erkannt</strong><small>{selected === "GW-SB-000099" ? "Lebensdauer erreicht · Werkzeugpass wird geöffnet" : "Werkzeugpass wird geöffnet"}</small></div> : scanState === "error" ? <div className={styles.scanMessage}><span><XCircle /></span><strong>Werkzeug nicht gefunden</strong><small>Code prüfen oder erneut scannen</small></div> : <><QrCode size={76} strokeWidth={1.3} /><span className={styles.scanLine} /><p>{scanState === "scanning" ? "Werkzeug-ID wird gelesen …" : "Code innerhalb des Rahmens positionieren"}</p></>}
      </div>
      <div className={styles.scannerControls}>
        <label><span>Demo-Werkzeug-ID</span><select value={selected} onChange={(event) => { setSelected(event.target.value); setScanState("idle"); }}><option value="GW-SB-000184">GW-SB-000184 · Sägeblatt</option><option value="GW-DP-000203">GW-DP-000203 · kritisch</option><option value="GW-FR-000301">GW-FR-000301 · Fräser</option><option value="GW-SB-000099">GW-SB-000099 · archiviert</option><option value="UNBEKANNT-4711">Unbekannter QR-Code</option></select></label>
        <button className={styles.scanButton} onClick={scan} disabled={scanState === "scanning" || scanState === "success"}><ScanLine /> {scanState === "scanning" ? "Scan läuft …" : "Dummy QR-Code scannen"}</button>
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

function ArchiveView({ onOpen }: { onOpen: (tool: Tool) => void }) {
  return <section className={styles.pageSection}><div className={styles.pageTitle}><div><h1>Archivierte Werkzeuge</h1><p>{archivedTools.length} Werkzeug mit erreichter Lebensdauer</p></div><span className={styles.archiveTitle}><Archive /></span></div><div className={styles.archiveNotice}><Info /><div><strong>Historie bleibt erhalten</strong><p>Archivierte Werkzeuge sind nicht mehr im aktiven Bestand, ihr vollständiger Werkzeugpass bleibt jedoch einsehbar.</p></div></div><div className={styles.toolGrid}>{archivedTools.map((tool) => <ToolCard key={tool.id} tool={tool} onOpen={onOpen} />)}</div></section>;
}

function ProfileView({ onLogout }: { onLogout: () => void }) {
  return <section className={styles.pageSection}><div className={styles.pageTitle}><div><h1>Profil</h1><p>Kundenzugang und Portal-Informationen</p></div><span><UserRound /></span></div><div className={styles.profilePanel}><div className={styles.avatar}>HM</div><div><h2>Holzwerk Muster GmbH</h2><p>kunde@gudel-werkzeuge.de</p><span><ShieldCheck /> Demo-Kundenzugang</span></div></div><div className={styles.profileFacts}><div><MapPin /><span><small>Kundenstandort</small><b>Bochum, Deutschland</b></span></div><div><ToolCase /><span><small>Werkzeugbestand</small><b>10 digitale Werkzeugpässe</b></span></div></div><button className={styles.logoutButton} onClick={onLogout}><LogOut /> Abmelden</button></section>;
}

export default function WerkzeugschrankPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<View>("overview");
  const [detail, setDetail] = useState<Tool | null>(null);
  const [scanner, setScanner] = useState(false);
  const navigate = (next: View) => { setView(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;
  const nav = [
    { id: "overview" as View, label: "Übersicht", icon: <Home /> },
    { id: "tools" as View, label: "Werkzeuge", icon: <ToolCase /> },
    { id: "archive" as View, label: "Archiv", icon: <Archive /> },
    { id: "profile" as View, label: "Profil", icon: <UserRound /> },
  ];
  return <div className={styles.appShell}>
    <header className={styles.topbar}><button className={styles.brand} onClick={() => navigate("overview")}><span><Image src="/digitaler-werkzeugschrank/logo.svg" alt="TMS" width={44} height={44} /></span><div><strong>Digitaler Werkzeugschrank</strong><small>Gudel Werkzeuge</small></div></button><div className={styles.topActions}><button aria-label="Menü"><Menu /></button><button className={styles.account} onClick={() => navigate("profile")}><span>HM</span><div><strong>Holzwerk Muster</strong><small>Kundenportal</small></div></button></div></header>
    <aside className={styles.sidebar}><div className={styles.sideLogo}><Image src="/digitaler-werkzeugschrank/logo.svg" alt="TMS" width={50} height={50} /></div><nav>{nav.map((item) => <button key={item.id} className={view === item.id ? styles.activeNav : ""} onClick={() => navigate(item.id)}>{item.icon}<span>{item.label}</span></button>)}</nav><button className={styles.sideScan} onClick={() => setScanner(true)}><QrCode /><span>Scannen</span></button><button className={styles.sideLogout} onClick={() => setLoggedIn(false)}><LogOut /></button></aside>
    <main className={styles.main}>{view === "overview" && <Dashboard onNavigate={navigate} onOpen={setDetail} />}{view === "tools" && <ToolList onOpen={setDetail} />}{view === "archive" && <ArchiveView onOpen={setDetail} />}{view === "profile" && <ProfileView onLogout={() => setLoggedIn(false)} />}</main>
    <nav className={styles.bottomNav}>{nav.slice(0, 2).map((item) => <button key={item.id} className={view === item.id ? styles.activeNav : ""} onClick={() => navigate(item.id)}>{item.icon}<span>{item.label}</span></button>)}<button className={styles.centerScan} onClick={() => setScanner(true)}><span><QrCode /></span><b>Scannen</b></button>{nav.slice(2).map((item) => <button key={item.id} className={view === item.id ? styles.activeNav : ""} onClick={() => navigate(item.id)}>{item.icon}<span>{item.label}</span></button>)}</nav>
    <DetailSheet tool={detail} onClose={() => setDetail(null)} />
    <Scanner open={scanner} onClose={() => setScanner(false)} onOpen={setDetail} />
  </div>;
}
