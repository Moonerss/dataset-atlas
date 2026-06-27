import { useState } from 'react';
import { exportDatasets } from '../lib/datasets';

export default function ImportExport() {
  const [message, setMessage] = useState('');

  async function handleExportJson() {
    try {
      const datasets = await exportDatasets();
      const blob = new Blob([JSON.stringify(datasets, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dataset-atlas-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage(`已导出 ${datasets.length} 条数据集记录。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '导出失败');
    }
  }

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Portability</p>
          <h1>导入 / 导出</h1>
          <p>先支持 JSON 导出；CSV 导入将在字段映射确认后补齐。</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2>导出数据</h2>
          <p className="muted">导出当前未归档的数据集记录，用于备份、迁移或人工检查。</p>
          <button className="primary-button" type="button" onClick={handleExportJson}>导出 JSON</button>
          {message && <p className="inline-message">{message}</p>}
        </div>

        <div className="card">
          <h2>CSV 导入字段建议</h2>
          <p className="muted">建议 CSV 至少包含以下列。正式导入功能应先做字段映射和错误预览。</p>
          <code className="code-block">title,accession,source,source_url,organism,disease,tissue,omics_type,sample_count,download_status,lifecycle_status,priority,notes</code>
        </div>
      </div>
    </section>
  );
}
