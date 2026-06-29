import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matnite Infotech | Admin",
  description: "Online Examination Management System — Admin Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
