import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "../../../util/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";
import SocialIcon from "../../../components/SocialIcon";

type Props = {
  params: { slug: string };
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
  const { data } = await supabase.from("resources").select("slug");
  return Array.isArray(data) ? data.map((r) => ({ slug: r.slug })) : [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = getStaticSupabaseClient();
  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", params.slug)
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
  const supabase = getStaticSupabaseClient();
  const { data } = await supabase
    .from("resources")
    .select(
      `
      *,
      social_media (
        platform,
        url
      )
    `
    )
    .eq("slug", params.slug)
    .single();

  const resource = data
    ? {
        slug: data.slug,
        nom: data.nom || "",
        type: data.type || "",
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
      <main className="re-main">
        <div className="re-container" style={{ padding: "3rem 0" }}>
          <p>La ressource demandée n’a pas été trouvée.</p>
          <Link href="/" className="re-link-pill">
            Retour à l’annuaire
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <header className="re-header">
        <div className="re-container re-header-inner">
          <div className="re-logo">
            <Link href="/" className="re-logo-link">
              <span className="re-logo-mark">RE</span>
              <span className="re-logo-text">
                <span className="re-logo-title">Ressources Entrepreneurs</span>
                <span className="re-logo-subtitle">
                  Répertoire d’accompagnement
                </span>
              </span>
            </Link>
          </div>
          <nav className="re-nav"></nav>
        </div>
      </header>

      <main className="re-detail re-detail--visible">
        <div className="re-container re-detail-inner">
          <section>
            <div className="re-detail-header">
              <h2>{resource.nom}</h2>
              <p>
                {resource.type}{" "}
                {resource.secteur ? ` • ${resource.secteur}` : null}
              </p>
            </div>

            <div style={{ marginTop: "0.75rem" }}>
              <img
                src={resource.metaImage || "/ressources_images/placeholder.svg"}
                alt={resource.nom}
                style={{
                  width: "100%",
                  maxHeight: 280,
                  objectFit: "cover",
                  borderRadius: "0.8rem",
                  border: "1px solid rgba(148,163,184,0.35)",
                }}
                referrerPolicy="no-referrer"
              />
            </div>

            {(() => {
              const splitParts = (val: string) =>
                val
                  .split("/")
                  .map((p) => p.trim())
                  .filter(Boolean);
              const typeParts = resource.type ? splitParts(resource.type) : [];
              const supportParts = resource.supports.flatMap(splitParts);
              return (
                <div className="re-card-tags" style={{ marginTop: "0.75rem" }}>
                  {typeParts.map((p, i) => (
                    <span
                      key={`type-${i}-${p}`}
                      className="re-tag re-tag--type"
                    >
                      {p}
                    </span>
                  ))}
                  {supportParts.map((p, i) => (
                    <span key={`sup-${i}-${p}`} className="re-tag">
                      {p}
                    </span>
                  ))}
                </div>
              );
            })()}

            {resource.metaDescription && (
              <div className="re-detail-section">
                <h3>Description</h3>
                <p>{resource.metaDescription}</p>
              </div>
            )}

            <div className="re-detail-section">
              <h3>Services principaux</h3>
              <p>
                {resource.services ||
                  "Description détaillée des services à consulter sur le site officiel de la ressource."}
              </p>
            </div>

            {resource.autres && (
              <div className="re-detail-section">
                <h3>Informations additionnelles</h3>
                <p>{resource.autres}</p>
              </div>
            )}

            <Link href="/" className="re-detail-close">
              Retour à la liste
            </Link>
          </section>

          <aside className="re-detail-sidebar">
            <div className="re-detail-sidebar-row">
              <span className="re-detail-sidebar-label">Localisation</span>
              <span>
                {resource.localisation ||
                  resource.geographie2 ||
                  resource.geographie ||
                  "Canada"}
              </span>
            </div>

            {resource.typeOrganisation && (
              <div className="re-detail-sidebar-row">
                <span className="re-detail-sidebar-label">
                  Type d’organisation
                </span>
                <span>{resource.typeOrganisation}</span>
              </div>
            )}

            {resource.secteur && (
              <div className="re-detail-sidebar-row">
                <span className="re-detail-sidebar-label">Secteur</span>
                <span>{resource.secteur}</span>
              </div>
            )}

            {resource.publicCible && (
              <div className="re-detail-sidebar-row">
                <span className="re-detail-sidebar-label">Public cible</span>
                <span>{resource.publicCible}</span>
              </div>
            )}

            {resource.modalite && (
              <div className="re-detail-sidebar-row">
                <span className="re-detail-sidebar-label">Modalités</span>
                <span>{resource.modalite}</span>
              </div>
            )}

            {resource.site && (
              <div className="re-detail-sidebar-row">
                <span className="re-detail-sidebar-label">Site web</span>
                <a href={resource.site} target="_blank" rel="noreferrer">
                  {resource.site}
                </a>
              </div>
            )}

            {resource.contacts && (
              <div className="re-detail-sidebar-row">
                <span className="re-detail-sidebar-label">Contact</span>
                <span>{resource.contacts}</span>
              </div>
            )}

            {resource.socials && resource.socials.length > 0 && (
              <>
                {resource.socials.map((social: any, idx: number) => {
                  const platform = social.platform?.toLowerCase();
                  let label = social.platform;
                  let handle = "";

                  // Extraire le handle de l'URL
                  try {
                    const url = new URL(social.url);
                    const pathname = url.pathname;
                    // Enlever les slashes et prendre le dernier segment non-vide
                    const segments = pathname.split("/").filter(Boolean);
                    handle = segments[segments.length - 1] || url.hostname;

                    // Pour certains réseaux, ajouter @ si c'est un username
                    if (
                      platform === "instagram" ||
                      platform === "twitter" ||
                      platform === "tiktok"
                    ) {
                      if (!handle.startsWith("@")) {
                        handle = "@" + handle;
                      }
                    }
                  } catch {
                    handle = social.url;
                  }

                  if (platform === "linkedin") {
                    label = "LinkedIn";
                  } else if (platform === "instagram") {
                    label = "Instagram";
                  } else if (platform === "facebook") {
                    label = "Facebook";
                  } else if (platform === "twitter" || platform === "x") {
                    label = "Twitter/X";
                  } else if (platform === "youtube") {
                    label = "YouTube";
                  } else if (platform === "tiktok") {
                    label = "TikTok";
                  }

                  return (
                    <div key={idx} className="re-detail-sidebar-row">
                      <span className="re-detail-sidebar-label">{label}</span>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <SocialIcon platform={platform} size={20} />
                        <span style={{ fontSize: "0.9rem" }}>{handle}</span>
                      </a>
                    </div>
                  );
                })}
              </>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
