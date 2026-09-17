import Link from "next/link";

export default function LanguageSelection() {
  return <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: 24, background: "#f4f6f8", fontFamily: "Arial, sans-serif", color: "#232734" }}>
    <section style={{ width: "min(100%, 560px)", padding: 32, borderRadius: 22, background: "white", boxShadow: "0 18px 55px rgba(35,39,52,.12)", textAlign: "center" }}>
      <p style={{ color: "#d3484b", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>Gudel Werkzeuge</p>
      <h1 style={{ margin: "8px 0 10px", fontSize: 36 }}>Digitaler Werkzeugschrank</h1>
      <p style={{ margin: "0 0 26px", color: "#68707d" }}>Sprache wählen · Choose language</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        <Link href="/de/" style={{ padding: 16, borderRadius: 12, background: "#ff6b6d", color: "white", textDecoration: "none", fontWeight: 800 }}>Deutsch</Link>
        <Link href="/en/" style={{ padding: 16, borderRadius: 12, background: "#232734", color: "white", textDecoration: "none", fontWeight: 800 }}>English</Link>
      </div>
    </section>
  </main>;
}
