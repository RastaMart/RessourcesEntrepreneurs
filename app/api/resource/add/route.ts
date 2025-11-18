import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scrapeMetadata } from "@/lib/scraper";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ["slug", "nom"];
    for (const k of required) {
      if (!body[k]) return NextResponse.json({ error: `Champ manquant: ${k}` }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Vérifier si la ressource existe déjà (non supprimée)
    const { data: existing } = await supabase
      .from("resources")
      .select("slug")
      .eq("slug", body.slug)
      .single();

    if (existing) {
      return NextResponse.json({ ok: true, duplicated: true });
    }

    // Si un site web est fourni, re-scrapper avec le bon slug pour obtenir l'image locale
    let finalMetaDescription = body.metaDescription || null;
    let finalImageUrl = body.metaImage || null;
    let finalSocials = body.socials || {};

    if (body.site) {
      try {
        const scraped = await scrapeMetadata(body.site, body.slug);
        if (scraped.ok) {
          // Always replace description if found during scraping
          if (scraped.description) {
            finalMetaDescription = scraped.description;
          }
          finalImageUrl = scraped.imageUrl || finalImageUrl;
          finalSocials = scraped.socials || finalSocials;
        }
      } catch (error) {
        console.error("Erreur scraping lors de l'ajout:", error);
        // Continue avec les données du preview si le scraping échoue
      }
    }

    // Préparer les données pour l'insertion
    const resourceData = {
      slug: body.slug,
      nom: body.nom,
      type: body.type || "",
      type_organisation: body.typeOrganisation || null,
      localisation: body.localisation || null,
      geographie: body.geographie || null,
      geographie2: body.geographie2 || null,
      site: body.site || null,
      secteur: body.secteur || null,
      modalite: body.modalite || null,
      services: body.services || null,
      public_cible: body.publicCible || null,
      contacts: body.contacts || null,
      autres: body.autres || null,
      supports: body.supports || [],
      meta_description: finalMetaDescription,
      image_url: finalImageUrl,
    };

    // Insérer la ressource
    const { error: insertError } = await supabase
      .from("resources")
      .insert([resourceData]);

    if (insertError) {
      console.error("Erreur insertion Supabase:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Insérer les réseaux sociaux
    if (finalSocials && typeof finalSocials === "object") {
      const socialEntries = Object.entries(finalSocials)
        .filter(([_, url]) => url)
        .map(([platform, url]) => ({
          resource_slug: body.slug,
          platform,
          url: url as string,
        }));

      if (socialEntries.length > 0) {
        await supabase.from("social_media").insert(socialEntries);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Erreur API add:", e);
    return NextResponse.json({ error: e?.message || "Erreur" }, { status: 500 });
  }
}


