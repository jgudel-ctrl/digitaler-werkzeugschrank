import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = { title: "Gudel Werkzeuge — Digital Tool Cabinet" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="de"><body>{children}</body></html>;
}
