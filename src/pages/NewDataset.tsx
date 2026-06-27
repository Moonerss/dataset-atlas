import { useNavigate } from 'react-router-dom';
import DatasetForm from '../components/DatasetForm';
import { createDataset } from '../lib/datasets';
import { DatasetInput } from '../types';

export default function NewDataset() {
  const navigate = useNavigate();

  async function handleSubmit(input: DatasetInput) {
    const dataset = await createDataset(input);
    navigate(`/datasets/${dataset.id}`);
  }

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Create</p>
          <h1>新增数据集</h1>
          <p>记录一个新的公开数据集、项目数据或待评估资源。</p>
        </div>
      </div>
      <div className="card">
        <DatasetForm submitLabel="创建数据集" onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
