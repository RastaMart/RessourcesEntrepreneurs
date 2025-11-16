import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export type Resource = {
  slug: string;
  nom: string;
  type: string;
  typeOrganisation?: string;
  localisation?: string;
  geographie?: string;
  geographie2?: string;
  site?: string;
  secteur?: string;
  modalite?: string;
  services?: string;
  publicCible?: string;
  contacts?: string;
  autres?: string;
  supports: string[];
};

const SUPPORT_COLUMNS: Record<string, string> = {
  "Mentorat / coaching ": "Mentorat / coaching",
  "Incubation & accélération ": "Incubation & accélération",
  "Formation & développement de compétences ":
    "Formation & développement de compétences",
  "Réseautage & communauté ": "Réseautage & communauté",
  "Conseils techniques ou sectoriels ": "Conseils techniques ou sectoriels",
  "Support administratif / réglementaire ":
    "Support administratif / réglementaire",
  "Support au marketing / commercialisation / accès au marché ":
    "Support marketing / commercialisation / accès au marché",
  "Support technologique / numérique ": "Support technologique / numérique",
  "Accès aux infrastructures ou ressources physiques ":
    "Accès aux infrastructures ou ressources physiques",
  "Soutien à l’innovation et recherche/développement (R&D)":
    "Soutien à l’innovation et R&D",
  "Soutien global de croissance & planification stratégique ":
    "Soutien global & planification stratégique",
};

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAllResources(): Resource[] {
  const csvPath = path.join(process.cwd(), "data", "ressources.csv");
  let fileContents = fs.readFileSync(csvPath, "utf8");

  // Retirer un éventuel BOM UTF‑8 en début de fichier (fréquent avec Excel)
  if (fileContents.charCodeAt(0) === 0xfeff) {
    fileContents = fileContents.slice(1);
  }

  const records = parse(fileContents, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  return records
    .filter((row) => row["Nom"])
    .map((row) => {
      const supports: string[] = [];

      Object.entries(SUPPORT_COLUMNS).forEach(([column, label]) => {
        if (row[column] && row[column].toUpperCase() === "TRUE") {
          supports.push(label);
        }
      });

      return {
        slug: slugify(row["Nom"]),
        nom: row["Nom"],
        type: row["Type"] || "",
        typeOrganisation: row["Type_organisation"],
        localisation: row["Localisation"],
        geographie: row["Geographie"],
        geographie2: row["Geographie2"],
        site: row["Site"],
        secteur: row["Secteur"],
        modalite: row["Modalite"],
        services: row["Services"],
        publicCible: row["Public cible"],
        contacts: row["Contacts"],
        autres: row["Autres"],
        supports,
      };
    });
}

export function getResourceBySlug(slug: string): Resource | undefined {
  return getAllResources().find((r) => r.slug === slug);
}

