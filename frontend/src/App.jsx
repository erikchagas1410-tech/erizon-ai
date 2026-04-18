import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewCampaign from './pages/NewCampaign.jsx';
import CampaignList from './pages/CampaignList.jsx';
import CopyGen from './pages/CopyGen.jsx';
import CreativeGen from './pages/CreativeGen.jsx';
import Competitor from './pages/Competitor.jsx';
import Analyze from './pages/Analyze.jsx';

const PAGES = {
  dashboard: Dashboard,
  'nova-campanha': NewCampaign,
  campanhas: CampaignList,
  copies: CopyGen,
  criativos: CreativeGen,
  concorrentes: Competitor,
  analisar: Analyze,
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const Page = PAGES[page] || Dashboard;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Scanline overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)'
      }} />
      <Sidebar current={page} onNavigate={setPage} />
      <main style={{ flex: 1, overflow: 'auto', padding: '32px', maxWidth: '100%' }}>
        <Page onNavigate={setPage} />
      </main>
    </div>
  );
}
