import Link from "next/link";
import { Alert } from "@/design-system";

export function InvalidFilterAlert({
  message,
  clearHref,
}: {
  message: string;
  clearHref: string;
}) {
  return (
    <Alert tone="warning" title="Filtro inválido">
      {message}{" "}
      <Link href={clearHref} className="font-medium underline">
        Limpar filtro
      </Link>
    </Alert>
  );
}
