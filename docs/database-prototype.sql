-- Dataset Atlas database prototype for Supabase/PostgreSQL
-- Personal-first design with collaboration-ready fields.

create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  owner_id uuid,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (name)
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text,
  description text,
  owner_id uuid,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (name)
);

create table if not exists public.datasets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  accession text,
  source text not null,
  source_url text,
  description text,
  publication_title text,
  pmid text,
  doi text,
  publication_url text,
  organism text,
  disease text,
  tissue text,
  cell_type text,
  omics_type text,
  technology_type text,
  sample_count integer check (sample_count is null or sample_count >= 0),
  condition_groups text,
  data_format text,
  data_size text,
  license text,
  download_status text not null default 'not_downloaded' check (download_status in ('not_downloaded', 'partial', 'downloaded', 'unavailable')),
  local_path text,
  lifecycle_status text not null default 'to_evaluate' check (lifecycle_status in ('to_evaluate', 'usable', 'analyzing', 'completed', 'deprecated', 'archived')),
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  project_id uuid references public.projects(id) on delete set null,
  notes text,
  owner_id uuid,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint datasets_accession_or_url check (
    nullif(trim(coalesce(accession, '')), '') is not null or
    nullif(trim(coalesce(source_url, '')), '') is not null
  )
);

create table if not exists public.dataset_tags (
  dataset_id uuid not null references public.datasets(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  created_by uuid,
  primary key (dataset_id, tag_id)
);

create table if not exists public.dataset_events (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references public.datasets(id) on delete cascade,
  event_type text not null check (event_type in ('created', 'updated', 'status_changed', 'downloaded', 'cleaned', 'analyzed', 'note_added', 'archived')),
  old_value jsonb,
  new_value jsonb,
  comment text,
  created_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.dataset_links (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references public.datasets(id) on delete cascade,
  label text not null,
  url text not null,
  link_type text not null default 'other' check (link_type in ('source', 'publication', 'metadata', 'download', 'analysis', 'other')),
  created_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_datasets_accession on public.datasets(accession);
create index if not exists idx_datasets_source on public.datasets(source);
create index if not exists idx_datasets_organism on public.datasets(organism);
create index if not exists idx_datasets_disease on public.datasets(disease);
create index if not exists idx_datasets_omics_type on public.datasets(omics_type);
create index if not exists idx_datasets_download_status on public.datasets(download_status);
create index if not exists idx_datasets_lifecycle_status on public.datasets(lifecycle_status);
create index if not exists idx_datasets_priority on public.datasets(priority);
create index if not exists idx_datasets_project_id on public.datasets(project_id);
create index if not exists idx_datasets_updated_at on public.datasets(updated_at desc);
create index if not exists idx_dataset_events_dataset_id on public.dataset_events(dataset_id);
create index if not exists idx_dataset_tags_tag_id on public.dataset_tags(tag_id);

create index if not exists idx_datasets_text_search on public.datasets using gin (
  to_tsvector(
    'simple',
    coalesce(title, '') || ' ' ||
    coalesce(accession, '') || ' ' ||
    coalesce(description, '') || ' ' ||
    coalesce(disease, '') || ' ' ||
    coalesce(tissue, '') || ' ' ||
    coalesce(omics_type, '') || ' ' ||
    coalesce(technology_type, '') || ' ' ||
    coalesce(notes, '')
  )
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_tags_updated_at on public.tags;
create trigger set_tags_updated_at
before update on public.tags
for each row execute function public.set_updated_at();

drop trigger if exists set_datasets_updated_at on public.datasets;
create trigger set_datasets_updated_at
before update on public.datasets
for each row execute function public.set_updated_at();