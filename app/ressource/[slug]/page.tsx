import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "../../../util/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";
import Header from "../../../components/Header";
import ResourceDetailClient from "../../../components/ResourceDetailClient";

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
  const supabase = getStaticSupabaseClient();
  const { data } = await supabase
    .from("resources")
    .select("slug");
  return Array.isArray(data) ? data.map((r) => ({ slug: r.slug })) : [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getStaticSupabaseClient();
  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) {
    return {
      title: "Ressource introuvable – Ressources Entrepreneurs",
    };
  }

  const titre = `${data.nom} – Ressource d'accompagnement`;

  return {
    title: titre,
    description:
      data.services ||
      `Fiche détaillée de ${data.nom}, ressource pour entrepreneurs au Québec et au Canada.`,
    openGraph: {
      title: titre,
      description:
        data.services ||
        `Ressource d'accompagnement pour entrepreneurs : ${data.type} à ${
          data.geographie2 || data.localisation || "Canada"
        }.`,
    },
  };
}

export default async function ResourcePage({ params }: Props) {
  try {
    const { slug } = await params;
    const supabase = getStaticSupabaseClient();
    const serverSupabase = await createClient();
    
    // Check if user is admin
    let isAdmin = false;
    try {
      const {
        data: { user },
      } = await serverSupabase.auth.getUser();
      if (user) {
        const { data: profile } = await serverSupabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        isAdmin = Boolean(profile?.is_admin);
      }
    } catch (err) {
      // User not logged in or error checking admin status
    }

    const { data, error: queryError } = await supabase
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
      .eq("slug", slug)
      .single();

    if (queryError) {
      console.error("Error fetching resource:", queryError);
      return (
        <>
          <Header />
          <main className="re-main">
            <div className="re-container" style={{ padding: "3rem 0" }}>
              <p>Erreur lors du chargement de la ressource: {queryError.message}</p>
              <Link href="/" className="re-link-pill">
                Retour à l'annuaire
              </Link>
            </div>
          </main>
        </>
      );
    }

  const resource = data
    ? {
        slug: data.slug,
        nom: data.nom || "",
        type: data.type || "",
        types: Array.isArray(data.resource_resource_types)
          ? data.resource_resource_types
              .map((rrt: any) => rrt.resource_types?.name)
              .filter((name): name is string => typeof name === "string")
          : (data.type ? [data.type] : []),
        typeOrganisation: data.type_organisation || "",
        localisation: data.localisation || "",
        geographie: data.geographie || "",
        geographie2: data.geographie2 || "",
        site: data.site || "",
        secteur: data.secteur || "",
        modalite: data.modalite || "",
        services: data.services || "",
        publicCible: data.public_cible || "",
        contacts: data.contacts || "",
        autres: data.autres || "",
        supports: Array.isArray(data.supports) ? data.supports : [],
        metaDescription: data.meta_description || null,
        metaImage: data.image_url || null,
        socials: Array.isArray(data.social_media) ? data.social_media : [],
      }
    : null;

  if (!resource) {
    return (
      <>
        <Header />
        <main className="re-main">
          <div className="re-container" style={{ padding: "3rem 0" }}>
            <p>La ressource demandée n'a pas été trouvée.</p>
            <Link href="/" className="re-link-pill">
              Retour à l'annuaire
            </Link>
          </div>
        </main>
      </>
    );
  }

    return (
      <>
        <Header />
        <ResourceDetailClient resource={resource} isAdmin={isAdmin} />
      </>
    );
  } catch (error: any) {
    console.error("Error in ResourcePage:", error);
    return (
      <>
        <Header />
        <main className="re-main">
          <div className="re-container" style={{ padding: "3rem 0" }}>
            <p>Erreur lors du chargement de la ressource: {error?.message || "Erreur inconnue"}</p>
            <Link href="/" className="re-link-pill">
              Retour à l'annuaire
            </Link>
          </div>
        </main>
      </>
    );
  }
}
