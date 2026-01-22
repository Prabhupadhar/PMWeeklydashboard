
export enum HealthStatus {
  ON_TRACK = '🟢 On Track',
  AT_RISK = '🟡 At Risk',
  OFF_TRACK = '🔴 Off Track'
}

export interface Task {
  key: string;
  summary: string;
  status: string;
  assignee: string;
  priority: string;
  dueDate: string;
  type?: string;
}

export interface Risk {
  id: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface ActionItem {
  id: string;
  task: string;
  owner: string;
  dueDate: string;
  status: 'Open' | 'Completed' | 'In Progress';
}

export interface Milestone {
  id: string;
  label: string;
  date: string;
  status: 'Completed' | 'Upcoming' | 'Delayed';
}

export interface DashboardData {
  id: string;
  projectName: string;
  reportingPeriod: string;
  overallStatus: HealthStatus;
  executiveSummary: string;
  scheduleHealth: HealthStatus;
  scopeHealth: HealthStatus;
  qualityHealth: HealthStatus;
  resourceHealth: HealthStatus;
  achievements: string[];
  plannedWork: string[];
  risks: Risk[];
  blockers: string[];
  actionItems: ActionItem[];
  progress: {
    completed: number;
    inProgress: number;
    todo: number;
    blocked: number;
  };
  // Graph Data
  priorityDistribution?: {
    high: number;
    medium: number;
    low: number;
  };
  workloadDistribution?: { name: string; count: number }[];
  burnTrend?: { label: string; value: number }[];
  phaseProgress?: { phase: string; percent: number }[];
  milestones?: Milestone[];
  budget?: {
    total: number;
    spent: number;
    currency: string;
  };
  teamSentiment?: 'Positive' | 'Neutral' | 'Stressed';
  activeWidgets: string[];
  lastUpdated: string;
}

export interface User {
  email: string;
  name: string;
}
