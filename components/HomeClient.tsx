"use client";

import type { Resource } from "../lib/resources";
import Link from "next/link";
import { useMemo, useState } from "react";

type Filters = {
  type: string[];
  geo: string[];
  publicCible: string[];
  supports: string[];
};

type Props = {
  resources: Resource[];
};

function useFilteredResources(raw: Resource[]) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>({
    type: [],
    geo: [],
    publicCible: [],
    supports: [],
  });

  const toggleFilter = (group: keyof Filters, value: string) => {
    setFilters((prev) => {
      const current = prev[group];
      return {
        ...prev,
        [group]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const clearFilters = () =>
    setFilters({ type: [], geo: [], publicCible: [], supports: [] });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return raw.filter((r) => {
      if (term) {
        const haystack = [
          r.nom,
          r.type,
          r.secteur,
          r.services,
          r.publicCible,
          r.autres,
          r.localisation,
          r.geographie2,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(term)) return false;
      }

      if (filters.type.length && !filters.type.includes(r.type)) return false;

      if (
        filters.geo.length &&
        !filters.geo.some(
          (g) =>
            r.geographie === g || r.geographie2 === g || r.localisation === g
        )
      ) {
        return false;
      }

      if (
        filters.publicCible.length &&
        !filters.publicCible.some((p) => (r.publicCible || "").includes(p))
      ) {
        return false;
      }

      if (
        filters.supports.length &&
        !filters.supports.every((s) => r.supports.includes(s))
      ) {
        return false;
      }

      return true;
    });
  }, [raw, search, filters]);

  return {
    search,
    setSearch,
    filters,
    toggleFilter,
    clearFilters,
    filtered,
  };
}

export default function HomeClient({ resources }: Props) {
  // Valeurs uniques pour les filtres
  const typeOptions = Array.from(new Set(resources.map((r) => r.type))).filter(
    Boolean
  );
  const geoOptions = Array.from(
    new Set(
      resources
        .map((r) => r.geographie2 || r.geographie || r.localisation)
        .filter(Boolean)
    )
  );
  const publicOptions = Array.from(
    new Set(
      resources
        .flatMap((r) =>
          (r.publicCible || "")
            .split(/[;,]/)
            .map((v) => v.trim())
            .filter(Boolean)
        )
        .filter(Boolean)
    )
  );
  const supportOptions = Array.from(
    new Set(resources.flatMap((r) => r.supports))
  );

  const { search, setSearch, filters, toggleFilter, clearFilters, filtered } =
    useFilteredResources(resources);

  const [showFilters, setShowFilters] = useState(false);

  const handleToggleFilter = (group: keyof Filters, value: string) => {
    toggleFilter(group, value);
  };

  const handleClearFilters = () => {
    clearFilters();
    setShowFilters(true);
  };

  const handleApplyFilters = () => {
    // Les filtres sont déjà appliqués en temps réel; ici on fait surtout
    // office de confirmation visuelle et on referme le panneau.
    setShowFilters(false);
  };

  return (
    <>
      <header className="re-header">
        <div className="re-container re-header-inner">
          <div className="re-logo">
            <span className="re-logo-mark">RE</span>
            <div className="re-logo-text">
              <span className="re-logo-title">Ressources Entrepreneurs</span>
              <span className="re-logo-subtitle">
                Répertoire d’accompagnement
              </span>
            </div>
          </div>
          <nav className="re-nav">
            <span className="re-nav-link re-nav-link--active">Ressources</span>
          </nav>
        </div>
      </header>

      <main className="re-main">
        <section className="re-hero">
          <div className="re-container re-hero-inner">
            <div className="re-hero-text">
              <h1>Trouvez la bonne ressource pour votre projet d’affaires</h1>
              <p>
                Incubateurs, accélérateurs, programmes sectoriels, mentorat,
                financement&nbsp;: explorez les principales ressources
                d’accompagnement pour entrepreneurs au Québec et au Canada.
              </p>
            </div>
            <div className="re-hero-search">
              <label htmlFor="search-input" className="re-field-label">
                Recherche par nom, secteur, service ou public ciblé
              </label>
              <div className="re-search-wrapper">
                <input
                  id="search-input"
                  type="search"
                  placeholder="Ex. incubateur Montréal, femmes entrepreneures, tourisme…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          className={
            "re-filters" +
            (!showFilters ? " re-filters--collapsed" : "")
          }
        >
          <div className="re-container">
            <div className="re-filters-grid">
              <div className="re-filter-group">
                <h2 className="re-filter-title">Type de ressource</h2>
                <div className="re-chip-group">
                  {typeOptions.map((t) => (
                    <button
                      key={t}
                      className={
                        "re-chip" +
                        (filters.type.includes(t) ? " re-chip--active" : "")
                      }
                      onClick={() => handleToggleFilter("type", t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="re-filter-group">
                <h2 className="re-filter-title">Localisation</h2>
                <div className="re-chip-group">
                  {geoOptions.map((g) => (
                    <button
                      key={g}
                      className={
                        "re-chip" +
                        (filters.geo.includes(g) ? " re-chip--active" : "")
                      }
                      onClick={() => handleToggleFilter("geo", g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="re-filter-group">
                <h2 className="re-filter-title">Public cible</h2>
                <div className="re-chip-group">
                  {publicOptions.map((p) => (
                    <button
                      key={p}
                      className={
                        "re-chip" +
                        (filters.publicCible.includes(p)
                          ? " re-chip--active"
                          : "")
                      }
                      onClick={() => handleToggleFilter("publicCible", p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="re-filter-group">
                <h2 className="re-filter-title">Services / soutien</h2>
                <div className="re-chip-group">
                  {supportOptions.map((s) => (
                    <button
                      key={s}
                      className={
                        "re-chip" +
                        (filters.supports.includes(s) ? " re-chip--active" : "")
                      }
                      onClick={() => handleToggleFilter("supports", s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="re-filters-footer">
              <div className="re-filters-footer-left">
                <button onClick={handleApplyFilters} className="re-btn-primary">
                  Appliquer les filtres
                </button>
                <button onClick={handleClearFilters} className="re-btn-link">
                  Effacer tous les filtres
                </button>
              </div>
              <button
                type="button"
                className="re-btn-link re-btn-link--close"
                onClick={() => setShowFilters(false)}
              >
                Fermer les filtres
              </button>
            </div>
          </div>
        </section>

        <section className="re-results">
          <div className="re-container">
            <div className="re-results-header">
              <p className="re-results-count">
                {filtered.length} ressource
                {filtered.length > 1 ? "s" : ""} affichée
                {filtered.length > 1 ? "s" : ""}
              </p>
              <button
                className="re-btn-toggle-filters"
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
              </button>
            </div>
            <div className="re-cards-grid">
              {filtered.map((r) => {
                return (
                <Link
                  key={r.slug}
                  href={`/ressource/${r.slug}`}
                  className="re-card"
                >
                  <div className="re-card-header">
                    <div className="re-card-headings">
                      <h3 className="re-card-title">{r.nom}</h3>
                      <div className="re-card-meta">
                        {r.secteur && <span>{r.secteur}</span>}
                        {r.geographie2 && (
                          <span>
                            <span className="re-dot" /> {r.geographie2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="re-card-meta">
                    {r.publicCible && <span>{r.publicCible}</span>}
                  </div>
                  <div className="re-card-footer">
                    <div className="re-card-tags">
                      {(() => {
                        const splitParts = (val: string) =>
                          val
                            .split("/")
                            .map((p) => p.trim())
                            .filter(Boolean);
                        const typeParts = r.type ? splitParts(r.type) : [];
                        const supportParts = r.supports.flatMap(splitParts);
                        const maxTags = 4;
                        const items: { key: string; label: string; variant?: "type" }[] =
                          [];
                        typeParts.forEach((p, i) => {
                          if (items.length < maxTags) {
                            items.push({ key: `type-${i}-${p}`, label: p, variant: "type" });
                          }
                        });
                        supportParts.forEach((p, i) => {
                          if (items.length < maxTags) {
                            items.push({ key: `sup-${i}-${p}`, label: p });
                          }
                        });
                        return items.map((it) => (
                          <span
                            key={it.key}
                            className={"re-tag" + (it.variant === "type" ? " re-tag--type" : "")}
                          >
                            {it.label}
                          </span>
                        ));
                      })()}
                    </div>
                  </div>
                </Link>
              );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}


