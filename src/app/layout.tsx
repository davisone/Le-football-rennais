import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Le Football Rennais",
  description: "Le Football Rennais — Contenu football rennais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
