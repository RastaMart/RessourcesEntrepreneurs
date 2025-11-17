export type ResourceType = {
  slug: string;
  menuLabel: string;
  fullTitle: string;
  description: string;
  imageUrl: string;
  originalType: string; // The original type name to match against resources
};

export const resourceTypes: ResourceType[] = [
  {
    slug: "mentorat-coaching",
    menuLabel: "Mentorat & Coaching",
    fullTitle: "Mentorat & Coaching",
    description: "Ressources de mentorat et coaching pour entrepreneurs",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop&q=80",
    originalType: "Mentorat / coaching"
  },
  {
    slug: "incubation-acceleration",
    menuLabel: "Incubation & Accélération",
    fullTitle: "Incubation & Accélération",
    description: "Programmes d'incubation et d'accélération pour startups",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop&q=80",
    originalType: "Incubation & accélération"
  },
  {
    slug: "formation-competences",
    menuLabel: "Formation & Compétences",
    fullTitle: "Formation & Développement de Compétences",
    description: "Formation et développement de compétences entrepreneuriales",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop&q=80",
    originalType: "Formation & développement de compétences"
  },
  {
    slug: "reseautage-communaute",
    menuLabel: "Réseautage & Communauté",
    fullTitle: "Réseautage & Communauté",
    description: "Réseautage et communautés d'entrepreneurs",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop&q=80",
    originalType: "Réseautage & communauté"
  },
  {
    slug: "conseils-techniques",
    menuLabel: "Conseils Techniques",
    fullTitle: "Conseils Techniques ou Sectoriels",
    description: "Conseils techniques et sectoriels pour entrepreneurs",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop&q=80",
    originalType: "Conseils techniques ou sectoriels"
  },
  {
    slug: "support-administratif",
    menuLabel: "Support Administratif",
    fullTitle: "Support Administratif / Réglementaire",
    description: "Support administratif et réglementaire pour entreprises",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=600&fit=crop&q=80",
    originalType: "Support administratif / réglementaire"
  },
  {
    slug: "marketing-commercialisation",
    menuLabel: "Marketing & Commercialisation",
    fullTitle: "Support au Marketing / Commercialisation / Accès au Marché",
    description: "Support au marketing, commercialisation et accès au marché",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&q=80",
    originalType: "Support au marketing / commercialisation / accès au marché"
  },
  {
    slug: "support-technologique",
    menuLabel: "Support Technologique",
    fullTitle: "Support Technologique / Numérique",
    description: "Support technologique et numérique pour entreprises",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop&q=80",
    originalType: "Support technologique / numérique"
  },
  {
    slug: "support-thematique",
    menuLabel: "Support Thématique",
    fullTitle: "Support Thématique ou pour Groupes Sous-représentés",
    description: "Support thématique et pour groupes sous-représentés",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop&q=80",
    originalType: "Support thématique ou pour groupes sous-représentés"
  },
  {
    slug: "infrastructures",
    menuLabel: "Infrastructures",
    fullTitle: "Accès aux Infrastructures ou Ressources Physiques",
    description: "Accès aux infrastructures et ressources physiques",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop&q=80",
    originalType: "Accès aux infrastructures ou ressources physiques"
  },
  {
    slug: "innovation-rd",
    menuLabel: "Innovation & R&D",
    fullTitle: "Soutien à l'Innovation et Recherche/Développement (R&D)",
    description: "Soutien à l'innovation et recherche/développement",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop&q=80",
    originalType: "Soutien à l'innovation et recherche/développement (R&D)"
  },
  {
    slug: "croissance-strategie",
    menuLabel: "Croissance & Stratégie",
    fullTitle: "Soutien Global de Croissance & Planification Stratégique",
    description: "Soutien global de croissance et planification stratégique",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop&q=80",
    originalType: "Soutien global de croissance & planification stratégique"
  }
];

export function getResourceTypeBySlug(slug: string): ResourceType | undefined {
  return resourceTypes.find(rt => rt.slug === slug);
}

export function getResourceTypeByOriginalType(originalType: string): ResourceType | undefined {
  return resourceTypes.find(rt => rt.originalType === originalType);
}

