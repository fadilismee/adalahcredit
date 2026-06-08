import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreeTools — Discover Free Tools & Resources",
  description: "Koleksi tools gratis terbaik untuk developer, designer, dan creator. Diupdate setiap minggu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
