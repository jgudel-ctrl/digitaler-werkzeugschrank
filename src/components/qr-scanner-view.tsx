"use client";

import { useEffect, useRef, useState } from "react";
import { CameraOff, Loader2 } from "lucide-react";
import QrScanner from "qr-scanner";

interface QrScannerViewProps {
  onScan: (code: string) => void;
  paused?: boolean;
}

const overlayStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: 16,
  textAlign: "center",
  color: "white",
  background: "rgba(0,0,0,.78)",
  zIndex: 6,
} as const;

export function QrScannerView({ onScan, paused = false }: QrScannerViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [status, setStatus] = useState<"lädt" | "aktiv" | "fehler">("lädt");
  const lastScanRef = useRef<{ code: string; at: number } | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const scanner = new QrScanner(
      video,
      (result) => {
        const code = result.data;
        const now = Date.now();
        if (lastScanRef.current?.code === code && now - lastScanRef.current.at < 2000) return;
        lastScanRef.current = { code, at: now };
        onScan(code);
      },
      { highlightScanRegion: true, highlightCodeOutline: true, maxScansPerSecond: 5 },
    );
    scannerRef.current = scanner;
    scanner.start().then(() => setStatus("aktiv")).catch(() => setStatus("fehler"));

    return () => {
      scanner.stop();
      scanner.destroy();
      scannerRef.current = null;
    };
  }, [onScan]);

  useEffect(() => {
    if (!scannerRef.current) return;
    if (paused) scannerRef.current.pause();
    else if (status === "aktiv") scannerRef.current.start().catch(() => undefined);
  }, [paused, status]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#000" }}>
      <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted playsInline />
      {status === "lädt" && <div style={overlayStyle}><Loader2 /><span>Kamera wird gestartet …</span></div>}
      {status === "fehler" && <div style={overlayStyle}><CameraOff /><span>Kamera nicht verfügbar. Bitte den Kamerazugriff erlauben.</span></div>}
    </div>
  );
}
