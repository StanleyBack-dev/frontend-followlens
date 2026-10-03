import "server-only";
import type { ApiError } from "@/shared/contracts/api";

export class BackendError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  toApiError(): ApiError {
    return { code: this.code, message: this.message, details: this.details };
  }

  static unreachable(): BackendError {
    return new BackendError(
      503,
      "BACKEND_UNREACHABLE",
      "Não foi possível conectar ao servidor. Tente novamente em instantes.",
    );
  }
}
