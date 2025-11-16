import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function normalizeUrl(baseUrl: string, maybeRelative?: string | null) {
  try {
    if (!maybeRelative) return null;
    return new URL(maybeRelative, baseUrl).toString();
  } catch {
    return null;
  }
}

function pickFrenchUrl($: cheerio.CheerioAPI, baseUrl: string) {
  const alternates: { href: string | null; hreflang: string }[] = [];
  $('link[rel="alternate"]').each((_, el) => {
    const href = $(el).attr("href");
    const hreflang = ($(el).attr("hreflang") || "").toLowerCase();
    if (href && hreflang) {
      alternates.push({ href: normalizeUrl(baseUrl, href), hreflang });
    }
  });
  const preferred =
    alternates.find((a) => a.hreflang === "fr-ca") ||
    alternates.find((a) => a.hreflang === "fr") ||
    alternates.find((a) => a.hreflang.startsWith("fr"));
  if (preferred && preferred.href) return preferred.href;
  const candidates = ["/fr", "/fr/", "/fr-ca", "/fr-ca/", "?lang=fr", "?locale=fr_CA"]
    .map((s) => normalizeUrl(baseUrl, s))
    .filter(Boolean) as string[];
  return candidates[0] || baseUrl;
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; RessourcesEntrepreneursBot/1.0; +https://example.com)",
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function findBestImage($: cheerio.CheerioAPI, baseUrl: string): string | null {
  const get = (sel: string, attr = "content") => ($(sel).attr(attr) || "").trim();
  
  // 1. Priorité aux meta tags Open Graph et Twitter
  const metaImages = [
    get('meta[property="og:image"]'),
    get('meta[property="og:image:url"]'),
    get('meta[property="og:image:secure_url"]'),
    get('meta[name="twitter:image"]'),
    get('meta[name="twitter:image:src"]'),
    get('meta[itemprop="image"]'),
    get('link[rel="image_src"]', 'href'),
  ].filter(Boolean);

  for (const img of metaImages) {
    const normalized = normalizeUrl(baseUrl, img);
    if (normalized && isValidImageUrl(normalized)) {
      return normalized;
    }
  }

  // 2. Chercher dans les balises <img> de la page
  const pageImages: Array<{ url: string; score: number }> = [];
  
  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
    if (!src) return;
    
    const normalized = normalizeUrl(baseUrl, src);
    if (!normalized || !isValidImageUrl(normalized)) return;
    
    // Calculer un score basé sur plusieurs critères (comme Facebook)
    let score = 0;
    
    // Taille de l'image (width/height)
    const width = parseInt($(el).attr('width') || '0');
    const height = parseInt($(el).attr('height') || '0');
    if (width >= 200 && height >= 200) score += 10;
    if (width >= 400 && height >= 400) score += 5;
    
    // Position dans le DOM (plus haut = meilleur)
    const position = $('img').index(el);
    score += Math.max(0, 10 - position);
    
    // Classes/IDs suggérant une image importante
    const classId = ($(el).attr('class') || '') + ($(el).attr('id') || '');
    if (/logo|brand|header|hero|banner|featured|main|primary/i.test(classId)) score += 15;
    if (/thumb|icon|avatar|emoji/i.test(classId)) score -= 10;
    
    // Alt text présent
    if ($(el).attr('alt')) score += 3;
    
    // Éviter les images de tracking, analytics, etc.
    if (/tracking|analytics|pixel|beacon|1x1/i.test(normalized)) score -= 20;
    
    pageImages.push({ url: normalized, score });
  });

  // Trier par score et retourner la meilleure
  if (pageImages.length > 0) {
    pageImages.sort((a, b) => b.score - a.score);
    return pageImages[0].url;
  }

  // 3. Fallback: chercher un logo
  const logoSelectors = [
    'img.logo',
    'img#logo',
    '.logo img',
    '#logo img',
    'header img',
    '.header img',
    '[class*="logo"] img',
  ];

  for (const selector of logoSelectors) {
    const logoImg = $(selector).first();
    if (logoImg.length) {
      const src = logoImg.attr('src') || logoImg.attr('data-src');
      if (src) {
        const normalized = normalizeUrl(baseUrl, src);
        if (normalized && isValidImageUrl(normalized)) {
          return normalized;
        }
      }
    }
  }

  return null;
}

function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    
    // Vérifier l'extension
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext));
    
    // Accepter aussi si c'est une URL d'image sans extension évidente
    // (ex: CDN avec query params)
    const looksLikeImage = /image|img|photo|picture/i.test(pathname) || hasValidExtension;
    
    // Rejeter les URLs trop courtes ou suspectes
    if (pathname.length < 5) return false;
    
    // Rejeter les images de tracking
    if (/pixel|beacon|track|analytics|1x1/i.test(url)) return false;
    
    return looksLikeImage;
  } catch {
    return false;
  }
}

function extract($: cheerio.CheerioAPI, baseUrl: string) {
  const get = (sel: string, attr = "content") => ($(sel).attr(attr) || "").trim();
  const title =
    get('meta[property="og:title"]') ||
    get('meta[name="twitter:title"]') ||
    $("title").first().text().trim() ||
    null;
  const desc =
    get('meta[property="og:description"]') ||
    get('meta[name="description"]') ||
    get('meta[name="twitter:description"]') ||
    null;
  
  // Utiliser la nouvelle fonction de recherche d'image améliorée
  const img = findBestImage($, baseUrl);

  const socials: Record<string, string | null> = {
    linkedin: null,
    instagram: null,
    facebook: null,
    twitter: null,
    youtube: null,
    tiktok: null,
  };
  $('a[href]').each((_, el) => {
    const href = ($(el).attr("href") || "").trim();
    const abs = normalizeUrl(baseUrl, href);
    if (!abs) return;
    const u = abs.toLowerCase();
    if (!socials.linkedin && u.includes("linkedin.com")) socials.linkedin = abs;
    if (!socials.instagram && u.includes("instagram.com")) socials.instagram = abs;
    if (!socials.facebook && (u.includes("facebook.com") || u.includes("fb.me")))
      socials.facebook = abs;
    if (!socials.twitter && (u.includes("twitter.com") || u.includes("x.com")))
      socials.twitter = abs;
    if (!socials.youtube && (u.includes("youtube.com") || u.includes("youtu.be")))
      socials.youtube = abs;
    if (!socials.tiktok && u.includes("tiktok.com")) socials.tiktok = abs;
  });
  return { title, desc, img, socials };
}

async function uploadImageToSupabase(imageUrl: string, slug: string): Promise<string | null> {
  try {
    // Télécharger l'image
    const res = await fetch(imageUrl, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; RessourcesEntrepreneursBot/1.0)",
      },
    });
    if (!res.ok) return null;

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Déterminer l'extension et le content type
    const ext = imageUrl.split(".").pop()?.split("?")[0]?.toLowerCase() || "jpg";
    const filename = `${slug}.${ext}`;
    
    const contentTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      bmp: "image/bmp",
    };
    const contentType = contentTypeMap[ext] || "image/jpeg";

    // Uploader vers Supabase Storage dans le bucket 'resources'
    const { data, error } = await supabase.storage
      .from("resources")
      .upload(filename, buffer, {
        contentType,
        upsert: true, // Remplacer si existe déjà
      });

    if (error) {
      console.error(`Erreur upload Supabase pour ${slug}:`, error);
      return null;
    }

    // Retourner l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from("resources")
      .getPublicUrl(filename);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error(`Erreur téléchargement/upload image pour ${slug}:`, error);
    return null;
  }
}

export async function scrapeMetadata(url: string, slug: string) {
  try {
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const frUrl = pickFrenchUrl($, url);
    let $$ = $;
    let usedUrl = url;
    if (frUrl && frUrl !== url) {
      try {
        const frHtml = await fetchHtml(frUrl);
        $$ = cheerio.load(frHtml);
        usedUrl = frUrl;
      } catch {
        // fallback
      }
    }
    const { title, desc, img, socials } = extract($$, usedUrl);
    
    // Uploader l'image vers Supabase Storage
    let imageUrl = null;
    if (img) {
      imageUrl = await uploadImageToSupabase(img, slug);
    }
    
    return {
      ok: true,
      usedUrl,
      title,
      description: desc,
      imageUrl: imageUrl || img, // Utiliser l'URL locale si téléchargée, sinon l'URL distante
      socials,
    };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Erreur" };
  }
}

