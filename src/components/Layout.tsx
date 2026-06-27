import { NavLink, useLocation } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { to: '/', label: 'Dashboard', meta: 'Overview' },
  { to: '/datasets', label: 'Datasets', meta: 'Library' },
  { to: '/datasets/new', label: 'New Dataset', meta: 'Create' },
  { to: '/import-export', label: 'Import / Export', meta: 'Portability' },
];

function getPageTitle(pathname: string) {
  if (pathname === '/') return 'Mission Control';
  if (pathname === '/datasets') return 'Dataset Registry';
  if (pathname === '/datasets/new') return 'New Dataset Intake';
  if (pathname === '/import-export') return 'Data Portability';
  if (pathname.includes('/edit')) return 'Edit Dataset Record';
  if (pathname.startsWith('/datasets/')) return 'Dataset Signal Profile';
  return 'Dataset Atlas';
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">DA</span>
          <div>
            <strong>Dataset Atlas</strong>
            <small>Bioinformatics data console</small>
          </div>
        </div>
        <nav className="nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              <span>{item.label}</span>
              <small>{item.meta}</small>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-panel">
          <span className="panel-label">Workspace</span>
          <strong>Research Dataset DB</strong>
          <small>Netlify + Supabase prototype</small>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <span className="topbar-kicker">Current module</span>
            <strong>{getPageTitle(location.pathname)}</strong>
          </div>
          <div className={`connection-pill ${isSupabaseConfigured ? 'is-online' : 'is-warning'}`}>
            <span />
            {isSupabaseConfigured ? 'Supabase connected' : 'Supabase setup needed'}
          </div>
        </header>
        {!isSupabaseConfigured && (
          <div className="setup-banner">
            Supabase 尚未配置：复制 <code>.env.example</code> 为 <code>.env</code>，填写项目 URL 和 anon key 后重启开发服务器。
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
