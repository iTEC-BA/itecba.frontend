// como llamar: import { getErrorDetails } from "@/lib/error-utils";
export type AppError = {
  code?: string;
  message?: string;
};

export const getErrorDetails = (error: unknown): AppError => {
  if (error instanceof Error) {
    // Errores de Firebase Auth (FirebaseError) son `instanceof Error` pero
    // además llevan un `.code` (ej. "auth/popup-closed-by-user",
    // "auth/network-request-failed"). Antes se perdía ese dato porque este
    // branch devolvía solo `message`. Lo tomamos si está presente, sin
    // asumir su forma.
    const maybeCode = (error as { code?: unknown }).code;
    return {
      message: error.message,
      code: typeof maybeCode === "string" ? maybeCode : undefined,
    };
  }

  if (typeof error !== "object" || error === null) {
    return {};
  }

  const candidate = error as Record<string, unknown>;

  return {
    code: typeof candidate.code === "string" ? candidate.code : undefined,
    message: typeof candidate.message === "string" ? candidate.message : undefined,
  };
};
