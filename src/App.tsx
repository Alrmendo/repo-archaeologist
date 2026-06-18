import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import OpenRepoDialog from './components/OpenRepoDialog';
import Overview from './pages/Overview';
import Hotspots from './pages/Hotspots';
import KnowledgeCoupling from './pages/KnowledgeCoupling';
import { AnalysisResult, ContributorOwnership, ExportReport, OwnershipReportEntry } from './types';

// Computing blame for every tracked file at export time would reintroduce the
// performance problem the on-demand ownership UI was built to avoid, so the
// export only covers the most relevant files: the top hotspots.
const EXPORT_OWNERSHIP_HOTSPOT_LIMIT = 20;

function cleanIpcErrorMessage(error: unknown, fallback: string): string {
  const raw = error instanceof Error ? error.message : fallback;
  const match = raw.match(/Error invoking remote method '[^']*':\s*(?:Error:\s*)?(.*)/s);
  return match ? match[1].trim() : raw;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [ownershipMap, setOwnershipMap] = useState<Record<string, ContributorOwnership[]>>({});
  const [ownershipLoadingFile, setOwnershipLoadingFile] = useState<string | null>(null);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleOpenRepo = async (repoPath: string) => {
    setAnalysisError(null);
    setIsAnalyzing(true);
    try {
      const result = await window.electronAPI.analyzeRepository(repoPath);
      setAnalysis(result);
      setOwnershipMap({});
      setIsDialogOpen(false);
    } catch (error) {
      setAnalysisError(cleanIpcErrorMessage(error, 'Failed to analyze repository.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePathInputClick = async () => {
    if (isAnalyzing) return;
    const picked = await window.electronAPI.openDirectoryDialog();
    if (picked) handleOpenRepo(picked);
  };

  const handleSelectFile = async (filePath: string) => {
    if (!analysis || ownershipMap[filePath] || ownershipLoadingFile === filePath) return;
    setOwnershipLoadingFile(filePath);
    try {
      const ownership = await window.electronAPI.getFileOwnership(analysis.stats.path, filePath);
      setOwnershipMap((prev) => ({ ...prev, [filePath]: ownership }));
    } finally {
      setOwnershipLoadingFile(null);
    }
  };

  const handleExport = async () => {
    if (!analysis) return;
    setIsExporting(true);
    try {
      const targetFiles = analysis.hotspots.slice(0, EXPORT_OWNERSHIP_HOTSPOT_LIMIT).map((h) => h.file);
      const ownershipEntries: OwnershipReportEntry[] = await Promise.all(
        targetFiles.map(async (file) => {
          const contributors =
            ownershipMap[file] ?? (await window.electronAPI.getFileOwnership(analysis.stats.path, file));
          return {
            file,
            contributors,
            knowledgeSilo: contributors.some((c) => c.name !== 'Others' && c.percentage > 80),
          };
        }),
      );

      setOwnershipMap((prev) => {
        const next = { ...prev };
        for (const entry of ownershipEntries) next[entry.file] = entry.contributors;
        return next;
      });

      const report: ExportReport = {
        repository: {
          name: analysis.stats.name,
          totalCommits: analysis.stats.totalCommits,
          totalContributors: analysis.stats.totalContributors,
          filesTracked: analysis.stats.filesTracked,
          firstCommitDate: analysis.stats.firstCommitDate,
          latestCommitDate: analysis.stats.latestCommitDate,
        },
        hotspots: analysis.hotspots,
        ownership: ownershipEntries,
        coupling: analysis.coupling,
      };

      const defaultFileName = `${analysis.stats.name.replace(/[\\/]/g, '-')}-report.json`;
      const result = await window.electronAPI.exportReport(defaultFileName, report);
      if (!result.canceled) {
        setToast({ type: 'success', message: `Report saved to ${result.filePath}` });
      }
    } catch (error) {
      setToast({ type: 'error', message: cleanIpcErrorMessage(error, 'Failed to export report.') });
    } finally {
      setIsExporting(false);
    }
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Overview
            stats={analysis?.stats ?? null}
            activity={analysis?.commitActivity ?? null}
            onOpenRepoClick={() => setIsDialogOpen(true)}
          />
        );
      case 'hotspots':
        return (
          <Hotspots
            hotspots={analysis?.hotspots ?? null}
            onOpenRepoClick={() => setIsDialogOpen(true)}
          />
        );
      case 'knowledge':
        return (
          <KnowledgeCoupling
            eligibleFiles={analysis?.ownershipEligibleFiles ?? null}
            ownershipMap={ownershipMap}
            ownershipLoadingFile={ownershipLoadingFile}
            onSelectFile={handleSelectFile}
            couplingData={analysis?.coupling ?? null}
            onOpenRepoClick={() => setIsDialogOpen(true)}
          />
        );
      default:
        return (
          <Overview
            stats={analysis?.stats ?? null}
            activity={analysis?.commitActivity ?? null}
            onOpenRepoClick={() => setIsDialogOpen(true)}
          />
        );
    }
  };

  return (
    <div className="dark bg-[#09090b] min-h-screen text-[#fafafa] flex flex-col md:flex-row antialiased select-none font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={analysis?.stats ?? null}
      />

      {/* Main page stage */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative">
        <TopBar
          stats={analysis?.stats ?? null}
          onOpenRepoClick={() => setIsDialogOpen(true)}
          onExportClick={handleExport}
          isExporting={isExporting}
          onPathInputClick={handlePathInputClick}
        />

        <main className="flex-1 overflow-hidden relative">
          {renderActivePage()}

          {isAnalyzing && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#09090b]/90 backdrop-blur-xs">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-3" />
              <p className="text-sm text-[#fafafa] font-sans">Analyzing repository...</p>
              <p className="text-xs text-[#71717a] mt-1 font-sans">Scanning history, hotspots, and coupling data</p>
            </div>
          )}
        </main>
      </div>

      <OpenRepoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onOpenRepo={handleOpenRepo}
        isAnalyzing={isAnalyzing}
        error={analysisError}
      />

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 max-w-sm px-4 py-3 rounded-lg border shadow-xl text-xs font-sans flex items-start gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-900 text-emerald-300'
              : 'bg-red-950/90 border-red-900 text-red-300'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          )}
          <span className="break-all">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
