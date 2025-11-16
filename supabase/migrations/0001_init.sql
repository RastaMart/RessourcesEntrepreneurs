-- === public.resources (from CSV + metadata) ===============================
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
  supports jsonb,
  meta_description text,
  image_url text,
  socials jsonb,
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

-- === public.resources_meta (optional mirror) ===============================
create table if not exists public.resources_meta (
  slug text primary key,
  url text,
  used_url text,
  description text,
  image_url text,
  socials jsonb,
  inserted_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists resources_meta_used_url_idx on public.resources_meta (used_url);

alter table public.resources_meta enable row level security;
do $$
begin
  begin
    create policy "Allow anonymous read (resources_meta)"
      on public.resources_meta
      for select
      to anon
      using (true);
  exception when duplicate_object then null;
  end;
end $$;

-- === Storage bucket & policies for images ==================================
-- Create bucket 'resources' if it doesn't exist
insert into storage.buckets (id, name, public)
values ('resources', 'resources', true)
on conflict (id) do nothing;

-- Public read for objects in 'resources'
create policy if not exists "Public read resources objects"
  on storage.objects
  for select
  to anon
  using (bucket_id = 'resources');

-- Allow anonymous upload/update for 'resources' (optional; needed for client/anon uploads)
create policy if not exists "Anon insert resources objects"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'resources');

create policy if not exists "Anon update resources objects"
  on storage.objects
  for update
  to anon
  using (bucket_id = 'resources')
  with check (bucket_id = 'resources');


