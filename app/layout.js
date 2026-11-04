import localFont from "next/font/local";
import "./globals.css";

// الخطوط محفوظة داخل المشروع (app/fonts) فلا يحتاج الموقع لأي خدمة خارجية
const plex = localFont({
  variable: "--font-plex",
  src: [
    { path: "./fonts/plex-400.woff2", weight: "400" },
    { path: "./fonts/plex-500.woff2", weight: "500" },
    { path: "./fonts/plex-700.woff2", weight: "700" },
  ],
});

const reem = localFont({
  variable: "--font-reem",
  src: [
    { path: "./fonts/reem-500.woff2", weight: "500" },
    { path: "./fonts/reem-700.woff2", weight: "700" },
  ],
});

export const metadata = {
  title: "مخطط المراجعة",
  description:
    "أداة مجانية لطلاب الثانوي والجامعة: جدول مراجعة، قائمة الدروس، وبطاقات الحفظ. بياناتك تبقى في جهازك.",
};

export const viewport = {
  themeColor: "#1D3FA8",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${plex.variable} ${reem.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
