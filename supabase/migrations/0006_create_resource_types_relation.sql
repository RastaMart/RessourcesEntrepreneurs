-- Create resource_types table to store all available types
create table if not exists public.resource_types (
  id serial primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamptz default now()
);

-- Create junction table for many-to-many relationship
create table if not exists public.resource_resource_types (
  resource_slug text not null references public.resources(slug) on delete cascade,
  resource_type_id integer not null references public.resource_types(id) on delete cascade,
  primary key (resource_slug, resource_type_id)
);

-- Create indexes
create index if not exists resource_resource_types_resource_slug_idx 
  on public.resource_resource_types(resource_slug);
create index if not exists resource_resource_types_resource_type_id_idx 
  on public.resource_resource_types(resource_type_id);
create index if not exists resource_types_slug_idx on public.resource_types(slug);
create index if not exists resource_types_name_idx on public.resource_types(name);

-- Enable RLS
alter table public.resource_types enable row level security;
alter table public.resource_resource_types enable row level security;

-- RLS policies for resource_types (public read, allow insert for types initialization)
do $$
begin
  begin
    create policy "Allow anonymous read (resource_types)"
      on public.resource_types
      for select
      to anon
      using (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "Allow anonymous insert (resource_types)"
      on public.resource_types
      for insert
      to anon
      with check (true);
  exception when duplicate_object then null;
  end;
end $$;

-- RLS policies for resource_resource_types (public read)
do $$
begin
  begin
    create policy "Allow anonymous read (resource_resource_types)"
      on public.resource_resource_types
      for select
      to anon
      using (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "Allow anonymous insert (resource_resource_types)"
      on public.resource_resource_types
      for insert
      to anon
      with check (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "Allow anonymous delete (resource_resource_types)"
      on public.resource_resource_types
      for delete
      to anon
      using (true);
  exception when duplicate_object then null;
  end;
end $$;

-- Insert all resource types from the application
insert into public.resource_types (name, slug) values
  ('Mentorat / coaching', 'mentorat-coaching'),
  ('Incubation & accélération', 'incubation-acceleration'),
  ('Formation & développement de compétences', 'formation-competences'),
  ('Réseautage & communauté', 'reseautage-communaute'),
  ('Conseils techniques ou sectoriels', 'conseils-techniques'),
  ('Support administratif / réglementaire', 'support-administratif'),
  ('Support au marketing / commercialisation / accès au marché', 'marketing-commercialisation'),
  ('Support technologique / numérique', 'support-technologique'),
  ('Support thématique ou pour groupes sous-représentés', 'support-thematique'),
  ('Accès aux infrastructures ou ressources physiques', 'infrastructures'),
  ('Soutien à l''innovation et recherche/développement (R&D)', 'innovation-rd'),
  ('Soutien global de croissance & planification stratégique', 'croissance-strategie')
on conflict (slug) do nothing;

-- Migrate existing data from types JSONB array to the junction table
insert into public.resource_resource_types (resource_slug, resource_type_id)
select distinct
  r.slug as resource_slug,
  rt.id as resource_type_id
from public.resources r
cross join lateral jsonb_array_elements_text(
  case 
    when r.types is not null and jsonb_array_length(r.types) > 0 then r.types
    when r.type is not null and r.type != '' then jsonb_build_array(r.type)
    else '[]'::jsonb
  end
) as type_name
inner join public.resource_types rt on rt.name = type_name
on conflict do nothing;

-- Also migrate from the old 'type' field if not already in types array
insert into public.resource_resource_types (resource_slug, resource_type_id)
select distinct
  r.slug as resource_slug,
  rt.id as resource_type_id
from public.resources r
inner join public.resource_types rt on rt.name = r.type
where r.type is not null
  and r.type != ''
  and not exists (
    select 1 
    from public.resource_resource_types rrt 
    where rrt.resource_slug = r.slug 
      and rrt.resource_type_id = rt.id
  )
on conflict do nothing;

