import "dotenv/config";
import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables d'environnement Supabase manquantes");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(input) {
  return (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeUrl(baseUrl, maybeRelative) {
  try {
    return new URL(maybeRelative, baseUrl).toString();
  } catch {
    return null;
  }
}

async function fetchHtml(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; RessourcesEntrepreneursBot/1.0; +https://example.com)",
        accept: "text/html,application/xhtml+xml"
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.text();
  } catch (e) {
    return null;
  }
}

function pickFrenchUrl($, baseUrl) {
  // Priorité aux liens alternates hreflang
  const alternates = [];
  $('link[rel="alternate"]').each((_, el) => {
    const href = $(el).attr("href");
    const hreflang = ($(el).attr("hreflang") || "").toLowerCase();
    if (href && hreflang) {
      alternates.push({ href: normalizeUrl(baseUrl, href), hreflang });
    }
  });
  // Chercher fr-CA, fr-ca, fr
  const preferred = alternates.find((a) => a.hreflang === "fr-ca") ||
    alternates.find((a) => a.hreflang === "fr") ||
    alternates.find((a) => a.hreflang.startsWith("fr"));
  if (preferred && preferred.href) return preferred.href;

  // Heuristiques courantes
  const candidates = [
    "/fr",
    "/fr/",
    "/fr-ca",
    "/fr-ca/",
    "?lang=fr",
    "?locale=fr_CA",
    "/fr-ca/index.html",
  ].map((s) => normalizeUrl(baseUrl, s)).filter(Boolean);
  return candidates[0] || baseUrl;
}

async function uploadImageToSupabase(imageUrl, slug) {
  try {
    const res = await fetch(imageUrl, {
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; RessourcesEntrepreneursBot/1.0; +https://example.com)"
      }
    });
    if (!res.ok) return null;
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const contentType = res.headers.get("content-type") || "";
    let ext = "jpg";
    if (contentType.includes("png")) ext = "png";
    else if (contentType.includes("webp")) ext = "webp";
    else if (contentType.includes("gif")) ext = "gif";
    else if (contentType.includes("svg")) ext = "svg";
    
    const filename = `${slug}.${ext}`;
    
    const contentTypeMap = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
    };
    
    // Uploader vers Supabase Storage
    const { error } = await supabase.storage
      .from("resources")
      .upload(filename, buffer, {
        contentType: contentTypeMap[ext] || "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error(`Erreur upload Supabase pour ${slug}:`, error.message);
      return null;
    }

    // Retourner l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from("resources")
      .getPublicUrl(filename);

    return publicUrlData.publicUrl;
  } catch (e) {
    console.error(`Erreur upload image ${slug}:`, e.message);
    return null;
  }
}

function extractMeta($, baseUrl) {
  const by = (selector, attr = "content") =>
    ($(selector).attr(attr) || "").toString().trim();

  // description candidates
  const descCandidates = [
    by('meta[property="og:description"]'),
    by('meta[name="og:description"]'),
    by('meta[name="description"]'),
    by('meta[name="twitter:description"]')
  ].filter(Boolean);
  const description = descCandidates[0] || null;

  // image candidates
  const imgCandidatesRaw = [
    by('meta[property="og:image"]'),
    by('meta[name="og:image"]'),
    by('meta[name="twitter:image"]')
  ].filter(Boolean);
  const imgCandidates = imgCandidatesRaw
    .map((u) => normalizeUrl(baseUrl, u))
    .filter(Boolean);
  const image = imgCandidates[0] || null;

  // Social links
  const socials = {
    linkedin: null,
    instagram: null,
    facebook: null,
    twitter: null,
    youtube: null,
    tiktok: null
  };
  $('a[href]').each((_, el) => {
    const href = ($(el).attr("href") || "").trim();
    const url = normalizeUrl(baseUrl, href);
    if (!url) return;
    const u = url.toLowerCase();
    if (!socials.linkedin && u.includes("linkedin.com")) socials.linkedin = url;
    if (!socials.instagram && u.includes("instagram.com")) socials.instagram = url;
    if (!socials.facebook && (u.includes("facebook.com") || u.includes("fb.me"))) socials.facebook = url;
    if (!socials.twitter && (u.includes("twitter.com") || u.includes("x.com"))) socials.twitter = url;
    if (!socials.youtube && (u.includes("youtube.com") || u.includes("youtu.be"))) socials.youtube = url;
    if (!socials.tiktok && u.includes("tiktok.com")) socials.tiktok = url;
  });

  return { description, image, socials };
}

async function main() {
  // Vérifier si un paramètre est passé (slug ou URL)
  const args = process.argv.slice(2);
  const targetParam = args[0];

  // Afficher l'aide si demandé
  if (targetParam === "--help" || targetParam === "-h") {
    console.log(`
📖 Usage du script de scraping:

  npm run scrape:meta                    # Scrapper toutes les ressources
  npm run scrape:meta <slug>             # Scrapper une ressource par son slug
  npm run scrape:meta <url>              # Scrapper une ressource par son URL

Exemples:
  npm run scrape:meta apollo13
  npm run scrape:meta https://apollo13.co/
  npm run scrape:meta quebec-tech-pour-le-succes-des-startups-tech
    `);
    process.exit(0);
  }

  let resources = [];

  if (targetParam) {
    // Si c'est une URL (commence par http)
    if (targetParam.startsWith("http://") || targetParam.startsWith("https://")) {
      console.log(`📥 Recherche de la ressource avec l'URL: ${targetParam}...`);
      
      // Normaliser l'URL (enlever le slash final pour la comparaison)
      const normalizedUrl = targetParam.replace(/\/$/, "");
      
      // Chercher avec ou sans le slash final
      const { data, error } = await supabase
        .from("resources")
        .select("slug, nom, site")
        .or(`site.eq.${normalizedUrl},site.eq.${normalizedUrl}/`)
        .maybeSingle();

      if (error || !data) {
        console.error("❌ Aucune ressource trouvée avec cette URL");
        process.exit(1);
      }
      resources = [data];
    } else {
      // Sinon, c'est un slug
      console.log(`📥 Recherche de la ressource avec le slug: ${targetParam}...`);
      const { data, error } = await supabase
        .from("resources")
        .select("slug, nom, site")
        .eq("slug", targetParam)
        .single();

      if (error || !data) {
        console.error("❌ Aucune ressource trouvée avec ce slug");
        process.exit(1);
      }
      resources = [data];
    }
  } else {
    // Récupérer toutes les ressources depuis Supabase
    console.log("📥 Récupération de toutes les ressources depuis Supabase...");
    const { data, error } = await supabase
      .from("resources")
      .select("slug, nom, site")
      .not("site", "is", null);

    if (error) {
      console.error("❌ Erreur Supabase:", error);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.log("⚠️  Aucune ressource trouvée avec un site web");
      return;
    }
    resources = data;
  }

  // Prépare la liste à traiter
  const items = resources.map((r) => ({
    name: r.nom,
    site: r.site,
    slug: r.slug
  }));

  const total = items.length;
  console.log(`\n🔍 Scraping des métadonnées (${total} sites)…\n`);
  const t0 = Date.now();

  let okCount = 0;
  let failCount = 0;
  let updateCount = 0;

  for (let i = 0; i < items.length; i++) {
    const { name, site, slug } = items[i];
    const idx = i + 1;
    const prefix = `[${idx}/${total} • ${Math.round((idx / total) * 100)}%]`;

    const html = await fetchHtml(site);
    if (!html) {
      failCount++;
      console.log(`${prefix} ${slug} – échec (pas de HTML)`);
      continue;
    }

    const $ = cheerio.load(html);
    // Tenter de basculer vers la version française
    const frUrl = pickFrenchUrl($, site);
    let usedUrl = site;
    let $$ = $;
    if (frUrl && frUrl !== site) {
      const frHtml = await fetchHtml(frUrl);
      if (frHtml) {
        $$ = cheerio.load(frHtml);
        usedUrl = frUrl;
      }
    }

    const { description, image, socials } = extractMeta($$, usedUrl);
    let imageUrl = null;
    if (image) {
      const uploadedUrl = await uploadImageToSupabase(image, slug);
      if (uploadedUrl) {
        imageUrl = uploadedUrl; // URL publique Supabase
      }
    }

    // Mettre à jour la ressource dans Supabase
    const updateData = {
      meta_description: description || null,
      image_url: imageUrl || null,
    };

    const { error: updateError } = await supabase
      .from("resources")
      .update(updateData)
      .eq("slug", slug);

    if (updateError) {
      console.error(`${prefix} ${slug} – erreur mise à jour:`, updateError);
      failCount++;
      continue;
    }

    // Mettre à jour les réseaux sociaux (avec validation pour éviter les doublons)
    if (socials) {
      // Récupérer les réseaux sociaux existants pour cette ressource
      const { data: existingSocials } = await supabase
        .from("social_media")
        .select("platform, url")
        .eq("resource_slug", slug);

      const existingSet = new Set(
        (existingSocials || []).map(s => `${s.platform}:${s.url}`)
      );

      // Préparer les nouvelles entrées (seulement celles qui n'existent pas)
      const socialEntries = Object.entries(socials)
        .filter(([_, url]) => url)
        .map(([platform, url]) => ({
          resource_slug: slug,
          platform,
          url,
        }))
        .filter(entry => !existingSet.has(`${entry.platform}:${entry.url}`));

      // Supprimer les réseaux sociaux qui ne sont plus dans les nouvelles données
      const newSocialsSet = new Set(
        Object.entries(socials)
          .filter(([_, url]) => url)
          .map(([platform, url]) => `${platform}:${url}`)
      );

      const toDelete = (existingSocials || []).filter(
        s => !newSocialsSet.has(`${s.platform}:${s.url}`)
      );

      if (toDelete.length > 0) {
        for (const social of toDelete) {
          await supabase
            .from("social_media")
            .delete()
            .eq("resource_slug", slug)
            .eq("platform", social.platform)
            .eq("url", social.url);
        }
      }

      // Insérer seulement les nouveaux réseaux sociaux
      if (socialEntries.length > 0) {
        const { error: socialError } = await supabase
          .from("social_media")
          .insert(socialEntries);
        
        // Ignorer les erreurs de contrainte unique (doublon)
        if (socialError && !socialError.message.includes("duplicate key")) {
          console.error(`Erreur insertion réseaux sociaux pour ${slug}:`, socialError.message);
        }
      }
    }

    okCount++;
    updateCount++;
    const descInfo = description ? `${Math.min(description.length, 120)} chars` : "—";
    const imgInfo = imageUrl ? "image ✓" : image ? "image (non téléchargée)" : "—";
    const langInfo = usedUrl !== site ? "FR" : "–";
    console.log(`${prefix} ${slug} – OK (desc: ${descInfo}, ${imgInfo}, ${langInfo})`);

    // Petite pause pour être poli avec les serveurs
    await new Promise((r) => setTimeout(r, 250));
  }

  const dt = Math.round((Date.now() - t0) / 1000);
  console.log(
    `\n✅ Scraping terminé en ${dt}s. OK: ${okCount}, Échecs: ${failCount}, Mises à jour: ${updateCount}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


