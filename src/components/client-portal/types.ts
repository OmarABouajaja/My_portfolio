export interface ProjectMilestone {
  label: string;
  status: "done" | "active" | "pending";
}

export interface ClientProject {
  id: string;
  client_token_id?: string;
  name: string;
  status: "active" | "review" | "completed" | string;
  progress: number;
  milestones: ProjectMilestone[];
  last_update?: string;
  lastUpdate?: string; // legacy compat
}
