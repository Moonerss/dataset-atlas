# Dataset Atlas

Dataset Atlas 是一个用于管理科研数据集信息的网页数据库原型，适合记录 GEO、SRA、ArrayExpress、TCGA、Zenodo 等来源的数据集。

## 技术栈

- React + Vite + TypeScript
- Supabase PostgreSQL
- Netlify 静态部署

## 本地运行

```bash
npm install
cp .env.example .env
npm run dev
```

在 `.env` 中填写：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 初始化 Supabase

1. 在 Supabase 创建新项目。
2. 打开 SQL Editor。
3. 粘贴并执行 `docs/database-prototype.sql`。
4. 在 Project Settings > API 中复制 Project URL 和 anon public key。
5. 将两个值填入 `.env`。

## Netlify 部署

推荐使用 Git 自动部署：

1. 将仓库推送到 GitHub。
2. Netlify 选择 Add new site > Import from Git。
3. 构建配置：
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 在 Netlify Site settings > Environment variables 中添加：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. 重新部署。

`netlify.toml` 已包含 SPA 路由重定向配置。

## 安全提醒

当前原型以个人使用为主。公网部署时，请在 Supabase 中启用 RLS 和 Auth，避免匿名用户修改数据。

## 主要页面

- `/`：数据集统计总览
- `/datasets`：搜索和筛选数据集
- `/datasets/new`：新增数据集
- `/datasets/:id`：数据集详情
- `/datasets/:id/edit`：编辑数据集
- `/import-export`：导出和导入说明
