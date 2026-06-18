import { useState, useMemo } from 'react';
import { Search, Flame, ArrowUpDown, HelpCircle, FolderOpen } from 'lucide-react';
import { HotspotItem, HeatLevel } from '../types';

interface HotspotsProps {
  hotspots: HotspotItem[] | null;
  onOpenRepoClick: () => void;
}

export default function Hotspots({ hotspots, onOpenRepoClick }: HotspotsProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'commits' | 'path'>('commits');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Toggle sort between commits and path
  const handleSort = (field: 'commits' | 'path') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Process sorting / filtering
  const processedHotspots = useMemo(() => {
    if (!hotspots) return [];

    let result = [...hotspots];

    // Filter by search text
    if (search.trim() !== '') {
      result = result.filter((item) =>
        item.file.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'commits') {
        return sortOrder === 'asc' ? a.commits - b.commits : b.commits - a.commits;
      } else {
        return sortOrder === 'asc'
          ? a.file.localeCompare(b.file)
          : b.file.localeCompare(a.file);
      }
    });

    return result;
  }, [hotspots, search, sortBy, sortOrder]);

  // Color mapped badges for the Heat indicator
  const renderHeatBadge = (heat: HeatLevel) => {
    switch (heat) {
      case 'very_high':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/40 text-red-400 border border-red-900/40 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Very High
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-950/40 text-orange-400 border border-orange-900/40 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/40 text-amber-450 border border-amber-900/40 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 text-zinc-405 border border-[#27272a] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-550" />
            Low
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 text-[#fafafa] font-sans p-8 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#09090b]">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#fafafa]">Hotspot Analysis</h2>
        <p className="text-xs text-[#a1a1aa] mt-1 font-sans">
          Locates files with high edit frequency. This highlights target areas of highest churn risk and technical debt.
        </p>
      </div>

      {/* Toolbar Options (Filters / Queries) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#09090b] border border-[#27272a] rounded-xl p-4 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#52525b]" />
          <input
            type="text"
            placeholder="Filter file registry by query word..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={!hotspots}
            className="w-full h-9 bg-[#18181b] border border-[#27272a] rounded-md px-3 py-1.5 pl-9 text-xs text-[#fafafa] focus:outline-hidden focus:border-zinc-700 placeholder-[#71717a] min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed font-sans"
          />
        </div>

        {/* Sort Controls (Button format for explicit selection) */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#52525b] uppercase tracking-wider font-sans mr-1">
            Sort Toggle:
          </span>
          <button
            type="button"
            onClick={() => handleSort('commits')}
            disabled={!hotspots}
            className={`h-9 px-3.5 rounded-md text-xs border transition-colors flex items-center gap-1.5 cursor-pointer ${
              sortBy === 'commits'
                ? 'bg-[#18181b] border-[#27272a] text-[#fafafa] font-semibold'
                : 'bg-[#09090b] border-[#27272a]/60 hover:bg-[#18181b] text-[#a1a1aa]'
            } disabled:opacity-50 disabled:cursor-not-allowed font-sans`}
          >
            Commits Churn
            <ArrowUpDown className="h-3 w-3 shrink-0 text-[#71717a]" />
          </button>
          <button
            type="button"
            onClick={() => handleSort('path')}
            disabled={!hotspots}
            className={`h-9 px-3.5 rounded-md text-xs border transition-colors flex items-center gap-1.5 cursor-pointer ${
              sortBy === 'path'
                ? 'bg-[#18181b] border-[#27272a] text-[#fafafa] font-semibold'
                : 'bg-[#09090b] border-[#27272a]/60 hover:bg-[#18181b] text-[#a1a1aa]'
            } disabled:opacity-50 disabled:cursor-not-allowed font-sans`}
          >
            File Path
            <ArrowUpDown className="h-3 w-3 shrink-0 text-[#71717a]" />
          </button>
        </div>
      </div>

      {/* Main Table Segment */}
      <div className="bg-[#09090b] border border-[#27272a] rounded-xl overflow-hidden shadow-xs">
        {hotspots ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#09090b] border-b border-[#27272a] text-[#a1a1aa] font-semibold">
                  <th className="p-3.5 pl-6 font-mono w-16">Rank</th>
                  <th 
                    className="p-3.5 cursor-pointer hover:text-[#fafafa] transition-colors font-sans"
                    onClick={() => handleSort('path')}
                  >
                    <div className="flex items-center gap-1.5">
                      File Path
                      <span className="text-[#52525b]">↕</span>
                    </div>
                  </th>
                  <th 
                    className="p-3.5 cursor-pointer hover:text-[#fafafa] transition-colors font-sans w-32"
                    onClick={() => handleSort('commits')}
                  >
                    <div className="flex items-center gap-1.5">
                      Commits Churn
                      <span className="text-[#52525b]">↕</span>
                    </div>
                  </th>
                  <th className="p-3.5 font-sans w-36">Heat Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]/40 font-sans">
                {processedHotspots.length > 0 ? (
                  processedHotspots.map((item) => (
                    <tr key={item.file} className="hover:bg-[#18181b]/30 text-zinc-300 transition-colors group">
                      <td className="p-3.5 pl-6 font-mono text-[#71717a] text-xs">
                        #{item.rank}
                      </td>
                      <td className="p-3.5 font-mono text-[#fafafa]/90 group-hover:text-[#fafafa] break-all select-all pr-4">
                        {item.file}
                      </td>
                      <td className="p-3.5 font-mono text-[#fafafa] font-bold pr-4">
                        {item.commits}
                      </td>
                      <td className="p-3.5 pr-6">
                        {renderHeatBadge(item.heat)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[#71717a] font-mono">
                      No matching files found for "{search}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State when no repository */
          <div className="p-16 flex flex-col items-center justify-center bg-[#09090b] text-center">
            <div className="p-4 rounded-full bg-[#18181b] border border-[#27272a] mb-4">
              <Flame className="h-8 w-8 text-[#52525b]" />
            </div>
            <h3 className="text-base font-medium text-[#fafafa] mb-1">
              No Repository Loaded
            </h3>
            <p className="text-xs text-[#71717a] mt-1.5 max-w-sm font-mono leading-relaxed">
             Connect to a local Git directory to start visualizing historical trends and hotspots.
            </p>
            <button
              type="button"
              onClick={onOpenRepoClick}
              className="mt-5 h-9 px-4 bg-[#fafafa] hover:bg-[#e4e4e7] text-[#09090b] font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Open Repository
            </button>
          </div>
        )}
      </div>

      {/* Extra Tip Panel */}
      {hotspots && (
        <div className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl flex gap-3 text-xs text-[#a1a1aa] font-sans shadow-xs">
          <HelpCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#fafafa]">SW Architect Insight:</span> Highly-frequently edited files (Hotspots) often become focal points for regression defects. Consider decoupling monolithic interfaces if modification counts continue to soar disproportionately compared to other modules.
          </div>
        </div>
      )}
    </div>
  );
}
