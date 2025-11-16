"use client";

import "./globals.css";
import type { ReactNode } from "react";
import Head from "next/head";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr-CA">
      <Head>
        <title>Ressources pour entrepreneurs | Annuaire Québec & Canada</title>
        <meta
          name="description"
          content="Annuaire élégant et complet des ressources d’accompagnement pour entrepreneurs au Québec et au Canada : incubateurs, accélérateurs, financement, mentorat et plus."
        />
        <meta name="robots" content="index,follow" />
      </Head>
      <body>{children}</body>
    </html>
  );
}

