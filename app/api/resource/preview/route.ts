import { NextRequest, NextResponse } from "next/server";
import { scrapeMetadata } from "@/lib/scraper";

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL manquante" }, { status: 400 });
    
    // Extraire un slug temporaire depuis l'URL pour le téléchargement d'image
    const urlObj = new URL(url);
    const tempSlug = slugify(urlObj.hostname.replace("www.", ""));
    
    const result = await scrapeMetadata(url, tempSlug);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erreur" }, { status: 500 });
  }
}


