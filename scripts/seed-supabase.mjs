import "dotenv/config";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const CSV_PATH = path.join(ROOT, "data", "ressources.csv");
const META_PATH = path.join(ROOT, "data", "scraped-meta.json");
const LOCAL_IMAGES_DIR = path.join(ROOT, "public", "ressources_images");
const BUCKET = "resources";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

function slugify(input) {
  return (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SUPPORT_COLUMNS = [
  "Mentorat / coaching ",
  "Incubation & accélération ",
  "Formation & développement de compétences ",
  "Réseautage & communauté ",
  "Conseils techniques ou sectoriels ",
  "Support administratif / réglementaire ",
  "Support au marketing / commercialisation / accès au marché ",
  "Support technologique / numérique ",
  "Accès aux infrastructures ou ressources physiques ",
  "Soutien à l’innovation et recherche/développement (R&D)",
  "Soutien global de croissance & planification stratégique "
];

async function ensurePublicUrl(pathInBucket) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(pathInBucket);
  return data?.publicUrl || null;
}

async function uploadIfNeeded(slug, localFilePath) {
  try {
    const ext = path.extname(localFilePath).toLowerCase() || ".jpg";
    const objectPath = `${slug}${ext}`;
    const fileBuf = fs.readFileSync(localFilePath);
    // Try list to detect existence
    const { data: list } = await supabase.storage.from(BUCKET).list("", {
      search: objectPath
    });
    const exists = Array.isArray(list) && list.some((o) => o.name === objectPath);
    if (!exists) {
      await supabase.storage.from(BUCKET).upload(objectPath, fileBuf, {
        upsert: true,
        contentType:
          ext === ".png"
            ? "image/png"
            : ext === ".webp"
            ? "image/webp"
            : ext === ".gif"
            ? "image/gif"
            : "image/jpeg"
      });
    }
    return await ensurePublicUrl(objectPath);
  } catch {
    return null;
  }
}

(async function main() {
  // Read CSV
  let csv = fs.readFileSync(CSV_PATH, "utf8");
  if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1);
  const records = parse(csv, { columns: true, skip_empty_lines: true, trim: true });

  // Read meta
  let meta = {};
  if (fs.existsSync(META_PATH)) {
    meta = JSON.parse(fs.readFileSync(META_PATH, "utf8"));
  }

  const resources = [];
  for (const row of records) {
    if (!row["Nom"]) continue;
    const slug = slugify(row["Nom"]);
    const m = meta[slug] || {};

    // Build supports list
    const supports = [];
    for (const col of SUPPORT_COLUMNS) {
      if (row[col] && String(row[col]).toUpperCase() === "TRUE") {
        supports.push(col.trim());
      }
    }

    // Resolve image
    let image_url = m.imageUrl || null;
    // if we still have a local file reference
    if (!image_url && m.savedImage && m.savedImage.startsWith("/ressources_images/")) {
      const fname = m.savedImage.split("/").pop();
      const localPath = path.join(LOCAL_IMAGES_DIR, fname);
      if (fs.existsSync(localPath)) {
        image_url = await uploadIfNeeded(slug, localPath);
      }
    }

    resources.push({
      slug,
      nom: row["Nom"],
      type: row["Type"] || null,
      type_organisation: row["Type_organisation"] || null,
      localisation: row["Localisation"] || null,
      geographie: row["Geographie"] || null,
      geographie2: row["Geographie2"] || null,
      site: row["Site"] || null,
      secteur: row["Secteur"] || null,
      modalite: row["Modalite"] || null,
      services: row["Services"] || null,
      public_cible: row["Public cible"] || null,
      contacts: row["Contacts"] || null,
      autres: row["Autres"] || null,
      supports,
      meta_description: m.description || null,
      image_url,
      socials: m.socials || null
    });
  }

  console.log(`Insertion/upsert ${resources.length} ressources…`);
  let i = 0;
  for (const r of resources) {
    i++;
    const { error } = await supabase.from("resources").upsert(r, { onConflict: "slug" });
    if (error) {
      console.error(`Erreur (${r.slug}):`, error.message);
    }
    const pct = Math.round((i / resources.length) * 100);
    process.stdout.write(`\r[${i}/${resources.length} • ${pct}%] ${r.slug}`);
  }
  console.log("\nTerminé.");
})(); 


