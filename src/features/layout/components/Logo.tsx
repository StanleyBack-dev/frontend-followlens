import { LogoMark } from "@/features/layout/components/LogoMark";

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const mark = size === "lg" ? "size-9" : "size-8";
  const text = size === "lg" ? "text-lg" : "text-[15px]";
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className={`${mark} text-accent`} />
      <span className={`${text} font-semibold tracking-tight text-fg`}>
        Follow<span className="text-accent">Lens</span>
      </span>
    </span>
  );
}
