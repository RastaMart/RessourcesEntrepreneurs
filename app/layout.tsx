import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ressources pour entrepreneurs | Annuaire Québec & Canada",
  description:
    "Annuaire élégant et complet des ressources d’accompagnement pour entrepreneurs au Québec et au Canada : incubateurs, accélérateurs, financement, mentorat et plus.",
  robots: "index,follow",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr-CA">
      <body>{children}</body>
    </html>
  );
}
