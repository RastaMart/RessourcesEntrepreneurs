-- Add RLS policies for authenticated users on resource_types and resource_resource_types
-- This fixes the issue where logged-in users (including admins) couldn't read resource types

-- RLS policies for resource_types (allow authenticated users to read and insert)
do $$
begin
  begin
    create policy "Allow authenticated read (resource_types)"
      on public.resource_types
      for select
      to authenticated
      using (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "Allow authenticated insert (resource_types)"
      on public.resource_types
      for insert
      to authenticated
      with check (true);
  exception when duplicate_object then null;
  end;
end $$;

-- RLS policies for resource_resource_types (allow authenticated users to read, insert, and delete)
do $$
begin
  begin
    create policy "Allow authenticated read (resource_resource_types)"
      on public.resource_resource_types
      for select
      to authenticated
      using (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "Allow authenticated insert (resource_resource_types)"
      on public.resource_resource_types
      for insert
      to authenticated
      with check (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "Allow authenticated delete (resource_resource_types)"
      on public.resource_resource_types
      for delete
      to authenticated
      using (true);
  exception when duplicate_object then null;
  end;
end $$;

