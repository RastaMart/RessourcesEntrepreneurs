-- Storage bucket (créer manuellement via UI si nécessaire) :
-- Nom : resources, Public: true

-- (resources_meta supprimée; métadonnées stockées directement sur public.resources)

-- Table principale des ressources (fusion CSV + métadonnées)
create table if not exists public.resources (
  slug text primary key,
  nom text not null,
  type text,
  type_organisation text,
  localisation text,
  geographie text,
  geographie2 text,
  site text,
  secteur text,
  modalite text,
  services text,
  public_cible text,
  contacts text,
  autres text,
  supports jsonb,                -- liste de soutiens (tags)
  meta_description text,
  image_url text,                -- URL publique (ex. Supabase Storage)
  socials jsonb,                 -- { linkedin, instagram, facebook, twitter, youtube, tiktok }
  inserted_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists resources_type_idx on public.resources (type);
create index if not exists resources_localisation_idx on public.resources (localisation);
create index if not exists resources_geographie_idx on public.resources (geographie);
create index if not exists resources_geographie2_idx on public.resources (geographie2);
create index if not exists resources_site_idx on public.resources (site);

alter table public.resources enable row level security;
do $$
begin
  begin
    create policy "Allow anonymous read (resources)"
      on public.resources
      for select
      to anon
      using (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "Allow anonymous upsert (resources)"
      on public.resources
      for insert
      to anon
      with check (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "Allow anonymous update (resources)"
      on public.resources
      for update
      to anon
      using (true)
      with check (true);
  exception when duplicate_object then null;
  end;
end $$;


