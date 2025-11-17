"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Resource } from "../lib/resources";
import { resourceTypes } from "../lib/resourceTypes";
import { getCategoryForResourceType } from "../lib/resourceTypeMapper";

type Props = {
  resource: Resource;
};

export default function ResourceCard({ resource: r }: Props) {
  const router = useRouter();
  
  const splitParts = (val: string) =>
    val
      .split("/")
      .map((p) => p.trim())
      .filter(Boolean);

  // Use types array from database, fallback to type for backward compatibility
  const typeParts = r.types && r.types.length > 0 
    ? r.types.filter(Boolean).map(t => t.trim())
    : (r.type ? [r.type.trim()] : []);
  const supportParts = r.supports.flatMap(splitParts);
  const maxTags = 4;
  const items: { key: string; label: string; variant?: "type" }[] = [];

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
  
  const handleTypeClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/type/${slug}`);
  };

  return (
    <Link href={`/ressource/${r.slug}`} className="re-card">
      <img
        src={r.metaImage || "/ressources_images/placeholder.svg"}
        alt={r.nom}
        className="re-card-thumb"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
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
          {items.map((it) => {
            if (it.variant === "type") {
              // Find matching category for type tags - check if the type matches directly
              const fullTypeCategory = resourceTypes.find(rt => rt.originalType === it.label);
              const category = fullTypeCategory || getCategoryForResourceType(it.label);
              
              if (category) {
                return (
                  <span
                    key={it.key}
                    className="re-tag re-tag--type re-tag--link"
                    onClick={(e) => handleTypeClick(e, category.slug)}
                    style={{ cursor: "pointer" }}
                  >
                    {it.label}
                  </span>
                );
              }
            }
            
            return (
              <span
                key={it.key}
                className={"re-tag" + (it.variant === "type" ? " re-tag--type" : "")}
              >
                {it.label}
              </span>
            );
          })}
        </div>
      </div>
    </Link>
  );
}

