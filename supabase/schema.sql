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


-- Table des profils utilisateurs (inclut un rôle admin simple)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

do $$
begin
  begin
    create policy "Allow users to read own profile"
      on public.profiles
      for select
      using (auth.uid() = id);
  exception when duplicate_object then null;
  end;

  begin
    create policy "Allow users to update own profile"
      on public.profiles
      for update
      using (auth.uid() = id)
      with check (auth.uid() = id);
  exception when duplicate_object then null;
  end;
end $$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert or update on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end $$;


