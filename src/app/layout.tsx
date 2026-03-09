import type { Metadata } from "next";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Le Football Rennais | Actu SRFC & Football",
  description:
    "Toute l'actualité du Stade Rennais FC : analyses, vidéos, discussions et communauté. Par des passionnés, pour des passionnés Rouge et Noir.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
