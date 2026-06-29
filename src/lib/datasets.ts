import { mockDatasets } from '../data/mockDatasets';
import { Dataset, DatasetFilters, DatasetInput } from '../types';
import { isSupabaseConfigured, supabase } from './supabase';

let localDatasets = [...mockDatasets];

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase 尚未配置。请复制 .env.example 为 .env 并填写 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY。');
  }

  return supabase;
}

function filterLocalDatasets(filters?: DatasetFilters) {
  let datasets = localDatasets.filter((dataset) => !dataset.archived_at);

  if (filters?.source) datasets = datasets.filter((dataset) => dataset.source === filters.source);
  if (filters?.organism) datasets = datasets.filter((dataset) => dataset.organism === filters.organism);
  if (filters?.omics_type) datasets = datasets.filter((dataset) => dataset.omics_type === filters.omics_type);
  if (filters?.lifecycle_status) datasets = datasets.filter((dataset) => dataset.lifecycle_status === filters.lifecycle_status);
  if (filters?.download_status) datasets = datasets.filter((dataset) => dataset.download_status === filters.download_status);
  if (filters?.priority) datasets = datasets.filter((dataset) => dataset.priority === filters.priority);

  const keyword = filters?.keyword.trim().toLowerCase();
  if (keyword) {
    datasets = datasets.filter((dataset) =>
      [dataset.title, dataset.accession, dataset.description, dataset.disease, dataset.tissue, dataset.omics_type, dataset.technology_type, dataset.notes]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    );
  }

  return datasets.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}
function normalizeInput(input: DatasetInput) {
  return {
    ...input,
    accession: input.accession?.trim() || null,
    source_url: input.source_url?.trim() || null,
    description: input.description?.trim() || null,
    publication_title: input.publication_title?.trim() || null,
    pmid: input.pmid?.trim() || null,
    doi: input.doi?.trim() || null,
    publication_url: input.publication_url?.trim() || null,
    organism: input.organism?.trim() || null,
    disease: input.disease?.trim() || null,
    tissue: input.tissue?.trim() || null,
    cell_type: input.cell_type?.trim() || null,
    omics_type: input.omics_type?.trim() || null,
    technology_type: input.technology_type?.trim() || null,
    condition_groups: input.condition_groups?.trim() || null,
    data_format: input.data_format?.trim() || null,
    data_size: input.data_size?.trim() || null,
    license: input.license?.trim() || null,
    local_path: input.local_path?.trim() || null,
    project_id: input.project_id || null,
    notes: input.notes?.trim() || null,
  };
}

export async function listDatasets(filters?: DatasetFilters): Promise<Dataset[]> {
  if (!isSupabaseConfigured) return filterLocalDatasets(filters);

  const client = requireSupabase();
  let query = client
    .from('datasets')
    .select('*')
    .is('archived_at', null)
    .order('updated_at', { ascending: false });

  if (filters?.source) query = query.eq('source', filters.source);
  if (filters?.organism) query = query.eq('organism', filters.organism);
  if (filters?.omics_type) query = query.eq('omics_type', filters.omics_type);
  if (filters?.lifecycle_status) query = query.eq('lifecycle_status', filters.lifecycle_status);
  if (filters?.download_status) query = query.eq('download_status', filters.download_status);
  if (filters?.priority) query = query.eq('priority', filters.priority);

  const { data, error } = await query;

  if (error) throw error;

  const keyword = filters?.keyword.trim().toLowerCase();
  if (!keyword) return data ?? [];

  return (data ?? []).filter((dataset) =>
    [dataset.title, dataset.accession, dataset.description, dataset.disease, dataset.tissue, dataset.omics_type, dataset.technology_type, dataset.notes]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword)),
  );
}

export async function getDataset(id: string): Promise<Dataset> {
  if (!isSupabaseConfigured) {
    const dataset = localDatasets.find((item) => item.id === id && !item.archived_at);
    if (!dataset) throw new Error('未找到数据集。');
    return dataset;
  }

  const client = requireSupabase();
  const { data, error } = await client.from('datasets').select('*').eq('id', id).single();

  if (error) throw error;
  return data;
}

export async function createDataset(input: DatasetInput): Promise<Dataset> {
  if (!isSupabaseConfigured) {
    const timestamp = new Date().toISOString();
    const dataset: Dataset = {
      ...normalizeInput(input),
      id: `local-${crypto.randomUUID()}`,
      owner_id: null,
      created_by: null,
      updated_by: null,
      created_at: timestamp,
      updated_at: timestamp,
      archived_at: null,
    };
    localDatasets = [dataset, ...localDatasets];
    return dataset;
  }

  const client = requireSupabase();
  const { data, error } = await client.from('datasets').insert(normalizeInput(input)).select('*').single();

  if (error) throw error;
  return data;
}

export async function updateDataset(id: string, input: DatasetInput): Promise<Dataset> {
  if (!isSupabaseConfigured) {
    const current = localDatasets.find((item) => item.id === id);
    if (!current) throw new Error('未找到数据集。');

    const updated: Dataset = {
      ...current,
      ...normalizeInput(input),
      updated_at: new Date().toISOString(),
    };

    localDatasets = localDatasets.map((item) => (item.id === id ? updated : item));
    return updated;
  }

  const client = requireSupabase();
  const { data, error } = await client.from('datasets').update(normalizeInput(input)).eq('id', id).select('*').single();

  if (error) throw error;
  return data;
}

export async function archiveDataset(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const archivedAt = new Date().toISOString();
    localDatasets = localDatasets.map((item) => (item.id === id ? { ...item, archived_at: archivedAt, updated_at: archivedAt } : item));
    return;
  }

  const client = requireSupabase();
  const { error } = await client.from('datasets').update({ archived_at: new Date().toISOString() }).eq('id', id);

  if (error) throw error;
}
export async function exportDatasets(): Promise<Dataset[]> {
  return listDatasets({
    keyword: '',
    source: '',
    organism: '',
    omics_type: '',
    lifecycle_status: '',
    download_status: '',
    priority: '',
  });
}
