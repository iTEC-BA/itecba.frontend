export interface PointActivity {
  id?: string;
  key: string;
  name: string;
  points: number;
  cooldownMinutes: number;
  dailyCap: number;
  isActive?: boolean;
  description?: string;
}

export interface GrantResult {
  granted: boolean;
  points?: number;
  reason?:
    | "activity_not_found"
    | "activity_inactive"
    | "cooldown"
    | "daily_cap_reached"
    | "internal_error"
    | "not_authenticated"
    | "not_in_cache";
}

export interface PointLogEntry {
  id: string;
  activityKey: string;
  activityName: string;
  pointsAwarded: number;
  context: Record<string, unknown>;
  createdAt: string;
}
