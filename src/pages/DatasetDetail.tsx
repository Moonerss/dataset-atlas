import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { archiveDataset, getDataset } from '../lib/datasets';
import { Dataset, downloadStatusLabels, lifecycleStatusLabels, priorityLabels } from '../types';

function valueOrDash(value: string | number | null) {
  return value === null || value === '' ? '—' : value;
}

function DetailItem({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{valueOrDash(value)}</strong>
    </div>
  );
}

export default function DatasetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    getDataset(id)
      .then(setDataset)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : '加载失败'));
  }, [id]);

  async function handleArchive() {
    if (!dataset) return;
    const confirmed = window.confirm('确认归档这个数据集？归档后列表默认不再显示。');
    if (!confirmed) return;
    await archiveDataset(dataset.id);
    navigate('/datasets');
  }

  if (error) return <div className="empty-state">{error}</div>;
  if (!dataset) return <div className="empty-state">正在加载数据集...</div>;

  return (
    <section className="page-stack">
      <div className="page-header detail-hero">
        <div>
          <p className="eyebrow">Dataset</p>
          <h1>{dataset.title}</h1>
          <p>{dataset.description || '暂无描述'}</p>
          <div className="accession-chip">{dataset.accession || dataset.source}</div>
        </div>
        <div className="button-row">
          {dataset.source_url && <a className="ghost-button" href={dataset.source_url} target="_blank" rel="noreferrer">打开来源</a>}
          <Link className="ghost-button" to={`/datasets/${dataset.id}/edit`}>编辑</Link>
          <button className="danger-button" type="button" onClick={handleArchive}>归档</button>
        </div>
      </div>

      <div className="status-strip">
        <span className={`badge status-${dataset.lifecycle_status}`}>{lifecycleStatusLabels[dataset.lifecycle_status]}</span>
        <span className={`badge download-${dataset.download_status}`}>{downloadStatusLabels[dataset.download_status]}</span>
        <span className={`badge priority-${dataset.priority}`}>优先级：{priorityLabels[dataset.priority]}</span>
      </div>

      <div className="detail-grid">
        <div className="card">
          <h2>基础信息</h2>
          <DetailItem label="登录号" value={dataset.accession} />
          <DetailItem label="来源" value={dataset.source} />
          <DetailItem label="PMID" value={dataset.pmid} />
          <DetailItem label="DOI" value={dataset.doi} />
          <DetailItem label="论文标题" value={dataset.publication_title} />
        </div>

        <div className="card">
          <h2>生物医学信息</h2>
          <DetailItem label="物种" value={dataset.organism} />
          <DetailItem label="疾病 / 表型" value={dataset.disease} />
          <DetailItem label="组织" value={dataset.tissue} />
          <DetailItem label="细胞类型" value={dataset.cell_type} />
          <DetailItem label="组学类型" value={dataset.omics_type} />
          <DetailItem label="技术类型" value={dataset.technology_type} />
          <DetailItem label="样本数" value={dataset.sample_count} />
          <DetailItem label="分组" value={dataset.condition_groups} />
        </div>

        <div className="card">
          <h2>数据可用性</h2>
          <DetailItem label="数据格式" value={dataset.data_format} />
          <DetailItem label="数据大小" value={dataset.data_size} />
          <DetailItem label="许可证" value={dataset.license} />
          <DetailItem label="本地路径" value={dataset.local_path} />
        </div>

        <div className="card">
          <h2>备注</h2>
          <p className="notes-text">{dataset.notes || '暂无备注'}</p>
          <DetailItem label="创建时间" value={new Date(dataset.created_at).toLocaleString()} />
          <DetailItem label="更新时间" value={new Date(dataset.updated_at).toLocaleString()} />
        </div>
      </div>
    </section>
  );
}
