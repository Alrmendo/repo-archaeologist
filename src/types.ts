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

export interface AnalysisResult {
  stats: RepoStats;
  commitActivity: CommitActivityPoint[];
  hotspots: HotspotItem[];
  coupling: ChangeCouplingItem[];
  ownershipEligibleFiles: string[];
}

export interface RepoOpenError {
  message: string;
}

export interface OwnershipReportEntry {
  file: string;
  contributors: ContributorOwnership[];
  knowledgeSilo: boolean;
}

export interface ExportReport {
  repository: {
    name: string;
    totalCommits: number;
    totalContributors: number;
    filesTracked: number;
    firstCommitDate: string;
    latestCommitDate: string;
  };
  hotspots: HotspotItem[];
  ownership: OwnershipReportEntry[];
  coupling: ChangeCouplingItem[];
}

export interface ExportResult {
  canceled: boolean;
  filePath?: string;
}
