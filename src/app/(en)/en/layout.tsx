import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Digital Tool Cabinet — TMS",
  description: "Digital tool inventory, sharpening cycles and tool passports from Gudel Werkzeuge.",
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
