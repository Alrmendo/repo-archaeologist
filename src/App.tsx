import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import OpenRepoDialog from './components/OpenRepoDialog';
import Overview from './pages/Overview';
import Hotspots from './pages/Hotspots';
import KnowledgeCoupling from './pages/KnowledgeCoupling';
import { MOCK_REPOS } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentRepoKey, setCurrentRepoKey] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Retrieve current repo datasets if a repo is simulation-loaded
  const currentRepoData = currentRepoKey ? MOCK_REPOS[currentRepoKey] : null;

  const handleSelectRepo = (repoKey: string | null) => {
    setCurrentRepoKey(repoKey);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Overview
            stats={currentRepoData?.stats ?? null}
            activity={currentRepoData?.commitActivity ?? null}
            onOpenRepoClick={() => setIsDialogOpen(true)}
          />
        );
      case 'hotspots':
        return (
          <Hotspots
            hotspots={currentRepoData?.hotspots ?? null}
            onOpenRepoClick={() => setIsDialogOpen(true)}
          />
        );
      case 'knowledge':
        return (
          <KnowledgeCoupling
            ownershipData={currentRepoData?.fileOwnership ?? null}
            couplingData={currentRepoData?.coupling ?? null}
            onOpenRepoClick={() => setIsDialogOpen(true)}
          />
        );
      default:
        return (
          <Overview
            stats={null}
            activity={null}
            onOpenRepoClick={() => setIsDialogOpen(true)}
          />
        );
    }
  };

  return (
    <div className="dark bg-[#09090b] min-h-screen text-[#fafafa] flex flex-col md:flex-row antialiased select-none font-sans">
      {/* Simulation sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={currentRepoData?.stats ?? null}
      />

      {/* Main page stage */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        <TopBar
          stats={currentRepoData?.stats ?? null}
          onOpenRepoClick={() => setIsDialogOpen(true)}
        />
        
        <main className="flex-1 overflow-hidden">
          {renderActivePage()}
        </main>
      </div>

      {/* Open Repo Simulation Selector */}
      <OpenRepoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSelectRepo={handleSelectRepo}
        currentRepoKey={currentRepoKey}
      />
    </div>
  );
}

