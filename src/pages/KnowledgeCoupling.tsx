import { useEffect, useState } from 'react';
import { Cpu, Users, Layers, AlertTriangle, FileCode, ArrowRight, HelpCircle, FolderOpen, Loader2 } from 'lucide-react';
import { ContributorOwnership, ChangeCouplingItem } from '../types';

interface KnowledgeCouplingProps {
  eligibleFiles: string[] | null;
  ownershipMap: Record<string, ContributorOwnership[]>;
  ownershipLoadingFile: string | null;
  onSelectFile: (file: string) => void;
  couplingData: ChangeCouplingItem[] | null;
  onOpenRepoClick: () => void;
}

export default function KnowledgeCoupling({
  eligibleFiles,
  ownershipMap,
  ownershipLoadingFile,
  onSelectFile,
  couplingData,
  onOpenRepoClick,
}: KnowledgeCouplingProps) {
  const [activeTab, setActiveTab] = useState<'ownership' | 'coupling'>('ownership');

  const fileList = eligibleFiles ?? [];
  const [selectedFile, setSelectedFile] = useState<string>('');

  // Auto-select the first file once a repository's eligible file list loads
  useEffect(() => {
    if (fileList.length > 0 && !fileList.includes(selectedFile)) {
      setSelectedFile(fileList[0]);
    }
  }, [fileList, selectedFile]);

  // Fetch blame data on demand whenever the selected file changes
  useEffect(() => {
    if (selectedFile) onSelectFile(selectedFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  // Get current selected file statistics
  const currentFileOwnership = selectedFile ? ownershipMap[selectedFile] ?? null : null;
  const isLoadingSelected = ownershipLoadingFile === selectedFile;

  // Check if there is any contributor with ownership > 80% (Knowledge Silo)
  const isKnowledgeSilo = currentFileOwnership 
    ? currentFileOwnership.some(item => item.name !== 'Others' && item.percentage > 80)
    : false;

  return (
    <div className="space-y-6 text-[#fafafa] font-sans p-8 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#09090b]">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#fafafa]">Knowledge & Coupling</h2>
        <p className="text-xs text-[#a1a1aa] mt-1 font-sans">
          Analyze codebase architecture vulnerability by mapping author ownership silos and high-frequency co-changing module couplings.
        </p>
      </div>

      {/* Tab Switcher - Sleek Modern Tab Panel */}
      <div className="flex border-b border-[#27272a] h-11 items-center">
        <button
          type="button"
          onClick={() => setActiveTab('ownership')}
          className={`h-full px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ownership'
              ? 'border-blue-500 text-[#fafafa] bg-[#18181b]/50'
              : 'border-transparent text-[#71717a] hover:text-[#fafafa]'
          }`}
          id="tab-ownership"
        >
          <Users className="h-4 w-4" />
          Code Ownership Map
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('coupling')}
          className={`h-full px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'coupling'
              ? 'border-blue-500 text-[#fafafa] bg-[#18181b]/50'
              : 'border-transparent text-[#71717a] hover:text-[#fafafa]'
          }`}
          id="tab-coupling"
        >
          <Layers className="h-4 w-4" />
          Temporal Change Coupling
        </button>
      </div>

      {/* tab content panels */}
      <div>
        {activeTab === 'ownership' ? (
          /* SECTION A: OWNERSHIP */
          <div className="space-y-6">
            {!eligibleFiles ? (
              /* Ownership empty state */
              <div className="bg-[#09090b] border border-dashed border-[#27272a] rounded-xl p-16 text-center shadow-xs">
                <div className="p-4 rounded-full bg-[#18181b] border border-[#27272a] mb-4 inline-block">
                  <Users className="h-8 w-8 text-[#52525b]" />
                </div>
                <h3 className="text-base font-medium text-[#fafafa] mb-1">
                  No Ownership Footprints Registered
                </h3>
                <p className="text-xs text-[#71717a] mt-1.5 max-w-sm mx-auto font-mono leading-relaxed">
                  Blame analytics and developer distribution metadata require a connected repository session.
                </p>
                <button
                  type="button"
                  onClick={onOpenRepoClick}
                  className="mt-5 h-9 px-4 bg-[#fafafa] hover:bg-[#e4e4e7] text-[#09090b] font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  Open Repository
                </button>
              </div>
            ) : (
              /* Ownership Dashboard layout */
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                
                {/* File Selector Sidebar List */}
                <div className="md:col-span-2 bg-[#09090b] rounded-xl border border-[#27272a] p-4 space-y-3">
                  <div className="text-[10px] font-bold text-[#52525b] uppercase tracking-widest px-1 font-sans">
                    Tracked Index Files
                  </div>
                  <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1">
                    {fileList.map((file) => {
                      const isSelected = selectedFile === file;
                      return (
                        <button
                          key={file}
                          type="button"
                          onClick={() => setSelectedFile(file)}
                          className={`w-full text-left p-2.5 rounded-md text-xs truncate transition-all border font-mono cursor-pointer ${
                            isSelected
                              ? 'bg-[#18181b] border-[#27272a] text-[#fafafa] font-semibold shadow-xs'
                              : 'bg-transparent border-transparent text-[#a1a1aa] hover:bg-[#18181b]/65 hover:text-[#fafafa]'
                          }`}
                        >
                          <span className="text-[#52525b] mr-1">▫/</span>{file.split('/').pop()}
                          <div className="text-[8px] text-[#71717a] mt-0.5 truncate">{file}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ownership Visualization Screen */}
                <div className="md:col-span-3 bg-[#09090b] rounded-xl border border-[#27272a] p-5 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#27272a]/40 pb-4">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-[#fafafa] font-mono break-all">{selectedFile.split('/').pop()}</div>
                          <div className="text-[10px] text-[#71717a] font-mono break-all mt-0.5">{selectedFile}</div>
                        </div>
                      </div>
                      
                      {/* Warning Badge: Conditional UI Logic as required */}
                      {isKnowledgeSilo && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-950/40 text-amber-400 border border-amber-900/40 font-mono self-start sm:self-center shrink-0">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          Knowledge Silo
                        </span>
                      )}
                    </div>

                    {/* Contributor bars */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-[10px] font-bold text-[#52525b] uppercase tracking-widest font-sans">
                        Author Contribution Breakdown
                      </h4>
                      {isLoadingSelected ? (
                        <div className="flex items-center gap-2 text-xs text-[#a1a1aa] font-mono py-4">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                          Running blame analysis...
                        </div>
                      ) : currentFileOwnership ? (
                        <div className="space-y-3.5">
                          {currentFileOwnership.map((item) => (
                            <div key={item.name} className="space-y-1">
                              <div className="flex justify-between text-xs font-mono">
                                <span className="font-semibold text-zinc-300">{item.name}</span>
                                <span className="text-zinc-450 font-bold">{item.percentage}%</span>
                              </div>
                              <div className="h-2 w-full bg-[#18181b] rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    item.name === 'Others'
                                      ? 'bg-zinc-600'
                                      : item.percentage > 80
                                      ? 'bg-amber-500 shadow-sm'
                                      : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#71717a] font-mono">No ownership details computed.</p>
                      )}
                    </div>
                  </div>

                  {isKnowledgeSilo && (
                    <div className="p-3 bg-amber-950/15 border border-amber-900/30 rounded-lg text-xs text-amber-400/95 font-sans leading-relaxed">
                      <span className="font-semibold text-amber-300 block mb-0.5">Silo Warning Threshold Triggered:</span> This file has over 80% ownership concentrated in a single writer. If this contributor leaves or switches teams, maintainability score could degrade due to low project knowledge redundancy.
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        ) : (
          /* SECTION B: CHANGE COUPLING */
          <div className="space-y-6">
            {!couplingData ? (
              /* Coupling empty state: "No coupling data available" as requested */
              <div className="bg-[#09090b] border border-dashed border-[#27272a] rounded-xl p-16 text-center shadow-xs">
                <div className="p-4 rounded-full bg-[#18181b] border border-[#27272a] mb-4 inline-block">
                  <Layers className="h-8 w-8 text-[#52525b]" />
                </div>
                <h3 className="text-base font-medium text-[#fafafa] mb-1">
                  No Coupling Data Available
                </h3>
                <p className="text-xs text-[#71717a] mt-1.5 max-w-sm mx-auto font-mono leading-relaxed">
                  Co-change metrics and dynamic coupling calculations requires sync history processing.
                </p>
                <button
                  type="button"
                  onClick={onOpenRepoClick}
                  className="mt-5 h-9 px-4 bg-[#fafafa] hover:bg-[#e4e4e7] text-[#09090b] font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  Open Repository
                </button>
              </div>
            ) : (
              /* Coupling Data Table */
              <div className="bg-[#09090b] border border-[#27272a] rounded-xl overflow-hidden shadow-xs">
                <div className="p-4 bg-[#09090b]/40 border-b border-[#27272a] px-6 py-4">
                  <h3 className="text-xs font-semibold text-[#fafafa] uppercase tracking-wider">
                    High Co-Change Component Partnerships
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#09090b] border-b border-[#27272a] text-[#a1a1aa] font-semibold">
                        <th className="p-3.5 pl-6 font-sans">File Partner A</th>
                        <th className="p-3.5 text-center w-12 font-sans">Relationship</th>
                        <th className="p-3.5 font-sans">File Partner B</th>
                        <th className="p-3.5 text-right pr-6 w-44 font-sans">Co-Changes count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a]/40 font-sans">
                      {couplingData.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#18181b]/30 text-zinc-300 transition-colors">
                          <td className="p-3.5 pl-6 font-mono font-medium text-zinc-200">
                            {item.fileA}
                          </td>
                          <td className="p-3.5 text-center text-zinc-550">
                            <ArrowRight className="h-3.5 w-3.5 inline text-blue-500" />
                          </td>
                          <td className="p-3.5 font-mono font-medium text-zinc-200">
                            {item.fileB}
                          </td>
                          <td className="p-3.5 pr-6 font-mono font-bold text-right text-blue-400 text-xs">
                            {item.coChanges} co-changes
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {couplingData && (
        <div className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl flex gap-3 text-xs text-[#a1a1aa] font-sans shadow-xs">
          <HelpCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#fafafa]">How Coupling works:</span> Change Coupling measures files that are consistently committed together in the same changeset. Extremely high coupling values between separated modules indicates logical leakage or missing architectural encapsulation.
          </div>
        </div>
      )}
    </div>
  );
}
