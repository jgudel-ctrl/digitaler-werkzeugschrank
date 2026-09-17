import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Digitaler Werkzeugschrank — TMS",
  description: "Digitaler Werkzeugbestand, Schärfzyklen und Werkzeugpässe von Gudel Werkzeuge.",
};

export default function GermanLayout({ children }: { children: React.ReactNode }) {
  return <html lang="de"><body>{children}</body></html>;
}
