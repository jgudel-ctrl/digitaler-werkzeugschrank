"use client";

import { useEffect, useRef, useState } from "react";
import { CameraOff, Loader2, RotateCcw } from "lucide-react";
import QrScanner from "qr-scanner";

interface QrScannerLabels {
  cameraStarting: string;
  cameraUnavailable: string;
  retryCamera?: string;
}

interface QrScannerViewProps {
  onScan: (code: string) => void;
  labels: QrScannerLabels;
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

const retryStyle = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  marginTop: 4,
  padding: "9px 12px",
  border: "1px solid rgba(255,255,255,.38)",
  borderRadius: 10,
  color: "white",
  background: "rgba(255,255,255,.12)",
  cursor: "pointer",
} as const;

export function QrScannerView({ onScan, labels, paused = false }: QrScannerViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const onScanRef = useRef(onScan);
  const [status, setStatus] = useState<"loading" | "active" | "error">("loading");
  const [restartKey, setRestartKey] = useState(0);
  const lastScanRef = useRef<{ code: string; at: number } | null>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;
    setStatus("loading");

    const scanner = new QrScanner(
      video,
      (result) => {
        const code = result.data;
        const now = Date.now();
        if (lastScanRef.current?.code === code && now - lastScanRef.current.at < 2000) return;
        lastScanRef.current = { code, at: now };
        onScanRef.current(code);
      },
      { highlightScanRegion: true, highlightCodeOutline: true, maxScansPerSecond: 5 },
    );
    scannerRef.current = scanner;
    scanner.start()
      .then(() => { if (!disposed) setStatus("active"); })
      .catch(() => { if (!disposed) setStatus("error"); });

    return () => {
      disposed = true;
      scanner.stop();
      scanner.destroy();
      if (scannerRef.current === scanner) scannerRef.current = null;
    };
  }, [restartKey]);

  useEffect(() => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    const wasPaused = pausedRef.current;
    pausedRef.current = paused;
    if (paused) scanner.pause();
    else if (wasPaused) scanner.start().catch(() => setStatus("error"));
  }, [paused]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#000" }}>
      <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted playsInline />
      {status === "loading" && <div style={overlayStyle}><Loader2 /><span>{labels.cameraStarting}</span></div>}
      {status === "error" && <div style={overlayStyle}>
        <CameraOff />
        <span>{labels.cameraUnavailable}</span>
        <button type="button" style={retryStyle} onClick={() => setRestartKey((key) => key + 1)}><RotateCcw size={16} /> {labels.retryCamera ?? "Retry camera"}</button>
      </div>}
    </div>
  );
}
