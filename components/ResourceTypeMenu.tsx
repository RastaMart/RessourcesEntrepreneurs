"use client";

import Link from "next/link";
import { resourceTypes } from "../lib/resourceTypes";

export default function ResourceTypeMenu() {
  return (
    <section className="re-resource-menu">
      <div className="re-container">
        <h2 className="re-resource-menu-title">Types de ressources</h2>
        <div className="re-resource-menu-grid">
          {resourceTypes.map((type) => (
            <Link
              key={type.slug}
              href={`/type/${type.slug}`}
              className="re-resource-menu-item"
            >
              <div className="re-resource-menu-item-icon">
                <img
                  src={type.imageUrl}
                  alt={type.fullTitle}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="re-resource-menu-item-label">{type.menuLabel}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

