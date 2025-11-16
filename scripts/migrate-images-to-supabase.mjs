import "dotenv/config";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables d'environnement Supabase manquantes");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const LOCAL_IMAGES_DIR = path.join(process.cwd(), "public", "ressources_images");

async function main() {
  console.log("📥 Récupération des ressources avec images locales...\n");

  // Récupérer toutes les ressources avec une image_url locale
  const { data: resources, error } = await supabase
    .from("resources")
    .select("slug, image_url")
    .like("image_url", "/ressources_images/%");

  if (error) {
    console.error("❌ Erreur Supabase:", error);
    process.exit(1);
  }

  if (!resources || resources.length === 0) {
    console.log("✅ Aucune image locale à migrer");
    return;
  }

  console.log(`🔄 Migration de ${resources.length} images vers Supabase Storage...\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    const { slug, image_url } = resource;
    const idx = i + 1;
    const prefix = `[${idx}/${resources.length}]`;

    // Extraire le nom du fichier depuis l'URL locale
    const filename = image_url.split("/").pop();
    const localPath = path.join(LOCAL_IMAGES_DIR, filename);

    // Vérifier si le fichier existe localement
    if (!fs.existsSync(localPath)) {
      console.log(`${prefix} ${slug} – fichier local introuvable: ${filename}`);
      failCount++;
      continue;
    }

    try {
      // Lire le fichier
      const fileBuffer = fs.readFileSync(localPath);
      
      // Déterminer le content type
      const ext = filename.split(".").pop().toLowerCase();
      const contentTypeMap = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        svg: "image/svg+xml",
      };
      const contentType = contentTypeMap[ext] || "image/jpeg";

      // Uploader vers Supabase
      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(filename, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.log(`${prefix} ${slug} – erreur upload: ${uploadError.message}`);
        failCount++;
        continue;
      }

      // Obtenir l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from("resources")
        .getPublicUrl(filename);

      // Mettre à jour la base de données avec la nouvelle URL
      const { error: updateError } = await supabase
        .from("resources")
        .update({ image_url: publicUrlData.publicUrl })
        .eq("slug", slug);

      if (updateError) {
        console.log(`${prefix} ${slug} – erreur mise à jour DB: ${updateError.message}`);
        failCount++;
        continue;
      }

      console.log(`${prefix} ${slug} – ✓ migré`);
      successCount++;
    } catch (error) {
      console.log(`${prefix} ${slug} – erreur: ${error.message}`);
      failCount++;
    }
  }

  console.log(`\n✅ Migration terminée: ${successCount} réussies, ${failCount} échecs`);
  
  if (successCount > 0) {
    console.log("\n💡 Vous pouvez maintenant supprimer le dossier public/ressources_images/");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

