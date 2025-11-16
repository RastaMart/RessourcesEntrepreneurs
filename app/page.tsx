import HomeClient from "../components/HomeClient";
import { cookies } from "next/headers";
import { createClient } from "../util/supabase/server";

export default async function HomePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("resources")
    .select(`
      *,
      social_media (
        platform,
        url
      )
    `)
    .order("nom", { ascending: true });

  const rows = Array.isArray(data) ? data : [];

  // Adapter la forme aux attentes de HomeClient
  const resources = rows.map((r) => ({
    slug: r.slug,
    nom: r.nom || "",
    type: r.type || "",
    typeOrganisation: r.type_organisation || "",
    localisation: r.localisation || "",
    geographie: r.geographie || "",
    geographie2: r.geographie2 || "",
    site: r.site || "",
    secteur: r.secteur || "",
    modalite: r.modalite || "",
    services: r.services || "",
    publicCible: r.public_cible || "",
    contacts: r.contacts || "",
    autres: r.autres || "",
    supports: Array.isArray(r.supports) ? r.supports : [],
    metaDescription: r.meta_description || null,
    metaImage: r.image_url || null,
    socials: Array.isArray(r.social_media) ? r.social_media : []
  }));

  return <HomeClient resources={resources} />;
}


