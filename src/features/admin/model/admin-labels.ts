import type { SelectOption } from "@/design-system";
import type { UserPlan, UserRole } from "@/shared/contracts/api";

export const ROLE_LABEL: Record<UserRole, string> = {
  user: "Usuário",
  admin: "Admin",
};

export const PLAN_LABEL: Record<UserPlan, string> = {
  free: "Free",
  pro: "Pro",
};

export const ROLE_OPTIONS: SelectOption[] = [
  { value: "user", label: ROLE_LABEL.user },
  { value: "admin", label: ROLE_LABEL.admin },
];

export const PLAN_OPTIONS: SelectOption[] = [
  { value: "free", label: PLAN_LABEL.free },
  { value: "pro", label: PLAN_LABEL.pro },
];
