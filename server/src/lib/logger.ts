/** Minimal structured logger. Technical details (stack traces, upstream
 * errors) are logged here server-side; routes must send only friendly,
 * generic messages back to clients — never raw error text. */
export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    console.log(JSON.stringify({ level: "info", message, ...meta, time: new Date().toISOString() }));
  },
  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(JSON.stringify({ level: "warn", message, ...meta, time: new Date().toISOString() }));
  },
  error(message: string, error?: unknown, meta?: Record<string, unknown>) {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
        ...meta,
        time: new Date().toISOString(),
      })
    );
  },
};
