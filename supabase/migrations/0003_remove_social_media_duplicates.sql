-- Supprimer les doublons en gardant seulement l'entrée avec l'ID le plus petit
DELETE FROM social_media a
USING social_media b
WHERE a.id > b.id
  AND a.resource_slug = b.resource_slug
  AND a.platform = b.platform
  AND a.url = b.url;

-- Ajouter une contrainte unique pour éviter les futurs doublons
ALTER TABLE social_media
ADD CONSTRAINT social_media_unique_constraint
UNIQUE (resource_slug, platform, url);

