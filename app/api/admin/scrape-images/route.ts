import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/util/supabase/server";
import * as cheerio from "cheerio";

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
    
    if (languageLinkPatterns.some(pattern => pattern.test(combined))) {
      const normalized = normalizeUrl(baseUrl, href);
      if (normalized && normalized !== baseUrl) {
        foundLanguageLinks.push(normalized);
      }
    }
    
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

function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext));
    
    const looksLikeImage = /image|img|photo|picture/i.test(pathname) || hasValidExtension;
    
    if (pathname.length < 5) return false;
    
    // Reject tracking/UI images
    if (/pixel|beacon|track|analytics|1x1|spacer|blank|transparent|loading|placeholder/i.test(url)) return false;
    
    return looksLikeImage;
  } catch {
    return false;
  }
}

function isContentImage(url: string, $el: cheerio.Cheerio<any>, baseUrl: string): boolean {
  const urlLower = url.toLowerCase();
  
  // Reject common UI/interface image patterns
  const uiPatterns = [
    /icon/i,
    /logo/i,
    /button/i,
    /arrow/i,
    /chevron/i,
    /menu/i,
    /nav/i,
    /header/i,
    /footer/i,
    /sidebar/i,
    /badge/i,
    /avatar/i,
    /profile-pic/i,
    /favicon/i,
    /sprite/i,
    /bg-/i,
    /background/i,
    /decoration/i,
    /pattern/i,
  ];
  
  // Check URL path
  if (uiPatterns.some(pattern => pattern.test(urlLower))) {
    return false;
  }
  
  // Check class/id attributes
  const classId = (($el.attr('class') || '') + ' ' + ($el.attr('id') || '')).toLowerCase();
  if (uiPatterns.some(pattern => pattern.test(classId))) {
    return false;
  }
  
  // Check parent elements
  const parent = $el.parent();
  const parentClassId = (parent.attr('class') || '') + ' ' + (parent.attr('id') || '');
  if (/nav|menu|header|footer|sidebar|toolbar|button|icon/i.test(parentClassId)) {
    return false;
  }
  
  // Prefer larger images (likely content)
  const width = parseInt($el.attr('width') || '0');
  const height = parseInt($el.attr('height') || '0');
  if (width > 0 && height > 0 && (width < 50 || height < 50)) {
    return false; // Too small, likely an icon
  }
  
  return true;
}

function scoreImage(url: string, $el: cheerio.Cheerio<any>, $: cheerio.CheerioAPI, baseUrl: string): number {
  let score = 0;
  
  // Size scoring
  const width = parseInt($el.attr('width') || '0');
  const height = parseInt($el.attr('height') || '0');
  if (width >= 400 && height >= 400) score += 20;
  else if (width >= 200 && height >= 200) score += 10;
  else if (width >= 100 && height >= 100) score += 5;
  
  // Position in DOM (earlier = better)
  const position = $('img').index($el[0]);
  score += Math.max(0, 20 - position);
  
  // Content indicators
  const classId = (($el.attr('class') || '') + ' ' + ($el.attr('id') || '')).toLowerCase();
  if (/hero|banner|featured|main|primary|content|article|post|image|photo|picture/i.test(classId)) {
    score += 15;
  }
  
  // Alt text present (good sign)
  if ($el.attr('alt')) score += 5;
  
  // Negative scoring for UI elements
  if (/icon|logo|button|arrow|chevron|menu|nav|header|footer|sidebar|badge|avatar|favicon|sprite|bg-|background|decoration|pattern/i.test(classId)) {
    score -= 20;
  }
  
  // URL patterns
  const urlLower = url.toLowerCase();
  if (/hero|banner|featured|main|primary|content|article|post|image|photo|picture/i.test(urlLower)) {
    score += 10;
  }
  if (/icon|logo|button|arrow|chevron|menu|nav|header|footer|sidebar|badge|avatar|favicon|sprite|bg-|background|decoration|pattern/i.test(urlLower)) {
    score -= 15;
  }
  
  return score;
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication and admin status
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // Get URL from request body
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch and parse HTML
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    
    // Try to get French version
    const frUrl = pickFrenchUrl($, url);
    let $$ = $;
    if (frUrl && frUrl !== url) {
      try {
        const frHtml = await fetchHtml(frUrl);
        $$ = cheerio.load(frHtml);
      } catch {
        // fallback to original
      }
    }

    // Extract meta images first (highest priority)
    const metaImages: Array<{ url: string; source: string; score: number }> = [];
    const get = (sel: string, attr = "content") => ($$(sel).attr(attr) || "").trim();
    
    const metaImageUrls = [
      get('meta[property="og:image"]'),
      get('meta[property="og:image:url"]'),
      get('meta[property="og:image:secure_url"]'),
      get('meta[name="twitter:image"]'),
      get('meta[name="twitter:image:src"]'),
      get('meta[itemprop="image"]'),
      get('link[rel="image_src"]', 'href'),
    ].filter(Boolean);

    for (const imgUrl of metaImageUrls) {
      const normalized = normalizeUrl(frUrl || url, imgUrl);
      if (normalized && isValidImageUrl(normalized)) {
        metaImages.push({
          url: normalized,
          source: "meta",
          score: 100, // Highest priority
        });
      }
    }

    // Extract page images
    const pageImages: Array<{ url: string; source: string; score: number }> = [];
    
    $$('img').each((_, el) => {
      const $el = $$(el);
      const src = $el.attr('src') || $el.attr('data-src') || $el.attr('data-lazy-src') || $el.attr('data-original');
      if (!src) return;
      
      const normalized = normalizeUrl(frUrl || url, src);
      if (!normalized || !isValidImageUrl(normalized)) return;
      
      // Filter out UI images
      if (!isContentImage(normalized, $el, frUrl || url)) return;
      
      // Score the image
      const score = scoreImage(normalized, $el, $$, frUrl || url);
      if (score > 0) {
        pageImages.push({
          url: normalized,
          source: "page",
          score,
        });
      }
    });

    // Sort page images by score (highest first)
    pageImages.sort((a, b) => b.score - a.score);

    // Combine: meta images first, then top page images
    const allImages = [...metaImages, ...pageImages.slice(0, 20)]; // Limit to top 20 page images

    // Remove duplicates
    const seen = new Set<string>();
    const uniqueImages = allImages.filter(img => {
      if (seen.has(img.url)) return false;
      seen.add(img.url);
      return true;
    });

    return NextResponse.json({
      ok: true,
      images: uniqueImages,
      usedUrl: frUrl || url,
    });
  } catch (e: any) {
    console.error("Error in scrape-images API:", e);
    return NextResponse.json({ error: e?.message || "Internal server error" }, { status: 500 });
  }
}

