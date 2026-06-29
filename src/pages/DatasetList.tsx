import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listDatasets } from '../lib/datasets';
import {
  Dataset,
  DatasetFilters,
  downloadStatusLabels,
  lifecycleStatusLabels,
  omicsOptions,
  organismOptions,
  priorityLabels,
  sourceOptions,
} from '../types';

const initialFilters: DatasetFilters = {
  keyword: '',
  source: '',
  organism: '',
  omics_type: '',
  lifecycle_status: '',
  download_status: '',
  priority: '',
};

export default function DatasetList() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [filters, setFilters] = useState<DatasetFilters>(initialFilters);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    listDatasets(filters)
      .then(setDatasets)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : '加载失败'))
      .finally(() => setIsLoading(false));
  }, [filters]);

  function updateFilter<K extends keyof DatasetFilters>(key: K, value: DatasetFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Browse</p>
          <h1>数据集列表</h1>
          <p>搜索、筛选并打开数据集详情。当前匹配 <strong className="signal-number">{datasets.length}</strong> 条记录。</p>
        </div>
        <Link className="primary-button" to="/datasets/new">新增数据集</Link>
      </div>

      <div className="card filter-card">
        <input
          className="search-input"
          value={filters.keyword}
          onChange={(event) => updateFilter('keyword', event.target.value)}
          placeholder="搜索标题、登录号、疾病、备注..."
        />
        <select value={filters.source} onChange={(event) => updateFilter('source', event.target.value)}>
          <option value="">全部来源</option>
          {sourceOptions.map((source) => <option key={source} value={source}>{source}</option>)}
        </select>
        <select value={filters.organism} onChange={(event) => updateFilter('organism', event.target.value)}>
          <option value="">全部物种</option>
          {organismOptions.map((organism) => <option key={organism} value={organism}>{organism}</option>)}
        </select>
        <select value={filters.omics_type} onChange={(event) => updateFilter('omics_type', event.target.value)}>
          <option value="">全部组学</option>
          {omicsOptions.map((omics) => <option key={omics} value={omics}>{omics}</option>)}
        </select>
        <select value={filters.lifecycle_status} onChange={(event) => updateFilter('lifecycle_status', event.target.value)}>
          <option value="">全部状态</option>
          {Object.entries(lifecycleStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select value={filters.download_status} onChange={(event) => updateFilter('download_status', event.target.value)}>
          <option value="">全部下载状态</option>
          {Object.entries(downloadStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select value={filters.priority} onChange={(event) => updateFilter('priority', event.target.value)}>
          <option value="">全部优先级</option>
          {Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      {error && <div className="empty-state">{error}</div>}
      {isLoading && <div className="empty-state">正在加载数据集...</div>}

      {!isLoading && !error && (
        <div className="card table-card">
          {datasets.length === 0 ? (
            <div className="empty-state">暂无匹配数据集。可以先新增一个数据集。</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>标题</th>
                  <th>登录号</th>
                  <th>来源</th>
                  <th>组学</th>
                  <th>技术类型</th>
                  <th>疾病</th>
                  <th>物种</th>
                  <th>样本数</th>
                  <th>状态</th>
                  <th>Meta 描述</th>
                </tr>
              </thead>
              <tbody>
                {datasets.map((dataset) => (
                  <tr key={dataset.id}>
                    <td><Link to={`/datasets/${dataset.id}`}>{dataset.title}</Link></td>
                    <td>{dataset.accession || '—'}</td>
                    <td>
                      {dataset.source_url ? (
                        <a className="source-link" href={dataset.source_url} target="_blank" rel="noreferrer">{dataset.source}</a>
                      ) : (
                        dataset.source
                      )}
                    </td>
                    <td>{dataset.omics_type || '—'}</td>
                    <td>{dataset.technology_type || '—'}</td>
                    <td>{dataset.disease || '—'}</td>
                    <td>{dataset.organism || '—'}</td>
                    <td>{dataset.sample_count ?? '—'}</td>
                    <td><span className={`badge status-${dataset.lifecycle_status}`}>{lifecycleStatusLabels[dataset.lifecycle_status]}</span></td>
                    <td className="meta-cell">{dataset.description || dataset.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}
