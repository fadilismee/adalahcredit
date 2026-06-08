import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-7G96YEXEF5";

export const metadata: Metadata = {
  title: {
    default: "adalahcredit — Free Tools & Resources",
    template: "%s | adalahcredit",
  },
  description: "Koleksi tools gratis terbaik untuk developer, designer, dan creator. Diupdate setiap minggu. Temukan AI tools, design apps, hosting, dan productivity tools gratis.",
  keywords: ["free tools", "gratis", "ai tools", "design tools", "developer tools", "productivity", "adalahcredit"],
  authors: [{ name: "adalahcredit" }],
  creator: "adalahcredit",
  metadataBase: new URL("https://adalahcredit.vercel.app"),
  verification: {
    google: "DinYk7pdd2KWrF7ci949ZhIWPn3Suv-x4xtRFXK3eak",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://adalahcredit.vercel.app",
    siteName: "adalahcredit",
    title: "adalahcredit — Free Tools & Resources",
    description: "Koleksi tools gratis terbaik untuk developer, designer, dan creator. Diupdate setiap minggu.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "adalahcredit" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "adalahcredit — Free Tools & Resources",
    description: "Koleksi tools gratis terbaik untuk developer, designer, dan creator.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
      </head>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
