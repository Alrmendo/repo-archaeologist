export type HeatLevel = 'very_high' | 'high' | 'medium' | 'low';

export interface RepoStats {
  name: string;
  totalCommits: number;
  totalContributors: number;
  filesTracked: number;
  firstCommitDate: string;
  latestCommitDate: string;
  path: string;
}

export interface CommitActivityPoint {
  month: string;
  count: number;
}

export interface HotspotItem {
  rank: number;
  file: string;
  commits: number;
  heat: HeatLevel;
}

export interface ContributorOwnership {
  name: string;
  percentage: number;
}

export interface ChangeCouplingItem {
  fileA: string;
  fileB: string;
  coChanges: number;
}

export interface MockRepoData {
  stats: RepoStats;
  commitActivity: CommitActivityPoint[];
  hotspots: HotspotItem[];
  fileOwnership: Record<string, ContributorOwnership[]>;
  coupling: ChangeCouplingItem[];
}
