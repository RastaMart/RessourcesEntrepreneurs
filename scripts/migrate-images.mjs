import "dotenv/config";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "data", "scraped_images");
const DEST = path.join(ROOT, "public", "ressources_images");

(async function main() {
  if (!fs.existsSync(SRC)) {
    console.log("Aucune source à migrer (data/scraped_images introuvable).");
    process.exit(0);
  }
  if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

  const files = fs.readdirSync(SRC).filter((f) => !f.startsWith("."));
  let moved = 0;
  for (const f of files) {
    const srcPath = path.join(SRC, f);
    const destPath = path.join(DEST, f);
    try {
      fs.copyFileSync(srcPath, destPath);
      moved++;
    } catch (e) {
      console.error("Erreur copie:", f, e.message);
    }
  }
  console.log(`Migration terminée: ${moved} fichier(s) copiés vers public/ressources_images`);
})(); 


