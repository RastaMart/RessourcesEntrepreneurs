-- Add types JSONB array field to support multiple types per resource
alter table public.resources 
add column if not exists types jsonb default '[]'::jsonb;

-- Migrate existing type values to types array
update public.resources
set types = case 
  when type is not null and type != '' then jsonb_build_array(type)
  else '[]'::jsonb
end
where types is null or types = '[]'::jsonb;

-- Create index for types array queries
create index if not exists resources_types_idx on public.resources using gin (types);

