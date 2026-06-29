export type DownloadStatus = 'not_downloaded' | 'partial' | 'downloaded' | 'unavailable';
export type LifecycleStatus = 'to_evaluate' | 'usable' | 'analyzing' | 'completed' | 'deprecated' | 'archived';
export type Priority = 'high' | 'medium' | 'low';

export interface Dataset {
  id: string;
  title: string;
  accession: string | null;
  source: string;
  source_url: string | null;
  description: string | null;
  publication_title: string | null;
  pmid: string | null;
  doi: string | null;
  publication_url: string | null;
  organism: string | null;
  disease: string | null;
  tissue: string | null;
  cell_type: string | null;
  omics_type: string | null;
  technology_type: string | null;
  sample_count: number | null;
  condition_groups: string | null;
  data_format: string | null;
  data_size: string | null;
  license: string | null;
  download_status: DownloadStatus;
  local_path: string | null;
  lifecycle_status: LifecycleStatus;
  priority: Priority;
  project_id: string | null;
  notes: string | null;
  owner_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export type DatasetInput = Omit<
  Dataset,
  | 'id'
  | 'owner_id'
  | 'created_by'
  | 'updated_by'
  | 'created_at'
  | 'updated_at'
  | 'archived_at'
>;

export interface DatasetFilters {
  keyword: string;
  source: string;
  organism: string;
  omics_type: string;
  lifecycle_status: string;
  download_status: string;
  priority: string;
}

export const emptyDatasetInput: DatasetInput = {
  title: '',
  accession: '',
  source: 'GEO',
  source_url: '',
  description: '',
  publication_title: '',
  pmid: '',
  doi: '',
  publication_url: '',
  organism: '',
  disease: '',
  tissue: '',
  cell_type: '',
  omics_type: '',
  technology_type: '',
  sample_count: null,
  condition_groups: '',
  data_format: '',
  data_size: '',
  license: '',
  download_status: 'not_downloaded',
  local_path: '',
  lifecycle_status: 'to_evaluate',
  priority: 'medium',
  project_id: null,
  notes: '',
};

export const sourceOptions = ['GEO', 'SRA', 'ArrayExpress', 'TCGA', 'Zenodo', 'Figshare', 'Other'];
export const organismOptions = ['human', 'mouse', 'rat', 'zebrafish', 'other'];
export const omicsOptions = ['RNA-seq', 'scRNA-seq', 'snRNA-seq', 'stRNA-seq', 'ATAC-seq', 'WGS', 'WES', 'proteomics', 'metabolomics', 'multi-omics', 'other'];

export const downloadStatusLabels: Record<DownloadStatus, string> = {
  not_downloaded: '未下载',
  partial: '部分下载',
  downloaded: '已下载',
  unavailable: '无法获取',
};

export const lifecycleStatusLabels: Record<LifecycleStatus, string> = {
  to_evaluate: '待评估',
  usable: '可用',
  analyzing: '分析中',
  completed: '已完成',
  deprecated: '弃用',
  archived: '归档',
};

export const priorityLabels: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};
