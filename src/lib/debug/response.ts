export const debugResponse = (error: unknown, status: unknown) => {
  if (process.env.NODE_ENV !== "development") return;
  if (error instanceof SyntaxError) {
    status = 400;
  } else if (typeof error === "object" && error !== null) {
    const e = error as Record<string, unknown>;
    const maybe = e.status;
    if (typeof maybe === "number" && maybe >= 400 && maybe <= 599) {
      status = maybe;
    }
  }
  const safeError =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : typeof error === "object" && error !== null
        ? {
            message: "Request failed",
            ...(typeof (error as Record<string, unknown>).code === "string"
              ? { code: (error as Record<string, unknown>).code as string }
              : {}),
            ...(Array.isArray((error as Record<string, unknown>).errors)
              ? {
                  errors: (error as Record<string, unknown>)
                    .errors as unknown[],
                }
              : {}),
          }
        : { message: String(error) };

  console.error("[RESPONSE_ERROR]:", safeError);

  return {
    error: safeError,
    status: status as number,
  };
};
