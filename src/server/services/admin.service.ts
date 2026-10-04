import "server-only";
import { backendFetch } from "@/server/http/backend-client";
import type {
  AdminDashboard,
  AdminOverview,
  AdminSubscription,
  AdminUser,
  Paginated,
  SubscriptionStatus,
  UpdateUserAccessInput,
  UserRole,
} from "@/shared/contracts/api";

// Admin access is enforced by the backend (AdminGuard); these calls just
// forward the session — a non-admin gets a 403 back.
export const adminService = {
  dashboard(token: string): Promise<AdminDashboard> {
    return backendFetch("/admin/dashboard", { token });
  },

  subscriptions(
    token: string,
    params: { status?: SubscriptionStatus; page?: number; limit?: number },
  ): Promise<Paginated<AdminSubscription>> {
    return backendFetch("/admin/subscriptions", { token, query: params });
  },

  overview(token: string): Promise<AdminOverview> {
    return backendFetch("/admin/overview", { token });
  },

  users(
    token: string,
    params: { search?: string; role?: UserRole; page?: number; limit?: number },
  ): Promise<Paginated<AdminUser>> {
    return backendFetch("/admin/users", { token, query: params });
  },

  updateAccess(
    token: string,
    userId: string,
    input: UpdateUserAccessInput,
  ): Promise<AdminUser> {
    return backendFetch(`/admin/users/${encodeURIComponent(userId)}`, {
      method: "PATCH",
      token,
      body: input,
    });
  },
};
