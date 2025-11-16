import "dotenv/config";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const META_PATH = path.join(ROOT, "data", "scraped-meta.json");
const LOCAL_IMAGES_DIR = path.join(ROOT, "public", "ressources_images");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET = "resources";

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

async function ensurePublicUrl(pathInBucket) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(pathInBucket);
  return data?.publicUrl || null;
}

async function uploadIfNeeded(slug, localFilePath) {
  try {
    const ext = path.extname(localFilePath).toLowerCase() || ".jpg";
    const objectPath = `${slug}${ext}`;
    const fileBuf = fs.readFileSync(localFilePath);
    // Try HEAD by listing; if exists, skip upload
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
  } catch (e) {
    return null;
  }
}

async function upsertMeta(row) {
  const payload = {
    slug: row.slug,
    url: row.url || null,
    used_url: row.usedUrl || row.url || null,
    description: row.description || null,
    image_url: row.imageUrl || null,
    socials: row.socials || null
  };
  await supabase.from("resources_meta").upsert(payload, { onConflict: "slug" });
}

(async function main() {
  const raw = fs.readFileSync(META_PATH, "utf8");
  const meta = JSON.parse(raw);
  let changed = 0;
  let i = 0;
  const keys = Object.keys(meta);
  console.log(`Sync vers Supabase: ${keys.length} entrées…`);
  for (const slug of keys) {
    i++;
    const m = meta[slug];
    // Upload image si on a un fichier local
    if (m.savedImage && m.savedImage.startsWith("/ressources_images/")) {
      const fname = m.savedImage.split("/").pop();
      const localPath = path.join(LOCAL_IMAGES_DIR, fname);
      if (fs.existsSync(localPath)) {
        const publicUrl = await uploadIfNeeded(slug, localPath);
        if (publicUrl) {
          m.imageUrl = publicUrl;
          m.savedImage = null;
          changed++;
        }
      }
    }
    await upsertMeta({ slug, ...m });
    const pct = Math.round((i / keys.length) * 100);
    process.stdout.write(`\r[${i}/${keys.length} • ${pct}%] ${slug}`);
  }
  if (changed > 0) {
    fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2), "utf8");
  }
  console.log(`\nTerminé. ${changed} image(s) pointent désormais vers Supabase Storage.`);
})();


