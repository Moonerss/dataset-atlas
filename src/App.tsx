import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DatasetDetail from './pages/DatasetDetail';
import DatasetList from './pages/DatasetList';
import EditDataset from './pages/EditDataset';
import ImportExport from './pages/ImportExport';
import NewDataset from './pages/NewDataset';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/datasets" element={<DatasetList />} />
        <Route path="/datasets/new" element={<NewDataset />} />
        <Route path="/datasets/:id" element={<DatasetDetail />} />
        <Route path="/datasets/:id/edit" element={<EditDataset />} />
        <Route path="/import-export" element={<ImportExport />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
