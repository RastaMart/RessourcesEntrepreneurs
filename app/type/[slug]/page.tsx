import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "../../../util/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";
import Header from "../../../components/Header";
import type { Resource } from "../../../lib/resources";
import { resourceTypes, getResourceTypeBySlug } from "../../../lib/resourceTypes";
import ResourceCard from "../../../components/ResourceCard";

type Props = {
  params: Promise<{ slug: string }>;
};

// Helper pour créer un client Supabase sans cookies (pour le build statique)
function getStaticSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient(supabaseUrl, supabaseKey);
}

// Désactiver la génération statique pour toujours avoir les données fraîches
export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  return resourceTypes.map((type) => ({ slug: type.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resourceType = getResourceTypeBySlug(slug);

  if (!resourceType) {
    return {
      title: "Type de ressource introuvable – Ressources Entrepreneurs",
    };
  }

  return {
    title: `${resourceType.fullTitle} – Ressources Entrepreneurs`,
    description: resourceType.description,
    openGraph: {
      title: resourceType.fullTitle,
      description: resourceType.description,
      images: [resourceType.imageUrl],
    },
  };
}

export default async function ResourceTypePage({ params }: Props) {
  const { slug } = await params;
  const resourceType = getResourceTypeBySlug(slug);
  const supabase = getStaticSupabaseClient();

  if (!resourceType) {
    return (
      <>
        <Header />
        <main className="re-main">
          <div className="re-container" style={{ padding: "3rem 0" }}>
            <p>Le type de ressource demandé n'a pas été trouvé.</p>
            <Link href="/" className="re-link-pill">
              Retour à l'annuaire
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Récupérer les ressources qui correspondent à ce type
  // Search in both the old 'type' field and the new 'types' JSONB array
  const searchTerms = resourceType.originalType
    .split("/")
    .map((term) => term.trim())
    .filter(Boolean);
  
  // Build conditions for the old 'type' field
  const typeConditions = searchTerms
    .map((term) => `type.ilike.%${term}%`)
    .join(",");
  
  // Fetch resources matching via the relation table
  // First get the resource_type_id for this type
  const { data: typeData } = await supabase
    .from("resource_types")
    .select("id")
    .eq("name", resourceType.originalType)
    .single();

  let data, error;

  // If we found the type in resource_types table, filter by relation
  if (typeData?.id) {
    // Get resource slugs that have this type
    const { data: junctionData } = await supabase
      .from("resource_resource_types")
      .select("resource_slug")
      .eq("resource_type_id", typeData.id);

    const resourceSlugs = Array.isArray(junctionData)
      ? junctionData.map((j) => j.resource_slug)
      : [];

    if (resourceSlugs.length > 0) {
      const { data: resourcesData, error: resourcesError } = await supabase
        .from("resources")
        .select(
          `
          *,
          social_media (
            platform,
            url
          ),
          resource_resource_types (
            resource_type_id,
            resource_types (
              id,
              name,
              slug
            )
          )
        `
        )
        .in("slug", resourceSlugs)
        .order("nom", { ascending: true });

      data = resourcesData;
      error = resourcesError;
    } else {
      data = [];
      error = null;
    }
  } else {
    // Fallback to old type field matching
    const { data: resourcesData, error: resourcesError } = await supabase
      .from("resources")
      .select(
        `
        *,
        social_media (
          platform,
          url
        ),
        resource_resource_types (
          resource_type_id,
          resource_types (
            id,
            name,
            slug
          )
        )
      `
      )
      .or(typeConditions || `type.ilike.%${resourceType.originalType}%`)
      .is("deleted_at", null)
      .order("nom", { ascending: true });

    data = resourcesData;
    error = resourcesError;
  }

  const resources: Resource[] = Array.isArray(data)
    ? data.map((r) => ({
        slug: r.slug,
        nom: r.nom || "",
        type: r.type || "",
        types: Array.isArray(r.resource_resource_types)
          ? r.resource_resource_types
              .map((rrt: any) => rrt.resource_types?.name)
              .filter((name): name is string => typeof name === "string")
          : (r.type ? [r.type] : []),
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
        socials: Array.isArray(r.social_media) ? r.social_media : [],
      }))
    : [];

  return (
    <>
      <Header />
      <main className="re-main">
        {/* Image Header */}
        <section className="re-type-header">
          <div className="re-type-header-image">
            <img
              src={resourceType.imageUrl}
              alt={resourceType.fullTitle}
              className="re-type-header-img"
            />
            <div className="re-type-header-overlay" />
          </div>
          <div className="re-container">
            <div className="re-type-header-content">
              <Link href="/" className="re-type-header-back">
                ← Retour à l'accueil
              </Link>
              <h1 className="re-type-header-title">{resourceType.fullTitle}</h1>
              <p className="re-type-header-description">
                {resourceType.description}
              </p>
            </div>
          </div>
        </section>

        {/* Resources List */}
        <section className="re-type-resources">
          <div className="re-container">
            <div className="re-type-resources-header">
              <p className="re-results-count">
                {resources.length} ressource
                {resources.length > 1 ? "s" : ""} affichée
                {resources.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="re-cards-grid">
              {resources.map((r) => (
                <ResourceCard key={r.slug} resource={r} />
              ))}
            </div>
            {resources.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                  Aucune ressource trouvée pour ce type.
                </p>
                <Link href="/" className="re-link-pill">
                  Retour à l'annuaire
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

