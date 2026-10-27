// layout.tsx on sovelluksen juuriasettelu.
// Se ympäröi kaikki sivut, eli tänne tulevat asiat, jotka näkyvät
// jokaisella sivulla (myöhemmin Header ja Footer), sekä <html>- ja <body>-tagit.

import type { Metadata } from "next";
import "./globals.css";

// Metadata näkyy selaimen välilehdellä ja hakukoneiden tuloksissa.
// Next.js lisää nämä automaattisesti sivun <head>-osaan.
export const metadata: Metadata = {
  title: "Tahkon Amanda – Liikunta ja hyvinvointi",
  description:
    "Ryhmäliikuntaa, personal trainingia ja rentoutusta Tahkolla, Siilinjärvellä, Kuopiossa ja Rautavaaralla.",
};

// RootLayout saa propsina children-sisällön, eli kulloinkin näytettävän sivun
// (esim. page.tsx). Readonly estää propsien vahingossa tapahtuvan muokkaamisen.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang="fi" kertoo ruudunlukijoille ja hakukoneille, että sivu on suomeksi.
    <html lang="fi">
      <body>{children}</body>
    </html>
  );
}