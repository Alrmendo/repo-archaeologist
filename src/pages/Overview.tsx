import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, GitCommit, Users, FileText, Database, GitBranch, FolderOpen } from 'lucide-react';
import { RepoStats, CommitActivityPoint } from '../types';

interface OverviewProps {
  stats: RepoStats | null;
  activity: CommitActivityPoint[] | null;
  onOpenRepoClick: () => void;
}

export default function Overview({ stats, activity, onOpenRepoClick }: OverviewProps) {
  // Format stats, default to placeholder dashes if empty as requested
  const displayStats = [
    {
      title: 'Repository Name',
      value: stats?.name ?? '—',
      icon: Database,
      desc: stats ? 'Connected local repo' : 'Waiting for connection',
    },
    {
      title: 'Total Commits',
      value: stats?.totalCommits !== undefined ? stats.totalCommits.toLocaleString() : '—',
      icon: GitCommit,
      desc: stats ? 'Total project history commits' : 'No history fetched',
    },
    {
      title: 'Total Contributors',
      value: stats?.totalContributors !== undefined ? stats.totalContributors.toLocaleString() : '—',
      icon: Users,
      desc: stats ? 'With authorship footprints' : 'No authorship footprints',
    },
    {
      title: 'Files Tracked',
      value: stats?.filesTracked !== undefined ? stats.filesTracked.toLocaleString() : '—',
      icon: FileText,
      desc: stats ? 'Files in head directory' : 'Files in indexed tree',
    },
    {
      title: 'First Commit Date',
      value: stats?.firstCommitDate ?? '—',
      icon: Calendar,
      desc: stats ? 'Earliest registered index' : 'Chronology start timestamp',
    },
    {
      title: 'Latest Commit Date',
      value: stats?.latestCommitDate ?? '—',
      icon: GitBranch,
      desc: stats ? 'Most recent commit' : 'Chronology end timestamp',
    },
  ];

  return (
    <div className="space-y-6 text-[#fafafa] font-sans p-8 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#09090b]">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#fafafa]">Repository Overview</h2>
        <p className="text-xs text-[#a1a1aa] mt-1 font-sans">
          Historical activity parameters, size milestones, and chronology boundaries of the codebase.
        </p>
      </div>

      {/* Row of 6 Stat Cards - Rounded XL cards as specified in the Sleek Interface theme */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {displayStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-[#09090b] border border-[#27272a] rounded-xl p-4 shadow-xs flex flex-col justify-between min-h-[110px] hover:border-[#3f3f46]/80 transition-colors duration-150"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#a1a1aa] uppercase tracking-wider">
                  {stat.title}
                </span>
                <Icon className="h-4 w-4 text-[#71717a] shrink-0" />
              </div>
              <div className="mt-3">
                <span className={`font-mono text-lg font-bold tracking-tight ${stats ? 'text-[#fafafa]' : 'text-[#71717a]'}`}>
                  {stat.value}
                </span>
                <p className="text-[9px] text-[#71717a] mt-1 truncate">
                  {stat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Commit Activity Chart Section - Sleek Blue Theme Accent */}
      <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-6 shadow-xs relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-[#fafafa] flex items-center gap-1.5">
            <GitCommit className="h-4 w-4 text-blue-500" />
            Commit Activity
          </h3>
          <div className="text-xs text-[#71717a] flex gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Monthly Commits
            </span>
          </div>
        </div>

        <div className="h-72 w-full relative">
          {activity && activity.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activity} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#52525b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#27272a',
                    borderRadius: '8px',
                    color: '#fafafa',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                  cursor={{ stroke: '#27272a', strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4, stroke: '#3b82f6', strokeWidth: 1, fill: '#09090b' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#60a5fa' }}
                  name="Commits"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090b] border border-dashed border-[#27272a] rounded-xl min-h-[250px]">
              <div className="p-4 rounded-full bg-[#18181b] border border-[#27272a] mb-4">
                <GitCommit className="h-8 w-8 text-[#52525b]" />
              </div>
              <h2 className="text-base font-medium text-[#fafafa] mb-1">No repository loaded</h2>
              <p className="text-xs text-[#71717a] max-w-xs text-center leading-relaxed">
                Connect to a local Git directory to start visualizing historical trends and hotspots.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Empty State Prompt Overlay if stats empty */}
      {!stats && (
        <div className="bg-[#09090b] rounded-xl border border-dashed border-[#27272a] p-8 text-center flex flex-col items-center justify-center max-w-lg mx-auto mt-6 shadow-md">
          <div className="bg-[#18181b] border border-[#27272a] rounded-full p-4 mb-4">
            <GitCommit className="h-8 w-8 text-blue-500 animate-pulse" />
          </div>
          <h3 className="text-sm font-semibold tracking-tight text-[#fafafa] font-sans">
            Open a repository to get started
          </h3>
          <p className="text-xs text-[#a1a1aa] mt-1.5 max-w-sm font-sans leading-relaxed">
             Use Repository Archaeologist to scan and reveal structural silos, high-frequency modification zones, and development statistics.
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
  );
}
