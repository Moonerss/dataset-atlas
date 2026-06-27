import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listDatasets } from '../lib/datasets';
import { Dataset, downloadStatusLabels } from '../types';

function countBy(items: Dataset[], key: keyof Dataset) {
  return items.reduce<Record<string, number>>((accumulator, item) => {
    const value = item[key];
    const label = value ? String(value) : '未指定';
    accumulator[label] = (accumulator[label] ?? 0) + 1;
    return accumulator;
  }, {});
}

function CountList({ title, counts }: { title: string; counts: Record<string, number> }) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCount = Math.max(...entries.map(([, count]) => count), 1);

  return (
    <div className="card metric-panel">
      <h2>{title}</h2>
      {entries.length === 0 ? (
        <p className="muted">暂无数据</p>
      ) : (
        <div className="count-list">
          {entries.map(([label, count]) => (
            <div key={label} className="count-row">
              <span>{downloadStatusLabels[label as keyof typeof downloadStatusLabels] ?? label}</span>
              <div className="count-meter" aria-hidden="true"><i style={{ width: `${Math.max((count / maxCount) * 100, 8)}%` }} /></div>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listDatasets()
      .then(setDatasets)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : '加载失败'));
  }, []);

  const stats = useMemo(() => {
    return {
      total: datasets.length,
      downloaded: datasets.filter((dataset) => dataset.download_status === 'downloaded').length,
      analyzing: datasets.filter((dataset) => dataset.lifecycle_status === 'analyzing').length,
      highPriority: datasets.filter((dataset) => dataset.priority === 'high').length,
      byOmics: countBy(datasets, 'omics_type'),
      bySource: countBy(datasets, 'source'),
      byDownload: countBy(datasets, 'download_status'),
    };
  }, [datasets]);

  if (error) return <div className="empty-state">{error}</div>;

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>数据集总览</h1>
          <p>集中管理公开数据集的发现、评估、下载和分析状态。</p>
        </div>
        <Link className="primary-button" to="/datasets/new">新增数据集</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-total"><span>总数据集</span><strong>{stats.total}</strong><small>Total records</small></div>
        <div className="stat-card stat-download"><span>已下载</span><strong>{stats.downloaded}</strong><small>Downloaded</small></div>
        <div className="stat-card stat-analyzing"><span>分析中</span><strong>{stats.analyzing}</strong><small>In analysis</small></div>
        <div className="stat-card stat-priority"><span>高优先级</span><strong>{stats.highPriority}</strong><small>High priority</small></div>
      </div>

      <div className="dashboard-grid">
        <CountList title="按组学类型" counts={stats.byOmics} />
        <CountList title="按来源平台" counts={stats.bySource} />
        <CountList title="按下载状态" counts={stats.byDownload} />
      </div>
    </section>
  );
}
