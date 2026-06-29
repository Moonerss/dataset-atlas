-- Add optional technology type metadata to datasets.
-- Safe to run multiple times in Supabase SQL Editor.

alter table public.datasets
  add column if not exists technology_type text;

-- Keep keyword search aligned with the updated schema.
drop index if exists public.idx_datasets_text_search;

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
