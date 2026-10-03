"use client";

import { useEffect } from "react";
import { ServerCrash } from "lucide-react";
import { Button, Card, EmptyState } from "@/design-system";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card>
      <EmptyState
        icon={<ServerCrash className="size-5" />}
        title="Não foi possível carregar os dados"
        description="O servidor pode estar indisponível. Tente novamente em instantes."
        action={
          <Button variant="secondary" onClick={reset}>
            Tentar novamente
          </Button>
        }
      />
    </Card>
  );
}
