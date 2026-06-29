import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DatasetForm from '../components/DatasetForm';
import { getDataset, updateDataset } from '../lib/datasets';
import { Dataset, DatasetInput } from '../types';

function toInput(dataset: Dataset): DatasetInput {
  return {
    title: dataset.title,
    accession: dataset.accession,
    source: dataset.source,
    source_url: dataset.source_url,
    description: dataset.description,
    publication_title: dataset.publication_title,
    pmid: dataset.pmid,
    doi: dataset.doi,
    publication_url: dataset.publication_url,
    organism: dataset.organism,
    disease: dataset.disease,
    tissue: dataset.tissue,
    cell_type: dataset.cell_type,
    omics_type: dataset.omics_type,
    technology_type: dataset.technology_type,
    sample_count: dataset.sample_count,
    condition_groups: dataset.condition_groups,
    data_format: dataset.data_format,
    data_size: dataset.data_size,
    license: dataset.license,
    download_status: dataset.download_status,
    local_path: dataset.local_path,
    lifecycle_status: dataset.lifecycle_status,
    priority: dataset.priority,
    project_id: dataset.project_id,
    notes: dataset.notes,
  };
}

export default function EditDataset() {
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

  async function handleSubmit(input: DatasetInput) {
    if (!id) return;
    const updated = await updateDataset(id, input);
    navigate(`/datasets/${updated.id}`);
  }

  if (error) return <div className="empty-state">{error}</div>;
  if (!dataset) return <div className="empty-state">正在加载数据集...</div>;

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Edit</p>
          <h1>编辑数据集</h1>
          <p>{dataset.title}</p>
        </div>
        <Link className="ghost-button" to={`/datasets/${dataset.id}`}>返回详情</Link>
      </div>
      <div className="card">
        <DatasetForm initialValue={toInput(dataset)} submitLabel="保存修改" onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
