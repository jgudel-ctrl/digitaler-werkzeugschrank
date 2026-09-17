import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Digitale gereedschapskast — TMS",
  description: "Digitaal gereedschapsbeheer, slijpcycli en gereedschapspaspoorten van Gudel Werkzeuge.",
};

export default function DutchLayout({ children }: { children: React.ReactNode }) {
  return <html lang="nl"><body>{children}</body></html>;
}
