import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lighthouse, by Codex",
  description: "Explore four rooms of a storm-bound lighthouse.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body data-room="rocks">{children}</body>
    </html>
  );
}
