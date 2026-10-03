// Contract types mirrored from the backend responses (JSON: dates are ISO
// strings). Shared by the BFF and the UI — types only, no runtime code.

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UserPlan = "free" | "pro";
export type UserRole = "user" | "admin";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  pictureUrl: string | null;
  plan: UserPlan;
  role: UserRole;
  /** Computed by the backend — the UI only uses it to hide navigation. */
  isAdmin: boolean;
  isMaster: boolean;
  termsAccepted: boolean;
  legalVersion: string;
};

export type FollowerStatus = "active" | "lost";
export type FollowerEventType = "lost" | "gained" | "returned";

// The export file only yields the @username and the date followed.
export type Follower = {
  username: string;
  status: FollowerStatus;
  followedAt: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  lostAt: string | null;
};

export type FollowerEvent = {
  id: string;
  username: string;
  type: FollowerEventType;
  importId: string;
  occurredAt: string;
  notifiedAt: string | null;
};

export type FollowerFilterOption = {
  username: string;
};

export type FollowerFilterOptions = {
  options: FollowerFilterOption[];
  truncated: boolean;
};

export type FollowersOverview = {
  activeFollowers: number;
  lostFollowersTotal: number;
  lostLast7Days: number;
  lostLast30Days: number;
  gainedLast30Days: number;
};

export type ImportStatus = "completed" | "failed";

export type ImportRecord = {
  id: string;
  status: ImportStatus;
  filename: string | null;
  followersCount: number | null;
  baseline: boolean;
  lostCount: number | null;
  gainedCount: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
};

export type ImportStatusView = {
  lastImport: ImportRecord | null;
  today: { used: number; limit: number; remaining: number };
};

export type ImportResult = {
  import: ImportRecord;
  emailsSent: number;
};

// === Owner-only automatic mode (session-based sync) ===
export type SyncTrigger = "manual" | "cron";
export type SyncRunStatus = "running" | "paused" | "completed" | "failed";

export type SyncRun = {
  id: string;
  trigger: SyncTrigger;
  status: SyncRunStatus;
  localDate: string;
  pagesFetched: number;
  followersCollected: number;
  invocations: number;
  lostCount: number | null;
  gainedCount: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  startedAt: string;
  updatedAt: string;
  finishedAt: string | null;
};

export type SyncDenialReason =
  | "manual-daily-limit"
  | "already-synced-today"
  | "min-interval"
  | "not-configured"
  | "integration-blocked"
  | "already-running";

export type SyncStatus = {
  integration: {
    configured: boolean;
    blocked: boolean;
    reason: string | null;
    blockedAt: string | null;
  };
  currentRun: SyncRun | null;
  lastCompletedRun: SyncRun | null;
  manualSync: {
    available: boolean;
    willResume: boolean;
    reason: SyncDenialReason | null;
    nextAllowedAt: string | null;
  };
  limits: { manualDailyLimit: number; minIntervalMinutes: number };
};

export type ManualSyncResult = { resumed: boolean; run: SyncRun };

// === Admin area ===
export type AdminUser = {
  id: string;
  email: string;
  name: string;
  pictureUrl: string | null;
  plan: UserPlan;
  role: UserRole;
  isMaster: boolean;
  termsAccepted: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

export type AdminOverview = {
  total: number;
  admins: number;
  activeLast30Days: number;
};

export type UpdateUserAccessInput = { role?: UserRole; plan?: UserPlan };

/** Error shape returned by every BFF route. */
export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};
