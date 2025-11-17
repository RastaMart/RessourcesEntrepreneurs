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
  // 1. Check meta tags for language
  const htmlLang = ($('html').attr("lang") || "").toLowerCase();
  if (htmlLang.startsWith("fr")) {
    // Already on French page
    return baseUrl;
  }

  // 2. Check link[rel="alternate"] with hreflang
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

  // 3. Check for language menu/links in the page
  // Look for common patterns: links with text like "FR", "Français", "French", etc.
  const languageLinkPatterns = [
    /^(fr|français|french)$/i,
    /^fr[-\s]?ca$/i,
    /français/i,
  ];
  
  const foundLanguageLinks: string[] = [];
  
  $('a[href]').each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().trim();
    const title = ($(el).attr("title") || "").trim();
    const ariaLabel = ($(el).attr("aria-label") || "").trim();
    const combined = `${text} ${title} ${ariaLabel}`.toLowerCase();
    
    // Check if link text matches French language patterns
    if (languageLinkPatterns.some(pattern => pattern.test(combined))) {
      const normalized = normalizeUrl(baseUrl, href);
      if (normalized && normalized !== baseUrl) {
        foundLanguageLinks.push(normalized);
      }
    }
    
    // Also check for common language selector patterns in href
    if (href && /[?&](?:lang|language|locale|hl)=fr/i.test(href)) {
      const normalized = normalizeUrl(baseUrl, href);
      if (normalized && normalized !== baseUrl) {
        foundLanguageLinks.push(normalized);
      }
    }
  });

  // 4. Check for language selector dropdowns/buttons
  $('[class*="lang"], [class*="language"], [id*="lang"], [id*="language"]').each((_, el) => {
    const $el = $(el);
    // Look for French links within language selectors
    $el.find('a[href]').each((_, linkEl) => {
      const href = $(linkEl).attr("href");
      const text = $(linkEl).text().trim().toLowerCase();
      if ((text.includes("fr") || text.includes("français")) && href) {
        const normalized = normalizeUrl(baseUrl, href);
        if (normalized && normalized !== baseUrl) {
          foundLanguageLinks.push(normalized);
        }
      }
    });
  });

  // Return first found language link if any
  if (foundLanguageLinks.length > 0) {
    return foundLanguageLinks[0];
  }

  // 5. Fallback: try common URL patterns
  const candidates = ["/fr", "/fr/", "/fr-ca", "/fr-ca/", "?lang=fr", "?locale=fr_CA", "?hl=fr"]
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
      redirect: "follow",
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; RessourcesEntrepreneursBot/1.0; +https://example.com)",
      },
    });
    if (!res.ok) return null;

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Déterminer l'extension et le content type depuis les headers
    const contentType = res.headers.get("content-type") || "";
    let ext = "jpg";
    if (contentType.includes("png")) ext = "png";
    else if (contentType.includes("webp")) ext = "webp";
    else if (contentType.includes("gif")) ext = "gif";
    else if (contentType.includes("svg")) ext = "svg";
    else if (contentType.includes("jpeg") || contentType.includes("jpg")) ext = "jpg";
    
    const filename = `${slug}.${ext}`;
    
    const contentTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
    };
    
    const finalContentType = contentTypeMap[ext] || "image/jpeg";

    // Uploader vers Supabase Storage dans le bucket 'resources'
    const { error } = await supabase.storage
      .from("resources")
      .upload(filename, buffer, {
        contentType: finalContentType,
        upsert: true, // Remplacer si existe déjà
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
  } catch (error: any) {
    console.error(`Erreur téléchargement/upload image pour ${slug}:`, error.message);
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

/**
 * Scrape and update a single resource in the database
 */
export async function scrapeAndUpdateResource(slug: string) {
  try {
    // Get resource from database
    const { data: resource, error: fetchError } = await supabase
      .from("resources")
      .select("slug, nom, site")
      .eq("slug", slug)
      .single();

    if (fetchError || !resource || !resource.site) {
      return { ok: false, error: "Resource not found or has no site URL" };
    }

    // Scrape metadata
    const scraped = await scrapeMetadata(resource.site, slug);
    if (!scraped.ok) {
      return { ok: false, error: scraped.error || "Scraping failed" };
    }

    // Update resource in database
    // Only replace description if found during scraping
    const updateData: {
      meta_description?: string | null;
      image_url: string | null;
    } = {
      image_url: scraped.imageUrl || null,
    };
    
    // Only update description if we found one during scraping
    if (scraped.description) {
      updateData.meta_description = scraped.description;
    }

    const { error: updateError } = await supabase
      .from("resources")
      .update(updateData)
      .eq("slug", slug);

    if (updateError) {
      return { ok: false, error: updateError.message };
    }

    // Update social media links
    if (scraped.socials) {
      // Get existing social media links
      const { data: existingSocials } = await supabase
        .from("social_media")
        .select("platform, url")
        .eq("resource_slug", slug);

      const existingSet = new Set(
        (existingSocials || []).map((s) => `${s.platform}:${s.url}`)
      );

      // Prepare new entries (only those that don't exist)
      const socialEntries = Object.entries(scraped.socials)
        .filter(([_, url]) => url)
        .map(([platform, url]) => ({
          resource_slug: slug,
          platform,
          url: url as string,
        }))
        .filter((entry) => !existingSet.has(`${entry.platform}:${entry.url}`));

      // Delete social media links that are no longer in the new data
      const newSocialsSet = new Set(
        Object.entries(scraped.socials)
          .filter(([_, url]) => url)
          .map(([platform, url]) => `${platform}:${url}`)
      );

      const toDelete = (existingSocials || []).filter(
        (s) => !newSocialsSet.has(`${s.platform}:${s.url}`)
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

      // Insert only new social media links
      if (socialEntries.length > 0) {
        const { error: socialError } = await supabase
          .from("social_media")
          .insert(socialEntries);

        if (socialError && !socialError.message.includes("duplicate key")) {
          console.error(`Error inserting social media for ${slug}:`, socialError.message);
        }
      }
    }

    return {
      ok: true,
      slug,
      description: scraped.description,
      imageUrl: scraped.imageUrl,
      socials: scraped.socials,
    };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Erreur" };
  }
}

/**
 * Scrape and update all resources or a specific one
 */
export async function scrapeAndUpdateResources(slug?: string) {
  try {
    let resources: Array<{ slug: string; nom: string; site: string }> = [];

    if (slug) {
      // Scrape a specific resource
      const { data, error } = await supabase
        .from("resources")
        .select("slug, nom, site")
        .eq("slug", slug)
        .not("site", "is", null)
        .single();

      if (error || !data) {
        return { ok: false, error: "Resource not found" };
      }
      resources = [data];
    } else {
      // Scrape all resources
      const { data, error } = await supabase
        .from("resources")
        .select("slug, nom, site")
        .not("site", "is", null)
        .is("deleted_at", null);

      if (error) {
        return { ok: false, error: error.message };
      }

      if (!data || data.length === 0) {
        return { ok: false, error: "No resources found with site URLs" };
      }

      resources = data;
    }

    const results = [];
    let okCount = 0;
    let failCount = 0;

    for (const resource of resources) {
      const result = await scrapeAndUpdateResource(resource.slug);
      results.push({
        slug: resource.slug,
        nom: resource.nom,
        ...result,
      });

      if (result.ok) {
        okCount++;
      } else {
        failCount++;
      }

      // Small delay to be polite with servers
      await new Promise((r) => setTimeout(r, 250));
    }

    return {
      ok: true,
      total: resources.length,
      okCount,
      failCount,
      results,
    };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Erreur" };
  }
}

