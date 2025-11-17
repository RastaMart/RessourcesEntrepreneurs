-- Create social_media table if it doesn't exist
create table if not exists public.social_media (
  id bigserial primary key,
  resource_slug text not null references public.resources(slug) on delete cascade,
  platform text not null,
  url text not null,
  created_at timestamptz default now()
);

create index if not exists social_media_resource_slug_idx on public.social_media(resource_slug);

alter table public.social_media enable row level security;

do $$
begin
  begin
    create policy "Allow anonymous read (social_media)"
      on public.social_media
      for select
      to anon
      using (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "Allow anonymous insert (social_media)"
      on public.social_media
      for insert
      to anon
      with check (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "Allow anonymous update (social_media)"
      on public.social_media
      for update
      to anon
      using (true)
      with check (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "Allow anonymous delete (social_media)"
      on public.social_media
      for delete
      to anon
      using (true);
  exception when duplicate_object then null;
  end;
end $$;

-- Supprimer les doublons en gardant seulement l'entrée avec l'ID le plus petit
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'social_media' and table_schema = 'public') then
    DELETE FROM social_media a
    USING social_media b
    WHERE a.id > b.id
      AND a.resource_slug = b.resource_slug
      AND a.platform = b.platform
      AND a.url = b.url;
  end if;
end $$;

-- Ajouter une contrainte unique pour éviter les futurs doublons (si elle n'existe pas déjà)
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'social_media' and table_schema = 'public') then
    if not exists (
      select 1 from pg_constraint 
      where conname = 'social_media_unique_constraint'
    ) then
      ALTER TABLE social_media
      ADD CONSTRAINT social_media_unique_constraint
      UNIQUE (resource_slug, platform, url);
    end if;
  end if;
end $$;
