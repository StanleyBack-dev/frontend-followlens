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
  /** Pro features unlocked (paid, granted by an admin, or an admin). */
  isPro: boolean;
  termsAccepted: boolean;
  legalVersion: string;
  /** When the account will be deleted, or null when not scheduled. */
  deletionScheduledFor: string | null;
};

// === Account (self-service profile) ===
export type AccountProfile = {
  id: string;
  email: string;
  name: string;
  pictureUrl: string | null;
  plan: UserPlan;
  role: UserRole;
  isAdmin: boolean;
  isMaster: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  deletion: { requestedAt: string; scheduledFor: string } | null;
  deletionGraceDays: number;
};

export type UpdateAccountProfileInput = { name: string };

export type AccountDeletionResult = {
  profile: AccountProfile;
  emailSent: boolean;
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

/** Events page; `locked` counts what the Free plan hides (0 on Pro). */
export type FollowerEventsPage = Paginated<FollowerEvent> & {
  locked: number;
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
  /** Free plan wait between imports; null on Pro. */
  freeInterval: { days: number; nextAllowedAt: string | null } | null;
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
  /** Users whose plan is Pro (paid or granted by an admin). */
  pro: number;
  activeLast30Days: number;
};

export type UpdateUserAccessInput = { role?: UserRole; plan?: UserPlan };

// === Instagram profiles tracked by the account ===
export type InstagramProfile = {
  id: string;
  name: string;
  isDefault: boolean;
  /** Over the plan's limit (after a downgrade): kept, but not usable. */
  locked: boolean;
  createdAt: string;
};

export type UserProfiles = {
  profiles: InstagramProfile[];
  /** How many profiles the plan allows. */
  limit: number;
};

/** `activeId` is the profile the current selection resolves to. */
export type ActiveProfiles = UserProfiles & { activeId: string };

// === Billing (Pro subscription) ===
export type BillingCycle = "monthly" | "yearly";
export type PaymentMethod = "checkout" | "pix_automatic";
export type SubscriptionStatus =
  "pending" | "active" | "past_due" | "canceled" | "expired";
export type BillingPaymentStatus =
  "pending" | "confirmed" | "received" | "overdue" | "refunded" | "deleted";
export type CancellationReason =
  | "too_expensive"
  | "not_using"
  | "missing_feature"
  | "import_too_manual"
  | "technical_issues"
  | "other";

export type SubscriptionSummary = {
  hasProAccess: boolean;
  /** Why the user has Pro, when they do. */
  proSource: "subscription" | "courtesy" | "admin" | "bonus" | null;
  /** End of a time-limited Pro earned by referrals, when one is running. */
  proBonusUntil: string | null;
  subscription: {
    status: SubscriptionStatus;
    billingCycle: BillingCycle | null;
    paymentMethod: PaymentMethod | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    pastDueSince: string | null;
  } | null;
  prices: Record<BillingCycle, number>;
  pastDueGraceDays: number;
  /** Whether Pix Automático can be offered at checkout. */
  pixAutomaticEnabled: boolean;
  freeLimits: {
    freeImportIntervalDays: number;
    freeHistoryDays: number;
    freeProfiles: number;
    proProfiles: number;
  };
};

export type SubscribeToProInput = {
  cpfCnpj: string;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
};

export type SubscribeToProResult = {
  checkoutUrl: string | null;
  pixQrCode: { payload: string | null; image: string | null } | null;
};

export type CancelSubscriptionInput = {
  reasons: CancellationReason[];
  otherReason?: string;
};

export type BillingPayment = {
  id: string;
  amount: number;
  status: BillingPaymentStatus;
  dueDate: string | null;
  paidAt: string | null;
  invoiceUrl: string | null;
  createdAt: string;
};

// === Support ===
export type SupportCategory =
  "doubt" | "technical_issue" | "suggestion" | "billing" | "other";
export type SupportTicketStatus = "open" | "answered" | "resolved";

export type SupportMessageStatus = {
  canSend: boolean;
  /** When the next message is allowed; null while one can be sent. */
  nextAllowedAt: string | null;
};

export type SendSupportMessageInput = {
  category: SupportCategory;
  message: string;
};

export type SentSupportMessage = {
  protocolNumber: number;
  category: SupportCategory;
  message: string;
  createdAt: string;
};

/** A ticket as the support team sees it. */
export type SupportTicket = {
  id: string;
  protocolNumber: number;
  category: SupportCategory;
  message: string;
  status: SupportTicketStatus;
  adminReply: string | null;
  repliedAt: string | null;
  finalizedAt: string | null;
  createdAt: string;
  userName: string;
  userEmail: string;
  finalizedByName: string | null;
};

// === Admin dashboard ===
export type AdminDashboard = {
  users: AdminOverview;
  subscriptions: {
    byStatus: Record<SubscriptionStatus, number>;
    activePro: number;
    /** Estimated monthly recurring revenue, in BRL. */
    monthlyRecurringRevenue: number;
  };
  support: { openTickets: number };
};

export type AdminSubscription = {
  id: string;
  userName: string;
  userEmail: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle | null;
  paymentMethod: PaymentMethod | null;
  price: number | null;
  proStartedAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  pastDueSince: string | null;
};

// === Referrals ===
export type ReferralOverview = {
  code: string;
  rewardDays: number;
  clicks: number;
  clicksLast7Days: number;
  /** When the latest clicks happened, newest first. */
  latestClicks: string[];
  invited: number;
  qualified: number;
  daysEarned: number;
  proBonusUntil: string | null;
  friends: { name: string; joinedAt: string; qualified: boolean }[];
};

// === Engagement ===
export type AchievementKey =
  | "first_import"
  | "first_comparison"
  | "imports_10"
  | "imports_25"
  | "streak_4"
  | "streak_12"
  | "followers_1k"
  | "followers_5k"
  | "followers_10k"
  | "first_referral";

export type Achievement = {
  key: AchievementKey;
  unlocked: boolean;
  unlockedAt: string | null;
  current: number;
  target: number;
};

export type AchievementsView = {
  streak: { current: number; best: number; activeThisWeek: boolean };
  achievements: Achievement[];
};

export type MonthlySummary = {
  /** YYYY-MM */
  month: string;
  current: boolean;
  imports: number;
  gained: number;
  returned: number;
  lost: number;
  net: number;
  followersAtStart: number | null;
  followersAtEnd: number | null;
  /** Month of the profile's first import; null before any import. */
  firstMonth: string | null;
};

/** Error shape returned by every BFF route. */
export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};
