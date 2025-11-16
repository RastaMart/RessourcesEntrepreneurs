import { getAllResources, getResourceBySlug } from "../../../lib/resources";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  const resources = getAllResources();
  return resources.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const resource = getResourceBySlug(params.slug);

  if (!resource) {
    return {
      title: "Ressource introuvable – Ressources Entrepreneurs"
    };
  }

  const titre = `${resource.nom} – Ressource d’accompagnement`;

  return {
    title: titre,
    description:
      resource.services ||
      `Fiche détaillée de ${resource.nom}, ressource pour entrepreneurs au Québec et au Canada.`,
    openGraph: {
      title: titre,
      description:
        resource.services ||
        `Ressource d’accompagnement pour entrepreneurs : ${resource.type} à ${resource.geographie2 || resource.localisation || "Canada"}.`
    }
  };
}

export default function ResourcePage({ params }: Props) {
  const resource = getResourceBySlug(params.slug);

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
            <span className="re-logo-mark">RE</span>
            <Link href="/" className="re-logo-text">
              <span className="re-logo-title">Ressources Entrepreneurs</span>
              <span className="re-logo-subtitle">Répertoire d’accompagnement</span>
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
                    <span key={`type-${i}-${p}`} className="re-tag re-tag--type">
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
                <span className="re-detail-sidebar-label">Type d’organisation</span>
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
          </aside>
        </div>
      </main>
    </>
  );
}



