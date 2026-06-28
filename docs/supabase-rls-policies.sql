-- Dataset Atlas RLS policies for authenticated users.
-- Run after docs/database-prototype.sql.

alter table public.projects enable row level security;
alter table public.tags enable row level security;
alter table public.datasets enable row level security;
alter table public.dataset_tags enable row level security;
alter table public.dataset_events enable row level security;
alter table public.dataset_links enable row level security;

drop policy if exists "authenticated users can read projects" on public.projects;
create policy "authenticated users can read projects"
on public.projects for select
to authenticated
using (true);

drop policy if exists "authenticated users can write projects" on public.projects;
create policy "authenticated users can write projects"
on public.projects for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users can read tags" on public.tags;
create policy "authenticated users can read tags"
on public.tags for select
to authenticated
using (true);

drop policy if exists "authenticated users can write tags" on public.tags;
create policy "authenticated users can write tags"
on public.tags for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users can read datasets" on public.datasets;
create policy "authenticated users can read datasets"
on public.datasets for select
to authenticated
using (true);

drop policy if exists "authenticated users can write datasets" on public.datasets;
create policy "authenticated users can write datasets"
on public.datasets for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users can read dataset_tags" on public.dataset_tags;
create policy "authenticated users can read dataset_tags"
on public.dataset_tags for select
to authenticated
using (true);

drop policy if exists "authenticated users can write dataset_tags" on public.dataset_tags;
create policy "authenticated users can write dataset_tags"
on public.dataset_tags for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users can read dataset_events" on public.dataset_events;
create policy "authenticated users can read dataset_events"
on public.dataset_events for select
to authenticated
using (true);

drop policy if exists "authenticated users can write dataset_events" on public.dataset_events;
create policy "authenticated users can write dataset_events"
on public.dataset_events for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users can read dataset_links" on public.dataset_links;
create policy "authenticated users can read dataset_links"
on public.dataset_links for select
to authenticated
using (true);

drop policy if exists "authenticated users can write dataset_links" on public.dataset_links;
create policy "authenticated users can write dataset_links"
on public.dataset_links for all
to authenticated
using (true)
with check (true);
