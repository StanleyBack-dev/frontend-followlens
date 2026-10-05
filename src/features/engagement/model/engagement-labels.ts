import {
  Award,
  Flame,
  GitCompareArrows,
  Gift,
  type LucideIcon,
  Rocket,
  Star,
  Trophy,
  Upload,
  Users,
} from "lucide-react";
import type { AchievementKey } from "@/shared/contracts/api";

export const ACHIEVEMENT_LABEL: Record<
  AchievementKey,
  { title: string; description: string; icon: LucideIcon }
> = {
  first_import: {
    title: "Primeira importação",
    description: "Importe a sua lista de seguidores pela primeira vez.",
    icon: Upload,
  },
  first_comparison: {
    title: "Primeira comparação",
    description: "Faça a segunda importação e veja quem saiu e quem chegou.",
    icon: GitCompareArrows,
  },
  imports_10: {
    title: "10 importações",
    description: "Chegue a 10 importações concluídas.",
    icon: Star,
  },
  imports_25: {
    title: "25 importações",
    description: "Chegue a 25 importações concluídas.",
    icon: Award,
  },
  streak_4: {
    title: "Um mês em dia",
    description: "Importe por 4 semanas seguidas.",
    icon: Flame,
  },
  streak_12: {
    title: "Três meses em dia",
    description: "Importe por 12 semanas seguidas.",
    icon: Trophy,
  },
  followers_1k: {
    title: "1.000 seguidores",
    description: "Tenha 1.000 seguidores em uma importação.",
    icon: Users,
  },
  followers_5k: {
    title: "5.000 seguidores",
    description: "Tenha 5.000 seguidores em uma importação.",
    icon: Users,
  },
  followers_10k: {
    title: "10.000 seguidores",
    description: "Tenha 10.000 seguidores em uma importação.",
    icon: Rocket,
  },
  first_referral: {
    title: "Primeira indicação",
    description: "Um amigo indicado por você assinou o Pro.",
    icon: Gift,
  },
};

export function weeks(count: number): string {
  return count === 1 ? "1 semana" : `${count} semanas`;
}

/** "2026-09" -> "setembro de 2026" */
export function monthLabel(month: string): string {
  const [year, index] = month.split("-").map(Number);
  // Mid-month and UTC, so no timezone can push it into a neighbor month.
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, index - 1, 15)));
}

export function addMonths(month: string, delta: number): string {
  const [year, index] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, index - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function signed(value: number): string {
  return `${value > 0 ? "+" : ""}${new Intl.NumberFormat("pt-BR").format(value)}`;
}
