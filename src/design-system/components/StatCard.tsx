import type { ReactNode } from "react";
import type { Tone } from "@/design-system/components/Badge";
import { Card } from "@/design-system/components/Card";
import { cn } from "@/design-system/utils/cn";

const iconTones: Record<Tone, string> = {
  neutral: "bg-surface-muted text-muted",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
};

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
}: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        {icon && (
          <span
            className={cn(
              "grid size-9 place-items-center rounded-md",
              iconTones[tone],
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums text-fg">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-soft">{hint}</p>}
    </Card>
  );
}
