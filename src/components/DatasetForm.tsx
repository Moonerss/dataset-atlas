import { FormEvent, useMemo, useState } from 'react';
import {
  DatasetInput,
  downloadStatusLabels,
  emptyDatasetInput,
  lifecycleStatusLabels,
  omicsOptions,
  organismOptions,
  priorityLabels,
  sourceOptions,
} from '../types';

interface DatasetFormProps {
  initialValue?: DatasetInput;
  submitLabel: string;
  onSubmit: (value: DatasetInput) => Promise<void>;
}

const downloadStatusOptions = Object.entries(downloadStatusLabels);
const lifecycleStatusOptions = Object.entries(lifecycleStatusLabels);
const priorityOptions = Object.entries(priorityLabels);

function inputValue(value: string | number | null) {
  return value ?? '';
}

export default function DatasetForm({ initialValue = emptyDatasetInput, submitLabel, onSubmit }: DatasetFormProps) {
  const [form, setForm] = useState<DatasetInput>(initialValue);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(form.title.trim() && form.source.trim() && (form.accession?.trim() || form.source_url?.trim()));
  }, [form.accession, form.source, form.source_url, form.title]);

  function updateField<K extends keyof DatasetInput>(key: K, value: DatasetInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('请填写数据集标题。');
      return;
    }

    if (!form.source.trim()) {
      setError('请填写来源平台。');
      return;
    }

    if (!form.accession?.trim() && !form.source_url?.trim()) {
      setError('登录号或原始链接至少填写一个。');
      return;
    }

    if (form.sample_count !== null && form.sample_count < 0) {
      setError('样本数不能为负数。');
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(form);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '保存失败，请稍后重试。');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <label className="field field-wide">
        <span>标题 *</span>
        <input value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="如 GSE12345 liver cancer RNA-seq" />
      </label>

      <label className="field">
        <span>登录号</span>
        <input value={inputValue(form.accession)} onChange={(event) => updateField('accession', event.target.value)} placeholder="GSE / SRP / PRJNA" />
      </label>

      <label className="field">
        <span>来源平台 *</span>
        <select value={form.source} onChange={(event) => updateField('source', event.target.value)}>
          {sourceOptions.map((source) => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
      </label>

      <label className="field field-wide">
        <span>原始链接</span>
        <input value={inputValue(form.source_url)} onChange={(event) => updateField('source_url', event.target.value)} placeholder="https://..." />
      </label>

      <label className="field field-wide">
        <span>描述</span>
        <textarea value={inputValue(form.description)} onChange={(event) => updateField('description', event.target.value)} rows={3} />
      </label>

      <label className="field">
        <span>物种</span>
        <select value={inputValue(form.organism)} onChange={(event) => updateField('organism', event.target.value)}>
          <option value="">未指定</option>
          {organismOptions.map((organism) => (
            <option key={organism} value={organism}>{organism}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>组学类型</span>
        <select value={inputValue(form.omics_type)} onChange={(event) => updateField('omics_type', event.target.value)}>
          <option value="">未指定</option>
          {omicsOptions.map((omics) => (
            <option key={omics} value={omics}>{omics}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>疾病 / 表型</span>
        <input value={inputValue(form.disease)} onChange={(event) => updateField('disease', event.target.value)} />
      </label>

      <label className="field">
        <span>组织</span>
        <input value={inputValue(form.tissue)} onChange={(event) => updateField('tissue', event.target.value)} />
      </label>

      <label className="field">
        <span>细胞类型</span>
        <input value={inputValue(form.cell_type)} onChange={(event) => updateField('cell_type', event.target.value)} />
      </label>

      <label className="field">
        <span>样本数</span>
        <input
          type="number"
          min="0"
          value={inputValue(form.sample_count)}
          onChange={(event) => updateField('sample_count', event.target.value === '' ? null : Number(event.target.value))}
        />
      </label>

      <label className="field field-wide">
        <span>分组信息</span>
        <input value={inputValue(form.condition_groups)} onChange={(event) => updateField('condition_groups', event.target.value)} placeholder="tumor/control, treatment/control" />
      </label>

      <label className="field">
        <span>数据格式</span>
        <input value={inputValue(form.data_format)} onChange={(event) => updateField('data_format', event.target.value)} placeholder="FASTQ, BAM, h5ad" />
      </label>

      <label className="field">
        <span>数据大小</span>
        <input value={inputValue(form.data_size)} onChange={(event) => updateField('data_size', event.target.value)} placeholder="120 GB" />
      </label>

      <label className="field">
        <span>下载状态</span>
        <select value={form.download_status} onChange={(event) => updateField('download_status', event.target.value as DatasetInput['download_status'])}>
          {downloadStatusOptions.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>生命周期状态</span>
        <select value={form.lifecycle_status} onChange={(event) => updateField('lifecycle_status', event.target.value as DatasetInput['lifecycle_status'])}>
          {lifecycleStatusOptions.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>优先级</span>
        <select value={form.priority} onChange={(event) => updateField('priority', event.target.value as DatasetInput['priority'])}>
          {priorityOptions.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>许可证</span>
        <input value={inputValue(form.license)} onChange={(event) => updateField('license', event.target.value)} />
      </label>

      <label className="field field-wide">
        <span>本地路径</span>
        <input value={inputValue(form.local_path)} onChange={(event) => updateField('local_path', event.target.value)} placeholder="D:/Bioinfo/project/data/..." />
      </label>

      <label className="field">
        <span>PMID</span>
        <input value={inputValue(form.pmid)} onChange={(event) => updateField('pmid', event.target.value)} />
      </label>

      <label className="field">
        <span>DOI</span>
        <input value={inputValue(form.doi)} onChange={(event) => updateField('doi', event.target.value)} />
      </label>

      <label className="field field-wide">
        <span>论文标题</span>
        <input value={inputValue(form.publication_title)} onChange={(event) => updateField('publication_title', event.target.value)} />
      </label>

      <label className="field field-wide">
        <span>论文链接</span>
        <input value={inputValue(form.publication_url)} onChange={(event) => updateField('publication_url', event.target.value)} />
      </label>

      <label className="field field-wide">
        <span>备注</span>
        <textarea value={inputValue(form.notes)} onChange={(event) => updateField('notes', event.target.value)} rows={4} />
      </label>

      <div className="form-actions field-wide">
        <button className="primary-button" type="submit" disabled={!canSubmit || isSaving}>
          {isSaving ? '保存中...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
