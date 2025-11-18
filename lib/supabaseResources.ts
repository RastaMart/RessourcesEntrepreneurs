import { cookies } from "next/headers";
import { createClient as createSupabaseServer } from "@/util/supabase/server";

export type DbResource = {
  slug: string;
  nom: string;
  type: string | null;
  type_organisation: string | null;
  localisation: string | null;
  geographie: string | null;
  geographie2: string | null;
  site: string | null;
  secteur: string | null;
  modalite: string | null;
  services: string | null;
  public_cible: string | null;
  contacts: string | null;
  autres: string | null;
  supports: string[] | null; // stored as jsonb array
  meta_description: string | null;
  image_url: string | null;
  socials: Record<string, string> | null;
};

export type UiResource = {
  slug: string;
  nom: string;
  type: string;
  typeOrganisation?: string;
  localisation?: string;
  geographie?: string;
  geographie2?: string;
  site?: string;
  secteur?: string;
  modalite?: string;
  services?: string;
  publicCible?: string;
  contacts?: string;
  autres?: string;
  supports: string[];
  metaDescription?: string | null;
  metaImage?: string | null;
  socials?: Record<string, string> | null;
};

function mapRowToUi(row: DbResource): UiResource {
  return {
    slug: row.slug,
    nom: row.nom,
    type: row.type || "",
    typeOrganisation: row.type_organisation || undefined,
    localisation: row.localisation || undefined,
    geographie: row.geographie || undefined,
    geographie2: row.geographie2 || undefined,
    site: row.site || undefined,
    secteur: row.secteur || undefined,
    modalite: row.modalite || undefined,
    services: row.services || undefined,
    publicCible: row.public_cible || undefined,
    contacts: row.contacts || undefined,
    autres: row.autres || undefined,
    supports: Array.isArray(row.supports) ? (row.supports as string[]) : [],
    metaDescription: row.meta_description || null,
    metaImage: row.image_url || null,
    socials: row.socials || null
  };
}

export async function fetchAllResources(): Promise<UiResource[]> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("resources")
    .select(
      "slug, nom, type, type_organisation, localisation, geographie, geographie2, site, secteur, modalite, services, public_cible, contacts, autres, supports, meta_description, image_url, socials"
    )
    .is("deleted_at", null)
    .order("nom", { ascending: true });
  if (error) {
    console.error("Supabase fetchAllResources error:", error.message);
    return [];
  }
  return (data as DbResource[]).map(mapRowToUi);
}

export async function fetchResourceBySlug(slug: string): Promise<UiResource | null> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("resources")
    .select(
      "slug, nom, type, type_organisation, localisation, geographie, geographie2, site, secteur, modalite, services, public_cible, contacts, autres, supports, meta_description, image_url, socials"
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("Supabase fetchResourceBySlug error:", error.message);
    return null;
  }
  if (!data) return null;
  return mapRowToUi(data as DbResource);
}


