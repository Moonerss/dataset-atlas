# Dataset Atlas Frontend Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable React + Vite + Supabase frontend prototype for managing Dataset Atlas records.

**Architecture:** The app is a Netlify-hosted single-page React application. Supabase JavaScript client handles direct CRUD calls to the PostgreSQL tables defined in `docs/database-prototype.sql`. UI state stays local to React components; no global state library is needed for the MVP.

**Tech Stack:** React 18, Vite, TypeScript, React Router, Supabase JS, plain CSS, Netlify static deployment.

---

## File Structure

- Create: `package.json` — npm scripts and dependencies.
- Create: `index.html` — Vite HTML entry.
- Create: `vite.config.ts` — Vite React config.
- Create: `tsconfig.json` — TypeScript config.
- Create: `netlify.toml` — Netlify build command, publish directory, SPA redirect.
- Create: `.env.example` — required Supabase environment variables.
- Create: `src/main.tsx` — React bootstrap.
- Create: `src/App.tsx` — app shell and routes.
- Create: `src/styles.css` — application styles.
- Create: `src/lib/supabase.ts` — Supabase client.
- Create: `src/lib/datasets.ts` — dataset CRUD API.
- Create: `src/types.ts` — shared TypeScript types and form constants.
- Create: `src/components/Layout.tsx` — navigation and shell layout.
- Create: `src/components/DatasetForm.tsx` — reusable create/edit form.
- Create: `src/pages/Dashboard.tsx` — summary statistics.
- Create: `src/pages/DatasetList.tsx` — searchable/filterable dataset table.
- Create: `src/pages/DatasetDetail.tsx` — dataset detail page.
- Create: `src/pages/NewDataset.tsx` — create page.
- Create: `src/pages/EditDataset.tsx` — edit page.
- Create: `src/pages/ImportExport.tsx` — simple CSV/JSON export helper and import placeholder guidance.
- Create: `README.md` — setup, Supabase, Netlify deployment instructions.

## Task 1: Scaffold Vite React App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `netlify.toml`
- Create: `.env.example`

- [ ] **Step 1: Create package metadata**

Create `package.json` with:

```json
{
  "name": "dataset-atlas",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.4",
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.8",
    "typescript": "^5.6.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {}
}
```

- [ ] **Step 2: Create Vite HTML entry**

Create `index.html` with:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dataset Atlas</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Create Vite and TypeScript configs**

Create `vite.config.ts` with:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

Create `tsconfig.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": []
}
```

- [ ] **Step 4: Add Netlify config and environment example**

Create `netlify.toml` with:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Create `.env.example` with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Task 2: Define Types and Supabase Data Layer

**Files:**
- Create: `src/types.ts`
- Create: `src/lib/supabase.ts`
- Create: `src/lib/datasets.ts`

- [ ] **Step 1: Define shared types and constants**

Create `src/types.ts` with dataset interfaces, enum options, labels, and initial form values matching `docs/database-prototype.sql`.

- [ ] **Step 2: Create Supabase client**

Create `src/lib/supabase.ts` that reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. If either is missing, export `isSupabaseConfigured = false` and allow the UI to show setup guidance instead of crashing.

- [ ] **Step 3: Create CRUD functions**

Create `src/lib/datasets.ts` with these functions:

```ts
listDatasets(filters)
getDataset(id)
createDataset(input)
updateDataset(id, input)
archiveDataset(id)
exportDatasets()
```

Each function should query only records where `archived_at` is null unless fetching a specific archived record is explicitly required.

## Task 3: Build App Shell and Navigation

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/components/Layout.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Bootstrap React app**

Create `src/main.tsx` with React StrictMode and import `src/styles.css`.

- [ ] **Step 2: Define routes**

Create `src/App.tsx` with routes:

```text
/ -> Dashboard
/datasets -> DatasetList
/datasets/new -> NewDataset
/datasets/:id -> DatasetDetail
/datasets/:id/edit -> EditDataset
/import-export -> ImportExport
```

- [ ] **Step 3: Create layout**

Create `src/components/Layout.tsx` with header, left navigation, and content area.

- [ ] **Step 4: Add production-ready prototype CSS**

Create `src/styles.css` with responsive layout, cards, tables, forms, badges, and status colors.

## Task 4: Build Dataset Form and CRUD Pages

**Files:**
- Create: `src/components/DatasetForm.tsx`
- Create: `src/pages/NewDataset.tsx`
- Create: `src/pages/EditDataset.tsx`
- Create: `src/pages/DatasetDetail.tsx`

- [ ] **Step 1: Create reusable form**

Create `DatasetForm` with fields for title, accession, source, URL, description, publication fields, organism, disease, tissue, cell type, omics type, sample count, condition groups, format, data size, license, statuses, local path, priority, and notes.

- [ ] **Step 2: Add validation**

Validation rules:

```text
title is required
source is required
accession or source_url is required
sample_count must be empty or >= 0
```

- [ ] **Step 3: Create new dataset page**

Create `NewDataset.tsx` that calls `createDataset`, shows errors, and navigates to `/datasets/:id` after success.

- [ ] **Step 4: Create edit dataset page**

Create `EditDataset.tsx` that loads an existing record, passes it into `DatasetForm`, calls `updateDataset`, and navigates back to detail.

- [ ] **Step 5: Create detail page**

Create `DatasetDetail.tsx` with grouped metadata sections, external link buttons, edit button, and archive button.

## Task 5: Build Dashboard, List, and Import/Export Pages

**Files:**
- Create: `src/pages/Dashboard.tsx`
- Create: `src/pages/DatasetList.tsx`
- Create: `src/pages/ImportExport.tsx`
- Modify: `README.md`

- [ ] **Step 1: Build dashboard**

Create cards showing total datasets, downloaded datasets, analyzing datasets, and high-priority datasets. Add simple grouped counts by `omics_type`, `source`, and `download_status`.

- [ ] **Step 2: Build dataset list**

Create filter controls for keyword, source, organism, omics type, lifecycle status, download status, and priority. Show a responsive table with title, accession, source, omics type, disease, sample count, status, priority, and updated date.

- [ ] **Step 3: Build import/export page**

Create JSON export download using current Supabase records. Add a CSV import guidance panel that explains expected columns and states that full CSV import will be implemented after field mapping is finalized.

- [ ] **Step 4: Write README**

Create setup instructions for installing dependencies, creating Supabase tables from `docs/database-prototype.sql`, configuring `.env`, running locally, and deploying to Netlify.

## Task 6: Verify Prototype

**Files:**
- No file changes expected unless validation catches errors.

- [ ] **Step 1: Install dependencies**

Run: `npm install`
Expected: dependencies install successfully and `package-lock.json` is created.

- [ ] **Step 2: Typecheck and build**

Run: `npm run build`
Expected: TypeScript compiles and Vite writes `dist`.

- [ ] **Step 3: Fix build issues**

If build fails, fix the exact TypeScript or bundling errors without changing product scope.

- [ ] **Step 4: Final review**

Confirm these files exist and are coherent:

```text
README.md
netlify.toml
.env.example
src/App.tsx
src/lib/supabase.ts
src/lib/datasets.ts
src/pages/DatasetList.tsx
src/pages/NewDataset.tsx
src/pages/EditDataset.tsx
src/pages/DatasetDetail.tsx
```
